const Topbar = (($) => {
    const el = $('.navbar-brand')
    console.log("TCL: Topbar -> el", el)
    $('.navbar-brand').click(function (e) {
        console.log("here")
        e.preventDefault(); // prevent the default action
        e.stopPropagation; // stop the click from bubbling
        location.reload(true);
    })
})

module.exports = Topbar;
