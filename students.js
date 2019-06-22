const fs = require('fs');
const FILE_NAME = `${__dirname}/inventories/students.json`

function getAll (req, res, route) {
    let data = require(FILE_NAME);
    return data.data;
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

    return new Promise((resolve, reject) => {
        fs.writeFile(FILE_NAME, JSON.stringify(students), err => err ? reject(err) : resolve(data));
    });
}

function getOne(req, res, route) {
    let students = require(FILE_NAME);
    let id = +route.paths[route.paths.length-1];

    let student = students.data.find(student => student.id === id);
    if(student) return Promise.resolve(student);
    return Promise.reject(new Error(`Students ID: ${id} not found`))
}

function update (req, res, data) {
}

module.exports = {
    getAll,
    getOne,
    create,
    update,
};