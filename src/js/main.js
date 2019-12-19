"use strict";
(function () {
    var $ = require("jquery");
    window.jQuery = $;
// Bootstrap doesn't have a "main" field / export anything =(
var bootstrap = require('bootstrap/dist/js/bootstrap.bundle')
    
    $(document).ready(function () {
        const uiService = require('./services/ui.service.js')($);
        const storageService = require('./services/storage.js')();
        const components = require('./config.js');

        uiService.loadLayout(components['topbar'].templateUrl)
        uiService.loadTemplate(components['main-menu'].templateUrl, () => {
            require('../components/main-menu/main-menu')($, uiService, storageService, components);
        })

        console.log("TCL: components", components)
    })
})()
//

// var storageService = require('./services/storage.js')();
// // console.log("TCL: storageServie", storageServie)

// storageService.save('asd','qwe123');
// console.log(storageService.get('asd'))

// console.log("TCL: $", $)
// var square = function square (x) { return x * x; }  
// // $("#placeholder").append(square(6));

// console.log("2345123")
// (function ($) {

//     const storageService = new StorageService();
//     



//     $('.navbar-brand').click(function(e) {
//         e.preventDefault(); // prevent the default action
//         e.stopPropagation; // stop the click from bubbling
//         location.reload(true);
//     })





//         $.getJSON("js/data.json", data => {
//             console.log("TCL: data", data)
//         })
// })(jQuery);