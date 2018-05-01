var mongo = require('./mongo')
var bCrypt = require('bcrypt');

function handle_request(msg, callback){
    var res = {};
    console.log("In handle request:"+ JSON.stringify(msg));

        mongo.findOneDocument('user',{'email':msg.username},function (err,user) {
                console.log("User here is ",user)
                if(err){
                    res.code = "401";
                    res.value = "Failed Login";}
                else if(!user){
                    res.code = "401";
                    res.value = "User not found";
                    res.user = ''
                }
                else if(!isValidPassword(user, msg.password)){
                    res.code = "401";
                    res.value = "Invalid password";
                    res.user = ''
                }
                else {
                    res.code = "200";
                    res.value = "Success Login";
                    res.user = user;
                    //console.log("response inside else ",res)
                }
                //console.log("response from here is ",res)
            callback(null, res)
            }

        )

}

var isValidPassword = function(user, password){
    //console.log("User ",user)
    //console.log("Password ",password)
    return bCrypt.compareSync(password, user.passwd);
}

exports.handle_request = handle_request;