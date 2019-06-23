const querystring = require('querystring');
const URLSearchParams = require('url').URLSearchParams

const Response = require('./response');
const RoutePath = require('./routePath');

module.exports = class Route {
    constructor (config) {
        if(!config) throw new Error(`Invalid Route: ${config}`);

        this.path = config.path;
        this.paths = this.split();

        this.matched = config.matched ? this.split(config.matched) : [];
        this.query = config.query ? this.parseQuery(config.query) : {};

        this.method = config.method;
        this.controller = config.controller;
    }

    split (path = this.path) {
        return path.split('/')
            .filter(p => !!p)
            .map((p, i) => new RoutePath(p, i));
    }

    parseQuery (queryString) {
        let query = new URLSearchParams(queryString);
        let data = {};
        for (const [name, value] of query) {
            data[name] = value;
        }
        return data;
    }

    check (path, method) {
        if(method !== this.method) return false;
        let matched = false;
        if(path === this.path) matched = true;
        else {
            let paths = this.split(path);
            if(paths.length === this.paths.length) {
                matched = this.paths.every((p, i) => {
                    if(!p.param) return p.path === paths[i].path;
                    else return true;
                });
            }
        }
        return matched;
    }

    getInstance (req, res, path, query = '') {
        return new Route({
            path: this.path,
            matched: path,
            query: query,
            method: this.method,
            controller: this.controller,
        });
    }

    get params () {
        let params = this.paths.filter(p => p.param)
            .map(p => ({[`${p.path.replace(':', '')}`]: this.matched[p.index].path}))
            .reduce((t, v) => Object.assign(t, v), {});


        return params;
    }

    processPost (req, res) {
        let body = '';
        req.on('data', chunck => body += chunck);

        return new Promise((resolve, reject) => {
            req.on('end', error => {
                if(error) return reject(error);
                resolve(querystring.parse(body));
            });
        });
    }

    async execute (req, res) {
        try {
            if(this.method === 'POST' | this.method === 'PUT')
                this.body = await this.processPost(req, res);
            await this.controller(req, res, this);
        } catch (err) {
            Response.ApplicationError(res, err);
        }
    }
}