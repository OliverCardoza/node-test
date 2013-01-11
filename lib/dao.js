var pg = require('pg');//.native;

var conString = "tcp://nodetest@localhost/nodetest";

function smartQuery(queryConfig, next){
    pg.connect(conString, function(err, client) {
        if (err) {
            next(err);
        } else {
            client.query(queryConfig, next);
        }
    });
}

function dumbQuery(queryConfig, next){
    var client = new pg.Client(conString);
    client.connect();

    client.on('error', function(err){
        console.log(err);
        next(err);
    });

    client.on('drain', client.end.bind(client));

    var query = client.query(queryConfig);
    var result = {rows: []};

    query.on('row', function(row){
        result.rows.push(row);
    });

    query.on('end', function(){
        next(null, result);
    });
}

module.exports = {
    smartQuery: smartQuery,
    dumbQuery:  dumbQuery
};