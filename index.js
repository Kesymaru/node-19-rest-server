const http = require('http');

const Router = require('./router.js');
const students = require('./students.js')

const routes = [
    {
        method: 'GET',
        path: 'api/v1/students',
        controller: students.getAll,
    },
    {
        method: 'GET',
        path: 'api/v1/students/:id',
        controller: students.getOne,
    },
    {
        method: 'POST',
        path: '/api/v1/students',
        controller: students.create
    },
    {
        method: 'PUT',
        path: '/api/v1/students/:id',
        controller: students.updated
    },
];

const server = http.createServer(Router.Register(routes));
server.listen(5000, '127.0.0.1', () => console.log('Server running on: 127.0.0.1:5000'));