$(document).ready(function(){
    $('#vhod').click(function(){
        $('div#formy').toggle(200)
    });

    $("#search").focus(function(){
        $(this).attr("value","");
        $(this).css("color","black");

    });
    $("#search").blur(function(){
        $(this).attr("value","Поиск по сайту");
        $(this).css("color","grey");
    });
    $(".navlit").hide();
    $('.butnav').click(function () {
        $(this).parent().find(".navlit").slideToggle("slow")
    });
    $('.carousel-button-right').click(function(){
        var carusel = $(this).parents('.carousel');
        right_carusel(carusel);
        return false;
    });
    $(".carousel-button-left").click(function() {
        var carusel = $(this).parents('.carousel');
        left_carusel(carusel);
        return false;
    });
    function left_carusel(carusel){
        var block_width = $(carusel).find('.carousel-block').outerWidth();
        $(carusel).find(".carousel-items .carousel-block").eq(-1).clone().prependTo($(carusel).find(".carousel-items"));
        $(carusel).find(".carousel-items").css({"left":"-"+block_width+"px"});
        $(carusel).find(".carousel-items .carousel-block").eq(-1).remove();
        $(carusel).find(".carousel-items").animate({left: "0px"}, 200);

    }
    function right_carusel(carusel){
        var block_width = $(carusel).find('.carousel-block').outerWidth();
        $(carusel).find(".carousel-items").animate({left: "-"+ block_width +"px"}, 200, function(){
            $(carusel).find(".carousel-items .carousel-block").eq(0).clone().appendTo($(carusel).find(".carousel-items"));
            $(carusel).find(".carousel-items .carousel-block").eq(0).remove();
            $(carusel).find(".carousel-items").css({"left":"0px"});
        });
    };
    $(function() {
        auto_right('.carousel:first');
    });
    function auto_right(carusel){
        setInterval(function(){
            if (!$(carusel).is('.hover'))
                right_carusel(carusel);
        }, 3000)
    }
    $('.carousel').mouseenter(function(){
        $(this).addClass('hover');
    });
    $('.carousel').mouseleave(function(){
        $(this).removeClass('hover');
    });
})