const fs = require('fs');
const FILE_NAME = `${__dirname}/../inventories/students.json`

const Response = require('../core/response');

const SANITIZE = ['id'];

function getAll (req, res) {
    let students = require(FILE_NAME);
    Response.Send(res, students.data);
}

function create (req, res, route) {
    let data = route.body;
    if(!data) throw new Error(`Invalid data.`);
    if(!data.name) throw new Error(`Name required: ${data.name}.`);
    if(!data.age) throw new Error(`Age required: ${data.age}.`);
    if(isNaN(+data.age)) throw new Error(`Age must be an number: ${data.age}.`);

    let students = require(FILE_NAME);

    data.id = ++students.counter;
    students.data.push(data);

    save(students)
        .then(() => Response.Send(res, data))
        .catch(err => Response.ApplicationError(res, err));
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
    SANITIZE.forEach(k => delete student[k]);
}

function updateOne (req, res, route) {
    let id = +route.params.id;
    let body = route.body;

    let student = findById(id);
    if(student) return Response.Send(res, student);

    let students = require(FILE_NAME);
    Object.assign(student, sanitize(body));

    let idx = students.data.findIndex(s => s.id === id);
    if(idx > -1) {
        students.data[idx] = student;

        save(students)
            .then(() => Response.Send(res, student))
            .catch(err => Response.ApplicationError(res, err));
    }

    Response.ApplicationError(res, new Error(`Students ID: ${id} not found`));
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