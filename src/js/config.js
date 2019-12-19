const componentsPath = 'components';
const componentNames = ['game-setup', 'boardgame', 'resume-game', 'topbar', 'main-menu'];
const COMPONENTS = [];
componentNames.forEach(c => {
    COMPONENTS[c] = {
        templateUrl: `${componentsPath}/${c}/${c}.html`,
        controller: `${componentsPath}/${c}/${c}`
    }
})
module.exports = COMPONENTS;