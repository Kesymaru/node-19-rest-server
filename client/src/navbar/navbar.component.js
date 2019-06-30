const NavbarComponent = (function () {
    class NavbarComponent extends HTMLElement {
        constructor(student = null) {
            super();

            MediatorService.Subscribe(RouterService.Subscritions.CHANGED, this.active.bind(this));

            this.render();
        }

        _menu () {
            let ul = document.createElement('ul');
            ul.className = 'right';

            return ConfigService.routes
                .filter(route => route.menu)
                .map(route => {
                    let li = this._li(route);
                    li.dataset.path = route.path;
                    return li;
                })
                .reduce((element, li) => element.appendChild(li).parentNode, ul);
        }

        _li (route) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.innerText = route.title;
            a.addEventListener('click', () => RouterService.go(route.path));
            li.appendChild(a);
            return li;
        }

        render () {
            this.nav = document.createElement('nav');

            let div = document.createElement('div');
            let logo = document.createElement('a');
            logo.className = 'brand-logo';
            logo.innerText = 'LOGO';
            div.appendChild(logo);

            this.menu = this._menu();
            div.appendChild(this.menu);
            this.nav.appendChild(div);

            this.appendChild(this.nav);
        }

        active (route) {
            this.menu.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            let li = this.menu.querySelector(`li[data-path="${route.path}"]`);
            if(li) li.classList.add('active');
        }
    }

    // register custom html element
    customElements.define(`${ConfigService.prefix}-navbar`, NavbarComponent);
    return NavbarComponent;
})();