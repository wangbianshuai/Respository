/**
 * Created by gaoshanshan_syp on 26/02/2018.
 */
require(['base','float',"trackBase", 'store','header','footer',"dialog",'formValidate', 'backTop', 'json', "requirejs","md"], function ($,float,track, store,header,footer,dialog) {
    var msg={
        errorMsg:'请检查您的网络！'
    };
    var dataUrl={
        checkMobileNum:'/userCenter/user/checkUsernameIsUnique',     //判断手机验证码
        checkEnterpriseNameIsUnique:'/userCenter/user/checkEnterpriseNameIsUnique',//检验公司名唯一性
        tokenUrl:'/feapi/users/formToken',
        isLoginUrl:'/userCenter/user/beInLogging',
        sendSMSUrl:'/messageCenter/send/Message',                       //发送短信验证码
        voiceSMSUrl:'/messageCenter/send/Voice',                       //发送语音验证码
        GraphCode:'/userCenter/kaptcha.jpg',             //判断图形验证码

        // toRegisterStep2 :'/user/toRegisterStep2.html',  //下一步认证
        isVerify:'/userCenter/kaptchaCode/checkKaptcha',   //判断图形验证码正确性
        regLogin:'/userCenter/user/enterpriseRegist',  //注册提交
        enterpriseOpenAcntProgressQuery:'/userCenter/user/enterpriseCapitalAccountV2/enterpriseOpenAcntProgressQuery/staticPc', //判断认证是否通过
    };
    header.init();
    footer.init();

    var interval=null,default_count_time = 60,time = default_count_time,eyeStatus = false,voiceBol=true;//默认闭眼;
    var readToken=(document.cookie.match(/( |^)Token=([a-zA-Z0-9_\-]+)(;|$)/)||[])[2];
    var dialogTips={
        //打开弹窗
        open:function (msg) {
            $('#J_tipsMsg').html(msg);
            $('#J_dialogTips').removeClass('disnone');
        },
        close:function () {
            $('#J_dialogTips').addClass('disnone');
        }
    };
//    关闭
    $('#J_close,#J_tipsBtn').on('click',function(){
        dialogTips.close();
    });
//   步骤一
    //name focus&blur事件监听
    $('#userName').focus(function(){
        $('#J_nameBorder').removeClass('redborder');
        $('#J_nameBorder').addClass('blueborder');
        $('#J_nameTiperror').addClass('hidden');
    }).blur(function(){
        validateCompanyName();
    });

    //phone number focus&blur事件监听
    $('#userNum').focus(function(){
        $('#J_numBorder').removeClass('redborder');
        $('#J_numBorder').addClass('blueborder');
        $('#J_numTiperror').addClass('hidden');
    }).blur(function(){
        validatePhoneNumber();
    });
    //password  focus&blur事件监听
    $('#userPsw').focus(function(){
        $('#J_pswBorder').removeClass('redborder');
        $('#J_pswBorder').addClass('blueborder');
        $('#J_pswTiperror').addClass('hidden');
    }).blur(function(){
        if(this.value != '' && this.value != null){
            var result = $.validatePassword(this.value);
            if(result != 'true'){
                $('#J_pswTiperror').removeClass('hidden');
                $('#J_pswTipRight').addClass('hidden');
                $('#J_pswBorder').removeClass('blueborder');
                $('#J_pswBorder').addClass('redborder');
                $("#J_nextStep").attr("disabled", "disabled");
            }else{
                $('#J_pswTiperror').addClass('hidden');
                $('#J_pswTipRight').removeClass('hidden');
                $('#J_pswBorder').removeClass('blueborder');
                if(allInputCorrect()){
                    $('#J_nextStep').removeAttr("disabled");
                }
            }
        }else{
            $('#J_pswTiperror').addClass('hidden');
            $('#J_pswTipRight').addClass('hidden');
            $('#J_pswBorder').removeClass('blueborder');
            if (allInputCorrect()){
                $('#J_nextStep').removeAttr("disabled");
            }
        }
    });
    //密码打开
    $('#J_pswEye').on('click',function(){
        twinkle();
    });
    //verify code focus&blur事件监听
    $('#verifyCode').focus(function(){
        $('#verifyCode').removeClass('redborder');
        $('#verifyCode').addClass('blueborder');
        $('#J_yzmTipError').addClass('hidden');
    }).blur(function(){
        checkCode();
    });
    //verify code input change 监听
    $('#verifyCode').bind('input propertychange', function() {
        checkCode();
    });
    //验证码
    $('#resetVerify').on('click',function(){
        loadimage('#verifyCode','#verifyurl');
    });

    //下一步按钮，点击事件
    $("#J_nextStep").click(function(){
        var phoneNumber =$.validateTrim($('#userNum').val());
        var verifyCode = $.validateTrim($("#verifyCode").val());

        nextVal(function (a) {
            return function (b) {
                return function (c) {
                    return function (d) {
                        if(a && b && c && d){
                            enableNextStepButton();
                            $('#J_stepFirst').addClass('disnone');
                            $('#J_userNum').val(phoneNumber);
                            $('#J_stepSecond').removeClass('disnone');
                            sendSMSInStep(verifyCode, phoneNumber);
                        }else {
                            return;
                        }
                    }
                }
            }
        });
    });

    function nextVal(callback){
        var returnVal=true;
        var companyName=$('#userName').val();
        var phoneNumber = $('#userNum').val();
        var password = $('#userPsw').val();
        var verifyCode = $("#verifyCode").val();
        //I：前端验证
        //validate companyName
        if($.validateTrim(companyName)==""){
            $('#J_nameBorder').addClass('redborder');
            $('#J_nameBorder').removeClass('blueborder');
            $('#J_nameTiperror').removeClass('hidden');
            $('#J_nameTiperror span').html("企业名称不能为空！");
            $('#J_nameTipRight').addClass('hidden');

            $("#J_nextStep").attr("disabled", "disabled");
            loadimage('#verifyCode','#verifyurl');
            returnVal=false;
            callback = callback && callback(returnVal);

        }else{
            validateCompanyName(function (result) {
                if(result==false){
                    $("#J_nextStep").attr("disabled", "disabled");
                    returnVal=false;
                }
                callback = callback && callback(returnVal);
            });
        }
        //validate phonenumber
        if($.validateTrim(phoneNumber) == "") {
            $('#J_numTiperror').removeClass('hidden');
            $('#J_numTiperror span').html('手机号码不能为空！');
            $('#J_numTipRight').addClass('hidden');
            $('#J_numBorder').removeClass('blueborder');
            $('#J_numBorder').addClass('redborder');
            $("#J_nextStep").attr("disabled", "disabled");
            loadimage('#verifyCode','#verifyurl');
            returnVal=false;
            callback = callback && callback(returnVal);
        }else{
            validatePhoneNumber(function (result) {
                if(result==false){
                    $("#J_nextStep").attr("disabled", "disabled");
                    loadimage('#verifyCode','#verifyurl');
                    returnVal=false;
                }
                callback = callback && callback(returnVal);
            });
        }
        //validate password
        if(password == ""){
            $('#J_pswTiperror').removeClass('hidden');
            $('#J_pswTiperror span').html('密码不能为空!');
            $('#J_pswTipRight').addClass('hidden');
            $('#J_pswBorder').removeClass('blueborder');
            $('#J_pswBorder').addClass('redborder');
            $("#J_nextStep").attr("disabled", "disabled");
            returnVal=false;
            callback = callback && callback(returnVal);
        }else{
            var result = $.validatePassword(password);
            if(result!='true'){
                $("#J_nextStep").attr("disabled", "disabled");
                returnVal=false;
            }
            callback = callback && callback(returnVal);
        }
        //validate verifycode
        if(verifyCode == ""){
            $('#verifyCode').removeClass('blueborder');
            $('#verifyCode').addClass('redborder');
            $('#J_yzmTipError').removeClass('hidden');
            $('#J_yzmTipRight').addClass('hidden');
            $('#J_yzmTipError span').html("验证码不能为空!");
            $("#J_nextStep").attr("disabled", "disabled");
            returnVal=false;
            callback = callback && callback(returnVal);
        }else{
            checkCode(function (result) {
                if(result==false){
                    $("#J_nextStep").attr("disabled", "disabled");
                    returnVal=false;
                }
                callback = callback && callback(returnVal);
            });
        }
        return returnVal;
    }

    //phone number focus&blur事件监听
    $('#J_userNum').focus(function(){
        $('#J_stepUserNum').removeClass('redborder');
        $('#J_stepUserNum').addClass('blueborder');
        $("#J_stepNumError").addClass('hidden');
    }).blur(function(){
        checkPhoneNumberInStep2();
    });
    //步骤二中手机号格式验证
    $('#J_userNum').bind('input propertychange', function() {
        checkPhoneNumberInStep2();
    });
    //步骤二图片验证码blur事件
    $('#J_verifyCode').focus(function(){
        $('#J_verifyCode').removeClass('redborder');
        $('#J_verifyCode').addClass('blueborder');
        $("#J_stepYzmError").addClass('hidden');
    }).blur(function(){
        checkCodeInStep2();
    });
    $('#J_verifyCode').bind('input propertychange', function(){
        checkCodeInStep2();
    });
    $('#J_resetVerify').on('click',function(){
        loadimage('#J_verifyCode','#J_verifyUrl');
    });

    //keypress 点击事件
    // company
    $('#userName').bind('keypress',function(event){
        if(event.keyCode == "13"  ) {
            $('#userNum').focus();
        }
    });
    //phone number enter event
    $('#userNum').bind('keypress',function(event){
        if(event.keyCode == "13"  ) {
            $('#userPsw').focus();
        }
    });
    //password enter event
    $('#userPsw').bind('keypress',function(event){
        if(event.keyCode == "13"  ) {
            $('#resetVerify').focus();
        }
    });
    //verify code enter event
    $('#resetVerify').bind('keypress',function(event){
        if(event.keyCode == "13"  ) {
            var canClick = "disabled" != $('#J_nextStep').attr('disabled');
            if(canClick){
                $('#J_nextStep').click();
            }
        }
    });
    //step2_enter event
    $('#J_userNum').bind('keypress',function(event){
        if(event.keyCode == "13"  ) {
            $('#J_verifyCode').focus();
        }
    });
    $('#J_verifyCode').bind('keypress',function(event){
        if(event.keyCode == "13"  ) {
            var canClick = "disabled" != $('#J_StepSend').attr('disabled');
            if(canClick){
                $('#J_StepSend').click();
            }
        }
    });
    $('#J_yyVerifyCode').bind('keypress',function(event){
        if(event.keyCode == "13"  ) {
            $('#J_agreeRegister').click();
        }
    });
    //步骤2  发送手机验证码
    $('#J_StepSend').on('click',function(){
        sendSmsInStep2(0);
    });
    //发送语音验证码
    $('#J_getVoiceYzm').on('click',function(){
        if($(this).hasClass('voice-send')){
            $(this).addClass('voice-send');
            clearInterval(interval);
            $('#J_sendSuccessTips').addClass('hidden');
            $('#J_StepSend').html("发送验证码到手机");
            sendSmsInStep2(1);
        }

    });
    //去掉错误提示
    $('.close').on('click',function(){
        $(this).parent().addClass('hidden');
    });
    //步骤一  验证企业名称
    function validateCompanyName(callback) {
        var returnValue = true;
        var name = $.validateTrim($('#userName').val());
        var result=$.validateCompanyName(name);
        if(name != '' && name != null){
            if(result!='true'){
                $('#J_nameTiperror').removeClass('hidden');
                $('#J_nameTiperror span').html(result);
                $('#J_nameTipRight').addClass('hidden');
                $('#J_nameBorder').removeClass('blueborder');
                $('#J_nameBorder').addClass('redborder');
                returnValue = false;
                callback && callback(false);
            }else{
                $('#J_nameTiperror').addClass('hidden');
                $('#J_nameTipRight').removeClass('hidden');
                $('#J_nameBorder').removeClass('blueborder');
                if(allInputCorrect()){
                    $('#J_nextStep').removeAttr("disabled");
                }
                returnValue = true;
                callback && callback(true);
                // $.xxdAjax({
                //     url:dataUrl.checkEnterpriseNameIsUnique+'?enterpriseName='+name,
                //     type: 'get',
                //     clientId: 'XXD_FRONT_END',
                //     data : {},
                //     dataType : "json",
                //     callbacks:function(result){
                //         if(result.code=='200000'){
                //             if(result.data.code==0){
                //                 $('#J_nameTiperror').addClass('hidden');
                //                 $('#J_nameTipRight').removeClass('hidden');
                //                 $('#J_nameBorder').removeClass('blueborder');
                //                 if(allInputCorrect()){
                //                     $('#J_nextStep').removeAttr("disabled");
                //                 }
                //                 returnValue = true;
                //                 callback && callback(true);
                //             }else{
                //                 $('#J_nameTiperror').removeClass('hidden');
                //                 $('#J_nameTiperror span').html(result.data.message);
                //                 $('#J_nameTipRight').addClass('hidden');
                //                 $('#J_nameBorder').removeClass('blueborder');
                //                 $('#J_nameBorder').addClass('redborder');
                //                 returnValue = false;
                //                 callback && callback(false);
                //             }
                //
                //         }
                //     },
                //     error: function () {
                //         float.alert({content:"请检查你的网络"});
                //         disabledNextStepButton();
                //         returnValue = false;
                //         callback && callback(false);
                //     }
                //
                // });
            }
        }else{
            $('#J_nameTiperror').addClass('hidden');
            $('#J_nameTipRight').addClass('hidden');
            $('#J_nameBorder').removeClass('blueborder');
            if(allInputCorrect()){
                $('#J_nextStep').removeAttr("disabled");
            }
            returnValue = false;
            callback && callback(false);
        }
        return returnValue;
    }
    //步骤一中验证电话号码
    function validatePhoneNumber(callback) {
        var returnValue = true;
        var mobile = $.validateTrim($('#userNum').val());
        var result = $.validateMobile(mobile);
        if(mobile != '' && mobile != null){//手机号不为空
            if(result != 'true'){//格式不正确
                $('#J_numBorder').removeClass('blueborder');
                $('#J_numBorder').addClass('redborder');
                $('#J_numTiperror').removeClass('hidden');
                $('#J_numTiperror span').html(result);
                $('#J_numTipRight').addClass('hidden');
                $("#J_nextStep").attr("disabled", "disabled");
                loadimage('#verifyCode','#verifyurl');
                returnValue = false;
                callback && callback(false);
            } else {
                $.xxdAjax({
                    url:dataUrl.checkMobileNum,
                    type: 'get',
                    clientId: 'XXD_FRONT_END',
                    data : {
                        username : mobile
                    },
                    dataType : "json",
                    callbacks:function(result){
                        if(result.code=='200000'){
                            if(result.data.code==0){
                                $('#J_numTiperror').addClass('hidden');
                                $('#J_numTipRight').removeClass('hidden');
                                $('#J_numBorder').removeClass('blueborder');
                                if(allInputCorrect()){
                                    $('#J_nextStep').removeAttr("disabled");
                                }
                                returnValue = true;
                                callback && callback(true);
                            }else{
                                $('#J_numTiperror').removeClass('hidden');
                                $('#J_numTiperror span').html(result.data.message);
                                $('#J_numTipRight').addClass('hidden');
                                $('#J_numBorder').removeClass('blueborder');
                                $('#J_numBorder').addClass('redborder');
                                $("#J_nextStep").attr("disabled", "disabled");
                                loadimage('#verifyCode','#verifyurl');
                                returnValue = false;
                                callback && callback(false);
                            }

                        }
                    },
                    error: function () {
                        float.alert({content:"请检查你的网络"});
                        disabledNextStepButton();
                        returnValue = false;
                        callback && callback(false);
                    }

                });
            }
        } else {//手机号为空
            $('#J_numTiperror').addClass('hidden');
            $('#J_numTipRight').addClass('hidden');
            $('#J_numBorder').removeClass('blueborder');
            if(allInputCorrect()){
                $('#J_nextStep').removeAttr("disabled");
            }
            returnValue = true;
            callback && callback(false);
        }
        return returnValue;
    }
//获取验证码
    function loadimage(domCode,dom) {
        $(domCode).val('');
        $(dom).attr('src',dataUrl.GraphCode+'?'+Math.random());
    }
    //检查当前所有输入框的状态
    function allInputCorrect(){
        if($('#J_nameTiperror').hasClass('hidden') && $('#J_numTiperror').hasClass('hidden') && $('#J_pswTiperror').hasClass('hidden') && $('#J_yzmTipError').hasClass('hidden')){
            return true;
        }
        return false;
    }
//    注册提交
    function submitInput() {
        if($('#J_stepNumError').hasClass('hidden') && $('#J_stepYzmError').hasClass('hidden') && $('#J_verifyCode').val()!='' && $('#J_userNum').val()!=''){
            return true;
        }
    }
//睁眼闭眼
    function twinkle(){
        if(!eyeStatus){
            //to open eye
            $('#userPsw').attr('type', '');
            $('#J_pswEye').removeClass('eye-close');
        }else{
            //to close eye
            $('#userPsw').attr('type', 'password');
            $('#J_pswEye').addClass('eye-close');
        }
        eyeStatus = !eyeStatus;
    }
    //步骤一：验证图片验证码
    function checkCode(callback) {
        var returnValue = true;
        var verifyCodeValue = $.validateTrim($('#verifyCode').val());
        if (verifyCodeValue != '' && verifyCodeValue != null) {
            $.xxdAjax({
                url:dataUrl.isVerify+'?del=false&kaptchaCode='+verifyCodeValue,
                type: 'get',
                clientId: 'XXD_FRONT_END',
                data : {},
                dataType : "json",
                callbacks:function(result){
                    if(result.code=="200000"){
                        if(result.data.code==0){
                            $('#J_yzmTipError').addClass('hidden');
                            $('#J_yzmTipRight').removeClass('hidden');

                            $('#verifyCode').removeClass('blueborder');
                            $('#verifyCode').removeClass('redborder');
                            if(allInputCorrect()){
                                $('#J_nextStep').removeAttr("disabled");
                            }
                            returnValue = true;
                            callback && callback(true);
                        }else{
                            $('#verifyCode').removeClass('blueborder');
                            $('#verifyCode').addClass('redborder');
                            $('#J_yzmTipError').removeClass("hidden");
                            $('#J_yzmTipRight').addClass('hidden');
                            $('#J_yzmTipError span').html(result.data.message);
                            $('#J_nextStep').attr("disabled","disabled");
                            returnValue = false;
                            callback && callback(false);
                        }

                    }
                },
                error: function () {
                    float.alert({content:"请检查你的网络~"});
                    disabledNextStepButton();
                    returnValue = false;
                    callback && callback(false);
                }

            });
        } else {
            $('#J_yzmTipError').addClass('hidden');
            $('#J_yzmTipRight').addClass('hidden');
            $('#verifyCode').removeClass('blueborder');
            if(allInputCorrect()){
                $('#J_nextStep').removeAttr("disabled");
            }
            returnValue = true;
            callback && callback(true);
        }
        return returnValue;
    }

    //同意注册按钮，点击事件
    $('#J_agreeRegister').click(function(){
        //短信验证码为空
        var smsCode = $.validateTrim($('#J_yyVerifyCode').val());
        var phoneNumber = $.validateTrim($('#J_userNum').val());
        if(phoneNumber!=''){
            checkPhoneNumberInStep2(function(result){
                if(result===true){
                    if(smsCode == "" || smsCode == null){
                        dialogTips.open('请输入短信验证码');
                        return;
                    }else{
                        //disabled同意注册按钮
                        disabledRegisterButton();
                        $('#J_agreeRegister').html('正在注册...');
                        //注册
                        var enterpriseName=$.validateTrim($('#userName').val());
                        var password = $.validateTrim($('#userPsw').val());
                        var md5pwd=$.md5($.md5(password));
                        var uuid= $('#uuid').val();
                        var referer = $("#referer").val();//访问来源
                        var register = $('#register').val();
                        var regFrom = $('#regFrom').val();
                        var regsource = 1;//用户来源1：网站注册,2：手机客户端注册,3：合作商户注册,4：合作商户导入,5：微信注册,6：移动网页注册
                        var submitData={"data":{"enterpriseName":enterpriseName,"phone":phoneNumber,"password":md5pwd,"messageCode":smsCode}};
                        $.xxdAjax({
                            url: dataUrl.regLogin,
                            type: 'POST',
                            clientId: 'XXD_FRONT_END',
                            data:JSON.stringify(submitData),
                            dataType : "json",
                            callbacks: function (result) {
                                if(result.code=='200000'){
                                    var allData;
                                    if(result.data.code==0){
                                        allData=result.data;
                                        SetCookie('Token',allData.data);
                                        //注册ga布码step3
                                        // ga('set', 'dimension1', '注册用户');
                                        $.ajax({
                                            type    : 'GET',
                                            url     : '/user/loginFrontByToken.html',
                                            beforeSend: function(request) {
                                                request.setRequestHeader("token",allData.data);
                                            },
                                            data    : {},
                                            contentType:'application/json;charset=UTF-8',
                                            dataType: 'json',
                                            success : function (res) {
                                                if(res.code == 0){
                                                    window.location.href = "authentication.html";
                                                }else{
                                                    enableRegisterButton();
                                                    $('#J_agreeRegister').html('同意注册');
                                                    //提交的时候清除定时器
                                                    setReSendHtml('J_StepSend');
                                                    clearInterval(interval);
                                                    time = default_count_time;
                                                    $('#J_verifyPart,#J_getVoiceYzm').removeClass('disnone');
                                                }
                                            },
                                            error:function () {
                                                alert('请检查您的网络~');
                                                enableRegisterButton();
                                                $('#J_agreeRegister').html('同意注册');
                                                //提交的时候清除定时器
                                                setReSendHtml('J_StepSend');
                                                clearInterval(interval);
                                                time = default_count_time;
                                                $('#J_verifyPart,#J_getVoiceYzm').removeClass('disnone');
                                                return false;
                                            }
                                        });
                                    }else{
                                        dialogTips.open(result.data.message);
                                        enableRegisterButton();
                                        $('#J_agreeRegister').html('同意注册');
                                        //提交的时候清除定时器
                                        setReSendHtml('J_StepSend');
                                        clearInterval(interval);
                                        time = default_count_time;
                                        $('#J_verifyPart,#J_getVoiceYzm').removeClass('disnone');

                                    }
                                }
                            },
                            error: function () {
                                dialogTips.open(msg.errorMsg);
                                enableRegisterButton();
                                $('#J_agreeRegister').html('同意注册');
                                //提交的时候清除定时器
                                setReSendHtml('J_StepSend');
                                clearInterval(interval);
                                time = default_count_time;
                                $('#J_verifyPart,#J_getVoiceYzm').removeClass('disnone');
                            }
                        });
                    }
                }
            });
        }else{
            $("#J_stepNumError").removeClass('hidden');
            $("#J_stepNumRight").addClass('hidden');
            $('#J_stepUserNum').addClass('redborder');
            $('#J_stepUserNum').removeClass('blueborder');
            $("#J_stepNumError span").html("手机号不能为空");
            //提交的时候清除定时器
            $('#J_StepSend').html("发送验证码到手机");
            $('#J_StepSend').removeAttr("disabled", "disabled");
            $('#J_sendSuccessTips').addClass('hidden');
            clearInterval(interval);
            time = default_count_time;
            $('#J_verifyPart,#J_getVoiceYzm').removeClass('disnone');
        }
    });

    //步骤二：手机格式验证
    function checkPhoneNumberInStep2(callback){
        var phoneNumber =  $.validateTrim($('#J_userNum').val()), result = $.validateMobile(phoneNumber);
        //手机号为空
        if(phoneNumber != '' && phoneNumber != null){
            //手机号格式不正确
            if(result != 'true'){
                $('#J_stepUserNum').addClass('redborder');
                $('#J_stepUserNum').removeClass('blueborder');
                $("#J_stepNumRight").addClass('hidden');
                $("#J_stepNumError").removeClass('hidden');
                $("#J_stepNumError span").html('手机号格式不正确');
                $('#J_StepSend').attr("disabled","disabled");
                $('#J_StepSend').addClass("message_yzm");
                callback && callback(false);
                return false;
            }else{
                //接口验证
                $.xxdAjax({
                    url : dataUrl.checkMobileNum,
                    clientId:'XXD_FRONT_END',
                    data : {
                        username : phoneNumber
                    },
                    type : "get",
                    dataType : "json",
                    callbacks:function (result) {
                        if(result.code=='200000'){
                            if(result.data.code==0){
                                $("#J_stepNumError").addClass('hidden');
                                $("#J_stepNumRight").removeClass('hidden');
                                $('#J_stepUserNum').removeClass('redborder');
                                $('#J_stepUserNum').removeClass('blueborder');
                                if(submitInput()){
                                    $('#J_StepSend').removeAttr("disabled");
                                    $('#J_StepSend').removeClass("message_yzm");
                                }
                                callback && callback(true);
                            }else{
                                $("#J_stepNumError").removeClass('hidden');
                                $("#J_stepNumRight").addClass('hidden');
                                $('#J_stepUserNum').removeClass('blueborder');
                                $('#J_stepUserNum').addClass('redborder');
                                $("#J_stepNumError span").html(result.data.message);
                                $('#J_StepSend').attr("disabled","disabled");
                                $('#J_StepSend').addClass("message_yzm");
                                callback && callback(false);
                                return false;
                            }
                        }
                    },
                    error:function(){
                        float.alert({content:"请检查你的网络~"});
                        $('#J_StepSend').attr("disabled","disabled");
                        $('#J_StepSend').addClass("message_yzm");
                        callback && callback(false);
                        return false;
                    }

                });
            }
        }else{
            $('#J_stepUserNum').removeClass('redborder');
            $('#J_stepUserNum').removeClass('blueborder');
            $("#J_stepNumError").addClass('hidden');
            $("#J_stepNumRight").addClass('hidden');
            if(submitInput()){
                $('#J_StepSend').removeAttr("disabled");
                $('#J_StepSend').removeClass("message_yzm");
            }
            callback && callback(false);
            return false;
        }
    }
    //步骤二：验证图片验证码
    function checkCodeInStep2(callback) {
        var returnValue = false;
        var verifyCodeValue = $.validateTrim($('#J_verifyCode').val());
        if (verifyCodeValue != '' && verifyCodeValue != null) {
            $.xxdAjax({
                url: dataUrl.isVerify + '?del=false&kaptchaCode=' + verifyCodeValue,
                type: 'get',
                clientId: 'XXD_FRONT_END',
                data: {},
                dataType: "json",
                callbacks:function(result){
                    if(result.code=="200000"){
                        if(result.data.code==0){
                            $('#J_stepYzmError').addClass('hidden');
                            $('#J_stepYzmRight').removeClass('hidden');
                            $('#J_verifyCode').removeClass('blueborder');
                            $('#J_verifyCode').removeClass('redborder');
                            returnValue = true;
                            if(submitInput()){
                                $('#J_StepSend').removeAttr("disabled");
                                $('#J_StepSend').removeClass("message_yzm");
                            }
                            callback && callback(true);
                        }else{
                            $('#J_verifyCode').removeClass('blueborder');
                            $('#J_verifyCode').addClass('redborder');
                            $('#J_stepYzmRight').addClass("hidden");
                            $('#J_stepYzmError').removeClass('hidden');
                            $('#J_stepYzmError span').html(result.data.message);
                            $('#J_StepSend').attr("disabled","disabled");
                            $('#J_StepSend').addClass("message_yzm");
                            returnValue = false;
                            callback && callback(false);
                            return false;
                        }
                    }
                },
                error: function () {
                    float.alert({content:"请检查你的网络~"});
                    disabledNextStepButton();
                    returnValue = false;
                    callback && callback(false);
                    return false;
                }
            });

        } else {
            $('#J_verifyCode').removeClass('blueborder');
            $('#J_verifyCode').removeClass('redborder');
            $('#J_stepYzmRight').addClass("hidden");
            $('#J_stepYzmError').addClass('hidden');
            if(submitInput()){
                $('#J_StepSend').attr("disabled","disabled");
                $('#J_StepSend').addClass("message_yzm");
            }
            callback && callback(false);
            return false;
        }
        return returnValue;
    }
    //点击获取短信/语音验证码
    function sendSmsInStep2(type){
        //图片验证码为空
        var verifyCode =$.validateTrim($("#J_verifyCode").val());
        var phoneNumber =$.validateTrim($('#J_userNum').val());

        checkPhoneNumberInStep2(function (result) {
            if(result==true && phoneNumber!=''){
                checkCodeInStep2(function (result) {
                    if(result==true && verifyCode!=''){
                        if(type == 0){
                            //发送短信验证码
                            sendSMSInStep(verifyCode, phoneNumber);
                        }else{
                            //发送语音验证码
                            sendVoiceSMSInStep(verifyCode, phoneNumber);
                        }
                    }else{
                        $('#J_verifyCode').removeClass('blueborder');
                        $('#J_verifyCode').addClass('redborder');
                        $('#J_stepYzmRight').addClass("hidden");
                        $('#J_stepYzmError').removeClass('hidden');
                        $('#J_stepYzmError span').html('图形验证码不能为空');
                        $('#J_StepSend').attr("disabled","disabled");
                        $('#J_StepSend').addClass("message_yzm");
                        $('#J_getVoiceYzm').removeClass('voice-send');
                        return;
                    }
                })
            }else{
                $("#J_stepNumError").removeClass('hidden');
                $("#J_stepNumRight").addClass('hidden');
                $('#J_stepUserNum').removeClass('redborder');
                $('#J_stepUserNum').addClass('blueborder');
                $("#J_stepNumError span").html("手机号不能为空");
                $('#J_StepSend').attr("disabled","disabled");
                $('#J_StepSend').addClass("message_yzm");
                $('#J_getVoiceYzm').removeClass('voice-send');
            }
        });
    }
    //步骤二：发送短信验证码
    function sendSMSInStep(vcode, phonenumber){
        var messageData={"data":{"phone":phonenumber,"smsTemplateCode":"MOBILE_REGISTER_CODE","kaptchaCode":vcode}};
        $.xxdAjax({
            contentType:"application/json",
            url: dataUrl.sendSMSUrl,
            type: 'POST',
            clientId: 'XXD_FRONT_END',
            data: JSON.stringify(messageData),
            dataType : "json",
            callbacks: function (result) {
                if(result.code=='200000'){
                    if(result.data.code==0){
                        $('#J_yyVerifyCode').val("").focus();
                        sendSMSSucc();
                        $('#J_sendSuccessTips').removeClass('hidden');

                    }else{
                        sendSMSError(result.data.message + ' 您可以尝试获取语音验证码。');
                        $('#J_verifyPart,#J_getVoiceYzm').removeClass('disnone');
                        clearVCodeInStep2(true);
                        $('#J_sendSuccessTips').addClass('hidden');
                    }
                }
            },
            error: function () {
                sendSMSError('您可以尝试获取语音验证码。');
                $('#J_verifyPart,#J_getVoiceYzm').removeClass('disnone');
                clearVCodeInStep2(true);
                $('#J_sendSuccessTips').addClass('hidden');
            }
        });
    }

    //步骤二：发送语音验证码
    function sendVoiceSMSInStep(vcode, phonenumber){
        var messageData={"data":{"phone":phonenumber,"busiCode":$("#BUSICODE_REGISTER").val(),"kaptchaCode":vcode}};
        $.xxdAjax({
            url: dataUrl.voiceSMSUrl,
            type: 'POST',
            clientId: 'XXD_FRONT_END',
            data: JSON.stringify(messageData),
            dataType : "json",
            callbacks: function (result) {
                if(result.code=='200000'){
                    if(result.data.code==0){
                        sendVoiceSMSSucc(result.data.message);
                        $('#J_sendSuccessTips').removeClass('hidden');
                    }else{
                        $('#J_sendSuccessTips').addClass('hidden');
                        sendVoiceSMSError(result.data.message);
                        clearVCodeInStep2(true);
                        $('#J_getVoiceYzm').removeClass('voice-send');
                    }
                }
            },
            error: function () {
                $('#J_sendSuccessTips').addClass('hidden');
                sendVoiceSMSError(msg.errorMsg);
                clearVCodeInStep2(true);
                $('#J_getVoiceYzm').removeClass('voice-send');
            }
        });

    }

    //步骤二：发送短信验证码成功函数
    function sendSMSSucc(){
        disabledSendSMSButton();
        beginCountZero('J_StepSend',0);
    }

    //步骤二：发送短信验证码失败函数
    function sendSMSError(msg){
        disabledSendSMSButton();
        dialogTips.open(msg);
    }

    //步骤二：发送语音验证码成功函数
    function sendVoiceSMSSucc(){
        // showAlert("成功", msg);
        disabledSendSMSButton();

        beginCountZero('J_StepSend',1);
    }

    //步骤二：发送语音验证码失败函数
    function sendVoiceSMSError(msg){
        disabledSendSMSButton();
        dialogTips.open(msg);
    }
    //步骤二 清除图形验证码
    function clearVCodeInStep2(needFocus){
        loadimage('#J_verifyCode','#J_verifyUrl');
        $('#J_stepYzmRight').addClass("hidden");
        if(needFocus){
            $('#J_verifyCode').val("").focus();
        }else{
            $('#J_verifyCode').val("");
        }
    }
    function disabledSendSMSButton() {
        $('#J_StepSend').attr("disabled", "disabled");
        $('#J_StepSend').addClass("message_yzm");
    }

    //开始步骤二倒计时
    function beginCountZero(id,type){
        clearInterval(interval);
        time=default_count_time;
        interval = setInterval(function(){countOper(id,type)}, 1000);
    }
    //倒计时操作
    function countOper(id,type) {
        time = time - 1;
        if (time < 0) {
            setReSendHtml(id);
            //清除定时器
            clearInterval(interval);
            time = default_count_time;
            $('#J_verifyPart,#J_getVoiceYzm').removeClass('disnone');
            if(type==1){
                $('#J_getVoiceYzm').removeClass('voice-send');
            }
        } else {
            $('#'+id).html("" + time + "秒后可重新获取");
        }
    }

    //步骤二置为重新发送&并显示验证码
    function setReSendHtml(id){
        $('#'+id).html("发送验证码到手机");
        $('#'+id).removeAttr("disabled", "disabled");
        showImageVCode();
        $('#J_sendSuccessTips').addClass('hidden');
    }
    //显示图片验证码
    function showImageVCode(){
        loadimage('#J_verifyCode','#J_verifyUrl');
        $('#J_verifyCode').val("");
        $('#J_stepYzmRight').addClass("hidden");
    }
    function disabledNextStepButton(){
        $("#J_nextStep").attr("disabled", "disabled");
    }
    function enableNextStepButton(){
        $("#J_nextStep").removeAttr("disabled", "disabled");
    }
    function disabledRegisterButton(){
        $('#J_agreeRegister').attr("disabled", "disabled");
    }
    function enableRegisterButton(){
        $('#J_agreeRegister').removeAttr("disabled", "disabled");
    }

    //设置cookie
    function SetCookie (name, value) {
        var exp = new Date(),domain='.'+location.host.split('.').splice(1,3).join('.');
        exp.setTime(exp.getTime() + (1*24*60*60*1000));
        window.document.cookie = name + "=" + escape (value) + "; expires=" + exp.toGMTString()+";path=/;domain="+domain;
    }
},function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});