(function ($) {
    var element = $('.title');
    console.log("TCL: element", element)


    $('ul.form li a').click(
        function (e) {
            console.log("click")
            e.preventDefault(); // prevent the default action
            e.stopPropagation; // stop the click from bubbling
            $(this).closest('ul').find('.selected').removeClass('selected');
            $(this).parent().addClass('selected');
            // $("#placeholder").load("game-setup.html");
            $.ajax({
                url: "./game-setup.html",
                cache: false
            })
                .done(function (html) {
                    console.log("TCL: html", html)
                    $("#placeholder").append(html);
                });
        });


})(jQuery);