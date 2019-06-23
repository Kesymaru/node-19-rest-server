const fs = require('fs');

const Response = require('../core/response');

const FILE_NAME = `${__dirname}/../inventories/students.json`;
const FIELDS = ['name', 'age'];

function getAll (req, res) {
    let students = require(FILE_NAME);
    Response.Send(res, students.data);
}

function create (req, res, route) {
    let student = sanitize(route.body);
    let errors = validate(student);

    if(errors.length) return Response.BadRequest(res, errors);

    let students = require(FILE_NAME);
    student.id = ++students.counter;
    students.data.push(student);

    save(students)
        .then(() => Response.Send(res, student))
        .catch(err => Response.ApplicationError(res, err));
}

function validate(student) {
    let errors = [];

    if(!student) errors.push(new Error(`Invalid student data.`));
    if(!student.name) errors.push(new Error(`Student name required.`));
    if(!student.age) errors.push(new Error(`Student age required.`));
    if(isNaN(+student.age)) errors.push(new Error(`Student age must be an number.`));

    return errors;
}

function save (students) {
    return new Promise((resolve, reject) => {
        fs.writeFile(FILE_NAME, JSON.stringify(students), err => err ? reject(err) : resolve(students));
    });
}

function getOne(req, res, route) {
    let id = +route.params.id;

    let student = findById(id);
    if(student) return Response.Send(res, student);

    Response.ApplicationError(res, new Error(`Students ID: ${id} not found`));
}

function findById (id) {
    let students = require(FILE_NAME);
    return students.data.find(student => student.id === id);
}

function sanitize (student) {
    return FIELDS
        .reduce((data, field) => Object.assign(data, {[`${field}`]: student[field]}), {});
}

function updateOne (req, res, route) {
    let id = +route.params.id;
    let body = sanitize(route.body);

    let student = findById(id);
    if(!student) return Response.ApplicationError(res, new Error(`Students ID: ${id} not found`));

    let students = require(FILE_NAME);
    Object.assign(student, body); // update the student

    let idx = students.data.findIndex(s => s.id === id);
    if(idx < -1) return Response.ApplicationError(res, new Error(`Could not update student ID: ${id}`));

    students.data[idx] = student;
    save(students)
        .then(() => Response.Send(res, student))
        .catch(err => Response.ApplicationError(res, err));
}

function report (req, res, route) {
    let students = require(FILE_NAME);
    let data = students.data
        .reduce((t, student, i) => {
            Object.keys(student).forEach(key => {
                t += `${key}:${student[key]}`;
                t += i < students.data.length ? '\n' : '';
            });
            return t;
        }, '');

    Response.Send(res, data, {
        'contentType': 'text/csv'
    });
}

module.exports = {
    getAll,
    getOne,
    create,
    updateOne,
    report,
};