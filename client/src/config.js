const Config = (function(){
    const DEFAULT_CONFIG = Object.freeze({
        prefix: 'app',

        page: 1,
        pageItems: 10,
        pageItemsOptions: [5, 10, 25, 50],
        sortBy: 'name',
        sortOrder: 'desc',

        api: 'http://localhost:5000/api/v1',
    });
    return Object.assign({}, DEFAULT_CONFIG);
})()