var mongo = require('./mongo')

var LogList=function (req,res){
            mongo.connect(function(db) {
                db.collection('userlogs').find({'userid':req.session.user._id}).toArray(function (err,user) {
                    if(err){
                        throw err;
                    }
                       // console.log("User Activity ",user)
                        var sendLogs=[];
                        for(var i=0;i<user.length;i++)
                        {
                            var file = {};
                            file.filename = user[i].filename;
                            file.operation = user[i].operation;
                            file.inserttime = user[i].inserttime;
                            sendLogs.push(file);
                        }

                    //console.log(JSON.stringify(sendLogs));
                    res.json({status:'201',LogList:sendLogs});

                    }
                )
            })

        };


exports.LogList = LogList