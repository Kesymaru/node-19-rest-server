const Response = require('./response');
const RoutePath = require('./routePath');

module.exports = class Route {
    constructor (config) {
        if(!config) throw new Error(`Invalid Route: ${config}`);

        this.path = config.path;

        this.paths = this.split();
        this.matched = config.matched ? this.split(config.matched) : [];

        this.method = config.method;
        this.controller = config.controller;
    }

    split (path = this.path) {
        return path.split('/')
            .filter(p => !!p)
            .map((p, i) => new RoutePath(p, i));
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

    getInstance (path) {
        return new Route({
            path: this.path,
            matched: path,
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
        let promise = new Promise();

        req.on('data', chunck => body += chunck);
        req.on('end', error => {
            if(error) return promise.reject(error);
            promise.resolve(querystring.parse(body));
        });

        return promise;
    }

    async execute (req, res) {
        let data = null;

        try {
            if(this.method === 'POST') this.body = await this.processPost(req, res);
            data = await this.controller(this);
        } catch (err) {
            Response.ApplicationError(res, err);
        }

        Response.Send(res, data);
    }
}