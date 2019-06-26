(function () {
    class NavbarComponent extends HTMLElement {
        constructor(student = null) {
            super();

            MediatorService.Subscribe(NavigationService.Subscritions.CHANGED, this.active.bind(this));

            this.render();
        }

        _menu () {
            let ul = document.createElement('ul');
            ul.className = 'right';

            return NavigationService.routes
                .filter(route => route.menu)
                .map(route => {
                    let li = this._li(route);
                    li.dataset.path = route.path;
                    if(route.active) li.classList = 'active';
                    return li;
                })
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

        active () {
            let route = NavigationService.active;
            this.menu.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            let li = this.menu.querySelector(`li[data-path="${route.path}"]`);
            li.classList.add('active');
        }
    }

    // register custom html element
    customElements.define(`${ConfigService.prefix}-navbar`, NavbarComponent);
})()