(function () {
    const CONFIG = {
        color: '',
        icon: '',
    };

    class IconComponent extends HTMLElement {
        constructor(config = {}) {
            super();

            this._config = Object.assign({}, CONFIG, config);
            this.element = document.createElement('i');

            this._props();

            this.appendChild(this.element);
        }

        _props () {
            let {text, className} = this._config;

            if(text) this.element.innerText = text;
            if(className) this.element.className = className;
        }
    }

    // register custom html element
    customElements.define(`${ConfigService.prefix}-icon`, IconComponent);
    window.IconComponent = IconComponent;
})()