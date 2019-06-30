const RouterComponent = (function () {
    class RouterComponent extends HTMLElement {
        content = null; // router outlet content
        route = null; // active route

        constructor() {
            super();

            MediatorService.Subscribe(RouterService.Subscritions.CHANGED, this.render.bind(this));
            if(RouterService.active) this.render();
        }

        render (route) {
            console.log("render", route);
            let component = route.execute();
            if(!component) return false;

            if(this.content) this.replaceChild(component, this.content);
            else this.appendChild(component);
            this.content = component;
        }
    }

    // register custom html element
    customElements.define(`${ConfigService.prefix}-router-outlet`, RouterComponent);
    return RouterComponent;
})()