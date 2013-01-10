var bcrypt = require('bcrypt'),
    Computecluster = require('compute-cluster'),
    fs = require('fs');

var pw_cc = new Computecluster({
        module: './lib/workers/password.js',
        max_backlog: -1
    });
var pw = "this could be a password";
var rounds = 10;

function password(next){
    bcrypt.genSalt(rounds, function(err, salt){
        if(err) {
            next(err);
        } else {
            bcrypt.hash(pw, salt, next);
        }
    });
}

function password2(next){
    pw_cc.enqueue({
        rounds: rounds,
        password: pw
    }, next);
}

module.exports = {
    password:   password,
    password2:  password2
};