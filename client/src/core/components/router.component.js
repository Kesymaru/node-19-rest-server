(function () {
    class RouterComponent extends HTMLElement {
        _element = null;
        constructor(student = null) {
            super();

            MediatorService.Subscribe(NavigationService.Subscritions.CHANGED, this.render.bind(this));
            if(NavigationService.active) this.render();
        }

        render () {
            console.log('render router', NavigationService.active);

            let element = NavigationService.active.component;
            console.log('router element', element);

            if(this._element) this.replaceChild(element, this._element);
            else this.appendChild(element);
            this._element = element;
        }
    }

    // register custom html element
    customElements.define(`${ConfigService.prefix}-router-outlet`, RouterComponent);
})()