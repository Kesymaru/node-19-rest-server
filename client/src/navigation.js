const Navigation = (function () {
    class Navigation {
        Subscritions = Object.freeze({
            CHANGED: `NAVIGATION_CHANGED`,
        });

        constructor() {
            this.routes = Config.routes.map(route => new Route(route));
            this.title = document.head.querySelector('title');
            this.active = this.routes.find(route => route.default);
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

            window.history.pushState(route.title, route.title, route.link);
            Mediator.Publish(this.Subscritions.CHANGED, route);
        }

        back () {
        }
    }

    class Route {
        constructor(config) {
            this.path = config.path;
            this.title = config.title;
            this.default = config.default;
            this.menu = config.menu;

            this.isParam = this._isParam();
            this.active = false;
            this.params = null;

            this._href = window.location.href;
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

        get link () {
            let path = this.path;
            if(this.params) Object.keys(this.params)
                .forEach(p => path = path.replace(`:${p}`, this.params[p]));

            console.log('path', path);
            return `${this._href}/${path}`;
        }
    }

    class DummyComponent extends HTMLElement {
        constructor() { super(); }
    };

    return new Navigation();
})();