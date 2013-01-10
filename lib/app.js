/**
 * Module dependencies.
 */
var express = require('express'),
    tasks = require('./tasks'),

    app = express(),
    server;

app.configure(function(){
    // View + view engine
    app.set('views', '../views');
    app.set('view engine', 'jade');
    // Basics
    app.use(express.bodyParser());
    app.use(require('express-validator'));
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'qbjD3VWCaiAy9tlryz3bAWCPReNvP7ZE'
    }));
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

function sendOff(res){
    return function(err, data){
        if(err){
            console.log(err);
            res.send(500);
        } else {
            res.json(data);
        }
    };
}

// Uses bcrypt to generate a salt (10 rounds) and password hash
app.get('/passwordEventLoop', function(req,res){
    tasks.passwordEventLoop(sendOff(res));
});
app.get('/passwordInternalThread', function(req,res){
    tasks.passwordInternalThread(sendOff(res));
});
app.get('/passwordComputeCluster', function(req,res){
    tasks.passwordComputeCluster(sendOff(res));
});

// Database I/O
app.get('/databaseReadNoPool', function(req,res){
    tasks.databaseReadNoPool(sendOff(res));
});
app.get('/databaseReadWithPool', function(req,res){
    tasks.databaseReadWithPool(sendOff(res));
});


app.get('/databaseWrite', function(req,res){
    tasks.databaseWrite(sendOff(res));
})
// File I/O Bound

// No-op
app.get('/no-op', function(req,res){
    res.send(200);
});

// Module exports
module.exports = app;
module.exports.server = server;
app.listen(6456, "localhost", undefined);