(function () {
    function init () {
        const nav = document.getElementById('nav-mobile');

        MENU.map(m => menuItem(m))
            .reduce((n, m) => n.appendChild(m).parentNode, nav);

        navigate(MENU[0]);
    }

    function menuItem (menu) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.innerText = menu.title;
        a.addEventListener('click', () => navigate(menu));
        li.appendChild(a);

        return li;
    }

    function navigate (menu) {
        MENU.forEach(m => m.element.hidden = true);
        menu.element.hidden = false;
    }
    
    init();

    class Navigation {

    }

    return new Navigation()``
})()