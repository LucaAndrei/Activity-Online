(function ($) {
    var element = $('.title');
    console.log("TCL: element", element)


    $('ul.form li a').click(
        function (e) {
            console.log("click", e, $(this).attr('href'));
            var href=$(this).attr('href');
            console.log("TCL: href", href)
            e.preventDefault(); // prevent the default action
            e.stopPropagation; // stop the click from bubbling
            $(this).closest('ul').find('.selected').removeClass('selected');
            $(this).parent().addClass('selected');
            console.log("haidi uaai")
            if(href=="game-setup") {
                console.log("load game setup")
                $("#placeholder").load("game-setup.html");
            } else if (href == "resume") {
                console.log("load resume")
                $("#placeholder").load("resume.html");
            }
            
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