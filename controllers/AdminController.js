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
var countries = require('country-data').countries;
var moment = require('moment');
var json2csv = require('json2csv');



/*** Admin controllers***/
function getAdminPage(req, res){ 
    async.parallel([
        function(callback){
            admin.getGenreMysql(callback)
        },
        function(callback){
            admin.getAuthorMysql(callback)
        },
        function(callback){
            admin.getPublishingMysql(callback)
        },
        function(callback){
            admin.getLanguageMysql(callback)
        }
    ], function(err, results) {
        if (typeof results[0] == undefined) {
            results[0] = [{"ID": 1}, {"Genre": 'Нет соединения с базой данных'}];
            res.render('../views/admin.jade', {"genre":results[0], "author":results[1], "publ":results[2], "lang":results[3]});
        }
        else if (typeof results[1] == undefined){
            results[1] = [{"ID":1},{"Name":'Нет соединения с базой данных'}];
            res.render('../views/admin.jade', {"genre":results[0], "author":results[1], "publ":results[2], "lang":results[3]});
        }
        else if (typeof results[2] == undefined) {
            results[2] = [{"ID":1},{"Publishing":'Нет соединения с базой данных'}];
            res.render('../views/admin.jade', {"genre":results[0], "author":results[1], "publ":results[2], "lang":results[3]});
        }
        else if (typeof results[3] == undefined) {
            results[3] = [{"ID":1},{"Language":'Нет соединения с базой данных'}];
            res.render('../views/admin.jade', {"genre":results[0], "author":results[1], "publ":results[2], "lang":results[3]});
        }
        else {
            res.render('../views/admin.jade', {"genre":results[0], "author":results[1], "publ":results[2], "lang":results[3]});
        }
    });
}
module.exports.getAdminPage = getAdminPage;

function getJanrePage(req,res){
    async.parallel([
        function(callback){
            admin.getGenreMysql(callback)
        },
        function(callback){
            admin.getAuthorMysql(callback)
        },
        function(callback){
            admin.getPublishingMysql(callback)
        },
        function(callback){
            admin.getLanguageMysql(callback)
        }
    ], function(err, results) {
        if(err){
            //do something on error
            res.render('../views/error.jade', {"error":err});
        }

        if(results == undefined){
            var unVariable = 'results array is undefined';
            res.render('../views/error.jade', {"error":unVariable});
        }else{
            unVariable = '';
            for(var i = 0; i < 4; i++){
                if(results[i] == undefined){
                    unVariable += i+' is indefined + ||   '
                }
            }
            if(unVariable != ''){
                res.render('../views/error.jade', {"error":unVariable});
            }else{
                res.render('../views/janre.jade', {"r":results[0], "authors":results[1], "publ":results[2], "lang":results[3]});
            }
        }
    });
}
module.exports.getJanrePage = getJanrePage;

function getEditPage(req, res) {
    res.render('../views/edit.jade');
}
module.exports.getEditPage = getEditPage;

function editSearch(req, res) {
    var query = urlp.parse(req.url).query,
        params = qs.parse(query);
    var name = params.name;
    connectMysql.query("SELECT * FROM `books` WHERE `Name` Like '%" + name + "%'", function(err, rows){
        if(err){
            console.log("err mysql in function getBooksMysql" + err);
        }
        var url_ = urlp.parse(req.url, true).query;
        res.setHeader('Content-Type', 'application/json');
        res.end(url_['callback']+"(" + JSON.stringify(rows)+")");
    });
}
module.exports.editSearch = editSearch;

function getActivePage(req, res) {
    //console.log( countries.all )
    var alpha = [];
    for (var i=0; i<countries.all.length; i++) {
        //console.log( countries.all[i].alpha2 );
        alpha.push(countries.all[i].alpha2 );
    }
    //console.log(alpha);

    res.render('../views/ActivitySchedule.jade', {'countries':alpha});
}
module.exports.getActivePage = getActivePage;

function getUsers(req, res) {
    var query = urlp.parse(req.url).query,
        params = qs.parse(query);
    var country = params.country;
    var date = params.date;

    //dateSearch
    var now = moment().format('YYYY-MM-DD');
    //console.log(now);


    var dateNow = now + ' 00:00:00';

    var dateSearch = '';
    var select = 'SELECT SUM(`Count`) as Count, DATE_FORMAT(Date , \"%d/%m/%Y\") as Date FROM `users` ';
    var where = '';
    if(date == 1) {
        dateSearch = dateNow;
        if(country !== 'All') {
            where = "WHERE `Country` = '" + country + "'";
        }
        if (where == '') {
            where= "WHERE `Date` >= '" + dateSearch + "' GROUP BY Date";
        }
        else {
            where = where + "AND `Date`  = '" + dateSearch + "' GROUP BY Date";
        }
    }
    else {
        if(date == 2) {
            var weekAgo = moment().subtract(7, 'days').format('YYYY-MM-DD');
            dateSearch = weekAgo + ' 00:00:00';
        }
        if(date == 3) {
            var monthAgo = moment().subtract(1, 'month').format('YYYY-MM-DD');
            dateSearch = monthAgo + ' 00:00:00';
        }
        if(date == 4) {
            var yearAgo = moment().subtract(1, 'year').format('YYYY-MM-DD');
            dateSearch = yearAgo + ' 00:00:00';
        }
        
        if(country !== 'All') {
            where = "WHERE `Country` = '" + country + "'";
        }
        if (where == '') {
            where= "WHERE `Date` >= '" + dateSearch + "' AND `Date` <= '" + dateNow + "' GROUP BY Date ORDER BY Date";
        }
        else {
            where = where + " AND `Date` >= '" + dateSearch + "' AND `Date` <= '" + dateNow + "' GROUP BY Date ORDER BY Date";
        }
    }
    var querystr = select + where;
    //console.log(querystr);

    /*** connect mysql***/

    connectMysql.query(querystr, function (err, rows) {
        if (err) {
            console.log('error mysql in function addBooksMysql' + err);
        }
        //console.log(rows);
        res.end(JSON.stringify(rows));
    });
}
module.exports.getUsers = getUsers;

function getCsv(req, res) {
    connectMysql.query("SELECT `Count`, `Country`, `Date` FROM `users`", function(err, rows){
        if(err){
            console.log("err mysql in function getBooksMysql" + err);
        }
        /***** creat .csv file *****/

        var fields = ['users', 'date', 'country'];
        var myCars = [];
        for(var i=0; i<rows.length; i++) {
            myCars[i] =
                {
                    "users": rows[i].Count,
                    "date": rows[i].Date,
                    "country": rows[i].Country
                };
        }
        var csv = json2csv({ data: myCars, fields: fields });

        fs.writeFile('uploads/users.csv', csv, function(err) {
            if (err) throw err;
        });
        res.end('uploads/users.csv');
    });
}
module.exports.getCsv = getCsv;

function getBooks(req, res) {
    connectMysql.query("SELECT * FROM `books`", function(err, rows){
        if(err){
            console.log("err mysql in function getBooksMysql" + err);
        }
        var url_ = urlp.parse(req.url, true).query;
        res.setHeader('Content-Type', 'application/json');
        res.end(url_['callback']+"(" + JSON.stringify(rows)+")");
    });
}
module.exports.getBooks = getBooks;

function deleteBooks(req, res){
    //console.log('start delete book');
    admin.deleteBooksMysql(req.body.ID);
    res.end('');
}
module.exports.deleteBooks = deleteBooks;

function addGenre(req, res){
    admin.addGenreMysql(req.body.genre);
    res.end('');
}
module.exports.addGenre = addGenre;

function addAuthor(req, res){
    admin.addAuthorMysql(req.body.author);
    res.end("");
}
module.exports.addAuthor = addAuthor;

function addPublishing(req, res){
    admin.addPublishingMysql(req.body.Publishing);
    res.end("");
}
module.exports.addPublishing = addPublishing;

function addLanguage(req, res){
    admin.addLanguageMysql(req.body.Language);
    res.end("");
}
module.exports.addLanguage = addLanguage;

function delAuthor(req, res) {
    admin.delAuthorMysql(req.body.id);
    res.end('');
}
module.exports.delAuthor = delAuthor;

function delGenre(req, res) {
    admin.delGenreMysql(req.body.ID);
    res.end('');
}
module.exports.delGenre = delGenre;

function delPublishing(req, res) {
    admin.delPublishingMysql(req.body.ID);
    res.end('');
}
module.exports.delPublishing = delPublishing;

function delLanguage(req, res) {
    admin.delLanguageMysql(req.body.ID);
    res.end('');
}
module.exports.delLanguage = delLanguage;

function upGenre(req,res) {
    admin.upGenreMysql(req.body.genre, req.body.ID);
    res.end('test');
}
module.exports.upGenre = upGenre;

function upAuthor(req,res) {
    admin.upAuthorMysql(req.body.author, req.body.ID);
    res.end('');
}
module.exports.upAuthor = upAuthor;

function upPublishing(req,res) {
    admin.upPublishingMysql(req.body.Publishing, req.body.ID);
    res.end('');
}
module.exports.upPublishing = upPublishing;

function upLanguage(req,res) {
    admin.upLanguageMysql(req.body.Language, req.body.ID);
    res.end('');
}
module.exports.upLanguage = upLanguage;

function addBooks(req,res) {
    admin.addBooksMysql(req.body.name, req.body.description, req.body.genre, req.body.author, req.body.publishing, req.body.language, req.body.file, req.body.img, req.body.year);
    res.end('');
}
module.exports.addBooks = addBooks;

function updateBooks(req,res) {
    admin.updateBooksMysql(req.body.ID, req.body.Name, req.body.Description, req.body.Genre, req.body.Author, req.body.Publishing, req.body.Language, req.body.Img, req.body.Year, req.body.File);
    res.end('');
}
module.exports.updateBooks = updateBooks;

function checkGenre (req, res) {
    async.parallel([
        function(callback){
            admin.checkGenreMysql(callback, req.body.genre)
        }
    ], function(err, results) {
        var count = results[0][0].count;
        if (count == 0) {
            res.end('true');
        }
        else{
            res.end('false');
        }
        //admin.checkGenreMysql(req.body.genre);

    });
}
module.exports.checkGenre = checkGenre;

function checkAuthor (req, res) {
    async.parallel([
        function(callback){
            admin.checkAuthorMysql(callback, req.body.author)
        }
    ], function(err, results) {
        var count = results[0][0].count;
        if (count == 0) {
            res.end('true');
        }
        else{
            res.end('false');
        }
    });
}
module.exports.checkAuthor = checkAuthor;

function checkPubl (req, res) {
    async.parallel([
        function(callback){
            admin.checkPublMysql(callback, req.body.publ)
        }
    ], function(err, results) {
        var count = results[0][0].count;
        if (count == 0) {
            res.end('true');
        }
        else{
            res.end('false');
        }
    });
}
module.exports.checkPubl = checkPubl;

function checkName (req, res) {
    async.parallel([
        function(callback){
            admin.checkNameMysql(callback, req.body.name)
        }
    ], function(err, results) {
        var count = results[0][0].count;
        if (count == 0) {
            res.end('true');
        }
        else{
            res.end('false');
        }
    });
}
module.exports.checkName = checkName;

function checkLang (req, res) {
    async.parallel([
        function(callback){
            admin.checkLangMysql(callback, req.body.lang)
        }
    ], function(err, results) {
        var count = results[0][0].count;
        if (count == 0) {
            res.end('true');
        }
        else{
            res.end('false');
        }
    });
}
module.exports.checkLang = checkLang;

function addPosterImage(req,res){
    var form = new formidable.IncomingForm();
    form.multiples = true;
    var folder = __dirname.replace("/controllers" , "");
    form.uploadDir = path.join(folder, '/uploads/posters');
    var Exten;
    var crypt;
    form.on('file', function(field, file) {

        Exten = "" + path.extname(file.name);
        crypt = crypto.createHash('md5').update('' + Math.random() + Date.now() + file.name).digest('hex');
        fs.rename(file.path, path.join(form.uploadDir, crypt+Exten));
    });
    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });
    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.end('uploads/posters/'+crypt + Exten);
    });
    // parse the incoming request containing the form data
    form.parse(req);
}
module.exports.addPosterImage = addPosterImage;

function changePosterImage(req,res) {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    var folder = __dirname.replace("/controllers" , "");
    form.uploadDir = path.join(folder, '/uploads/posters');
    var Exten;
    var crypt;
    form.on('file', function(field, file) {
        Exten = "" + path.extname(file.name);
        crypt = crypto.createHash('md5').update('' + Math.random() + Date.now() + file.name).digest('hex');
        fs.rename(file.path, path.join(form.uploadDir, crypt+Exten));
    });
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });
    form.on('end', function() {
        res.end('uploads/posters/'+crypt + Exten);
    });
    form.parse(req);
}
module.exports.changePosterImage = changePosterImage;

function changeFile(req,res) {
    var form = new formidable.IncomingForm();
    form.multiples = true;
    var folder = __dirname.replace("/controllers" , "");
    form.uploadDir = path.join(folder, '/uploads/books');
    var Exten;
    var crypt;
    form.on('file', function(field, file) {
        Exten = "" + path.extname(file.name);
        crypt = crypto.createHash('md5').update('' + Math.random() + Date.now() + file.name).digest('hex');
        fs.rename(file.path, path.join(form.uploadDir, crypt+Exten));
    });
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });
    form.on('end', function() {
        res.end('uploads/books/'+crypt + Exten);
    });
    form.parse(req);
}
module.exports.changeFile = changeFile;

function addFile(req,res){
        // create an incoming form object
    var form = new formidable.IncomingForm();
        // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;
        // store all uploads in the /uploads directory
    var folder = __dirname.replace("/controllers" , "");
    form.uploadDir = path.join(folder, '/uploads/books');
    var Exten;
    var crypt;
    form.on('file', function(field, file) {
        Exten = "" + path.extname(file.name);
        crypt = crypto.createHash('md5').update('' + Math.random() + Date.now() + file.name).digest('hex');
        fs.rename(file.path, path.join(form.uploadDir, crypt+Exten));
    });
    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });
    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.end('uploads/books/'+crypt + Exten);
    });
    // parse the incoming request containing the form data
    form.parse(req);
}
module.exports.addFile = addFile;

function checkUploads() {
    async.parallel([
        function(callback){
            admin.checkImageAndBooks(callback)
        }
    ], function(err, results) {
        var images = [];
        for (var i=0; i<results[0].length; i++) {
            images.push(results[0][i].Image.substring(16));
        }

        var files = [];
        for (var y=0; y<results[0].length; y++) {
            files.push(results[0][y].File.substring(14));
        }

        var folder = __dirname.replace("/controllers" , "");
        fs.readdir(folder + '/uploads/posters', function(err, items) {
            Array.prototype.diff = function(a) {
                return this.filter(function(i){return a.indexOf(i) < 0;});
            };
            var mas1 = images,
                mas2 = items;
            var result = mas2.diff(mas1);
            if (result == []) {
                console.log('no files to delete');
            }
            else {
                for (var x = 0; x < result.length; x++) {
                    fs.unlink(folder + '/uploads/posters/' + result[x], function (err) {
                        if (err) throw err;
                    });
                }
            }
        });

        fs.readdir(folder + '/uploads/books', function(err, items2) {
            Array.prototype.diff = function(a) {
                return this.filter(function(i){return a.indexOf(i) < 0;});
            };
            var mas3 = files,
                mas4 = items2;
            var result = mas4.diff(mas3);
            if (result == []) {
                console.log('no files to delete');
            }
            else {
                for (var x = 0; x < result.length; x++) {
                    fs.unlink(folder + '/uploads/books/' + result[x], function (err) {
                        if (err) throw err;
                    });
                }
            }
        });
    });
}
module.exports.checkUploads = checkUploads;