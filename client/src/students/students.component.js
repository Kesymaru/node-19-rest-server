/**
 * Students Component
 */
const StudentComponent = (function() {
    class StudentComponent extends HTMLElement {
        loading = false;

        constructor () {
            super();

            this.render();

            MediatorService.Subscribe(StudentsService.Subscritions.CREATED, () => this.getAll(false));
        }

        _thead () {
            return StudentsService.headers
                .map(title => this._th(title))
                .reduce((thead, th) => thead.appendChild(th).parentElement, document.createElement('thead'));
        }

        _tbody (error) {
            let tbody = document.createElement('tbody');

            if(error || this.loading || !StudentsService.data.length) {
                let message = '';
                if(error) message = error.message;
                else if(this.loading) message = 'Loading...';
                else message = 'No students data';
                tbody.appendChild(this._tbodyMessage(message));
                return tbody;
            }

            return StudentsService.data
                .map(student => this._tr(student))
                .reduce((tbody, td) => tbody.appendChild(td).parentElement, tbody);
        }

        _tbodyMessage (message) {
            let tr = document.createElement('tr');
            let th = document.createElement('th');
            th.innerText = message;
            th.colSpan = StudentsService.headers.length;
            tr.appendChild(th);
            return tr;
        }

        _tfoot () {
            let tfoot = document.createElement('tfoot');
            let tr = document.createElement('tr');

            let td = document.createElement('td');
            td.innerText = `Page: ${StudentsService.page} of ${StudentsService.totalPages}`;

            tr.appendChild(td);
            tr.appendChild(this._pagination());
            tfoot.appendChild(tr);

            return tfoot;
        }

        _pagination () {
            let td = document.createElement('td');
            td.className = 'right';

            let previous = document.createElement('button');
            if(StudentsService.page === 1) previous.setAttribute('disabled', true);
            previous.innerText = 'Previous';
            previous.className = 'waves-effect waves-light btn';
            previous.addEventListener('click', () => this.paginate(StudentsService.page - 1));
            td.appendChild(previous);

            let next = document.createElement('button');
            if(StudentsService.totalPages > 0 && StudentsService.totalPages === StudentsService.page)
                next.setAttribute('disabled', true);
            next.innerText = 'next';
            next.className = 'waves-effect waves-light btn';
            next.addEventListener('click', () => this.paginate(StudentsService.page + 1));

            let pageItems = ConfigService.pageItemsOptions
                .map(i => {
                    let option = document.createElement('option');
                    option.value = i;
                    option.innerText = i;
                    if(i === StudentsService.pageItems) option.selected = true;
                    return option;
                })
                .reduce((select, option) => select.appendChild(option).parentElement, document.createElement('select'));

            pageItems.addEventListener('change', (event) => this.paginate(1, event.target.value));

            td.appendChild(pageItems);
            td.appendChild(next);
            return td;
        }

        _th (text) {
            let th = document.createElement('td');
            th.innerText = text;
            th.addEventListener('click', () => this.sort(text));
            return th;
        }

        _tr (student) {
            let tr = document.createElement('tr');
            tr.addEventListener('dblclick', () => RouterService.go(`students/${student.id}`));

            return Object.keys(student)
                .map(key => this._td(student[key]))
                .reduce((row, td) => row.appendChild(td).parentNode, tr);
        }

        _td (text) {
            let td = document.createElement('td');
            td.innerText = text;
            return td;
        }

        _search () {
            let search = document.createElement('input');
            search.type = 'search';

            let timeout = null;
            search.addEventListener('search', () => this.search(search.value));
            return search;
        }

        render () {
            this.searchInput = this._search();
            this.thead = this._thead();
            this.tbody = this._tbody();
            this.tfoot = this._tfoot();

            this.table = document.createElement('table');
            this.table.classList.add('striped');
            this.table.classList.add('highlight');
            this.table.classList.add('centered');
            this.table.classList.add('responsive-table');

            this.table.appendChild(this.thead)
            this.table.appendChild(this.tbody)
            this.table.appendChild(this.tfoot);

            this.appendChild(this.searchInput);
            this.appendChild(this.table);

            this.getAll();
        }

        renderTbody (error = null) {
            let tbody = this._tbody(error);
            this.table.replaceChild(tbody, this.tbody);
            this.tbody = tbody;
        }

        renderFooter () {
            let tfoot = this._tfoot();
            this.table.replaceChild(tfoot, this.tfoot);
            this.tfoot = tfoot;
        }

        getAll (reset = true) {
            this.loading = true;
            this.renderTbody();
            StudentsService.getAll(reset)
                .then(() => {
                    this.loading = false;
                    this.renderTbody();
                    this.renderFooter();
                })
                .catch(err => this.renderTbody(err));
        }

        sort (sortBy) {
            this.loading = true;
            this.renderTbody();

            StudentsService.sort(sortBy)
                .then(() => {
                    this.loading = false;
                    this.renderTbody();
                })
                .catch(err => this.renderTbody(err))
        }

        paginate (page, pageItems = null) {
            if(page < 0 ) return false;

            this.loading = true;
            this.renderTbody();

            StudentsService.paginate(page, pageItems)
                .then(() => {
                    this.loading = false;
                    this.renderTbody();
                    this.renderFooter();
                })
                .catch(err => this.renderTbody(err));
        }

        search (searchText) {
            if(!searchText) return this.getAll();
            if(searchText.length < 3) return false;

            this.loading = true;
            this.renderTbody();

            StudentsService.search(searchText)
                .then(() => {
                    this.loading = false;
                    this.renderTbody();
                    this.renderFooter();
                })
                .catch(err => this.renderTbody(err));
        }
    }

    // register custom html element
    customElements.define(`${ConfigService.prefix}-students`, StudentComponent);
    return StudentComponent;
})();