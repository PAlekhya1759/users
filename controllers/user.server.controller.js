let config = require('../config');
const jwt = require('jwt-simple');
const { User } = require('../db/models');
const mongoose = require('mongoose');


function generateToken(username, done) {
    let date = new Date().setDate(new Date().getDate() + 7);
    const payLoad = {
        iss : { username: username },
        exp: date
    };
    done(null,jwt.encode(payLoad, config.tokenSecret));
}

exports.signUpDataValidation = function(data, done) {
    if(!data || (data && !Object.keys(data).length)) {
        done('Proper data is required for user registration');
    } else if(!data.username) {
        done('Username (Email/Mobile) should not be blank');
    } else if(data.username) {
        let req = new RegExp(config.mobileOrPhoneRegex);
        if(!req.test(data.username)) {
            done('Username is not valid');
        } else if(!data.password) {
            done('Password is required');
        } else if(data.password && data.password.length && data.password.length < 8) {
            done('Password length should not be less than 8');
        } else {
            done(null);
        }
    } else {
        done('No proper data');
    }
};

exports.findOrRegisterUser = function(data,done) {
    User.findOne({deleted:false, username: data.username}).exec(function(findErr, user) {
        if(findErr) {
            done(findErr, null);
        } else if(user) {
            done('A user already exists with this username', null);
        } else {
            let user = new User(data);
            user.save(function(saveErr, saveRes) {
                if(saveErr) {
                    done(saveErr,null);
                } else {
                    generateToken(saveRes.username, function(genErr, genRes) {
                        done(genErr, {status:true, user:saveRes, token:genRes});
                    });
                }
            });
        }
    });
};

exports.getUserByToken = function(data, done) {
    let token = (data.body.token || data.headers.token);
    let info = jwt.decode(token,config.tokenSecret);
    if(new Date(info.exp) > new Date()) {
        User.findOne({username: info.iss.username, deleted: false}).exec(function(findErr, findRes) {
            done(findErr, findRes);
        });
    } else {
        done('Token is exxpired');
    }
};

exports.findUserByQuery = function(userId, done) {
    User.aggregate([{
        $match : {_id: mongoose.Types.ObjectId(userId), deleted: false }
    }, {
        $lookup: {
            'from': 'tasks',
            let: { target_item: { $ifNull: ['$_id', false] } },
            pipeline: [{
                $match: {
                    $expr: { $and: [{ $eq: ['$assignee', '$$target_item'] }, { $eq: ['$deleted', false] }] }
                }
            }],
            'as': 'tasks'
        }
    }]).exec(function(aggregateErr, finalUser) {
        done(aggregateErr, finalUser);
    });
}