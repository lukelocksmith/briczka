$(function () {
    $(document).on('mousemove', function (e) {
        $('.logo-img__bgc').css({
            left: -e.pageX / 10 ,
            top: -e.pageY / 10 
        });
    });
});