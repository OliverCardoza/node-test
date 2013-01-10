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

// CPU intense, internal threadpool of 4
app.get('/password', function(req,res){
    tasks.password(sendOff(res));
});

// CPU intense, compute cluster
app.get('/password2', function(req,res){
    tasks.password2(sendOff(res));
});

// CPU intense, new process
app.get('/image', function(req,res){
    tasks.image(sendOff(res));
});

// CPU intense, compute cluster
app.get('/image2', function(req,res){
    tasks.image2(sendOff(res));
});

// Network I/O Bound

// File I/O Bound

// No-op
app.get('/no-op', function(req,res){
    res.send(200);
});

// CPU intense, in main event loop
app.get('/forLoop', function(req,res){
    var rounds = parseInt(req.param('rounds'), 10);
    tasks.forLoop(rounds, sendOff(res));
});
// Module exports
module.exports = app;
module.exports.server = server;
app.listen(6456, "localhost", undefined);
// module.exports.startServer = function(cb) {
//     server = app.listen(6456, "localhost", undefined, cb);
//     return server;
// };
// module.exports.stopServer = function(cb) {
//     return server.close(cb);
// };


