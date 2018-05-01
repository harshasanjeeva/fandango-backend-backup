var mongodb = require('./services/mongo')
var mongo_pool = require('./services/conn_pool')
var connection =  new require('./kafka/Connection');
var login = require('./services/login');
var sign_up = require('./services/signup');


var topic_name = 'login_topic';
var topic_signup = 'signup_topic';


var consumer = connection.getConsumer(topic_name);
var consumer_signup = connection.getConsumer(topic_signup);
var producer = connection.getProducer();

//mongodb.connect();
mongo_pool.create_conn_pool(1000,function () {
    }
)
console.log("Mongo Connections created")

console.log('server is running');

consumer.on('message', function (message) {
    console.log('message received');
    console.log('received message is ',JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    login.handle_request(data.data, function(err,res){
        console.log('after handle',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});

consumer_signup.on('message', function (message) {
    console.log('message received in sign up');
    console.log('received message in sign up',JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    sign_up.handle_signup(data.data, function(err,res){
        console.log('after handle sign up',res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log("Sending response from consumer_signup",data);
    });
        return;
    });
});
