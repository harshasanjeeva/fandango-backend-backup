var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://devfandango:fandango1@ds251819.mlab.com:51819/fandango";

var conn_pool = [];
var connected = false;
var error = false;

var create_conn_pool = function(pool_count,callback){
    connect( function(err, _db){
        connected =  true;
        if (err) {
            throw new Error('Could not connect: '+err);
            callback(err,null);
        }else{
            conn_pool.push(_db);
            console.log("conn pool length ",conn_pool.length);
            connectPool(pool_count,function(err,result){
                if(result){
                    getConnection(callback);
                }
            });
        }
    });
}


var connect = function(callback){
    MongoClient.connect(url, function(err, _db){
        if (err) {
            throw new Error('Could not connect: '+err);
        }
        callback(err,_db);
    });
};


var connectPool=function(count,callback){
    for(var i=0;i<count-1;i++){
        connect( function(err, _db){
            if (err) {
                throw new Error('Could not connect: '+err);
                callback(err,null);
            }else{
                conn_pool.push(_db);
              //  console.log("",conn_pool.length);
            }
        });
    }
    callback(false,true);
}

var getConnection = function(callback){

    if(connected){
        if(error){
            callback(undefined);
        }else{
            while(conn_pool.length==0);
            var db = conn_pool[0];
            conn_pool = conn_pool.slice(1,conn_pool.length);
            console.log("after getting connection, the count is ",conn_pool.length);
            callback(db);
        }

    }else{
        create_conn_pool(600,function(){
            getConnection(callback);
        });

    }


}

var closeConnection = function(db){

    conn_pool.push(db);
    console.log("after getting connection back, the count is ",conn_pool.length);
}

exports.getConnection = getConnection;
exports.create_conn_pool = create_conn_pool;
exports.closeConnection = closeConnection;