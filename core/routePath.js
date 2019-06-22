module.exports = class RoutePath {
    constructor(path, index) {
        this.index = index;
        this.path = path;
        this.param = this.isParam();
    }

    isParam () {
        let regex = /\:\w/i;
        return regex.test(this.path);
    }
}