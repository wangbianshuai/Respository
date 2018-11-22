require(['base', "trackBase", 'store', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, track, store, jui, header, footer, dialog){
    header.init();
    footer.init();
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
        
        //alert('登录状态异常，请重新登录！');
        //window.location.href = '/user/delSessionAndForwardToLogin.html';
        return false;
    }else{
        if(fakeToken.substring(0,1) == '\"'){
            fakeToken = fakeToken.substr(1,fakeToken.length - 2);
        }
    }
	$.ajax({
        url:'/userCenter/user/userInfoByToken',
        type:'get',
        beforeSend:function(request){
            request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
            request.setRequestHeader('clientTime',myTime);
            request.setRequestHeader('token',fakeToken);
        },
        success:function(data){
            if(data.code != '200000'){
                if(data.code == '200400' || data.code == '200403' || data.code == '200406' || data.code == '200407' || data.code == '200408' || data.code == '200301' || data.code == '200302' || data.code == '200303' || data.code == '200304' || data.code == '200305' || data.code == '200600' || data.code == '200601' || data.code == '200602'){
                    $('.nav-right').html('<a href="/user/ilogin.html">登录</a><a href="/user/iregister.html" class="red ga-click" ga-category="注册" ga-action="第一步" ga-label="banner">注册</a><a href="/ask/askList.html">问答</a>');
                    //alert(data.message);
                    //window.location.href = '/user/delSessionAndForwardToLogin.html';
                    return false;
                }else if(data.code == '100500' || data.code == '100600' || data.code == '100700' || data.code == '100900'){
                	$('.nav-right').html('<a href="/user/ilogin.html">登录</a><a href="/user/iregister.html" class="red ga-click" ga-category="注册" ga-action="第一步" ga-label="banner">注册</a><a href="/ask/askList.html">问答</a>');
                    //alert(data.message);
                    return false;
                }else{
                	$('.nav-right').html('<a href="/user/ilogin.html">登录</a><a href="/user/iregister.html" class="red ga-click" ga-category="注册" ga-action="第一步" ga-label="banner">注册</a><a href="/ask/askList.html">问答</a>');
                    //alert(data.message);
                    return false;
                }
            }else{
                $('.nav-right').html('<span class="nav-user j_userDropdown" position="bottom" tipcontent="html">欢迎:' + data.data.data.nickname + '<i></i></span><a href="/ask/askList.html">问答</a><a href="http://bbs.xinxindai.com">社区</a>');
            }
            header.init();
        },
        error:function(){
            //alert('网路异常，请重试！');
        }
    });
}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});