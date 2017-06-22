/**
 * Created by R0mme11 on 15.01.2017.
 */
console.log('admin');

//Add Poster
$("#uploadimg").on("change" , function(){
    var formData = new FormData();
    console.log($('#uploadimg')[0].files[0]);
    formData.append('file', $('#uploadimg')[0].files[0]);
    var data = {};
    $.ajax({
        url : 'admin/PosterImage',
        type : 'POST',
        data : formData,//{}
        processData: false,  // tell jQuery not to process the data
        contentType: false,  // tell jQuery not to set contentType
        success : function(data) {
            console.log(data);
            //alert(data);
            $("#poster").css('backgroundImage', 'url('+data+')' );
            $("#poster").css("backgroundSize", 'cover');
            $("#poster").css("backgroundRepeat", 'no-repeat');
        },
        failure: function(){
            alert('fail!');
        }
    });
    console.log('was changed');
});

//Add class genre, author, publishing, language
$('#addGenre').on("click" , function(){
    var text = document.getElementById("genre").value;
    console.log(text);
    $.ajax({
        url : 'genre/addGenre',
        type : 'POST',
        data : JSON.stringify({"genre": $.trim($("#genre").val())}),//{}
        contentType: 'application/json',  // tell jQuery not to set contentType
        success : function() {
            location.reload();
        },
        failure: function(){
            alert('fail!');
        }
    })
});
$('#addAuthor').on("click" , function(){
    var text = document.getElementById("author").value;
    console.log(text);
    $.ajax({
        url : 'author/addAuthor',
        type : 'POST',
        data : JSON.stringify({"author": $.trim($("#author").val())}),//{}
        contentType: 'application/json',  // tell jQuery not to set contentType
        success : function(data) {
            location.reload();
            //alert(data);
        },
        failure: function(){
            alert('fail!');
        }
    })
});
$('#addPublishing').on("click" , function(){
    var text = document.getElementById("Publishing").value;
    console.log(text);
    $.ajax({
        url : 'Publishing/addPublishing',
        type : 'POST',
        data : JSON.stringify({"Publishing": $.trim($("#Publishing").val())}),//{}
        contentType: 'application/json',  // tell jQuery not to set contentType
        success : function(data) {
            location.reload();
            //alert(data);
        },
        failure: function(){
            alert('fail!');
        }
    })
});
$('#addLanguage').on("click" , function(){
    var text = document.getElementById("Language").value;
    console.log(text);
    $.ajax({
        url : 'Language/addLanguage',
        type : 'POST',
        data : JSON.stringify({"Language": $.trim($("#Language").val())}),//{}
        contentType: 'application/json',  // tell jQuery not to set contentType
        success : function(data) {
            location.reload();
            //alert(data);
        },
        failure: function(){
            alert('fail!');
        }
    })
});

//Delete class genre, author, publishing, language
$('.delGenre').on("click" , function(){
    $.ajax({
        url : 'genre/delGenre',
        type : 'POST',
        data : JSON.stringify({"ID": $(this).data('id')}),
        contentType: 'application/json',  // tell jQuery not to set contentType
        success : function() {
            location.reload();
        },
        failure: function(){
            alert('fail!');
        }
    })
});
$('.delAuthor').on("click" , function(){
    $.ajax({
        url : 'author/delAuthor',
        type : 'POST',
        data : JSON.stringify({"id": $(this).data('id')}),
        contentType: 'application/json',  // tell jQuery not to set contentType
        success : function() {
            location.reload();
        },
        failure: function(){
            alert('fail!');
        }
    })
});
$('.delPublishing').on("click" , function(){
    $.ajax({
        url : 'Publishing/delPublishing',
        type : 'POST',
        data : JSON.stringify({"ID": $(this).data('id')}),
        contentType: 'application/json',  // tell jQuery not to set contentType
        success : function() {
            location.reload();
        },
        failure: function(){
            alert('fail!');
        }
    })
});
$('.delLanguage').on("click" , function(){
    $.ajax({
        url : 'Language/delLanguage',
        type : 'POST',
        data : JSON.stringify({"ID": $(this).data('id')}),
        contentType: 'application/json',  // tell jQuery not to set contentType
        success : function() {
            location.reload();
        },
        failure: function(){
            alert('fail!');
        }
    })
});

//Upgrate class genre, author, publishing, language
$('.upGenre').on("click" , function(){
    $.ajax({
        url : 'genre/upGenre',
        type : 'POST',
        data : JSON.stringify({"ID": $(this).data('id'), "genre":$(this).parent().parent().find(".genreName").val()}),
        contentType: 'application/json',
        success : function(data) {
            location.reload();
        },
        failure: function(){
            alert('fail!');
        }
    })
});
$('.upAuthor').on("click" , function(){
    $.ajax({
        url : 'author/upAuthor',
        type : 'POST',
        data : JSON.stringify({"ID": $(this).data('id'), "author":$(this).parent().parent().find(".authorName").val()}),
        contentType: 'application/json',
        success : function() {
            location.reload();
        },
        failure: function(){
            alert('fail!');
        }
    })
});
$('.upPublishing').on("click" , function(){
    $.ajax({
        url : 'Publishing/upPublishing',
        type : 'POST',
        data : JSON.stringify({"ID": $(this).data('id'), "Publishing":$(this).parent().parent().find(".publName").val()}),
        contentType: 'application/json',
        success : function() {
            location.reload();
        },
        failure: function(){
            alert('fail!');
        }
    })
});
$('.upLang').on("click" , function(){
    $.ajax({
        url : 'Language/upLanguage',
        type : 'POST',
        data : JSON.stringify({"ID": $(this).data('id'), "Language":$(this).parent().parent().find(".langName").val()}),
        contentType: 'application/json',
        success : function() {
            location.reload();
        },
        failure: function(){
            alert('fail!');
        }
    })
});

//Hide button 'save'
$(".genreName").on("change", function(){
    $(this).parent().parent().find(".upGenre").show();
});
$(".authorName").on("change", function(){
    $(this).parent().parent().find(".upAuthor").show();
});
$(".publName").on("change", function(){
    $(this).parent().parent().find(".upPublishing").show();
});
$(".langName").on("change", function(){
    $(this).parent().parent().find(".upLang").show();
});

//Multiselect
/*
$(document).ready(function() {
    $("#genre").kendoMultiSelect().data("kendoMultiSelect");
    $("#author").kendoMultiSelect().data("kendoMultiSelect");
    $('#publishing').kendoMultiSelect().data("kendoMultiSelect");
    $('#language').kendoMultiSelect().data("kendoMultiSelect");
});
*/
//Check
//$('#genre').on('input', '[data-action="text"]', function () {
    //alert('hello');
    $('#genreForm').validate({
        rules: {
            genre: {
                required: true,
                remote: {
                    url: "check-email.php",
                    type: "post",
                    data: {
                        genre: $("#genre").val()
                    }
                }
            }
        },
        messages: {
            genre: {
                required: "Поле должно быть заполнено",
            }
        }
    });
//});

