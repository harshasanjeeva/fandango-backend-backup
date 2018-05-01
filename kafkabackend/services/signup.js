var mongo = require('./mongo')

function handle_signup(msg, callback){
    var res = {};
    console.log("In sign up:"+ JSON.stringify(msg));
    mongo.findOneDocument('usertable',{'email':msg.email},function (err,user) {
        console.log("In signup user ",user)
        if(err){
            console.log("sending status 401 coz of error")
            res.code = "401";
            res.value = "Error exists"
        }
        else if(user){
            console.log("sending status 401 coz user already exists")
            res.code = "401";
            res.value = "User already exists";
        }
        else{
            mongo.insertDocument('user',msg,function (err,results) {

                if (err) {
                    console.log("sending status 401 while insert doc")
                    res.code = "401";
                    res.value = "Error found";
                    callback(null, res)
                }
                else {
                    console.log("User Registered")
                    var path = results["ops"][0]["_id"];
                    console.log(path);
                    res.code = 200;
                    res.value = "User registered";
                    callback(null, res)
                }
            })}
        console.log("response from here is ",res)
    })}
exports.handle_signup = handle_signup;