// students controller
const students = [
    {id: 1, name: 'Alex'}, 
    {id: 2, name: 'Melissa'},
];

function getAllStudents (req, res) {
    console.log('getAllStudents');
    return students;
}

function getStudent(req, res) {
    return students[0];
}

module.exports = {getAllStudents, getStudent}