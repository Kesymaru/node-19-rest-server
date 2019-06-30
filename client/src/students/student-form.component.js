const StudentFormComponent = (function () {
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
        id = null;

        constructor(route = null) {
            super();

            if(route) this.id = route.params.id;
            if(this.id) this.load();

            MediatorService.Subscribe(StudentsService.Subscritions.CREATED, () => this.form.reset());

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
            let form = document.createElement('form');

            Object.keys(this.schema)
                .map(k => this._input(this.schema[k]))
                .reduce((f, i) => f.appendChild(i).parentNode, form);

            this._error = document.createElement('div');
            form.appendChild(this._error);

            form.appendChild(new ButtonComponent({
                text: 'Submit',
                type: 'submit',
                className: 'waves-effect waves-light btn red',
                events: {
                    click: () => console.log('click event on button')
                }
            }))

            let reset = {
                text: 'Reset',
                type: 'reset',
                className: 'waves-effect waves-light btn',
            }
            if(this.student) {
                reset.text = 'Cancel';
                reset.events = {
                    click: () => RouterService.go('students')
                };

                form.appendChild(new ButtonComponent({
                    text: 'Remove',
                    className: 'waves-effect waves-light btn',
                    events: {
                        click: this.remove.bind(this)
                    }
                }));
            }
            form.appendChild(new ButtonComponent(reset));

            form.addEventListener('submit', this.submit.bind(this));

            if(this.form) this.replaceChild(form, this.form);
            else this.appendChild(form);
            this.form = form;
        }

        load () {
            StudentsService.getOne(this.id)
                .then(student => {
                    this.student = student;
                    if(this.student) this.schema.map(schema => {
                        if(this.student[schema.name]) schema.value = this.student[schema.name];
                        return schema;
                    });
                    this.render();
                })
                .catch(err => this.showError(err));
        }

        submit (event) {
            event.preventDefault();

            let student = this.schema
                .reduce((t, s) => Object.assign(t, {[`${s.name}`]: this.form[s.name].value}), {})

            let promise = this.student
                ? StudentsService.update(this.student.id, student)
                : StudentsService.create(student);

            promise.then(() => RouterService.go('students'))
                .catch(err => this.showError(err));
        }

        remove () {
            StudentsService.remove(this.student.id)
                .then(() => RouterService.go('students'))
                .catch(this.showError.bind(this));
        }

        showError (error) {
            this._error.innerText = error.message;
            setTimeout(() => this._error.innerText = '', 5000);
        }
    }

    // register custom html element
    customElements.define(`${ConfigService.prefix}-student-form`, StudentFormComponent);
    return StudentFormComponent;
})();