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
            this.form = document.createElement('form');

            Object.keys(this.schema)
                .map(k => this._input(this.schema[k]))
                .reduce((f, i) => f.appendChild(i).parentNode, this.form);

            this._error = document.createElement('div');
            this.form.appendChild(this._error);

            this.form.appendChild(new ButtonComponent({
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
                    click: () => NavigationService.go('students')
                };

                this.form.appendChild(new ButtonComponent({
                    text: 'Remove',
                    className: 'waves-effect waves-light btn',
                    events: {
                        click: this.remove.bind(this)
                    }
                }));
            }
            this.form.appendChild(new ButtonComponent(reset));

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

            promise.then(() => NavigationService.go('students'))
                .catch(err => this.showError(err));
        }

        remove () {
            StudentsService.remove(this.student.id)
                .then(() => NavigationService.go('students'))
                .catch(this.showError.bind(this));
        }

        showError (error) {
            this._error.innerText = error.message;
            setTimeout(() => this._error.innerText = '', 5000);
        }
    }

    // register custom html element
    customElements.define(`${ConfigService.prefix}-student-form`, StudentFormComponent);
    window.StudentFormComponent = StudentFormComponent;
})()