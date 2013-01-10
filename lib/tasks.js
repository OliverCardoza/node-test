var bcrypt = require('bcrypt'),
    Computecluster = require('compute-cluster'),
    fs = require('fs'),
    im = require('imagemagick');

var pw_cc = new Computecluster({
        module: './lib/workers/password.js',
        max_backlog: -1
    });
var pw = "this could be a password";
var rounds = 10;

var im_cc = new Computecluster({
        module: './lib/workers/image.js',
        max_backlog: -1
    });
var im_args = [
        "/home/oliver/repos/node-concurrency/lib/resources/cropper.png",
        "-resize",
        "1000x1000^",
        "-gravity",
        "center",
        "-extent",
        "1000x1000",
        "/home/oliver/repos/node-concurrency/lib/resources/output/cropper-400x400.png"
    ];


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

function image(next){
    im.convert(im_args, function(err, stdout){
        next(err, im_args[7]);
    });
}

function image2(next){
    im_cc.enqueue(im_args, next);
}

// no-op
function noop(next){
    next(null, "success");
}

// blocking synchronous
function forLoop(rounds, next){
    var start = new Date(),
        end,
        duration = 0,
        i;

    for (i = 0; i < rounds; i+=1){
        duration = start.getTime();
    }

    end = new Date();
    duration = end.getTime()-start.getTime();
    console.log('[forLoop]: duration='+duration);
    next && next();   
}



module.exports = {
    password:   password,
    password2:  password2,
    image:      image,
    image2:     image2,
    noop:       noop,
    forLoop:    forLoop
};