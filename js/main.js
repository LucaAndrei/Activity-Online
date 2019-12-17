(function ($) {
    var element = $('.title');
    console.log("TCL: element", element)

    $('.navbar-brand').click(function(e) {
        e.preventDefault(); // prevent the default action
        e.stopPropagation; // stop the click from bubbling
        location.reload(true);
    })


    $('ul.menu-list li').click(
        function (e) {
            console.log("click", e, $(this).attr('class'));
            var elementClass = $(this).attr('class');
            console.log("TCL: elementClass", elementClass)
            e.preventDefault(); // prevent the default action
            e.stopPropagation; // stop the click from bubbling
            $(this).closest('ul').find('.selected').removeClass('selected');
            $(this).parent().addClass('selected');
            if(elementClass.indexOf("game-setup") > -1) {
                console.log("load game setup")
                $("#placeholder").load("game-setup.html");
            } else if (elementClass.indexOf("resume") > -1) {
                console.log("load resume")
                $("#placeholder").load("resume.html");
            }
        });

        
        $.getJSON("js/data.json", data => {
            console.log("TCL: data", data)
        })
})(jQuery);