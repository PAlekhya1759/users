const express = require('express');
const app = express();
const { mongoose } = require('./db/mongoose');
const bodyParser = require('body-parser');
const userController =  require('./controllers/user.server.controller');
const _ = require('lodash');


//Load in the mongoose models
const {User, Task} = require('./db/models');

//Load middleware
app.use(bodyParser.json());

/* ROUTE HANDLERS */

/* USER ROUTES */

app.get('/users', (req,res) => {
    userController.getUserByToken(req, function(err, user) {
        if (err) {
             res.status(400).send({
                status: false,
                message: err
            });
        } else if(user) {
            let pageOptions =  {};
            if (req.query.page && !isNaN(req.query.page)) {
                pageOptions.page = parseInt(req.query.page, 10);
            }
            if (req.query.limit) {
                pageOptions.limit = parseInt(req.query.limit, 10);
            }
            User.find({ deleted:false }).skip(pageOptions.page > 0 ? ((pageOptions.page - 1) * pageOptions.limit) : 0).limit(pageOptions.limit ? pageOptions.limit : 10).exec(function(findErr, findRes) {
                if(findErr) {
                    res.status(400).send({
                        status: false,
                        message: findErr
                    });
                } else {
                    res.send(findRes);
                }
            });
        } else {
            res.send({status:400, message: 'No User'});
        }
    });
});

app.post('/users', (req,res) => {
    userController.signUpDataValidation(req.body, function(err) {
        if(err) {
            res.send({ status:400, message: err });
        } else {
            userController.findOrRegisterUser(req.body, function(findErr, finalUser) {
                if(findErr) {
                    res.send({ status:400, message: findErr });
                } else {
                    res.send(finalUser);
                }
            });
        }
   });
});

app.put('/users/:userId', (req, res) => {
    userController.getUserByToken(req, function(err, loginUser) {
        if (err) {
             res.status(400).send({ status: false, message: err });
        } else if(loginUser) {
            User.findOne({_id: req.params.userId, deleted: false}).exec(function(findErr, findRes) {
                if(findErr) {
                    res.status({status:200, message: findErr});
                } else {
                    let finalUser = _.extend(findRes, req.body);
                    finalUser.lastUpdated = new Date();
                    finalUser.lastUpdatesUser = loginUser._id;
                    if(req.body.isDelete) {
                        finalUser.delete = true;
                    }
                    finalUser.save(function(saveErr,saveRes) {
                        if(saveErr) {
                            res.status(400).send({ status: false, message: saveErr });
                        } else {
                            res.send(saveRes);
                        }
                    }); 
                }
            });
        } else {
            res.send({status: 400, message: 'No User'});
        }
    });
});

app.get('/users/:userId', (req, res) => {
    userController.getUserByToken(req, function(err, loginUser) {
        if (err) {
             res.status(400).send({ status: false, message: err });
        } else if(loginUser) {
            console.log(req.params.userId);
            userController.findUserByQuery(req.params.userId, function(userErr, userRes) {
                if(userErr) {
                    res.send({status: 400, message: userErr});
                } else {
                    res.send(userRes);
                }
            });
        } else {
            res.send({status: 400, message: 'No User'});
        }
    });
});

app.listen(8000, () => {
    console.log('Server is listening on port 8000');
});