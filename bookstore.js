console.log('it`s working');
var express = require('express');
var cookieParser = require('cookie-parser');
var adminControler = require('./controllers/AdminController.js');
var mainControler = require('./controllers/MainController.js');
var app = express();
var mysql = require('mysql');
var connectMysql = require('./helpers/connect_mysql.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/static', express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/static/slider'));
app.use("/uploads", express.static(__dirname + '/uploads'));




/// client urls
app.get('/', function (req, res) {
    mainControler.getMainPage(req , res);
    //res.sendFile(__dirname +'/views/main.jade', {});
});
app.get('/main', function (req, res) {
    mainControler.getMainPage(req , res);
    //res.render(__dirname +'/views/main.jade', {});
});
app.get('/formForBooks', function (req, res) {
    mainControler.getFormForBooks(req , res);
    //res.render(__dirname +'/views/main.jade', {});
});
app.get('/searchBooks', function (req, res) {
    mainControler.searchBooks(req,res);
});
app.get('/getContent', function (req, res) {
    mainControler.getContent(app ,req , res);
});



//admin urls
app.get('/admin', function (req, res) {
    adminControler.getAdminPage(req , res);
});
app.get('/janre', function (req, res) {
     adminControler.getJanrePage(req, res);
});
app.get('/edit', function (req, res) {
    adminControler.getEditPage(req, res);
});
app.get('/activitySchedule', function (req, res) {
    adminControler.getActivePage(req, res);
});

app.get('/edit/search', function (req, res) {
    adminControler.editSearch(req, res);
});
app.get('/getUsers', function (req, res) {
    adminControler.getUsers(req, res);
});
app.get('/getCsv', function (req, res) {
    adminControler.getCsv(req, res);
});
app.get('/edit/getBooks', function (req, res) {
    adminControler.getBooks(req, res);
});
app.post('/edit/deleteBooks', function (req, res) {
    adminControler.deleteBooks(req, res);
});
app.post('/admin/PosterImage', function (req, res) {
    adminControler.addPosterImage(req,res);
});
app.post('/edit/PosterImage', function (req, res) {
    adminControler.changePosterImage(req,res);
});
app.post('/edit/newFile', function (req, res) {
    adminControler.changeFile(req,res);
});
app.post('/genre/addGenre', function (req, res) {
    console.log(req.body);
    adminControler.addGenre(req, res);
});
app.post('/author/addAuthor', function (req, res) {
    console.log(req.body);
    adminControler.addAuthor(req, res);
});
app.post('/Publishing/addPublishing', function (req, res) {
    console.log(req.body);
    adminControler.addPublishing(req, res);
});
app.post('/Language/addLanguage', function (req, res) {
    console.log(req.body);
    adminControler.addLanguage(req, res);
});
app.post('/author/delAuthor', function(req, res) {
    console.log(JSON.stringify(req.body + ' id author'));
    adminControler.delAuthor(req, res);
});
app.post('/genre/delGenre', function(req, res) {
    console.log(JSON.stringify(req.body));
    adminControler.delGenre(req, res);
});
app.post('/Publishing/delPublishing', function(req, res) {
    console.log(JSON.stringify(req.body));
    adminControler.delPublishing(req, res);
});
app.post('/Language/delLanguage', function(req, res) {
    console.log(JSON.stringify(req.body));
    adminControler.delLanguage(req, res);
});
app.post('/genre/upGenre', function(req, res) {
    console.log('it`s upgrate genre' + (JSON.stringify(req.body)));
    adminControler.upGenre(req, res);
});
app.post('/author/upAuthor', function(req, res) {
    console.log('it`s upgrate author' + (JSON.stringify(req.body)));
    adminControler.upAuthor(req, res);
});
app.post('/Publishing/upPublishing', function(req, res) {
    console.log('it`s upgrate publ' + (JSON.stringify(req.body)));
    adminControler.upPublishing(req, res);
});
app.post('/Language/upLanguage', function(req, res) {
    console.log('it`s upgrate lang' + (JSON.stringify(req.body)));
    adminControler.upLanguage(req, res);
});
app.post('/genre/checkGenre', function(req, res) {
    adminControler.checkGenre(req, res);
});
app.post('/author/checkAuthor', function(req, res) {
    adminControler.checkAuthor(req, res);
});
app.post('/publ/checkPubl', function(req, res) {
    adminControler.checkPubl(req, res);
});
app.post('/name/checkName', function(req, res) {
    adminControler.checkName(req, res);
});
app.post('/lang/checkLang', function(req, res) {
    adminControler.checkLang(req, res);
});
app.post('/books/addBooks', function(req, res) {
    adminControler.addBooks(req, res);
});
app.post('/edit/updateBooks', function(req, res) {
    adminControler.updateBooks(req, res);
});
app.post('/admin/addFile', function (req, res) {
    adminControler.addFile(req,res);
});









/// test
var timerId = setInterval(function() {
    console.log( "start delete" );
    adminControler.checkUploads();
}, 1000*60*60*24);

/*
function test() {
    console.log( "start delete" );
    adminControler.checkUploads();
}
test();*/

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});