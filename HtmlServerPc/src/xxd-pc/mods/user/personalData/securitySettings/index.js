require(['base', "trackBase", 'store', 'side', 'juicer'
    , 'md', 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, track, store, side, jui, md, header, footer, dialog) {

    header.init();
    footer.init();

    side.tabs({
        tabsObject: $("#J_tabs"),//tab 栏
    });
    //左侧菜单
    side.leftMenu(3);
    var token = store && store.get("token") || {};
    var phone, userId, payPassword,securityqid,pwdPro,pvalue,loginid;//当前用户电话号码
    var global = window["GLOBAL_STATIC_DATA"];
    //获取用户手机号
    phone = global.userInfo.data.mobile;

    /*修改支付密码-方式*/
    $("#J_payPwdWays").on("change", function () {
        $(this).val() == "1" ? $(".updateByPwd").removeClass('hide') & $(".updateBySecurity").addClass('hide') : $(".updateByPwd").addClass('hide') & $(".updateBySecurity").removeClass('hide');
        if(!securityqid){
            side.thisDialog('您还没有初始化密保问题，我们将帮你跳转到初始化密保问题页面！');
            $('#J_tabs li').removeClass('active').eq(2).addClass('active');
            $('.j_tabContent').addClass('hide').eq(2).removeClass('hide');
            return;
        }
    });
    //图片验证码点击
    $(document).on('click', '.verifyUrl', function () {
        $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
    });
    $(document).on('click', '.refresh', function () {
        $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
    });
    var domain,version=window.version,proTocol=window.location.protocol;
    if(document.domain == 'stage.xxd.com'){
        domain = proTocol+'//stage-static.xxd.com/pc/'+version+'/build/mods/user/personalData/securitySettings/i/';
    }else if(document.domain == 'dev.xxd.com'){
        domain = proTocol+'//dev-static.xxd.com/pc/'+version+'/build/mods/user/personalData/securitySettings/i/';
    }else if(document.domain == 'uat.xxd.com'){
        domain = proTocol+'//uat-static.xxd.com/pc/'+version+'/build/mods/user/personalData/securitySettings/i/';
    }else if(document.domain == 'www.xinxindai.com'){
        domain = proTocol+'//static.xinxindai.com/pc/'+version+'/build/mods/user/personalData/securitySettings/i/';
    }

    $('body').append('<form action="" id="newForm1" name="newForm1" method="post" target="_blank"></form>');
    $('#newForm1').append('<input type="text" id="back_notify_url" name="back_notify_url" />');
    $('#newForm1').append('<input type="text" id="client_tp" name="client_tp" />');
    $('#newForm1').append('<input type="text" id="code" name="code" />');
    $('#newForm1').append('<input type="text" id="login_id" name="login_id" />');
    $('#newForm1').append('<input type="text" id="mchnt_cd" name="mchnt_cd" />');
    $('#newForm1').append('<input type="text" id="mchnt_txn_ssn" name="mchnt_txn_ssn" />');
    $('#newForm1').append('<input type="text" id="page_notify_url" name="page_notify_url" />');
    $('#newForm1').append('<input type="text" id="signature" name="signature" />');
    $('#newForm1').append('<input type="text" id="ver" name="ver" />');

    //更改授权
    $('#editInsure').click(function(){
        if(openType == 0){
            $.ajax({
                url:'/userCenter/userAuth/gotoFyouAuthSt',
                type:'post',
                async:false,
                cache:false,
                headers:{'Content-Type':'application/json'},
                data:'{"data":{"source":"CLIENT_XXD_STATIC_PC"}}',
                beforeSend:function(request){
                    request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
                    request.setRequestHeader('clientTime',myTime);
                    request.setRequestHeader('token',fakeToken);
                },
                success:function(data){
                    huarunData = data.data.data.fuiouParams;
                    huarunUrl = data.data.data.fuiou_Auto_st_page_url;
                    $('#newForm1').attr('action',huarunUrl);
                    $('#back_notify_url').val(huarunData.back_notify_url);
                    $('#client_tp').val(huarunData.client_tp);
                    $('#code').val(huarunData.code);
                    $('#login_id').val(huarunData.login_id);
                    $('#mchnt_cd').val(huarunData.mchnt_cd);
                    $('#mchnt_txn_ssn').val(huarunData.mchnt_txn_ssn);
                    $('#page_notify_url').val(huarunData.page_notify_url);
                    $('#signature').val(huarunData.signature);
                    $('#ver').val(huarunData.ver);
                    $('#newForm1').submit();
                },
                error:function(){
                    alert('网络异常，请重试！');
                    return false;
                }
            });
        }else{
            dialog({
                id: "",
                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                "<div class='m-con-bd'>" +
                "<div class='filed-user'>  " +
                "<p>尊敬的用户，为了提升您的资金安全，保证顺利投标、充值和提现等操作，建议您尽快开通华瑞银行存管账户</p> </div> " +
                "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>开通存管账户</a><a class='btn btn_right right c_close' >暂不开通</a></p> </div>" +
                "</div>"
                + "</div>",
                cancel: function (clo) {
                    clo.close();
                },
                confirm: function () {
                    window.location.href = 'openAccount.html';
                }
            });
            return false;
        }
        
    });

    //判断当前用户是否设置了支付密码，是否设置了密保，设置过的密保问题是几号
    judgeUser();
    function judgeUser() {
        $.xxdAjax({
            url: '/userCenter/user/userInfoForPC',
            type: 'get',
            clientId: 'XXD_FRONT_END',
            token: token,
            data: {},
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        var data = data.data.userDetailInfo;
                        userId = data.userId;
                        loginid = data.loginid;
                        payPassword = data.payPassword;
                        securityqid = data.securityqid;
                        if (payPassword == '-1') {
                            side.thisDialog('您还没有设置支付密码，请先设置');
                            $('.j_tabContent').addClass('hide').eq(1).removeClass('hide');
                            $('.J_payPwdTitle,.updateByPwd,.updateBySecurity').addClass('hide');
                            $('.J_noPassword').removeClass('hide');
                            $('#J_tabs li').removeClass('active').eq(1).addClass('active');
                        }
                        if(securityqid){
                            $('.J_setFirstIssue').addClass('hide');
                            $('.J_newPrivateIssue').removeClass('hide');
                        }
                        //获取所有密保
                        $.xxdAjax({
                            url: '/userCenter/user/changepassword',
                            type: 'get',
                            clientId: 'XXD_FRONT_END',
                            data: {},
                            token: token,
                            callbacks: function (data) {
                                if (data && data.code == '200000') {
                                    $('.J_privateIssue').html('');
                                    if (data.data) {
                                        $.each(data.data.pwdPro, function (i, v) {
                                            $('.J_privateIssue,.J_privateNewIssue').append("<option value='" + (i + 1) + "' pkey='" + v.pkey + "'>" + v.pvalue + "</option>");
                                        });
                                        pwdPro = data.data.pwdPro;
                                        if(securityqid){
                                            $.each(pwdPro,function (i, v) {
                                                if(securityqid == v.pkey){
                                                    pvalue = v.pvalue;
                                                }
                                            });
                                            $('.J_secretIssue').val(pvalue+'?');
                                            $('.J_lastIssue').val(pvalue+'?');
                                        }
                                    }
                                }
                            },
                            error: function () {
                                side.thisDialog('网络异常，请刷新重试');
                            }
                        });
                    }
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }


    //修改支付密码点击过去就设置显示修改方式为当前密码修改
    $('#J_tabs li').eq(1).click(function () {
        $('#J_payPwdWays').val('1');
        var a = $('#J_payPwdWays').val();
        var b = $('.J_privateIssue').val();
        $('.updateBySecurity').addClass('hide');
        if(payPassword != '-1'){
            $('.updateByPwd').removeClass('hide');
        }
    })
    //当用户未设置支付密码的时候点击均为弹窗
    /*$('#J_tabs li').click(function () {
        if (payPassword == '-1') {
            side.thisDialog('您还没有设置支付密码，请先设置');
            $('.j_tabContent').addClass('hide').eq(1).removeClass('hide');
            $('.J_payPwdTitle,.updateByPwd,.updateBySecurity').addClass('hide');
        }
    })*/
    //确认设置支付密码
    $('.J_submitPayPwd').click(function () {
        if ($('.J_setPayPwd').val() == '') {
            error($('.J_setPwdError'),'请设置支付密码');
            return;
        }
        if($('.J_setPayPwd').val().length<6 || $('.J_setPayPwd').val().length>16){
            error($('.J_setPwdError'),'密码长度为6-16个字符之间，请重新输入');
            return;
        }
        if($('.J_setPayPwd').val().indexOf(loginid) != -1){
            error($('.J_setPwdError'),'密码中不能包含用户名');
            return;
        }
        if ($('.J_setTwicePayPwd').val() == '') {
            error($('.J_setPwdError'),'请确认支付密码');
            return;
        }
        if($('.J_setTwicePayPwd').val().length<6 || $('.J_setTwicePayPwd').val().length>16){
            error($('.J_setPwdError'),'密码长度为6-16个字符之间，请重新输入');
            return;
        }
        if($('.J_setTwicePayPwd').val().indexOf(loginid) != -1){
            error($('.J_setPwdError'),'密码中不能包含用户名');
            return;
        }
        $.xxdAjax({
            url: '/userCenter/user/setPayPassword',
            type: 'post',
            clientId: 'XXD_FRONT_END',
            token: token,
            data: JSON.stringify({
                "data": {
                    "password": $.md5($.md5($('.J_setTwicePayPwd').val()))
                }
            }),
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data.code == 0) {
                        hideError($('.J_setPwdError'));
                        side.thisDialog(data.data.message);
                        $('#J_tabs li').removeClass('active').eq(0).addClass('active');
                        $('.j_tabContent').addClass('hide').eq(0).removeClass('hide');
                        $('.J_payPwdTitle,.updateByPwd').removeClass('hide');
                        $('.J_noPassword').addClass('hide');
                        //设置完支付密码后更新payPassword参数
                        payPassword = 1;
                    } else {
                        error($('.J_setPwdError'),data.data.message);
                    }
                } else {
                    error($('.J_setPwdError'),data.message);
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    });

    //修改登录密码
    $('.J_changeLoginPwd').click(function () {
        var loginPwd = $('.J_loginPwd'), newlLoginPwd = $('.J_newlLoginPwd'), twiceoginPwd = $('.J_twiceoginPwd');
        var thisError = $('.J_loginError');
        if (loginPwd.val() == '') {
            error(thisError,'请输入当前登录密码');
            return;
        }
        if (newlLoginPwd.val() == '') {
            error(thisError,'请输入新的登录密码');
            return;
        }
        if(newlLoginPwd.val().length<6 || newlLoginPwd.val().length>16){
            error(thisError,'密码长度为6-16个字符之间，请重新输入');
            return;
        }
        if(newlLoginPwd.val().indexOf(loginid) != -1){
            error(thisError,'密码中不能包含用户名');
            return;
        }
        if (twiceoginPwd.val() == '') {
            error(thisError,'请再次输入新的登录密码');
            return;
        }
        if(twiceoginPwd.val().length<6 || twiceoginPwd.val().length>16){
            error(thisError,'密码长度为6-16个字符之间，请重新输入');
            return;
        }
        if(twiceoginPwd.val().indexOf(loginid) != -1){
            error(thisError,'密码中不能包含用户名');
            return;
        }
        if (newlLoginPwd.val() != twiceoginPwd.val()) {
            error(thisError,'两次密码输入不同，请重新输入新密码');
            return;
        }
        changeLoginPwd($('.J_loginPwd').val(), $('.J_twiceoginPwd').val(), '2');
    });

    //修改支付密码，通过老密码修改
    $('.J_changePayPwd').click(function () {
        var oldPwd = $('.J_oldPwd'), newPwd = $('.J_newPwd'), twicePwd = $('.J_twicePwd'),
            phoneCode = $('.J_phoneCode');
        var thisError = $('.J_byPwdError');
        if (oldPwd.val() == '') {
            error(thisError,'请输入当前支付密码');
            return;
        }
        if(oldPwd.val().length<6 || oldPwd.val().length>16){
            error(thisError,'密码长度为6-16个字符之间，请重新输入');
            return;
        }
        if(oldPwd.val().indexOf(loginid) != -1){
            error(thisError,'密码中不能包含用户名');
            return;
        }
        if (newPwd.val() == '') {
            error(thisError,'请输入新的支付密码');
            return;
        }
        if(newPwd.val().length<6 || newPwd.val().length>16){
            error(thisError,'密码长度为6-16个字符之间，请重新输入');
            return;
        }
        if(newPwd.val().indexOf(loginid) != -1){
            error(thisError,'密码中不能包含用户名');
            return;
        }
        if (twicePwd.val() == '') {
            error(thisError,'请再次输入新的支付密码');
            return;
        }
        if(twicePwd.val().length<6 || twicePwd.val().length>16){
            error(thisError,'密码长度为6-16个字符之间，请重新输入');
            return;
        }
        if(twicePwd.val().indexOf(loginid) != -1){
            error(thisError,'密码中不能包含用户名');
            return;
        }
        if (newPwd.val() != twicePwd.val()) {
            error(thisError,'两次密码输入不同，请重新输入新密码');
            return;
        }
        if (phoneCode.val() == '') {
            error($('.J_byPwdError'),'手机验证码为空，请重试');
            return;
        }
        changePayPwd();
    });
    //修改支付密码，通过密保修改
    $('.J_changeSecretPwd').click(function () {
        if (!securityqid) {
            side.thisDialog('您还没有初始化密保问题，我们将帮你跳转到初始化密保问题页面！');
            $('#J_tabs li').removeClass('active').eq(2).addClass('active');
            $('.j_tabContent').addClass('hide').eq(2).removeClass('hide');
            return;
        }
        var thisError = $('.J_byIssueError');
        if ($('.J_secretAnswer').val() == '') {
            error(thisError,'请输入您的密保答案');
            return;
        }
        if ($('.J_secretPwd').val() == '') {
            error(thisError,'请输入新的支付密码');
            return;
        }
        if($('.J_secretPwd').val().length<6 || $('.J_secretPwd').val().length>16){
            error(thisError,'密码长度为6-16个字符之间，请重新输入');
            return;
        }
        if($('.J_secretPwd').val().indexOf(loginid) != -1){
            error(thisError,'密码中不能包含用户名');
            return;
        }
        if ($('.J_secretTwicePwd').val() == '') {
            error(thisError,'请再次输入新的支付密码');
            return;
        }
        if($('.J_secretTwicePwd').val().length<6 || $('.J_secretTwicePwd').val().length>16){
            error(thisError,'密码长度为6-16个字符之间，请重新输入');
            return;
        }
        if($('.J_secretTwicePwd').val().indexOf(loginid) != -1){
            error(thisError,'密码中不能包含用户名');
            return;
        }
        if ($('.J_secretPwd').val() != $('.J_secretTwicePwd').val()) {
            error(thisError,'两次密码输入不同，请重新输入新密码');
            return;
        }
        changePwqBySecret($('.J_secretAnswer').val(),$('.J_secretTwicePwd').val());
    });
    //获取短信验证码
    $('.J_getPhoneCode').click(function () {
        var thisError = $('.J_byPwdError');
        if ($('.J_oldPwd').val() == '') {
            error(thisError,'请输入当前的支付密码');
            return;
        }
        if ($('.J_newPwd').val() == '') {
            error(thisError,'请输入新的支付密码');
            return;
        }
        if ($('.J_twicePwd').val() == '') {
            error(thisError,'请确认新的支付密码');
            return;
        }
        var a = 60;
        $('.J_getPhoneCode').html('重新发送('+a+')').css('background', '#eee');
        var timer = setInterval(function () {
            a--;
            if (a == 0) {
                clearInterval(timer);
                $('.J_getPhoneCode').html('获取短信验证码').css('background', '#2096e9');
                window.clearTimeout(timer);
                return;
            }
            $('.J_getPhoneCode').html('重新发送('+a+')').css('background', '#eee');
        }, 1000);

        getMessage();
    });
    //获取语音验证
    $('.J_getVoice').click(function () {
        var thisError = $('.J_byPwdError');
        if ($('.J_oldPwd').val() == '') {
            error(thisError,'请输入当前的支付密码');
            return;
        }
        if ($('.J_newPwd').val() == '') {
            error(thisError,'请输入新的支付密码');
            return;
        }
        if ($('.J_twicePwd').val() == '') {
            error(thisError,'请确认新的支付密码');
            return;
        }
        getVoice();
        $('.J_phoneCode').removeClass('phoneno');
        $('.J_getPhoneCode').addClass('hide');
        var a = 60;
        $('.J_getVoice').html('重新发送('+a+')').css('color', '#888');
        var timer = setInterval(function () {
            if (a == 0) {
                $('.get-message').removeClass('get-code').html('获取验证码');
                $('.J_phoneCode').addClass('phoneno');
                $('.J_getPhoneCode').removeClass('hide');
                $('.J_getVoice').html('获取语音验证码').css('color', '#2096e9');
                window.clearTimeout(timer);
                return;
            }
            a--;
            $('.J_getVoice').html('重新发送('+a+')').css('color', '#888');
        }, 1000);

    });

    //判断当前用户是否设置过密保问题，不同情况下显示不一样
    $('#J_tabs li').eq(2).click(function () {
        if (!securityqid) {
            $('.J_setFirstIssue').removeClass('hide');
            $('.J_newPrivateIssue').addClass('hide');
        }
    });
    //设置密保
    $('.J_setPwdPro').click(function () {
        if ($('.J_privateAnswer').val() == '') {
            error($('.J_setNewIssueError'),'请输入答案');
            return;
        }
        setPwdPro($('.J_privateIssue').val(), $('.J_privateAnswer').val());
    });
    //修改密保
    $('#J_setSecurity').click(function () {
        if ($('.J_lastAnswer').val() == '') {
            error($('.J_setIssueError'),'请输入旧密保答案');
            return;
        }
        if ($('.J_privateNewAnswer').val() == '') {
            error($('.J_setIssueError'),'请输入新密保答案');
            return;
        }
        changePwdPro($('.J_privateNewIssue').val(), $('.J_lastAnswer').val(), $('.J_privateNewAnswer').val());
    });

    function changeLoginPwd(oldpassword, password, pswType) {
        $.xxdAjax({
            url: '/userCenter/user/updatePassword',
            type: 'post',
            clientId: 'XXD_FRONT_END',
            token: token,
            data: JSON.stringify({
                "data": {
                    "oldPassword": $.md5($.md5(oldpassword)),
                    "password": $.md5($.md5(password)),
                    "pswType": pswType
                }
            }),
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        if (data.data.code == 0) {  //修改成功
                            hideError($('.J_loginError'));
                            thisDialog(data.data.message,function () {
                                $('.J_loginPwd,.J_newlLoginPwd,.J_twiceoginPwd').val('');
                            });
                        } else {
                            error($('.J_loginError'),data.data.message);
                        }
                    } else {
                        error($('.J_loginError'),data.message);
                    }
                }
                else if(data && data.code >= '200300' && data.code < '200400'){
                    error($('.J_loginError'),"登录失效，请点击重新&nbsp;<a href='/user/ilogin.html'>登录</a>");
                }
                else {
                    error($('.J_loginError'),data.message);
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }

    function changePayPwd() {
        //校验老的支付密码
        $.xxdAjax({
            url: '/userCenter/user/validatePayPwdByToken',
            type: 'post',
            clientId: 'XXD_FRONT_END',
            token: token,
            data: JSON.stringify({
                "data": {
                    "payPassword": $.md5($('.J_oldPwd').val()),
                }
            }),
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        if (data.data.code == 0) {
                            changePassword();
                        } else {
                            error($('.J_byPwdError'),data.data.message);
                        }
                    } else {
                        error($('.J_byPwdError'),data.message);
                    }
                }
                else if(data && data.code >= '200300' && data.code < '200400'){
                    error($('.J_byPwdError'),"登录失效，请点击重新&nbsp;<a href='/user/ilogin.html'>登录</a>");
                }
                else {
                    error($('.J_byPwdError'),data.message);
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
        function changePassword() {
            $.xxdAjax({
                url: '/userCenter/user/resetPassword',
                type: 'post',
                clientId: 'XXD_FRONT_END',
                data: JSON.stringify({
                    "data": {
                        "phone": phone,
                        "password": $.md5($.md5($('.J_twicePwd').val())),
                        "pswType": '4',
                        "smsCode": $('.J_phoneCode').val()
                    }
                }),
                callbacks: function (data) {
                    if (data && data.code == '200000') {
                        if (data.data) {
                            if (data.data.code == 0) {  //修改成功
                                hideError($('.J_byPwdError'));
                                thisDialog(data.data.message,function () {
                                    $('.J_oldPwd,.J_newPwd,.J_twicePwd,.J_phoneCode,.J_verification').val('');
                                    $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
                                });
                            } else {
                                error($('.J_byPwdError'),data.data.message);
                                $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
                            }
                        } else {
                            error($('.J_byPwdError'),data.message);
                            $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
                        }
                    }
                    else if(data && data.code >= '200300' && data.code < '200400'){
                        error($('.J_byPwdError'),"登录失效，请点击重新&nbsp;<a href='/user/ilogin.html'>登录</a>");
                        $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
                    }else {
                        error($('.J_byPwdError'),data.message);
                        $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
                    }
                },
                error: function () {
                    side.thisDialog('网络异常，请刷新重试');
                    $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
                }
            });
        }
    }

    function changePwqBySecret(securityans,password) {
        $.xxdAjax({
            url: '/userCenter/user/updPayPwdByPwdPro',
            type: 'get',
            clientId: 'XXD_FRONT_END',
            token: token,
            data: {
                "securityans": securityans,
                "password": password
            },
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        if (data.data.resultCode == 0) {  //修改成功
                            hideError($('.J_byIssueError'));
                            thisDialog(data.data.returnMsg,function () {
                                $('.J_secretAnswer,.J_secretPwd,.J_secretTwicePwd').val('');
                            });
                        } else {
                            error($('.J_byIssueError'),data.data.returnMsg);
                        }
                    } else {
                        error($('.J_byIssueError'),data.message);
                    }
                }
                else if(data && data.code >= '200300' && data.code < '200400'){
                    error($('.J_byIssueError'),"登录失效，请点击重新&nbsp;<a href='/user/ilogin.html'>登录</a>");
                }else {
                    error($('.J_byIssueError'),data.message);
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }

    function getVoice() {
        $.xxdAjax({
            url: '/messageCenter/send/Voice',
            type: 'post',
            clientId: 'XXD_FRONT_END',
            data: JSON.stringify({
                "data": {
                    "phone": phone,
                    "userId": userId,
                    "busiCode": 'CHANGE_PASSWORD',
                    "kaptchaCode": $('.J_verification').val()
                }
            }),
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        if (data.data.code == 0) {  //修改成功
                            side.thisDialog(data.data.message);
                            hideError($('.J_byPwdError'));
                        } else {
                            error($('.J_byPwdError'),data.data.message);
                        }
                    } else {
                        error($('.J_byPwdError'),data.message);
                    }
                } else {
                    error($('.J_byPwdError'),data.message);
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }

    function getMessage() {
        $.xxdAjax({
            url: '/messageCenter/send/Message',
            type: 'post',
            clientId: 'XXD_FRONT_END',
            data: JSON.stringify({
                "data": {
                    "phone": phone,
                    "smsTemplateCode": 'PASSWORD_MODIFY',
                    "kaptchaCode": $('.J_verification').val()
                }
            }),
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        if (data.data.code == 0) {  //修改成功
                            side.thisDialog(data.data.message);
                            hideError($('.J_byPwdError'));
                        } else {
                            error($('.J_byPwdError'),data.data.message);
                        }
                    } else {
                        error($('.J_byPwdError'),data.message);
                    }
                } else {
                    error($('.J_byPwdError'),data.message);
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }

    function setPwdPro(securityQid, securityans) {
        $.xxdAjax({
            url: '/userCenter/user/setPwdPro',
            type: 'get',
            clientId: 'XXD_FRONT_END',
            token: token,
            data: {
                'securityQid': securityQid,
                'securityans': securityans
            },
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        if (data.data.resultCode == 0) {  //修改成功
                            side.thisDialog(data.data.returnMsg);
                            hideError($('.J_setNewIssueError'));
                            securityqid = securityQid;
                            //设置已设置过的密保问题
                            if(securityqid){
                                $.each(pwdPro,function (i, v) {
                                    if(securityqid == v.pkey){
                                        pvalue = v.pvalue;
                                    }
                                });
                                $('.J_secretIssue').val(pvalue+'?');
                                $('.J_lastIssue').val(pvalue+'?');
                            }
                            //确认设置成功后，显示就得改动了
                            $('.J_setFirstIssue').addClass('hide');
                            $('.J_newPrivateIssue').removeClass('hide');
                        } else {
                            error($('.J_setNewIssueError'),data.data.returnMsg);
                        }
                    } else {
                        error($('.J_setNewIssueError'),data.message);
                    }
                } else {
                    error($('.J_setNewIssueError'),data.message);
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }

    function changePwdPro(securityQid, securityans, newMibaoAnswers) {
        $.xxdAjax({
            url: '/userCenter/user/updPwdPro',
            type: 'get',
            clientId: 'XXD_FRONT_END',
            token: token,
            data: {
                'securityQid': securityQid,
                'securityans': securityans,
                'newMibaoAnswers': newMibaoAnswers,
            },
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        if (data.data.resultCode == 0) {  //修改成功
                            hideError($('.J_setIssueError'));
                            thisDialog(data.data.returnMsg,function () {
                                $('.J_lastAnswer,.J_privateNewAnswer').val('');
                            });
                        } else {
                            error($('.J_setIssueError'),data.data.returnMsg);
                        }
                    } else {
                        error($('.J_setIssueError'),data.message);
                    }
                }
                else if(data && data.code >= '200300' && data.code < '200400'){
                    error($('.J_setIssueError'),"登录失效，请点击重新&nbsp;<a href='/user/ilogin.html'>登录</a>");
                }
                else {
                    error($('.J_setIssueError'),data.message);
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }

    function thisDialog(content,callback) {
        dialog({
            content: "<div class='dimension operate-tip'>"
            +"<i class='close_x J_deleteValue'>×</i>"
            +"<h5>提示</h5>"
            +"<div class='tip-content'>"
            +"<p>"+content+"</p>"
            +"<a href='#' class='btn J_deleteValue'>确认</a>"
            +"</div>"
            +"</div>",
            id: "",
            confirm: function (art) {

            },
            cancel: function (art) {
                art.remove();
            }
        });
        $('body').on('click','.J_deleteValue',function () {
            $('.mui-dialog').remove();
            callback();
        });
    }
    function error(obj,error) {
        obj.removeClass('hide').html(error);
    }

    function hideError(obj) {
        obj.addClass('hide');
    }
    side.getLeftHeight();

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
        window.location.href = '../../user/delSessionAndForwardToLogin.html';
        return false;
    }else{
        if(fakeToken.substring(0,1) == '\"'){
            fakeToken = fakeToken.substr(1,fakeToken.length - 2);
        }
    }
    var dataFlag = 0;
    var openType = 1;
    $('#J_tabs').find('li').eq(3).click(function(){
        $.ajax({
            url:'/userCenter/user/queryUserAuthStByFYou',
            type:'get',
            async:false,
            cache:false,
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_STATIC_PC');
                request.setRequestHeader('clientTime',myTime);
                request.setRequestHeader('token',fakeToken);
            },
            success:function(data){
                if(data.code != '200000'){
                    if(data.code == '200403' || data.code == '200406' || data.code == '200407' || data.code == '200408' || data.code == '200600' || data.code == '200601' || data.code == '200602'){
                        alert(data.message);
                        return false;
                    }else if(data.code == '200400'){
                        alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                        return false;
                    }else if(data.code == '200301' || data.code == '200302' || data.code == '200303' || data.code == '200304' || data.code == '200305'){
                        alert('登录状态异常，请重新登录！');
                        window.location.href = '../../user/delSessionAndForwardToLogin.html';
                        return false;
                    }else if(data.code == '100500' || data.code == '100600' || data.code == '100700' || data.code == '100900'){
                        alert(data.message);
                        return false;
                    }else{
                        alert(data.message);
                        return false;
                    }
                }else{
                    if(data.data.code != 0){
                        $('#tableCon').fadeOut(0);
                        if(data.data.code == 1){
                            openType = 1;
                            dialog({
                                id: "",
                                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                "<div class='m-con-bd'>" +
                                "<div class='filed-user'>  " +
                                "<p>尊敬的用户，为了提升您的资金安全，保证顺利投标、充值和提现等操作，建议您尽快开通华瑞银行存管账户</p> </div> " +
                                "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>开通存管账户</a><a class='btn btn_right right c_close' >暂不开通</a></p> </div>" +
                                "</div>"
                                + "</div>",
                                cancel: function (clo) {
                                    clo.close();
                                },
                                confirm: function () {
                                    window.location.href = 'openAccount.html';
                                }
                            });
                            return false;
                        }else{
                            alert(data.data.message);
                            return false;
                        }
                    }else{
                        //judgeUser();
                        openType = 0;
                        $('#tableCon').fadeIn(0);
                        if(dataFlag == 0){
                            dataFlag = 1;
                            $.each(data.data.data.results,function(index,item){
                                if(item.autoLendStatus == '0'){
                                    $('#tableCon').append('<tr><td style="width:170px;">自动出借授权</td><td style="width:160px;">--</td><td style="width:160px;">--</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '0.png" /></td><td>--</td></tr>');
                                }else if(item.autoLendStatus == '1'){
                                    $('#tableCon').append('<tr><td style="width:170px;">自动出借授权</td><td style="width:160px;">' + item.auto_lend_amt + '</td><td style="width:160px;">' + item.auto_lend_term + '</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '1.png" /></td><td>已使用授权出借额度' + item.used_lend_amt + '</td></tr>');
                                }
                                if(item.autoRepayStatus == '0'){
                                    $('#tableCon').append('<tr><td style="width:170px;">自动还款授权</td><td style="width:160px;">--</td><td style="width:160px;">--</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '0.png" /></td><td>--</td></tr>');
                                }else if(item.autoRepayStatus == '1'){
                                    $('#tableCon').append('<tr><td style="width:170px;">自动还款授权</td><td style="width:160px;">' + item.auto_repay_amt + '</td><td style="width:160px;">' + item.auto_repay_term + '</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '1.png" /></td><td>--</td></tr>');
                                }
                                if(item.autoCompenStatus == '0'){
                                    $('#tableCon').append('<tr><td style="width:170px;">自动代偿授权</td><td style="width:160px;">--</td><td style="width:160px;">--</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '0.png" /></td><td>--</td></tr>');
                                }else if(item.autoCompenStatus == '1'){
                                    $('#tableCon').append('<tr><td style="width:170px;">自动代偿授权</td><td style="width:160px;">' + item.auto_compen_amt + '</td><td style="width:160px;">' + item.auto_compen_term + '</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '1.png" /></td><td>--</td></tr>');
                                }
                                if(item.autoFeeStatus == '0'){
                                    $('#tableCon').append('<tr><td style="width:170px;">缴费授权</td><td style="width:160px;">--</td><td style="width:160px;">--</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '0.png" /></td><td>--</td></tr>');
                                }else if(item.autoFeeStatus == '1'){
                                    $('#tableCon').append('<tr><td style="width:170px;">缴费授权</td><td style="width:160px;">' + item.auto_fee_amt + '</td><td style="width:160px;">' + item.auto_fee_term + '</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '1.png" /></td><td>--</td></tr>');
                                }
                            });
                        }
                    }
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    });

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});


