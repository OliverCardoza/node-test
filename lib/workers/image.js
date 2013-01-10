var im = require('imagemagick');

process.on('message', function(args){
    im.convert(args, function(err, stdout){
        console.log(err);
        process.send(err || args[7]);
    });
});