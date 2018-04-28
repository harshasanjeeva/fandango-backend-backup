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

router.post('/ticketing', function (req, res, next) {

    var email = req.body.email;
    var user_id = req.body.user_id;
    var movie_id = req.body.movie_id;
    var general = req.body.general;
    var student = req.body.student;
    var children = req.body.children;
    var general_amount = req.body.general_amount;
    var student_amount = req.body.student_amount;
    var children_amount = req.body.children_amount;

    var total = general_amount + student_amount + children_amount;

    console.log("reached login");

    var data = {
        user_id: user_id,
        email: email,
        movie_id: movie_id,
        general: general,
        student: student,
        children: children,
        general_amount: general_amount,
        student_amount: student_amount,
        children_amount: children_amount,
        total: total
    }
    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ", url);

        mongo.insertDocument(db, 'bookingtable', data, function (err, results) {
            if (err) {
                console.log("sending status 401")
                res.json({
                    status: '401'
                });
            }
            else {
                console.log("Booking Made Successful")
                res.json({
                    data: data
                })
            }
        })
    })
})

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

router.post('/getmovies', function (req, res, next) {

    console.log("Reached all get movies");
    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ", url)

        mongo.connect(function (db) {
            var coll = db.collection('movietable');
            console.log("dummy");
            coll.find({}).toArray(function (err, user) {
                if (err) {
                    console.log("err")
                    res.json({
                        status: '401'
                    });
                }
                else {
                    console.log("no err",user)
                    res.json({
                        moviedata: user
                    });
                }
            });
        });
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

router.post('/payment', function (req, res, next) {
    console.log("in payment");

    var user_id = req.body.user_id;
    var name = req.body.name;
    var creditcard = req.body.creditcard;
    var cvv = req.body.cvv;
    var expdate = req.body.expdate;
    var movieid = req.body.movieid;
    var movieName = req.body.movieName;
    var total_amount = req.body.total_amount;
    var total_tickets = req.body.total_tickets;
    var genre=req.body.genre;
    var release=req.body.release;
    var timings=req.body.timings;
    var theatrename=req.body.theatrename;
    var student=req.body.student;
    var children=req.body.children;
    var general=req.body.general;

    var data = {
        user_id :user_id,
        name : name,
        creditcard: creditcard,
        cvv : cvv,
        expdate : expdate,
        movieid : movieid,
        movieName: movieName,
        genre:genre,
        release:release,
        total_amount: total_amount,
        total_tickets: total_tickets,
        timings:timings,
        theatrename:theatrename,
        student:student,
        children:children,
        general:general
    }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

        mongo.insertDocument(db,'payment',data,function (err,results) {
            if (err) {
                console.log("sending status 401")
                res.json({
                    status: false
                });
            }
            else {
                console.log("payment added successfully")
                var path = results["ops"][0]["_id"];
                console.log(path);
                res.json({
                    value:data,
                    status: true,
                });
            }
        });
    });
});


router.post('/realticket', function (req, res, next) {

    var user_id = req.body.user_id;
    console.log(user_id);
    console.log("reached real ticket");

    mongo.connect(function (db) {
        var coll = db.collection('payment');
        coll.findOne({'user_id': user_id}, function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            else if(!user)
            {
                console.log("user not found")
                res.send(404)
            }
            else {
                coll.
                res.json({
                    bill: user
                });
            }
        });
    });
});

router.post('/editprofile', function (req, res, next) {

    var user_id = req.body.user_id;
    console.log(user_id);
    console.log("reached real ticket");

    mongo.connect(function (db) {
        var coll = db.collection('payment');
        coll.findOne({'user_id': user_id}, function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            else if(!user)
            {
                console.log("user not found")
                res.send(404)
            }
            else {
                res.json({
                    bill: user
                });
            }
        });
    });
});

router.post('/delprofile', function (req, res, next) {

    var user_id = req.body.user_id;
    console.log(user_id);
    console.log("reached delete profile");

    mongo.connect(function (db) {
        var coll = db.collection('usertable');
        coll.remove({'user_id': user_id}, function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            else if(!user)
            {
                console.log("user not found")
                res.send(404)
            }
            else {
                res.json({
                    status: true
                });
            }
        });
    });
});

router.post('/viewprofile', function (req, res) {

    var user_id = req.body.userid;
    console.log(user_id);
    console.log("reached view profile");

    mongo.connect(function (db) {
        var coll = db.collection('usertable');
        coll.findOne({'user_id': user_id}, function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            else if(!user)
            {
                console.log("user not found")
                //res.send(404)
            }
            else {
                var collect=db.collection('profiletable')
                collect.findOne({'email':user.email}), function(err,results){
                    if (err) {
                        res.json({
                            status: false
                        });
                    }
                    else {
                        console.log(results)
                              res.json({
                                  First_Name: results.First_Name,
                                  Last_Name: results.Last_Name,
                                  address: results.address,
                                  city: results.city,
                                  state: results.state,
                                  zipcode: results.zipcode,
                                  phone: results.phone,
                                  email: results.email
                        });
                    }
                }
            }
        });
    });
});
module.exports = router;
