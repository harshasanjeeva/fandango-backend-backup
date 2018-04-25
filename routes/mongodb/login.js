var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt');
var mongo = require('./mongo')
var mongoURL = "mongodb://localhost:27017/freelancer";


module.exports = function(passport){
    passport.use('login', new LocalStrategy(function(email, password, done) {
        mongo.connect(function(db) {
            var coll = db.collection('user');
            coll.findOne({'email':email, 'password': password},function (err,user) {
                    if(err)
                        done(err)
                    else if(!user){
                        console.log('User Not Found with email ' + email);
                        done(null, false)
                    }
                    else if(!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        done(null,false)
                    }
                    else {
                        done(null, user);
                    }
                }
            )
        })
    })
    )};


    var isValidPassword = function(user, password){
        console.log("User ",user)
        console.log("Password ",password)
        return bCrypt.compareSync(password, user.password);
    }

