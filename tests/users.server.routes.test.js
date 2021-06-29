'use strict';

/**
 * Module dependencies.
 */
let should = require('should');
let userController = require('../controllers/user.server.controller');

/*  Unit tests */

describe('User CRUD Unit Tests:', function () {
    before(function(done) {
        /* Data for all the test cases */
        users = [
        {}, 
        {
            username:''
        }, {
            username:'alekhya'
        }, {
            username:'alekhya@gmail.com',
            password:'',
        }, {
            username:'alekhya@gmail.com',
            password:'p'
        }, {
            username:'alekhya@gmail.com',
            password:'password'
        }, {
            username:'alekhya@gmail.com',
            password:'password'
        }, {
            username:'alekhya@yahoo.com',
            password:'password',
            email: 'abcd@gmail.com',
            mobile: 9999977777
        }, {
            username:'alekhya@outlook.com',
            password:'password'
        }];
        done();
    });

    beforeEach(function(done) {
        done();
    });

    /* Case 1: Throw error when there is no data to create user */
    it('should not be able to create user without any data', function(done) {
        userController.signUpDataValidation(users[0], function(err) {
            should.exist(err);
            err.should.equal('Proper data is required for user registration');
            done();
        });
    });

    /* Case 2: Throw error when there is no username */
    it('should not be able to create user without username', function(done) {
        userController.signUpDataValidation(users[1], function(err) {
            should.exist(err);
            err.should.equal('Username (Email/Mobile) should not be blank');
            done();
        });
    });

    /* Case 3: Throw error when there is no proper username */
    it('should not be able to create user without proper username', function(done) {
        userController.signUpDataValidation(users[2], function(err) {
            should.exist(err);
            err.should.equal('Username is not valid');
            done();
        });
    });

     /* Case 4: Throw error when there is no password */
    it('should not be able to create user without password', function(done) {
        userController.signUpDataValidation(users[3], function(err) {
            should.exist(err);
            err.should.equal('Password is required');
            done();
        });
    });

     /* Case 5: Throw error when password is empty*/
     it('should not be able to create user with empty password', function(done) {
        userController.signUpDataValidation(users[4], function(err) {
            should.exist(err);
            err.should.equal('Password is required');
            done();
        });
    });

    /* Case 6: Should be able to create user */
     it('should be able to create user with proper data', function(done) {
        userController.signUpDataValidation(users[5], function(err) {
            should.not.exist(err);
            userController.findOrRegisterUser(req.body, function(findErr, finalUser) {
                should.not.exist(findErr);
                should.exist(finalUser);
                finalUser.user.username.should.equal('alekhya@gmail.com');
                done();
            });
        });
    });

    /* Case 7: Should not be able to create users with duplicate username */
    it('should not be able to create user with same username', function(done) {
        userController.signUpDataValidation(users[6], function(err) {
            should.not.exist(err);
            userController.findOrRegisterUser(req.body, function(findErr, finalUser) {
                should.exist(findErr);
                findErr.should.equal('A user already exists with this username');
                done();
            });
        });
    });

    /* Case 8: Should be able to create user */
    it('should be able to create user with all data', function(done) {
        userController.signUpDataValidation(users[7], function(err) {
            should.not.exist(err);
            userController.findOrRegisterUser(users[7], function(findErr, finalUser) {
                should.not.exist(findErr);
                should.exist(findUser);
                finalUser.user.username.should.equal('alekhya@yahoo.com');
                finalUser.user.email.should.equal('abcd@gmail.com');
                done();
            });
        });
    });

    /* Case 9: To get the list of all users */
    it('should be able to get the list of all users', function(done) {
        userController.findUsersList({deleted:false}, {page: 1, limit:10}, function(findErr, findRes) {
            should.not.exist(findErr);
            should.exist(findRes);
            findRes.length.should.not.equal(0);
            done();
        });
    });

    /* Case 10: Should be able to get single user */
    it('should be able to get single user', function(done) {
        userController.signUpDataValidation(users[8], function(err) {
            should.not.exist(err);
            userController.findOrRegisterUser(users[8], function(findErr, finalUser) {
                should.not.exist(findErr);
                should.exist(findUser);
                finalUser.user.username.should.equal('alekhya@outlook.com');
                userController.findUserByQuery(finalUser.user._id, function(userErr, userRes) {
                    should.not.exist(userErr);
                    should.exist(userRes);
                    userRes.username.should.equal('alekhya@outlook.com');
                    done();
                });
            });
        });
    });

    afterEach(function(done) {
        done();
    });

    after(function(done) {
        done();
    });
});


