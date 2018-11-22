require(['base', "trackBase", 'store', 'juicer'
    , 'header', 'footer', "dialog", "bankListTpl",'backTop', 'json', "requirejs"
], function ($, track, store, jui, header, footer, dialog,bankListTpl) {
    header.init();
    footer.init();
    var clocks = setInterval(function(){
        if(parseInt($('.g-left').height()) < parseInt($('.g-right').height())){
            $('.g-left').css('min-height',$('.g-right').height() + 'px');
        }else{
            clearInterval(clocks);
        }
    },100);
    function num(obj){
        obj.val(obj.val().replace(/[^\d.]/g,""));
        obj.val(obj.val().replace(/^\./g,""));
        obj.val(obj.val().replace(/\.{2,}/g,"."));
        obj.val(obj.val().replace(".","$#$").replace(/\./g,"").replace("$#$","."));
        obj.val(obj.val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'));
    }
    $('.last .filed-user').eq(0).fadeOut(0);
    $('#errorTip1').fadeOut(0);
    $('#errorTip2').fadeOut(0);
    $('.bluetipexc').find('strong').fadeOut(0);
    $.each($('.menu ul li'),function(){
        $(this).find('div').css('display','none');
    });
    $('.menu ul li').eq(0).addClass('showTab');
    $('.showTab').find('div').css('display','block');
    $('.menu ul li a').on('click',function(){
        if($(this).parent('li').attr('class') == 'showTab'){
            $(this).parent('li').removeClass('showTab');
            $(this).parent('li').find('div').css('display','none');
        }else{
            $(this).parent('li').addClass('showTab');
            $(this).parent('li').find('div').css('display','block');
        }
    });
    var timer = new Date();
    var myTime = timer.getTime();
    function getCookie(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return unescape(arr[2]);
        }else{
            return null;
        }
    }
    var fakeToken = getCookie('Token');
    if(fakeToken == '' || fakeToken == null || fakeToken == undefined){
        alert('登录状态异常，请重新登录！');
        window.location.href = '../../../user/delSessionAndForwardToLogin.html';
        return false;
    }else{
        if(fakeToken.substring(0,1) == '\"'){
            fakeToken = fakeToken.substr(1,fakeToken.length - 2);
        }
    }
    
    $('body').append('<form action="" id="newForm1" name="newForm1" method="post" target="_blank"></form>');
    $('#newForm1').append('<input type="text" id="amt" name="amt" />');
    $('#newForm1').append('<input type="text" id="back_notify_url" name="back_notify_url" />');
    $('#newForm1').append('<input type="text" id="login_id" name="login_id" />');
    $('#newForm1').append('<input type="text" id="mchnt_cd" name="mchnt_cd" />');
    $('#newForm1').append('<input type="text" id="mchnt_txn_ssn" name="mchnt_txn_ssn" />');
    $('#newForm1').append('<input type="text" id="page_notify_url" name="page_notify_url" />');
    $('#newForm1').append('<input type="text" id="signature" name="signature" />');

    var domain;
    if(document.domain == 'stage.xxd.com'){
        domain = 'http://stage-static.xxd.com/pc/1.1.0/build/img/';
    }else if(document.domain == 'dev.xxd.com'){
        domain = 'http://dev-static.xxd.com/pc/1.1.0/build/img/';
    }else if(document.domain == 'uat.xxd.com'){
        domain = 'http://uat-static.xxd.com/pc/1.1.0/build/img/';
    }else if(document.domain == 'www.xinxindai.com'){
        domain = 'http://static.xinxindai.com/pc/1.1.0/build/img/';
    }

    var bankList = [
        {'bankCode':'0102','bankName':'中国工商银行','imgUrl':domain + 'bklogo_gs.png'},
        {'bankCode':'0103','bankName':'中国农业银行','imgUrl':domain + 'bklogo_ny.png'},
        {'bankCode':'0104','bankName':'中国银行','imgUrl':domain + 'bklogo_zg.png'},
        {'bankCode':'0105','bankName':'中国建设银行','imgUrl':domain + 'bklogo_js.png'},
        {'bankCode':'0301','bankName':'交通银行','imgUrl':domain + 'bklogo_jt.png'},
        {'bankCode':'0302','bankName':'中信银行','imgUrl':domain + 'bklogo_zx.png'},
        {'bankCode':'0303','bankName':'中国光大银行','imgUrl':domain + 'bklogo_gd.png'},
        {'bankCode':'0304','bankName':'华夏银行','imgUrl':domain + 'bklogo_hx.png'},
        {'bankCode':'0305','bankName':'中国民生银行','imgUrl':domain + 'bklogo_ns.png'},
        {'bankCode':'0306','bankName':'广东发展银行','imgUrl':domain + 'bklogo_gf.png'},
        {'bankCode':'0307','bankName':'平安银行股份有限公司','imgUrl':domain + 'bklogo_pa.png'},
        {'bankCode':'0308','bankName':'招商银行','imgUrl':domain + 'bklogo_zs.png'},
        {'bankCode':'0309','bankName':'兴业银行','imgUrl':domain + 'bklogo_xy.png'},
        {'bankCode':'0310','bankName':'上海浦东发展银行','imgUrl':domain + 'bklogo_pf.png'},
        {'bankCode':'0403','bankName':'中国邮政储蓄银行股份有限公司','imgUrl':domain + 'bklogo_yz.png'}
    ]

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});