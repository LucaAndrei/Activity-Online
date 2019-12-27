const MainMenu = (($, uiService, storageService, components) => {
    const isGameInProgress = storageService.get() !== null;
    $('ul.menu-list li').click(
        function (e) {
            var c = $(this).attr('component');
            e.preventDefault(); // prevent the default action
            e.stopPropagation; // stop the click from bubbling
            
            if (c.indexOf("game-setup") > -1) {
                uiService.loadTemplate(components[c].templateUrl, () => {
                    require('../game-setup/game-setup')($, uiService, storageService, components).init();
                })
            } else if (c.indexOf("boardgame") > -1 && isGameInProgress) {
                uiService.loadTemplate(components[c].templateUrl, () => {
                    const boardgame = require('../boardgame/boardgame')($, uiService, storageService, components);
                    boardgame.init();
                })
            }
        });
    (function disableResume() {
        if(!isGameInProgress) {
            $('.resume').addClass('disabled');
        }
    }())
})

module.exports = MainMenu;
