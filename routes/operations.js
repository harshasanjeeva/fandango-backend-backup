var express = require('express');
var router = express.Router();
//var expressValidator = require('express-validator');
var mongo = require('./mongodb/mongo');
var kafka = require('./kafka/client');
var loginStatus=false;
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


router.post('/adminLogin', function (req, res, next) {

    var email = req.body.email;
    var password = req.body.password;
    console.log("reached login");

    mongo.connect(function (db) {
        var coll = db.collection('administrator');
        coll.findOne({'email': email, 'password': password}, function (err, user) {
            if (err) {
                res.json({
                    status: false
                });
            }
            if (!user) {
                console.log('Admin Not Found with email ' + email);
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





router.post('/editprofile',function (req, res, next) {

    console.log("body---->email",req.body)
    
    console.log("email :" +req.body.email);
    console.log("phone :" +req.body.phone);
    console.log("name :" +req.body.name);

    console.log("userid :" +req.body.userid);
    console.log("cardholder :" +req.body.cardholder);
    console.log("creditcard :" +req.body.creditcard);
    console.log("cvv :" +req.body.cvv);
    console.log("expdate :" +req.body.expdate);
    var email = req.body.email;
    var name = req.body.name;
    var userid = req.body.userid;
    var phone = req.body.phone;
    var cardholder = req.body.cardholder;
    var creditcard = req.body.creditcard;
    var cvv = req.body.cvv;
    var expdate = req.body.expdate;
 





    mongo.connect(function (db) {


        var coll = db.collection('profiletable');
            coll.findOne({'name': name}, function (err, user) {
                    if (err) {
                        console.log("sending status 401")
                        res.json({
                            status: '401'
                        });
                    }
            else if (user) {

            coll.remove({'name':name},function(err,obj){
                console.log(" document(s) deleted");
                var data={
                    name:name,
                    email:email,
                    phone:phone,
                    cardholder:cardholder,
                    creditcard:creditcard,
                    userid:userid,
                    cvv:cvv,
                    expdate:expdate
                }
                mongo.insertDocument(db, 'profiletable', data, function (err, results) {
                    console.log("Profile Edited Successfully")
                    res.send({message: "Profile edited successfully!"});
                });



            });

 
            }
            else{

                var data={
                    name:name,
                    email:email,
                    phone:phone,
                    cardholder:cardholder,
                    creditcard:creditcard,
                    userid:userid,
                    cvv:cvv,
                    expdate:expdate
                }
                mongo.insertDocument(db, 'profiletable', data, function (err, results) {
                    console.log("Profile Edited Successfully")
                    res.send({message: "Profile edited successfully!"});
                });
            }
        }
        );
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

    var movieId =  Math.floor(Math.random() * Math.floor(9999));
    var movieName = req.body.movieName;
    var cast = req.body.cast;
    var movieTiming=req.body.movieTiming;
    var movieType=req.body.movieType;
    var movieVideoLink=req.body.movieVideoLink;
    var rating = req.body.rating;
    var photos = req.body.photos;
    var length = req.body.length;
    var reviews = req.body.reviews;

    var data = {
        movieId : movieId,
        movieName : movieName,
        cast : cast,
        movieTiming: movieTiming,
        movieType: movieType,
        rating:rating,
        movieVideoLink:movieVideoLink,
        photos: photos,
        length: length,
        reviews: reviews


    }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

        var coll = db.collection('movietable');
        coll.findOne({'movieName':movieName},function (err,user) {
            if(err){
                console.log("sending status 401")
                res.json({
                    status : false
                });
            }
            else if(user){
                var myquery = {movieName: movieName};
                var coll = db.collection('movietable');
                var newvalues = {$set: {cast: cast, movieTiming: movieTiming,movieType:movieType,rating:rating,movieVideoLink:movieVideoLink,photos:photos,length:length,reviews:reviews}};
                coll.updateOne(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    db.close();
                });
            }

            else{
                mongo.insertDocument(db,'movietable',data,function (err,results) {
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

                    // res.json({
                    //     moviedata: user
                    // });

                }
            });
        });
    });
});



router.post('/addHall', function (req, res, next) {
    console.log("in addhall");

    var hallName = req.body.hallName;
    var hallId = req.body.hallId;
    var hallAddress = req.body.hallAddress;
    var type = req.body.type;
    console.log("type is"+ type);
    var data = {
        hallName : hallName,
        hallId : hallId,
        hallAddress : hallAddress
    }

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)

        if(type==='add') {
            console.log("in adder");

            mongo.insertDocument(db, 'addhall', data, function (err, results) {
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
        }
        else {

            console.log("in update function", hallId, hallName, hallAddress);
            var myquery = {hallId: hallId};
            var coll = db.collection('addhall');
            var newvalues = {$set: {hallName: hallName, hallAddress: hallAddress}};
            coll.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
            });
        }

    });
});


router.post('/getMovieHalls', function (req, res, next) {

    console.log("Reached all get halls");
    mongo.connect(function (db) {
        console.log("Connected to MongoDB at ", url)

        mongo.connect(function (db) {
            var coll = db.collection('addhall');
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
                        hallData: user
                    });

                }
            });
        });
    });
});

router.post('/addUserToHall', function (req, res, next) {
    console.log("in addUserToHall");

    var hallUserEmail = req.body.email;
    var userEmail = req.body.hallUserEmail;
    var hallId = req.body.hallId;
    var password = req.body.password;
    console.log("in addUserToHall"+hallUserEmail+userEmail+hallId+password);
    var hallUserId =  Math.floor(Math.random() * Math.floor(9999));
    var data = {
        hallUserEmail : hallUserEmail,
        hallId : hallId,
        password:password,
        hallUserId:hallUserId
    }

    mongo.connect(function(db) {
        var coll = db.collection('UserHall');
        coll.findOne({'hallUserEmail': userEmail}, function (err, user) {
            if (err) {
                console.log("sending status 401")
                res.json({
                    status: false
                });
            }
            else if (user) {
                var myquery = {hallUserEmail: userEmail};
                var coll = db.collection('UserHall');
                var newvalues = {
                    $set: {
                        hallUserEmail: hallUserEmail,
                        password: password,
                        hallUserId: hallUserId
                    }
                };
                coll.updateOne(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    db.close();
                });
            }

            else {
                mongo.insertDocument(db, 'UserHall', data, function (err, results) {
                    if (err) {
                        console.log("sending status 401")
                        res.json({
                            status: false
                        });
                    }
                    else {
                        console.log("User Added to Hall")
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



router.post('/payment', function (req, res, next) {
    console.log("in payment");

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


router.post('/viewAllUsers', function (req, res, next) {


    var hallId = req.body.hallId;
    console.log("in payment",hallId);

    mongo.connect(function(db){
        console.log("Connected to MongoDB at ",url)
        var coll = db.collection("UserHall");
        coll.find({hallId:hallId}).toArray(function(err, user) {
            if (err) {
                console.log("sending status 401")
                res.json({
                    status: false
                });
            }
            else {

                console.log("no err",user)
                res.json({
                    userData: user
                });
            }
        });
    });
});


module.exports = router;
