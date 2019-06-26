(function () {
    const CONFIG = {
        className: '',
        icon: '',
    };

    class ButtonComponent extends HTMLElement {
        constructor(config = {}) {
            super();

            this._config = Object.assign({}, CONFIG, config);
            this.element = document.createElement('button');

            this._props();
            if(this._config.icon) this._icon();
            if(this._config.events) this._events();

            this.appendChild(this.element);
        }

        _props () {
            let { type, className, text } = this._config;
            if(type) this.element.type = type;
            if(className) this.element.className = className;
            if(text) this.element.innerText = text;
        }

        _icon () {
            let icon = new IconComponent(this._config.icon);
            this.element.appendChild(icon);
        }

        _events () {
            for(let event in this._config.events) {
                this.element.addEventListener(event, this._config.events[event]);
            }
        }
    }

    // register custom html element
    customElements.define(`${ConfigService.prefix}-button`, ButtonComponent);
    window.ButtonComponent = ButtonComponent;
})()