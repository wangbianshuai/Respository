require(['base', "trackBase", 'store', 'detail', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', 'md'
], function ($, track, store, detail, jui, header, footer, dialog, md) {
    header.init();
    footer.init();
    var userDO = store && store.get("userDO") || {};
    track.init(userDO);
    countDown();
    function countDown() {
        var number = 5;
        setInterval(function () {
            number--;
            $('.time').html(number);
            if (number <= 0) {
                number = 0;
                window.location.href = "/usercenter/openAccount.html";
            }
        }, 1000);
    }
}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

