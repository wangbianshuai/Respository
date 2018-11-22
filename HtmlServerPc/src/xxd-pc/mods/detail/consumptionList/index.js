
require(['base', "trackBase", 'store', 'detail', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', 'md'
], function ($, track, store, detail, jui, header, footer, dialog, md) {
    header.init();
    footer.init();
    var userDO = store && store.get("userDO") || {};
    track.init(userDO);


    //选项卡判断
    detail.tabs({
        tabsObject: $("#consumptionNav"),//tab 栏
        consumeTableObject: $(".consumption"), //table 表格对象
        consumePadingUrl: '/integrationPlatform/bids?'+new Date().getTime(), //ajax 数据集
        consumePagination: $(".pagination"), //分页组件
    }, '');













}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});
