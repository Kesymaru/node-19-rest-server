const fs = require('fs');
const FILE_NAME = `${__dirname}/../inventories/students.json`

function getAll () {
    let data = require(FILE_NAME);
    return Promise.resolve(data.data);
}

function create (route) {
    let data = route.body;
    if(!data) throw new Error(`Invalid data.`);
    if(!data.name) throw new Error(`Name required: ${data.name}.`);
    if(!data.age) throw new Error(`Age required: ${data.age}.`);
    if(isNaN(+data.age)) throw new Error(`Age must be an number: ${data.age}.`);

    let students = require(FILE_NAME);

    data.id = ++students.counter;
    students.data.push(data);

    return new Promise((resolve, reject) => {
        fs.writeFile(FILE_NAME, JSON.stringify(students), err => err ? reject(err) : resolve(data));
    });
}

function getOne(route) {
    let id = +route.params.id;
    let students = require(FILE_NAME);

    let student = students.data.find(student => student.id === id);
    if(student) return Promise.resolve(student);
    return Promise.reject(new Error(`Students ID: ${id} not found`))
}

function update (route) {
    let {id} = route.params;

    Promise.resolve({id});
}

function report () {
    let data = require(FILE_NAME);
    let text = data
        .reduce((t, student, i) => {
            Object.keys(student).forEach(key => {
                t += `${key}:${student[key]}`;
                t += i < data.length ? '\n' : '';
            });
            return t;
        }, '');

    console.log('data', text);
    Promise.resolve(text);
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
    report,
};