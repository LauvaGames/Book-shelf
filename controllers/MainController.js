"use strict";
const fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var crypto = require('crypto');
var mysql = require('mysql');
var connectMysql = require('../helpers/connect_mysql.js');
var admin = require('../models/admin_model.js');
var async = require('async');
var urlp = require('url');
var qs = require('query-string');
var geoip = require('geoip-lite');
var moment = require('moment');


/*** Main controllers***/
function getMainPage (req, res) {
    var ip = req.connection.remoteAddress.substring(7);


    var now = moment().format('YYYY-MM-DD');
    var dateNow = now + ' 00:00:00';



    var geo = geoip.lookup(ip);
    var country = geo.country;


    var count = 1;
    //res.clearCookie('bookstore');
    connectMysql.query("SELECT `Count` FROM `users` WHERE `Country` = '"+country+"' AND `Date` = '"+dateNow+"'", function (err, rows) {
        if (err) {
            console.log(err);
        }
        if (rows.length > 0) {
            count = rows[0].Count + 1;
            if (req.cookies.bookstore !== "yes") {
                //console.log("UPDATE `users` SET `Count` = "+count+" WHERE `Country` = '"+country+"' AND `Date` = '"+dateNow+"' ");
                connectMysql.query("UPDATE `users` SET `Count` = '"+count+"' WHERE `Country` = '"+country+"' AND `Date` = '"+dateNow+"' ", function(err){
                    if(err){
                        console.log("err mysql in function getBooksMysql" + err);
                    }
                });
                res.cookie('bookstore', 'yes', { expires: new Date(Date.now() + 1000*60*60*24)});
            }
            else {
                //console.log('this user isn`t uniq');
            }
        }
        else {
            if (req.cookies.bookstore !== "yes") {
                count = 1;
                connectMysql.query("INSERT INTO `users` (`Country`, `Date`, Count) VALUES('"+country+"', '"+dateNow+"', '"+count+"')", function(err){
                    if(err){
                        console.log("err mysql in function getBooksMysql" + err);
                    }
                });
                res.cookie('bookstore', 'yes', { expires: new Date(Date.now() + 1000*60*60*24)});
            }
            else {
                //console.log('this user isn`t uniq');
            }
        }
    });

    async.parallel([
        function(callback){
            admin.getGenreMysql(callback)
        },
        function(callback){
            admin.getAuthorMysql(callback)
        },
        function(callback) {
            admin.getPublishingMysql(callback)
        },
        function(callback){
            admin.getLanguageMysql(callback)
        },
        function(callback) {
            admin.getBooksMysql(callback)
        }
    ], function(err, results) {
        if (results[0] == undefined) {
            results[0] = [{"ID": 1}, {"Genre": 'Нет соединения с базой данных'}];
            res.render('../views/main.jade', {"genre":results[0], "author":results[1], "publ":results[2], "lang":results[3], 'books':results[4]});
        }
        else if (typeof results[1] == undefined){
            results[1] = [{"ID":1},{"Name":'Нет соединения с базой данных'}];
            res.render('../views/main.jade', {"genre":results[0], "author":results[1], "publ":results[2], "lang":results[3], 'books':results[4]});
        }
        else if (typeof results[2] == undefined) {
            results[2] = [{"ID":1},{"Publishing":'Нет соединения с базой данных'}];
            res.render('../views/main.jade', {"genre":results[0], "author":results[1], "publ":results[2], "lang":results[3], 'books':results[4]});
        }
        else if (typeof results[3] == undefined) {
            results[3] = [{"ID":1},{"Language":'Нет соединения с базой данных'}];
            res.render('../views/main.jade', {"genre":results[0], "author":results[1], "publ":results[2], "lang":results[3], 'books':results[4]});
        }
        else if (typeof results[4] == undefined) {
            results[4] = [{"ID":1},{"Name":'Нет соединения с базой данных'},{"Author":'Нет соединения с базой данных'}, {"Image":'static/images/nofoto.gif'}];
            res.render('../views/main.jade', {"genre":results[0], "author":results[1], "publ":results[2], "lang":results[3], 'books':results[4]});
        }
        else {
            res.render('../views/main.jade', {"genre":results[0], "author":results[1], "publ":results[2], "lang":results[3], 'books':results[4]});
        }
    });
}
module.exports.getMainPage = getMainPage;

function getContent (app, req, res) {
    async.parallel([
        function(callback) {
            admin.getBooksMysql(callback)
        },
        function(callback) {
            admin.getPopular(callback)
        }
    ], function(err, results) {
        res.render('../views/content.jade', {"books":results[0], "popular":results[1]});
    });
}
module.exports.getContent = getContent;




function getFormForBooks (req, res) {
    var query = urlp.parse(req.url).query,
        params = qs.parse(query);
    var id = params.id;
    connectMysql.query("SELECT `Views` FROM `books` WHERE id = '"+id+"' ", function(err, rows){
        if(err){
            console.log("err mysql in function getBooksMysql" + err);
        }
        var views = rows[0].Views + 1;
        connectMysql.query("UPDATE `books` SET `Views` = '"+views+"' WHERE id = '"+id+"' ", function(err){
            if(err){
                console.log("err mysql in function getBooksMysql" + err);
            }
        });
    });


    async.parallel([
        function(callback) {
            admin.getBookToForm(callback, id)
        }
    ], function(err, results) {
        if (typeof results[0] == undefined) {
            results[0] = [{"ID": 1}, {"Author": 'Нет соединения с базой данных'}];
            res.render('../views/formForBooks.jade', {"book":results[0]});
        }
        else {
            res.render('../views/formForBooks.jade', {"book":results[0]});
        }
    });
}
module.exports.getFormForBooks = getFormForBooks;

function searchBooks (req, res) {
    var query = urlp.parse(req.url).query,
        params = qs.parse(query);
    var name = params.name;
    var author = params.author;
    var genre = params.genre;
    var publ = params.publ;
    var year = params.year.split(',');
    var lang = params.lang.split(',');

    var select = 'SELECT `ID`, `Name`, `Genre`, `Author`, `Publishing`, `Language`, `Image`, `File`, `Year`, `Description` FROM `books` ';
    var where = '';
    if (name!=='' && name!==undefined){
        where = 'WHERE `Name` LIKE "%' + name + '%"';
    }
    if (genre!=='' && genre!==undefined) {
        if (where == '') {
            where= "WHERE `Genre` = '" + genre + "'";
        }
        else {
            where = "WHERE `Name` LIKE '%" + name + "%' AND `Genre` = " + "'" + genre + "'";
        }
    }
    if (publ!=='' && publ!==undefined) {
        if (where == '') {
            where= "WHERE `Publishing` = '" + publ + "'";
        }
        else {
            where = where + " AND `Publishing` = '" + publ + "'";
        }
    }
    if (author!=='' && author!==undefined) {
        if (where == '') {
            where= "WHERE `Author` = '" + author + "'";
        }
        else {
            where = where + " AND `Author` = '" + author + "'";
        }
    }
    if (lang[0]!=='' && lang[0]!==undefined) {
        if (where == '') {
            where= "WHERE `Language` = '" + lang[0] + "'";
        }
        else {
            where = where + " AND `Language` = '" + lang[0] + "'";
        }
    }
    if (lang[1]!=='' && lang[1]!==undefined) {
        if (where == '') {
            where= "WHERE `Language` = '" + lang[1] + "'";
        }
        if (where !=='' && lang[0] == '') {
            where= where + " AND `Language` = '" + lang[1] + "'";
        }
        if (where !== '' && lang[0] !== '') {
            where= where + " OR `Language` = '" + lang[1] + "'";
        }
    }
    if (lang[2]!=='' && lang[2]!==undefined) {
        if (where == '') {
            where= "WHERE `Language` = '" + lang[2] + "'";
        }
        if (where !=='' && lang[0] == '' && lang[1] == '') {
            where= where + " AND `Language` = '" + lang[2] + "'";
        }
        if (where !== '' && lang[0] !== '' ||  lang[1] !== '') {
            where= where + " OR `Language` = '" + lang[2] + "'";
        }
    }
    if (lang[3]!=='' && lang[3]!==undefined) {
        if (where == '') {
            where= "WHERE `Language` = '" + lang[3] + "'";
        }
        if (where !=='' && lang[0] == '' && lang[1] == '' && lang[2] == '') {
            where= where + " AND `Language` = '" + lang[3] + "'";
        }
        if (where !== '' && lang[0] !== '' ||  lang[1] !== '' || lang[2] !== '') {
            where= where + " OR `Language` = '" + lang[3] + "'";
        }
    }
    if (year[0]!=='' && year[0]!==undefined) {
        if (where == '') {
            where= "WHERE `Year` " + year[0];
        }
        else {
            where = where + " AND `Year` " + year[0];
        }
    }
    if (year[1]!=='' && year[1]!==undefined) {
        if (where == '') {
            where= "WHERE `Year` " + year[1];
        }
        if (where !=='' && year[0] == '') {
            where= where + " AND `Year` " + year[1];
        }
        if (where !== '' && year[0] !== '') {
            where= where + " OR `Year` " + year[1];
        }
    }
    if (year[2]!=='' && year[2]!==undefined) {
        if (where == '') {
            where= "WHERE `Year` " + year[2] ;
        }
        if (where !=='' && year[0] == '' && year[1] == '') {
            where= where + " AND `Year` " + year[2];
        }
        if (where !== '' && year[0] !== '' || year[1] !== '') {
            where= where + " OR `Year` " + year[2];
        }
    }
    if (year[3]!=='' && year[3]!==undefined) {
        if (where == '') {
            where= "WHERE `Year` " + year[3];
        }
        if (where !=='' && year[0] == '' && year[1] == '' && year[2] == '') {
            where= where + " AND `Year` " + year[3];
        }
        if (where !== '' && year[0] !== '' || year[1] !== '' || year[2] !== '') {
            where= where + " OR `Year` " + year[3];
        }
    }
    if (year[4]!=='' && year[4]!==undefined) {
        if (where == '') {
            where= "WHERE `Year` " + year[4] ;
        }
        if (where !=='' && year[0] == '' && year[1] == '' && year[2] == '' && year[3] == '') {
            where= where + " AND `Year` " + year[4];
        }
        if (where !== '' && year[0] !== '' || year[1] !== '' || year[2] !== '' || year[3] !== '') {
            where= where + " OR `Year` " + year[4];
        }
    }
    if (year[5]!=='' && year[5]!==undefined) {
        if (where == '') {
            where= "WHERE `Year` " + year[5];
        }
        if (where !=='' && year[0] == '' && year[1] == '' && year[2] == '' && year[3] == '' && year[4] == '') {
            where= where + " AND `Year` " + year[5];
        }
        if (where !== '' && year[0] !== '' || year[1] !== '' || year[2] !== '' || year[3] !== '' || year[4] !== '') {
            where= where + " OR `Year` " + year[5];
        }
    }
    if (year[6]!=='' && year[6]!==undefined) {
        if (where == '') {
            where= "WHERE `Year` " + year[6];
        }
        if (where !=='' && year[0] == '' && year[1] == '' && year[2] == '' && year[3] == '' && year[4] == '' && year[5] == '') {
            where= where + " AND `Year` " + year[6];
        }
        if (where !== '' && year[0] !== '' || year[1] !== '' || year[2] !== '' || year[3] !== '' || year[4] !== '' || year[5] !== '') {
            where= where + " OR `Year` " + year[6];
        }
    }
    var query = select + where;


    async.parallel([
        function(callback) {
            admin.searchBooksMysql(callback, query);
        }
    ], function(err, results) {
        //console.log('results: '+JSON.stringify(results[0]));
        res.render('../views/newContent.jade', {"books":results[0]});
    });
}
module.exports.searchBooks = searchBooks;