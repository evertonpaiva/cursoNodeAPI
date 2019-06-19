var mysql  = require('mysql');

function createDBConnection(){
    return mysql.createConnection({
        host: 'localhost',
        user: 'payfastuser',
        password: 'm3nlgpWseJ0',
        database: 'payfast',
    });
}

module.exports = function() {
    return createDBConnection;
};
