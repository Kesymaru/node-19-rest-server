const RouterService = (function () {
    class RouterService {
        Subscritions = Object.freeze({
            CHANGED: `ROUTE_CHANGED`,
        });

        constructor() {
            this.router = new Router(ConfigService.routes || []);

            let {pathname, search} = window.location;
            this.go(`${pathname}${search}`);
        }

        go (path) {
            let route = this.router.find(path);
            if(!route) return false;

            window.history.pushState(route.toObject(), route.title, route.toString());
            MediatorService.Publish(this.Subscritions.CHANGED, route);
        }

        back () {
            window.history.back();
        }
    }

    return new RouterService();
})();