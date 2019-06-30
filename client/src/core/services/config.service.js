const ConfigService = (function(){
    const prefix = 'app';
    const ROUTES = [
        {
            path: 'students',
            title: 'Students',
            callback: (route) => new StudentComponent(route),
            menu: true,
        },
        {
            path: 'students/create',
            title: 'Create Student',
            callback: (route) => new StudentFormComponent(route),
            menu: true,
        },
        {
            path: 'students/:id',
            title: 'Edit Student',
            callback: (route) => new StudentFormComponent(route),
            menu: false,
        },
    ];

    // config object
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
})();