/**
 * Created by gaoshanshan_syp on 2017/6/7.
 */
require(['base',"trackBase", 'store', 'juicer'
    , 'companyHeader', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, track, store, jui, header, footer, dialog) {
    header.init();
    footer.init();
},function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});
