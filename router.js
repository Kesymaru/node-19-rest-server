// router singleton
const querystring = require('querystring');

let instance = null;
module.exports = class Router {
    constructor(routes) {
        this.routes = routes;
        this.routes.map(route => Object.assign(route, {
            paths: this.splitPath(route.path)
        }))
    }

    splitPath (path) {
        return path.split('/').filter(r => !!r);
    }

    route (req, res) {
        this.req = req;
        this.res = res;
        let path = this.req.url;
        let method = this.req.method;

        let route = this.check(path, method);
        if(!route) return this.badRequest(new Error(`Bad Request: ${method} ${path}`));
        if(method === 'POST') {
            let body = '';
            this.req.on('data', chunck => body += chunck);
            this.req.on('end', () => {
                route.body = querystring.parse(body);
                this.getControllerData(route);
            });
        }
        else this.getControllerData(route)
    }

    async getControllerData (route, data = null) {
        try {
            route.data = await route.controller(this.req, this.res, route);
            this.response({
                success: true,
                data: route.data
            });
        } catch(err){
            this.badRequest(err);
        }
    }

    check (path, method) {
        let regex = /\:\w/i;
        let paths = this.splitPath(path);

        let route = this.routes
            .filter(route => route.method === method && route.paths[0] === paths[0])
            .map(route => Object.assign({}, route, {
                paths: route.paths.map((r, i) => regex.test(r) && paths[i] ? paths[i] : r)
            }))
            .find(route => route.method === method && '/'+route.paths.join('/') === path);

        return route;
    }

    response (data, options = {statusCode: 200, contentType: 'application/json'}) {
        this.res.statusCode = options.statusCode;
        this.res.setHeader('Content-Type', options.contentType);
        this.res.end(JSON.stringify(data));
    }

    badRequest (error) {
        let data = {success: false, error: error.message};
        this.response(data, {statusCode: 500, contentType: 'application/json'});
    }

    static Register(routes) {
        if(!instance) instance = new Router(routes);
        return instance.route.bind(instance);
    }
}