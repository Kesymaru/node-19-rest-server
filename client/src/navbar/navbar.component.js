(function () {
    class NavbarComponent extends HTMLElement {
        constructor(student = null) {
            super();
            this.render();
        }

        _menu () {
            let ul = document.createElement('ul');
            ul.className = 'right';

            return NavigationService.routes
                .filter(route => route.menu)
                .map(route => this._li(route))
                .reduce((element, li) => element.appendChild(li).parentNode, ul);
        }

        _li (route) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.innerText = route.title;
            a.addEventListener('click', () => NavigationService.go(route.path));
            li.appendChild(a);
            return li;
        }

        render () {
            this.nav = document.createElement('nav');
            this.section = document.createElement('section');

            let div = document.createElement('div');
            let logo = document.createElement('a');
            logo.className = 'brand-logo';
            logo.innerText = 'LOGO';
            div.appendChild(logo);
            div.appendChild(this._menu());
            this.nav.appendChild(div);

            this.appendChild(this.nav);
            this.appendChild(this.section);
        }
    }

    // register custom html element
    customElements.define(`${ConfigService.prefix}-navbar`, NavbarComponent);
})()