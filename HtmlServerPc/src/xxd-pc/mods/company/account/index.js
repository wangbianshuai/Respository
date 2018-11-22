require([
  'base', 'echarts', 'cropper', "trackBase", 'store', 'side', 'juicer',
  'companyHeader', 'footer', "dialog", 'backTop', 'json', 'requirejs'
], function ($, echarts, cropper, track, store, side, jui, header, footer, dialog) {

    header.init();
    footer.init();

    $(function() {
        if(parseInt($('.g-left').height()) < parseInt($('.g-right').height())){
            $('.g-left').css('min-height',$('.g-right').height() + 'px');
        }
    });
}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

