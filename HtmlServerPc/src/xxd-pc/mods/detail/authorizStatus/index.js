/**
 * Created by gaoshanshan_syp on 20/06/2018.
 */
require(['base', "trackBase", 'store','detail', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, track, store,detail,jui, header, footer, dialog){
    header.init();
    footer.init();

     if($('#J_showCode').html()==0){
         $('#J_showIcon').removeClass('fail-icon');
     }else{
         $('#J_showIcon').removeClass('sucess-icon');
     }
    var userDO = store && store.get("userDO") || {};
    track.init(userDO);
}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});