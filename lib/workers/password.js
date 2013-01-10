var bcrypt = require('bcrypt');

process.on('message', function(obj){
    var salt = bcrypt.genSaltSync(obj.rounds),
        hash = bcrypt.hashSync(obj.password, salt);
    process.send(hash);
});