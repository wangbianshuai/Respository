require(['base', "trackBase", 'store', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, track, store, jui, header, footer, dialog) {
    header.init();
    footer.init();
    //点击认证 隐藏step1 ,显示step2
    $("#approve").on("click", function () {
        $(".step1").addClass("disnone");
        $(".step2").removeClass("disnone");
    });

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

