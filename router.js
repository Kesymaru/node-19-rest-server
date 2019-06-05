// router singleton
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

        //let url = new URL(this.req.url);
        let path = this.req.url;
        let method = this.req.method;

        let route = this.check(path, method);
        if(!route) return this.badRequest(new Error(`Bad Request: ${method} ${path}`));
        let data = route.controller(this.req, this.res, route);

        this.response(data);
    }

    check (path, method) {
        let regex = /\:/gi;
        let paths = this.splitPath(path);

        let route = this.routes
            .map(route => {
                route.paths = route.paths.map((r, i) => regex.test(r) && paths[i] ? paths[i] : r);
                return route;
            })
            .find(route => route.method === method && '/'+route.paths.join('/') === path);

        return route;
    }

    response (data, options = {statusCode: 200, contentType: 'application/json'}) {
        this.res.statusCode = options.statusCode;
        this.res.setHeader('Content-Type', options.contentType);
        this.res.end(JSON.stringify(data));
    }

    badRequest (error) {
        this.res.statusCode = 404;
        this.res.setHeader('Content-Type', 'text/html');
        this.res.end(error.message);
    }

    static Register(routes) {
        if(!instance) instance = new Router(routes);
        return instance.route.bind(instance);
    }
}