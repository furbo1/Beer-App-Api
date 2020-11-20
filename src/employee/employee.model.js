var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmployeeSchema = new Schema({
    id: String,
    jobName: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


var Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;


//MVC PATTERN
// HTTP ARQUITECTURE
// RESTful + React
// mongoose 