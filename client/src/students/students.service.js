const StudentsService = (() => {
    class StudentsService {
        data = [];
        headers = ['name', 'age', 'id'];
        page = Config.page;
        pageItems = Config.pageItems;
        totalPages = 0;
        sortBy = Config.sortBy;
        sortOrder = Config.sortOrder;
        searchText = '';

        Subscritions = Object.freeze({
            ALL: `STUDENTS_LOADED`,
            CREATED: `STUDENT_ADDED`,
            UPDATED: `STUDENT_UPDATED`,
            REMOVED: `STUDENT_REMOVED`,
        });

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

        create (student) {
            let params = new URLSearchParams();
            for (let key in student) {
                params.append(key, student[key]);
            }
            let config = {
                method: 'POST',
                body: params.toString()
            };

            return fetch(`${Config.api}/students`, config)
                .then(response => {
                    let promise = response.json();
                    promise.then(data => Mediator.Publish(this.Subscritions.CREATED, data));
                    return promise;
                });
        }

        update (id, student) {
            let params = new URLSearchParams();
            for (let key in student) {
                params.append(key, student[key]);
            }
            let config = {
                method: 'PUT',
                body: params.toString()
            };

            return fetch(`${Config.api}/students/${id}`, config)
                .then(response => {
                    let promise = response.json();
                    promise.then(data => Mediator.Publish(this.Subscritions.UPDATED, data));
                    return promise;
                });
        }

        remove (id) {
            let params = new URLSearchParams();
            params.append('id', id);

            let config = {
                method: 'DELETE',
                body: params.toString()
            };

            return fetch(`${Config.api}/students/${id}`, config)
                .then(response => {
                    let promise = response.json();
                    promise.then(data => Mediator.Publish(this.Subscritions.REMOVED, data));
                    return promise;
                });
        }
    }
    return new StudentsService();
})();