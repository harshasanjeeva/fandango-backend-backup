var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://devfandango:fandango1@ds251819.mlab.com:51819/fandango';
var conn = require('./conn_pool');


function connect(callback){
    conn.getConnection(callback)
};

/**
 * Returns the collection on the selected database
 */
exports.collection = function(name){
    if (!connected) {
        throw new Error('Must connect to Mongo before calling "collection"');
    }
    return db.collection(name);
};

exports.findDocument = function(collection,data,callback){
    connect(function (db) {
        console.log("type of callback in findDocument", typeof callback)
        var coll = db.collection(collection);
        var cursor = coll.find(data);
        var return_data = [];
        cursor.forEach(function(doc) {
            //console.log(JSON.stringify(doc));
            return_data.push(doc);
        }, function(err) {
            conn.closeConnection(db);
            callback(false,return_data);
        });
    })
};

exports.findOneDocument = function(collection,data,callback){
    connect(function (db) {
        console.log("Input data is ",collection)
        var coll = db.collection(collection);
        coll.findOne(data).then(function(return_data) {
            console.log("Return data ", return_data)
            conn.closeConnection(db);
            callback(false, return_data);
        })
    })

};

/**
 * inserts data in given collection
 */
exports.insertDocument = function (collection, data,callback) {
    connect(function (db) {
        var coll = db.collection(collection);
        coll.insertOne(data,function(err, result) {
            if(err){
                console.log("Got error")
            }
            else
            {
                console.log("Inserted a document into the collection.",collection);
                conn.closeConnection(db);
                callback(err,result)
            }
        });
    })
   
};

exports.deleteDocument = function (collection, data,callback) {
    connect(function (db) {
        var coll = db.collection(collection);
        console.log(data)
        coll.removeOne(data,function(err, result) {
            if(err){
                console.log("Got error while deletion of document")
            }
            else
            {
                console.log("deleted a document from collection ",collection);
                conn.closeConnection(db);
                callback(err,result)
            }
        });
    })
};

/**
 * save document in given collection
 */
exports.saveDocument = function (collection, data,callback) {
    connect(function (db) {
        var coll = db.collection(collection);
        coll.save(data,function(err, result) {
            if(err){
                console.log("Got error" , err)
            }
            else
            {
                console.log("Saved User Profile.");
                conn.closeConnection(db);
                callback(err,result)
            }
        });
    })

};

/**
 * save document in given collection
 */
exports.findAndModifyDocument = function (collection, data) {
    connect(function (db) {
        var coll = db.collection(collection);
        coll.findAndModify(
            {_id:ObjectId(data.id)},
            [],
            {$set:{fname:data.fname,lname:data.lname}},
            { new:true }
        );
        conn.closeConnection(db)
    })
    };

exports.connect = connect;
