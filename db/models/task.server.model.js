const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const validateLength256 = function(property) {
    if(property) {
        return (property && property.length <= 256);
    }
    return true;
};
let TaskSchema = new Schema({ 
    title: {
        type: String,
        default: '',
        trim: true,
        validate: [validateLength256, 'First Name length should be less than 256']
    },
    description:{
        type: String,
        default: '',
        trim: true
    },
    summary:{
        type: String,
        default: '',
        trim: true
    },
    type: {
        type: String,
        enum: ['Bug', 'Epic', 'Task', 'Story', 'Sub-Task'],
        default: 'Task',
        trim: true
    },
    reporter: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    assignee: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    currentStatus: {
        type: String,
        enum: ['Backlog', 'ToDo', 'InProgress', 'Done', 'Re-Opened', 'Verified', 'Closed'],
        default: 'Backlog',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    priority: {
        type: String,
        enum: ['Highest', 'High', 'Medium', 'Low'],
        default: 'Highest',
        trim: true
    },
    code: {
        type: String,
        default: '',
        trim: true
    },
    project: {
        type: String,
        default: '',
        trim: true
    },
    comments: [{
        comment: {
            type: String,
            default: '',
            trim: true
        }
    }],
    statusHistory: [{
        status: {
            type: String,
            enum: ['Highest', 'High', 'Medium', 'Low'],
            default: 'Highest',
            trim: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        user: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    lastUpdatedUser: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    updateHistory: [{
        modifiedOn: {
            type: Date,
            default: Date.now
        },
        modifiedBy: {
            type: Schema.ObjectId,
            ref: 'User'
        }
    }],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = { Task };