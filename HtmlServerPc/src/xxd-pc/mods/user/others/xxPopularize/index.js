require(['base', "trackBase", 'store', 'juicer', 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"], function ($, track, store, jui, header, footer, dialog) {
    //绑定邮箱弹框
    $("#J_setPopinfo").on("click", function () {
        dialog({
            id: "setPopinfo",
            content: "<div class='xxPop-tips'><i class='c_close' href='#'>×</i> " +
            "<div class='m-con-hd'>提示</div> <div class='tip-content'> " +
            "<p>抱歉！那您还没有完成邮箱认证！</p> <p>请先认证邮箱。</p> " +
            "</div> <a class='btn'>确认提交</a> </div>",
            cancel: function (clo) {
                clo.close();
            },
            confirm: function () {

            }
        });
    });
});