const NavigationService = (function () {
    class NavigationService {
        Subscritions = Object.freeze({
            CHANGED: `NAVIGATION_CHANGED`,
        });

        constructor() {
            this.routes = ConfigService.routes.map(route => new Route(route));
            this.title = document.head.querySelector('title');

            this._init();
        }

        _init () {
            let {pathname} = window.location;

            let route = this.routes.find(r => this._check(r, pathname));
            route = route ? route : this.routes.find(route => route.default);

            route.active = true;
            this.active = route;

            console.log('link', route.link());

            window.history.replaceState(route, route.title, route.link(pathname));
            MediatorService.Publish(this.Subscritions.CHANGED, route);
        }

        _check (route, pathname) {
            if (route.path === pathname) return true;
            let paths = pathname.split('/').filter(p => p);
            if(paths.length !== route.paths.length) return false;
            return route.paths.every((p, i) => p.isParam ? true : (p.path === paths[i]));
        }

        go (path, params = null) {
            let route = this.routes.find(r => r.path === path);
            if(!route) throw new Error(`Invalid route path: ${path}`);

            route.params = params;

            this.title.innerText = route.title;
            this.routes.map(r => {
                r.active = r === route;
                return r;
            });
            this.active = route;
            route.active = true;

            window.history.pushState(route, route.title, route.link());
            MediatorService.Publish(this.Subscritions.CHANGED, route);
        }

        back () {
            window.history.back();
        }
    }

    class Route {
        constructor(config) {
            this.path = config.path;
            this.title = config.title;
            this.default = config.default;
            this.menu = config.menu;

            this.paths = this.path.split('/').map((p, i) => new RoutePath(p, i));
            this.isParam = this._isParam();
            this.active = false;
            this.params = null;

            this._origin = window.location.origin;
            this._component = config.component;
        }

        _isParam () {
            let regex = /\:\w/i;
            return regex.test(this.path);
        }

        get component () {
            let componentClass = window[this._component];
            if(typeof componentClass !== 'function') return new DummyComponent(this);
            return new componentClass(this.params);
        }

        link (pathname = '') {
            if(!pathname) {
                let path = this.path;
                if(this.params) Object.keys(this.params)
                    .forEach(p => path = path.replace(`:${p}`, this.params[p]));
                return `${this._origin}/${path}`;
            }

            let paths = pathname.split('/').filter(p => p);
            this.params = {};
            let path = this.paths
                .map((p, i)=> {
                    if(p.isParam) {
                        this.params[p.path.replace(':', '')] = paths[i];
                        return paths[i];
                    }
                    return p.path;
                })
                .join('/');

            return `${this._origin}/${path}`;
        }
    }

    class RoutePath {
        constructor(path, index) {
            this.index = index;
            this.path = path;
            this.isParam = this._isParam();
        }

        _isParam () {
            let regex = /\:\w/i;
            return regex.test(this.path);
        }
    }

    class DummyComponent extends HTMLElement {
        constructor() { super(); }
    };

    return new NavigationService();
})();