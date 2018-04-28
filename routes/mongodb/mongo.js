var MongoClient = require('mongodb').MongoClient;
var db;
var connected = false;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
//var url = 'mongodb://localhost:27017/freelancer'
var url = 'mongodb://devfandango:fandango1@ds251819.mlab.com:51819/fandango';

/**
 * Connects to the MongoDB Database with the provided URL
 */
exports.connect = function(callback){
    console.log( typeof callback);
    MongoClient.connect(url, function(err, _db){
        if (err) { throw new Error('Could not connect: '+err); }
        db = _db;
        connected = true;
        console.log(connected +" is connected");
        callback(db);
    });
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
/**
 * inserts data in given collection
 */
exports.insertDocument = function (db,collection, data,callback) {
    var coll = db.collection(collection);
    coll.insertOne(data,function(err, result) {
        if(err){
            console.log("Got error")
        }
        else
        {
            console.log("Inserted a document into the collection.",collection);
            callback(err,result)
        }
    });
};

exports.deleteDocument = function (db,collection, data,callback) {
    var coll = db.collection(collection);
    console.log(data)
    coll.removeOne(data,function(err, result) {
        if(err){
            console.log("Got error while deletion of document")
        }
        else
        {
            console.log("deleted a document from collection ",collection);
            callback(err,result)
        }
    });
};


/**
 * save document in given collection
 */
exports.saveDocument = function (db,collection, data,callback) {
    var coll = db.collection(collection);
   coll.save(data,function(err, result) {
        if(err){
            console.log("Got error" , err)
        }
        else
        {
            console.log("Saved User Profile.");
            callback(err,result)
        }
    });
};

/**
 * save document in given collection
 */
exports.findAndModifyDocument = function (db,collection, data) {
    var coll = db.collection(collection);
    coll.findAndModify(
        {_id:ObjectId(data.id)},
        [],
        {$set:{fname:data.fname,lname:data.lname}},
        { new:true }
)};

exports.findAndUpdateHall = function (db,collection,data) {
    var coll = db.collection(collection);
    var myquery = {hallId: data.hallId};
    var newvalues = {$set: {hallName: data.hallName, hallAddress: data.hallAddress}};
    coll.updateOne(myquery, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
    });
}