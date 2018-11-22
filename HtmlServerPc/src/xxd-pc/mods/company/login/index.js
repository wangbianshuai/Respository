/**
 * Created by gaoshanshan_syp on 26/02/2018.
 */
require(['base',"trackBase", 'float','store', 'juicer', 'header','footer',"dialog",'formValidate', 'backTop',  "requirejs",'md'], function ($, track,float,store, jui, header, footer,dialog) {
    var errorTips={
        userNull:'登录名为空~',
        pswNull:'密码名为空~',
        verifyNull:'验证码为空~',
        verifyError:'验证码错误'
    };
    var dataUrl = {
        submitInf:'/userCenter/user/enterpriseLogin',
        verifyUrl:'/userCenter/kaptcha.jpg',
        loginInfoUrl:'/feapi/users/loginInfo',
        ref:document.referrer,
        isLoginUrl:'/userCenter/user/beInLogging',
        isVerify:'/userCenter/kaptchaCode/checkKaptcha',
        enterpriseOpenAcntProgressQuery:'/userCenter/user/enterpriseCapitalAccountV2/enterpriseOpenAcntProgressQuery/staticPc', //判断认证是否通过
    };
    // 获取tocken
    var readToken=(document.cookie.match(/( |^)Token=([a-zA-Z0-9_\-]+)(;|$)/)||[])[2];
    header.init();
    footer.init();
    function openAcntProgress(Token,callback) {
        $.xxdAjax({
            url      : dataUrl.enterpriseOpenAcntProgressQuery,
            type:'post',
            clientId: "XXD_FRONT_END",
            data     : {},
            token: Token,
            dataType : 'json',
            callbacks:function(result){
                if(result.code=='200000'){
                    callback && callback(result.data);
                }else if(result.code=='200400'){
                    alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                }
            },
            error:function(){
                alert('请检查您的网络~');
                return false;
            }
        });
    }
    $('#username').bind('keypress',function(event){
        var keyCode = event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode);
        if(keyCode == "13"  ) {
            $('#userpsw').focus();
        }
    });
    $('#userpsw').bind('keypress',function(event){
        var keyCode = event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode);
        if(keyCode == "13" ) {
            $('#verifyCode').focus();
        }
    });
    $('#verifyCode').bind('keypress',function(event){
        var keyCode = event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode);
        if(keyCode== "13"  ) {
            $("#submit").trigger('click');
            event.preventDefault();
        }
    });
    $('#submit').on('click',function(ev){
        var event=ev || event;
        event.preventDefault();
        remember();
        judgeInput(function (a) {
            return function (b) {
                return function (c) {
                    if(a && b && c){
                        $('#tipsBorder').css('visibility','hidden');
                        $('#username,#userpsw,#verifyCode').removeClass('tips-border');
                        $('#submit').html('正在登录...');
                        var userName=$.validateTrim($('#username').val());
                        var password = $.validateTrim($('#userpsw').val());
                        var md5pwd=$.md5($.md5(password));
                        var submitData={"data":{"accountMobile":userName,"password":md5pwd}};
                        $.xxdAjax({
                            url      : dataUrl.submitInf,
                            type:'post',
                            clientId: "XXD_FRONT_END",
                            data     : JSON.stringify(submitData),
                            dataType : 'json',
                            callbacks:function (data) {
                                var result;
                                if (data.code == "200000"&& (result=data.data)) {
                                    if(result.code==0){
                                        // 登录后端获取session
                                        SetCookie('Token',result.data);
                                        $.ajax({
                                            type    : 'GET',
                                            url     : '/user/loginFrontByToken.html',
                                            beforeSend: function(request) {
                                                request.setRequestHeader("token",result.data);
                                            },
                                            data    : {},
                                            contentType:'application/json;charset=UTF-8',
                                            dataType: 'json',
                                            success : function (res) {
                                                if(res.code == 0){
                                                    openAcntProgress(result.data,function (result) {
                                                        if(result.data.companyUserOpenAccountCompletedStatus==1){
                                                            window.location.href='/usercenter/company/account.html';
                                                        }else{
                                                            window.location.href='/usercenter/company/authentication.html';
                                                        }
                                                    });
                                                }
                                            },
                                            error:function () {
                                                alert('请检查您的网络~');
                                                return false;
                                            }
                                        });
                                    }else{
                                        errorChange($('#errorTips'),result.message);
                                        $('#username').addClass('tips-border');
                                        $('#userpsw').addClass('tips-border');
                                        $('#username').focus();
                                        $('#verifyCode').val('');
                                        changeCode($('#verifyUrl'));
                                        $('#submit').html('立即登录');
                                    }
                                }else{
                                    if(result.code=='200400'){
                                        alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                                    }
                                }
                            },
                            error:function () {
                                errorChange($('#errorTips'),"抱歉,连接失败，请稍后再试");
                            }

                        });
                    }else{
                        return;
                    }

                }
            }

        })
    });
// 当在文本上去掉所有的样式
// $("input[type='text'],input[type='password']").on('focus',function(){
// 	$("input[type='text'],input[type='password']").each(function(index,val){
// 		$(val).removeClass('tips-border');
// 	})
// 	$('#tipsBorder').css('visibility','hidden');
// })
// 刷新验证码
    $('#resetVerify').on('click',function(){
        changeCode($('#verifyUrl'));
    });
// 关闭显示
    $('#closeBtn').on('click',function(ev){
        var event=ev||event;
        event.preventDefault();
        $('#tipsBorder').css('visibility','hidden');
    })
    var check=false;
    $('#remember').on('click',function (){
        if(!check){
            $(this).attr('checked','checked');
            check=true;
        }else{
            $(this).removeAttr('checked');
            check=false;
        }

    })
// 改变验证码
    changeCode($('#verifyUrl'));
    function  changeCode(veriElem){
        veriElem.attr('src',dataUrl.verifyUrl+'?'+ Math.random());
    }

    function judgeInput(callback){
        // 用户名
        // var flag=true;
        if($('#username').val()==""){
            errorChange($('#errorTips'),errorTips.userNull);
            $('#username').focus();
            $('#username').addClass('tips-border');
            callback=callback && callback(false);
        }else{
            $('#username').removeClass('tips-border');
            callback= callback && callback(true);
        }
        // 密码
        if($('#userpsw').val()==""){
            errorChange($('#errorTips'),errorTips.pswNull);
            $('#userpsw').addClass('tips-border');
            $('#userpsw').focus();
            callback=callback && callback(false);
        }else{
            $('#userpsw').removeClass('tips-border');
            callback= callback && callback(true);
        }
        if($('#verifyCode').val()!="" && $('#verifyCode').val()!=null){
            checkCode(function (result) {
                if(result==true){
                    $('#verifyCode').removeClass('tips-border');
                    $('#tipsBorder').css('visibility','hidden');
                    callback= callback && callback(true);
                }else{
                    errorChange($('#errorTips'),errorTips.verifyError);
                    $('#verifyCode').addClass('tips-border');
                    $('#verifyCode').focus();
                    callback=callback && callback(false);
                }
            });
        }else{
            errorChange($('#errorTips'),errorTips.verifyNull);
            $('#verifyCode').addClass('tips-border');
            $('#verifyCode').focus();
            callback=callback && callback(false);
        }
    }

    function checkCode(callback) {
        var verifyCodeValue = $.validateTrim($('#verifyCode').val());
        $.xxdAjax({
            url:dataUrl.isVerify+'?del=false&kaptchaCode='+verifyCodeValue,
            type: 'get',
            clientId: 'XXD_FRONT_END',
            data : {},
            dataType : "json",
            callbacks:function(result){
                if(result.code=="200000"){
                    if(result.data.code==0){
                        callback && callback(true);
                    }else{
                        callback && callback(false);
                    }
                }else{
                    if(result.code=='200400'){
                        alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                    }
                    callback && callback(false);
                }
            },
            error: function () {
                errorChange($('#errorTips'),"抱歉,连接失败，请稍后再试");
                callback && callback(false);
            }

        });
    }
    // 错误文案
    function errorChange(elem,text){
        $('#tipsBorder').css('visibility','hidden');
        elem.html('');
        elem.html(text);
        $('#tipsBorder').css('visibility','visible');
        $('#submit').html('立即登录');
    }

//本地设置cookie start
    function remember()
    {
        if($('#remember').attr("checked")=='checked'){
            SetCookie("username",$('#username').val());
        }
    }
    //设置cookie
    function SetCookie (name, value) {
        var exp = new Date(),domain='.'+location.host.split('.').splice(1,3).join('.');
        exp.setTime(exp.getTime() + (1*24*60*60*1000));
        window.document.cookie = name + "=" + escape (value) + "; expires=" + exp.toGMTString()+";path=/;domain="+domain;
    }
//  cookie end
},function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});


