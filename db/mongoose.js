//This file will handle connection logic to the MongoDB
let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/assignment', { useNewUrlParser: true}).then( ()=> {
    console.log('Connected to MongoDB Successfully');
}).catch((err) => {
    console.log('Error while attempting to connect to MongoDB');
    console.log(e);
});

module.exports = {
    mongoose
};