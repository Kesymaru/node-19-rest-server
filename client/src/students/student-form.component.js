(function () {
    class StudentFormComponent extends HTMLElement {
        schema = [
            {
                title: 'Name:',
                name: 'name',
                type: 'text',
                placeholder: 'Student name',
                value: '',
                required: true
            },
            {
                title: 'Age:',
                name: 'age',
                type: 'number',
                value: 1,
                min: 1,
                max: 100,
                required: true
            },
        ];
        form = null;

        constructor(student = null) {
            super();

            this.student = student;
            if(this.student) this.schema.map(schema => {
                if(this.student[schema.name]) schema.value = this.student[schema.name];
                return schema;
            });

            Mediator.Subscribe(StudentsService.Subscritions.CREATED, () => this.form.reset());

            this.render();
        }

        _input (config) {
            let div = document.createElement('div');
            let label = document.createElement('label');
            label.innerText = config.title || config.name;
            div.appendChild(label);

            let input = document.createElement('input');
            for(let key in config) {
                input[key] = config[key];
            }
            label.appendChild(input)

            return div;
        }

        render () {
            this.form = document.createElement('form');

            Object.keys(this.schema)
                .map(k => this._input(this.schema[k]))
                .reduce((f, i) => f.appendChild(i).parentNode, this.form);

            this._error = document.createElement('div');
            this.form.appendChild(this._error);

            let submit = document.createElement('button');
            submit.type = 'submit';
            submit.innerText = 'Submit';
            submit.className = 'waves-effect waves-light btn red';
            this.form.appendChild(submit);

            let reset = document.createElement('button');
            reset.className = 'waves-effect waves-light btn';
            if(!this.student) {
                reset.type = 'reset';
                reset.innerText = 'Reset';
            }
            else {
                reset.innerText = 'Cancel';
                reset.addEventListener('click', () => Navigation.go('students'));

                let remove = document.createElement('button');
                remove.innerText = 'Remove'
                remove.className = 'waves-effect waves-light btn';
                remove.addEventListener('click', this.remove.bind(this));
                this.form.appendChild(remove);
            }
            this.form.appendChild(reset);

            this.form.addEventListener('submit', this.submit.bind(this));
            this.appendChild(this.form);
        }

        submit (event) {
            event.preventDefault();

            let student = this.schema
                .reduce((t, s) => Object.assign(t, {[`${s.name}`]: this.form[s.name].value}), {})

            let promise = this.student
                ? StudentsService.update(this.student.id, student)
                : StudentsService.create(student);

            promise.then(() => Navigation.go('students'))
                .catch(err => this.showError(err));
        }

        remove () {
            StudentsService.remove(this.student.id)
                .then(() => Navigation.go('students'))
                .catch(this.showError.bind(this));
        }

        showError (error) {
            this._error.innerText = error.message;
            setTimeout(() => this._error.innerText = '', 5000);
        }
    }

    // register custom html element
    customElements.define(`${Config.prefix}-student-form`, StudentFormComponent);
    window.StudentFormComponent = StudentFormComponent;
})()