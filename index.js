const http = require('http');

const Router = require('./router.js');
const students = require('./students.js')

const routes = [{ method: 'GET', path: '/students', controller: students.getAllStudents },
    { method: 'GET', path: '/students/:id', controller: students.getStudent }];

const server = http.createServer(Router.Register(routes));
server.listen(5000, '127.0.0.1', () => console.log('Server running on: 127.0.0.1:5000'));