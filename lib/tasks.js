var bcrypt = require('bcrypt'),
    Computecluster = require('compute-cluster'),
    dao = require('./dao.js'),
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

function databaseReadNoPool(next){
    var id = Math.floor((Math.random()*1000)+1);

    dao.dumbQuery({
        text: "SELECT * FROM users WHERE id = $1",
        values: [id]
    }, function(err, result){
        if(err){
            next(err);
        } else {
            next(null, result.rows[0]);
        }
    });
}

function databaseReadWithPool(next){
    var id = Math.floor((Math.random()*1000)+1);

    dao.smartQuery({
        text: "SELECT * FROM users WHERE id = $1",
        values: [id]
    }, function(err, result){
        if(err){
            next(err);
        } else {
            next(null, result.rows[0]);
        }
    });
}

function databaseWrite(next){
    var firstname = "first" + Math.floor((Math.random()*1000)+1);
    var lastname = "last" + Math.floor((Math.random()*1000)+1);
    var age = Math.floor((Math.random()*100)+1);

    dao.smartQuery({
        text: "INSERT INTO users (firstname, lastname, age) VALUES ($1, $2, $3) RETURNING *;",
        values: [firstname, lastname, age]
    }, function(err, result){
        if(err){
            next(err);
        } else {
            next(null, result.rows[0]);
        }
    });
}

module.exports = {
    passwordEventLoop:          passwordEventLoop,
    passwordInternalThread:     passwordInternalThread,
    passwordComputeCluster:     passwordComputeCluster,

    databaseReadNoPool:         databaseReadNoPool,
    databaseReadWithPool:       databaseReadWithPool,

    databaseWrite:              databaseWrite
};