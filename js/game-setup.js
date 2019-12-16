(function ($) {
    var element = $('.title');
    console.log("TCL: element", element)


    $('.titleSet').click(
        function (e) {
            console.log("titleSet click")
            // e.preventDefault(); // prevent the default action
            // e.stopPropagation; // stop the click from bubbling
            // $(this).closest('ul').find('.selected').removeClass('selected');
            // $(this).parent().addClass('selected');
            // // $("#placeholder").load("game-setup.html");
            // $.ajax({
            //     url: "./game-setup.html",
            //     cache: false
            // })
            //     .done(function (html) {
            //         console.log("TCL: html", html)
            //         $("#placeholder").append(html);
            //     });
        });


})(jQuery);