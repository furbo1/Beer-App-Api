var mongoose = require('mongoose');
let bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
let ROLE_TYPES = require('../utils/constants')

var UserSchema = new Schema({
    username: String,
    email: {
        type: String,
        validate: {
            validator: function (email) {
                return new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$').test(email);
            }
        },
        unique: [true, 'This email already exists!']
    },
    password: {
        type: String,
        select: false

    },
    role: { 
        type: String,
        enum: [
            ROLE_TYPES.MANAGER,
            ROLE_TYPES.MARKETING,
            ROLE_TYPES.SALES,
            ROLE_TYPES.ADMIN,
            ROLE_TYPES.CLIENT

        ],
        default: "CLIENT"

    }
});

UserSchema.methods.generatePassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};


UserSchema.pre("save", async function () {
    this.password = await this.generatePassword(this.password);
});



var User = mongoose.model('User', UserSchema);

module.exports = User;


//MVC PATTERN
// HTTP ARQUITECTURE
// RESTful + React
// mongoose 