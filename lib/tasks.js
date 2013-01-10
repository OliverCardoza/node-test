var bcrypt = require('bcrypt'),
    Computecluster = require('compute-cluster'),
    fs = require('fs');

var pw_cc = new Computecluster({
        module: './lib/workers/password.js',
        max_backlog: -1
    });
var pw = "this could be a password";
var rounds = 10;

function passwordEventLoop(next){
    var salt = bcrypt.genSaltSync(rounds);
    var hash = bcrypt.hashSync(pw, salt);

    next(null, hash);
}

function passwordInternalThread(next){
    bcrypt.genSalt(rounds, function(err, salt){
        if(err) {
            next(err);
        } else {
            bcrypt.hash(pw, salt, next);
        }
    });
}

function passwordComputeCluster(next){
    pw_cc.enqueue({
        rounds: rounds,
        password: pw
    }, next);
}

module.exports = {
    passwordEventLoop:          passwordEventLoop,
    passwordInternalThread:     passwordInternalThread,
    passwordComputeCluster:     passwordComputeCluster
};