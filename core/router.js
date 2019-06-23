const Response = require('./response');
const Route = require('./route')

let instance = null;
module.exports = class Router {
    constructor(routes) {
        this.routes = routes.map(r => new Route(r));
    }

    route (req, res) {
        let {url, method} = req;
        let query = url.split('?');
        let path = query[0];
        query = query.length ? query[1] : '';

        let found = this.routes.find(r => r.check(path, method));
        if(!found) return Response.BadRequest(res, new Error(`Bad Request: ${method} ${path}`));

        let route = found.getInstance(req, res, path, query);
        route.execute(req, res);
    }

    static Register(routes) {
        if(!instance) instance = new Router(routes);
        return instance.route.bind(instance);
    }
}