(function () {
    class RouterComponent extends HTMLElement {
        _element = null;
        constructor(student = null) {
            super();

            window.addEventListener('onpopstate', this.render.bind(this));
        }

        render () {
            let element = NavigationService.active.component;
            console.log('router element', element);

            if(this._element) this.replaceChild(element, this._element);
            else this.appendChild(element);
            this._element = element;
        }
    }

    // register custom html element
    customElements.define(`${ConfigService.prefix}-router`, RouterComponent);
})()