(function () {
    class RouterComponent extends HTMLElement {
        _element = null;
        _route = null;

        constructor(student = null) {
            super();

            MediatorService.Subscribe(NavigationService.Subscritions.CHANGED, this.render.bind(this));
            if(NavigationService.active) this.render();
        }

        render () {
            let route = NavigationService.active;
            if(this._route && this._route === route) return;
            this._route = route;

            let element = this._route.component;
            console.log('router element', element);

            if(this._element) this.replaceChild(element, this._element);
            else this.appendChild(element);
            this._element = element;
        }
    }

    // register custom html element
    customElements.define(`${ConfigService.prefix}-router-outlet`, RouterComponent);
})()