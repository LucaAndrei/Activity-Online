const Topbar = (($) => {
    const el = $('.navbar-brand')
    $('.navbar-brand').click(function (e) {
        e.preventDefault(); // prevent the default action
        e.stopPropagation; // stop the click from bubbling
        location.reload(true);
    })
})

module.exports = Topbar;
