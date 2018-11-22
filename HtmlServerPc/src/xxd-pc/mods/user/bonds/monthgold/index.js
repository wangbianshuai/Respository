require(['base', "trackBase", 'store','side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, track, store,side, jui, header, footer, dialog) {

    header.init();
    footer.init();
    //左侧菜单
    side.leftMenu(1);


    var map = {
        creditorObject: $("#haveTable"),
        creditorPadingUrl: '/tradeCenter/investBiz/bondsListByToken',
        loanPagination: $(".haveTable-page"),
    };
    side.getCreditor(map);
    side.getLeftHeight();


}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});


