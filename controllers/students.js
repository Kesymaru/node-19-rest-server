const fs = require('fs');
const FILE_NAME = `${__dirname}/../inventories/students.json`

const Response = require('../core/response');

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

    fs.writeFile(FILE_NAME, JSON.stringify(students), err => {
        if(err) return Response.ApplicationError(res, err);
        Response.Send(res, data);
    });
}

function getOne(req, res, route) {
    let id = +route.params.id;
    let students = require(FILE_NAME);

    let student = students.data.find(student => student.id === id);
    if(student) return Response.Send(res, student);

    Response.ApplicationError(res, new Error(`Students ID: ${id} not found`))
}

function update (req, res, route) {
    let {id} = route.params;

    Response.Send(res, {id});
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
    update,
    report,
};