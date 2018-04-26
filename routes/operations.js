var express = require('express');
var router = express.Router();
//var expressValidator = require('express-validator');
var mongo = require('./mongodb/mongo');
var kafka = require('./kafka/client');
//var url = 'mongodb://localhost:27017/freelancer';

var session = require('client-sessions');
var url='mongodb://devfandango:fandango1@ds251819.mlab.com:51819/fandango'
var expressSessions = require("express-session");
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'teevra.2016@outlook.com',
        pass: 'Speedlabs09'
    }
});

var dummy="dummy";


router.post('/login', function (req, res, next) {

    var email = req.body.email;
    var password = req.body.password;
    console.log("reached login");

    mongo.connect(function (db) {
        var coll = db.collection('usertable');
        coll.findOne({'email': email, 'password': password}, function (err, user) {
                if (err) {
                    res.json({
                        status: false
                    });
                }
                if (!user) {
                    console.log('User Not Found with email ' + email);
                    res.json({
                        status: false
                    });
                }
                else {

                    //dummy=user.Username;
                        res.json({
                            email: email,
                            status: true,
                            user_id: user.user_id
                        });
                }
            });
    });
});


router.post('/signup', function (req, res, next) {

    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;
    var user_id =  Math.floor(Math.random() * Math.floor(9999));
    console.log("email :" + email);
    console.log("Name :" + name);

    var data = {
        user_id:user_id,
        name : name,
        email : email,
        password : password
    }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

        var coll = db.collection('usertable');
        coll.findOne({'email':email},function (err,user) {
            if(err){
                console.log("sending status 401")
                res.json({
                    status : false
                });
            }
            else if(user){
                console.log("sending status 401")
                res.json({
                    status : false
                });
            }

            else{
                mongo.insertDocument(db,'usertable',data,function (err,results) {
                    if (err) {
                        console.log("sending status 401")
                        res.json({
                            status: false
                        });
                    }
                    else {
                        console.log("User Registered")
                        var path = results["ops"][0]["_id"];
                        console.log(path);
                        res.json({
                            status: true,
                        });
                    }
                });
            }
        })
 });
});

router.post('/addmovies', function (req, res, next) {
    console.log("in addmovies");

    var title = req.body.title;
    var trailer = req.body.trailer;
    var cast = req.body.cast;
    var user_id =  Math.floor(Math.random() * Math.floor(9999));
    var release_date = req.body.release_date;
    var rating = req.body.rating;
    var photos = req.body.photos;
    var length = req.body.length;
    var theatres = req.body.theatres;
    var reviews = req.body.reviews;

    var data = {
        title : title,
        trailer : trailer,
        cast : cast,
        release_date: release_date,
        rating: rating,
        photos: photos,
        length: length,
        theatres: theatres,
        reviews: reviews


    }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

        var coll = db.collection('addmovie');
        coll.findOne({'title':title},function (err,user) {
            if(err){
                console.log("sending status 401")
                res.json({
                    status : false
                });
            }
            else if(user){
                console.log("sending status 401")
                res.json({
                    status : false
                });
            }

            else{
                mongo.insertDocument(db,'addmovie',data,function (err,results) {
                    if (err) {
                        console.log("sending status 401")
                        res.json({
                            status: false
                        });
                    }
                    else {
                        console.log("Movie added successfully")
                        var path = results["ops"][0]["_id"];
                        console.log(path);
                        res.json({
                            status: true,
                        });
                    }
                });
            }
        })
    });
});


router.post('/addhall', function (req, res, next) {
    console.log("in addhall");

    var time1 = req.body.time1;
    var time2 = req.body.time2;
    var time3 = req.body.time3;
    var user_id =  Math.floor(Math.random() * Math.floor(9999));
    var time4 = req.body.time4;
    var time5 = req.body.time5;
    var tickets = req.body.tickets;
    var screen = req.body.screen;
    var price = req.body.price;

    var data = {
        time1 : time1,
        time2 : time2,
        time3 : time3,
        time4: time4,
        time5: time5,
        tickets: tickets,
        screen: screen,
        price: price


    }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

                mongo.insertDocument(db,'addhall',data,function (err,results) {
                    if (err) {
                        console.log("sending status 401")
                        res.json({
                            status: false
                        });
                    }
                    else {
                        console.log("Movie hall added successfully")
                        var path = results["ops"][0]["_id"];
                        console.log(path);
                        res.json({
                            status: true,
                        });
                    }
                });


    });
});

module.exports = router;
