const Config = (function(){
    const prefix = 'app';
    const ROUTES = [
        {
            path: 'students',
            title: 'Students',
            component: 'StudentComponent',
            menu: true,
            default: true,
        },
        {
            path: 'students/create',
            title: 'Create Student',
            component: 'StudentFormComponent',
            menu: true,
        },
        {
            path: 'students/:id',
            title: 'Edit Student',
            component: 'StudentFormComponent',
            menu: false,
        },
    ];
    const DEFAULT_CONFIG = Object.freeze({
        prefix,
        routes: ROUTES,

        page: 1,
        pageItems: 10,
        pageItemsOptions: [5, 10, 25, 50],
        sortBy: 'name',
        sortOrder: 'desc',

        api: 'http://localhost:5000/api/v1',
    });
    return Object.assign({}, DEFAULT_CONFIG);
})()