const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const config = require('../../config');
const validateEmail = function(property) {
    if(property) {
        const expression = new RegExp(config.emailRegEx);
        return expression.test(property);
    }
    return true;
};

const validateMobileNumber = function(property) {
    if(property) {
        const expression = new RegExp(config.mobileRegEx);
        return expression.test(property);
    }
    return true;
};

const validateLength256 = function(property) {
    if(property) {
        return (property && property.length <= 256);
    }
    return true;
};
let UserSchema = new Schema({
    firstName: {
        type: String,
        default: '',
        trim: true,
        validate: [validateLength256, 'First Name length should be less than 256']
    },
    middleName: {
        type: String,
        default: '',
        trim: true,
        validate: [validateLength256, 'First Name length should be less than 256']
    },
    lastName: {
        type: String,
        default: '',
        trim: true,
        validate: [validateLength256, 'First Name length should be less than 256']
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    email: {
        type: String,
        default: '',
        trim: true,
        validate: [validateEmail, 'Please fill proper email']
    },
    mobile: {
        type: String,
        default: '',
        trim: true,
        validate: [validateMobileNumber, 'Please fill proper Mobile Number']
    },
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        default: ''
    },
    created: {
        type:  Date,
        default: Date.now
    },
    lastUpdated: {
        type:  Date,
        default: Date.now
    },
    lastUpdatesUser : {
        type: Schema.ObjectId,
        ref: 'User'
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = { User };