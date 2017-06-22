var mysql = require('mysql');
var connectMysql = require('../helpers/connect_mysql.js');



function addGenreMysql(genre){
    connectMysql.query("INSERT INTO `genre` (`Genre`) VALUES('"+genre+"')" , function(err, rows){
        if(err){
            console.log("err mysql in function addGenreMysql" + err);
        }
    });
}
module.exports.addGenreMysql = addGenreMysql;

function addAuthorMysql(author){
    connectMysql.query("INSERT INTO `author` (`Name`) VALUES('"+author+"')" , function(err, rows){
        if(err){
            console.log("err mysql in function addAuthorMysql" + err);
        }
    });
}
module.exports.addAuthorMysql = addAuthorMysql;

function addPublishingMysql(Publishing){
    connectMysql.query("INSERT INTO `Publishing` (`Publishing`) VALUES('"+Publishing+"')" , function(err, rows){
        if(err){
            console.log("err mysql in function addPublishingMysql" + err);
        }
    });
}
module.exports.addPublishingMysql = addPublishingMysql;

function addLanguageMysql(Language){
    connectMysql.query("INSERT INTO `Languages` (`Language`) VALUES('"+Language+"')" , function(err, rows){
        if(err){
            console.log("err mysql in function addLanguageMysql" + err);
        }
    });
}
module.exports.addLanguageMysql = addLanguageMysql;

function getBooksMysql(callback){
    connectMysql.query("SELECT `ID`, `Name`, `Genre`, `Author`, `Publishing`, `Language`, `Image`, `File`, `Year`, `Description` FROM `books`", function(err, rows){
        if(err){
            console.log("err mysql in function getBooksMysql" + err);
        }
        callback(null, rows);
    });
}
module.exports.getBooksMysql = getBooksMysql;

function getGenreMysql(callback){
    connectMysql.query("SELECT `ID`, `Genre` FROM `genre`", function(err, rows){
        if(err){
            console.log("err mysql in function getGenreMysql" + err);
            callback(err);
        }else{
            callback(null, rows);
        }

    });
}
module.exports.getGenreMysql = getGenreMysql;

function getAuthorMysql(callback){
    connectMysql.query("SELECT `id`, `Name` FROM `author`", function(err, rows){
        if(err){
            console.log("err mysql in function getAuthorMysql" + err);
            callback(err);
        }else{
            callback(null, rows);
        }
    });
}
module.exports.getAuthorMysql = getAuthorMysql;

function getPublishingMysql(callback){
    connectMysql.query("SELECT `ID`, `Publishing` FROM `Publishing`", function(err, rows){
        if(err){
            console.log("err mysql in function getPublishingMysql" + err);
            callback(err);
        }else{
            callback(null, rows);
        }

    });
}
module.exports.getPublishingMysql = getPublishingMysql;

function getLanguageMysql(callback){
    connectMysql.query("SELECT `ID`, `Language` FROM `Languages`", function(err, rows){
        if(err){
            console.log("err mysql in function getLanguageMysql" + err);
            callback(err);
        }else{
            callback(null, rows);
        }

    });
}
module.exports.getLanguageMysql = getLanguageMysql;


function delAuthorMysql(id){
    connectMysql.query("DELETE FROM `author` WHERE id = '"+id+"' ", function(err, rows){
        if(err){
            console.log("err mysql in function delAuthorMysql" + err);
        }
    });
}
module.exports.delAuthorMysql = delAuthorMysql;

function delGenreMysql(id) {
    connectMysql.query("DELETE FROM `genre` WHERE id = '"+id+"' ", function (err) {
        if (err) {
            console.log('error mysql in function delGenreMysql' + err);
        }
    });
}
module.exports.delGenreMysql = delGenreMysql;

function delPublishingMysql(id) {
    connectMysql.query("DELETE FROM `Publishing` WHERE id = '"+id+"' ", function (err) {
        if (err) {
            console.log('error mysql in function delPublishingMysql' + err);
        }
    });
}
module.exports.delPublishingMysql = delPublishingMysql;

function delLanguageMysql(id) {
    connectMysql.query("DELETE FROM `Languages` WHERE id = '"+id+"' ", function (err) {
        if (err) {
            console.log('error mysql in function delLanguageMysql' + err);
        }
    });
}
module.exports.delLanguageMysql = delLanguageMysql;

function upGenreMysql(genre, id) {
    connectMysql.query("UPDATE `genre` SET `Genre` = '"+genre+"' WHERE id = '"+id+"' ", function (err) {
        if (err) {
            console.log('error mysql in function upGenreMysql' + err);
        }
    });
}
module.exports.upGenreMysql = upGenreMysql;


function upAuthorMysql(author, id) {
    connectMysql.query("UPDATE `author` SET `Name` = '"+author+"' WHERE id = '"+id+"' ", function (err) {
        if (err) {
            console.log('error mysql in function upAuthorMysql' + err);
        }
    });
}
module.exports.upAuthorMysql = upAuthorMysql;

function upPublishingMysql(Publishing, id) {
    connectMysql.query("UPDATE `Publishing` SET `Publishing` = '"+Publishing+"' WHERE id = '"+id+"' ", function (err) {
        if (err) {
            console.log('error mysql in function upPublishingMysql' + err);
        }
    });
}
module.exports.upPublishingMysql = upPublishingMysql;

function upLanguageMysql(Language, id) {
    connectMysql.query("UPDATE `Languages` SET `Language` = '"+Language+"' WHERE id = '"+id+"' ", function (err) {
        if (err) {
            console.log('error mysql in function upLanguageMysql' + err);
        }
    });
}
module.exports.upLanguageMysql = upLanguageMysql;

function addBooksMysql(name, description, genre, author, publ, lang, fileLocation, imgLocation, year) {
    connectMysql.query("INSERT INTO `books` (`Name`, `Author`, `Genre`, `Language`, `Publishing`, `Description`, `File`, `Image`, `Year`) VALUES('"+name+"', '"+author+"', '"+genre+"', '"+lang+"', '"+publ+"', '"+description+"', '"+fileLocation+"', '"+imgLocation+"', '"+year+"')", function (err) {
        if (err) {
            console.log('error mysql in function addBooksMysql' + err);
        }
    });
}
module.exports.addBooksMysql = addBooksMysql;

function checkGenreMysql (callback, genre){
    connectMysql.query("SELECT COUNT (`Genre`) as count  FROM `genre` WHERE Genre = '"+genre+"'", function (err,rows) {
        if (err) {
            console.log('error mysql in function checkGenreMysql' + err);
        }
        callback(null, rows);
    });
}
module.exports.checkGenreMysql = checkGenreMysql;

function checkAuthorMysql (callback, author){
    connectMysql.query("SELECT COUNT (`Name`) as count  FROM `author` WHERE Name = '"+author+"'", function (err,rows) {
        if (err) {
            console.log('error mysql in function checkAuthorMysql' + err);
        }
        callback(null, rows);
    });
}
module.exports.checkAuthorMysql = checkAuthorMysql;

function checkPublMysql (callback, publ){
    connectMysql.query("SELECT COUNT (`Publishing`) as count  FROM `Publishing` WHERE Publishing = '"+publ+"'", function (err,rows) {
        if (err) {
            console.log('error mysql in function checkPublMysql' + err);
        }
        callback(null, rows);
    });
}
module.exports.checkPublMysql = checkPublMysql;

function checkLangMysql (callback, lang){
    connectMysql.query("SELECT COUNT (`Language`) as count  FROM `Languages` WHERE Language = '"+lang+"'", function (err,rows) {
        if (err) {
            console.log('error mysql in function checkPublMysql' + err);
        }
        callback(null, rows);
    });
}
module.exports.checkLangMysql = checkLangMysql;

function checkNameMysql (callback, name){
    connectMysql.query("SELECT COUNT (`Name`) as count  FROM `books` WHERE Name = '"+name+"'", function (err,rows) {
        if (err) {
            console.log('error mysql in function checkPublMysql' + err);
        }
        callback(null, rows);
    });
}
module.exports.checkNameMysql = checkNameMysql;

/**** Edit books func */

function updateBooksMysql(ID, Name, Description, Genre, Author, Publishing, Language, Image, Year, File) {
    connectMysql.query("UPDATE `books` SET `Name` = '"+Name+"', `Genre` = '"+Genre+"', `Author` = '"+Author+"', `Language` = '"+Language+"', `Publishing` = '"+Publishing+"', `Description` = '"+Description+"', `Image` = '"+Image+"', `Year` = '"+Year+"', `File` = '"+File+"'  WHERE id = '"+ID+"'", function (err) {
        if (err) {
            console.log('error mysql in function updateBooksMysql' + err);
        }
    });
}
module.exports.updateBooksMysql = updateBooksMysql;

function deleteBooksMysql(ID) {
    connectMysql.query("DELETE FROM `books` WHERE `ID` = '"+ID+"'", function (err) {
        if (err) {
            console.log('error mysql in function deleteBooksMysql' + err);
        }
    });
}
module.exports.deleteBooksMysql = deleteBooksMysql;

function getBookToForm (callback, id){
    connectMysql.query("SELECT `ID`, `Name`, `Genre`, `Author`, `Publishing`, `Language`, `Image`, `File`, `Year`, `Description`, `Views` FROM `books` WHERE `ID` = '"+id+"'", function (err,rows) {
        if (err) {
            console.log('error mysql in function getBookToForm' + err);
        }
        callback(null, rows);
    });
}
module.exports.getBookToForm = getBookToForm;

function getPopular (callback){
    connectMysql.query("SELECT `ID`, `Name`, `Genre`, `Author`, `Publishing`, `Language`, `Image`, `File`, `Year`, `Description`, `Views` FROM `books` ORDER BY Views DESC LIMIT 5 OFFSET 0", function (err,rows) {
        if (err) {
            console.log('error mysql in function getPopular' + err);
        }
        callback(null, rows);
    });
}
module.exports.getPopular = getPopular;

function searchBooksMysql (callback, query) {
    console.log(query);
    connectMysql.query(query, function (err, rows) {
        if (err) {
            console.log('error mysql in function addBooksMysql' + err);
        }
        callback(null, rows);
    });
}
module.exports.searchBooksMysql = searchBooksMysql;

function checkImageAndBooks (callback) {
    connectMysql.query("SELECT `Image`, `File` FROM `books`", function (err, rows) {
        if (err) {
            console.log('error mysql in function addBooksMysql' + err);
        }
        callback(null, rows);
    });
}
module.exports.checkImageAndBooks = checkImageAndBooks;