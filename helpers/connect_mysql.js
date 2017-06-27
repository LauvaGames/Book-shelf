"use strict";

//// INCLUDE
var mysql = require('mysql');

//// Connection MYSQL DB
var connection_mysql = undefined;

function connectBD(){
    connection_mysql = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "Кw54aEjXTZd2",
        database: "bookstore"
    });
}
connectBD();

//error
connection_mysql.on('error', function(err) {
    console.log('MYSQL BD err ' + new Date());
    setTimeout(function(){
        connectBD();
    }, 30000);

});

module.exports = connection_mysql;