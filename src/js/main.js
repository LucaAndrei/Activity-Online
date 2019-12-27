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
    })
})()