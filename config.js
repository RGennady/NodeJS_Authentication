var mysql      = require('mysql');
var connection = mysql.createPool({
    host     : '192.168.0.1',
    user     : 'user',
    password : 'password',
    database : 'bd_name',
    multipleStatements: true
});
 
module.exports = connection;
