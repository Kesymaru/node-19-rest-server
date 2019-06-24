const Config = (function(){
    const DEFAULT_CONFIG = Object.freeze({
        prefix: 'app',
        page: 1,
        pageItems: [5, 10, 25, 50],
        api: 'http://localhost:5000/api/v1',
    });
    return Object.assign({}, DEFAULT_CONFIG);
})()