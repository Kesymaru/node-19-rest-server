const StudentsService = (() => {
    const instance = null;
    class StudentsService {
        data = [];
        headers = ['name', 'age', 'id'];
        page = Config.page;
        pageItems = Config.pageItems;
        totalPages = 0;
        sortBy = Config.sortBy;
        sortOrder = Config.sortOrder;
        searchText = '';

        constructor() {}

        _url () {
            let url = new URL(`${Config.api}/students`);

            if(this.page) url.searchParams.append('page', this.page);
            if(this.pageItems) url.searchParams.append('pageItems', this.pageItems);
            if(this.sortBy) url.searchParams.append('sortBy', this.sortBy);
            if(this.sortOrder) url.searchParams.append('sortOrder', this.sortOrder);
            if(this.searchText) url.searchParams.append('search', this.searchText);

            return url;
        }

        _reset () {
            this.page = Config.page;
            this.pageItems = Config.pageItems;
            this.totalPages = 0;
            this.sortBy = Config.sortBy;
            this.sortOrder = Config.sortOrder;
            this.searchText = '';
        }

        getAll (reset) {
            if(reset) this._reset();
            let url = this._url();

            return fetch(url.toString())
                .then(response => response.json())
                .then(response => {
                    this.data = response.data;
                    this.page = +response.page;
                    this.pageItems = +response.pageItems;
                    this.totalPages = +response.totalPages;
                    return response;
                });
        }

        sort (sortBy) {
            if(this.sortBy === sortBy) this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
            else this.sortOrder = Config.sortOrder;

            this.sortBy = sortBy;

            return this.getAll();
        }

        search (searchText) {
            if(!searchText || searchText.length < 3)
                return new Promise((r, reject) => reject('Invalid search text.'));
            this.searchText = searchText;

            return this.getAll();
        }

        paginate (page, pageItems) {
            this.page = page;
            if(pageItems) this.pageItems = pageItems;

            return this.getAll();
        }
    }
    return new StudentsService();
})();