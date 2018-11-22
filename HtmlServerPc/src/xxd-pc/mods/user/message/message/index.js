require(['base', "trackBase", 'store','side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, track, store,side, jui, header, footer, dialog) {

    header.init();
    footer.init();
    //左侧菜单
    side.leftMenu(5);
    side.getLeftHeight();

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

