define(['base','dialog','registerTpl','trackBase','juicer'],function($ , dialog ,registerTpl ,track, jui) {
    var registerDialog;
    $(document).delegate("#J_sendMobileCode" , "touchend" , function (){
        var $me = $(this);
        if ($me.hasClass("disable")) {
            return;
        }
        var username = $("#J_rUsername").val()||"";
        var imgCode = $("#J_rImgCode").val()||"";
        if ($.isDevicePhone())
        $.ajax({
            url:'/feapi/users/checkMobile',
            //contentType: "application/json",
            dataType:"json",
            data: {
                mobile:username,
                formtoken:formToken
            },
            type:"post",
            success:function (res){
                if (res && res.code==1){
                    $.ajax({
                        url:'/feapi/users/sendSMS',
                        //contentType: "application/json",
                        dataType:"json",
                        data: {
                            mobile:username,
                            imgcode:imgCode,
                            formtoken:formToken
                        },
                        type:"post",
                        success:function (res){
                            if (res && res.code==200000){
                                $.log ("手机短信已经发送!");
                                var time = 60;
                                $me.addClass("disable");
                                function _fn (){
                                    if (time == 0) {
                                        $me.removeClass("disable");
                                        $me.html("发送验证码");
                                    } else {
                                        $me.html(time+"S");
                                        setTimeout(function (){
                                            _fn();
                                        } , 1000);
                                        time--;
                                    }
                                }
                                _fn();
                            } else {
                                $(".mui-register-msg").removeClass("hide").html(res.info);
                            }
                        },
                        error:function (data){
                            $.log (data);
                        }
                    });
                    $(".mui-register-msg").addClass("hide");

                }else if(res.code==0){
                    $(".mui-register-msg").removeClass("hide").html(res.info);
                }
            },
            error:function (data){
                $.log (data);
            }
        });

    });


    $(document).delegate("#J_rImgCode","keyup" , function (){
        var $me = $(this);
        var len = $me.val().length;
        var $code = $("#J_sendMobileCode");
        if (len==4) {
            $code.removeClass("disable");
        } else {
            $code.addClass("disable");
        }
    });


    var formToken = "";
    $(document).delegate("#J_registerImgCode","click" , function () {
        _imgCode($(this) , formToken);
    });
    // function checkPwd() {
    //     var password = $("#J_rPassword").val();
    //     if (password == '') {
    //         $(".mui-register-msg").removeClass("hide").html("请输入密码");
    //         return false;
    //     }
    //     if (validatePassword(password) != 'true') {
    //         $(".mui-register-msg").removeClass("hide").html("有效密码为6-16位数字字母组合");
    //         return false;
    //     }
    //     $(".mui-register-msg").addClass("hide");
    //     return true;
    // }
    // function validatePassword(arg) {
    //     var patter = /^([a-zA-Z0-9])*$/;
    //     var patter1 = /^([a-zA-Z])*$/;
    //     var patter2 = /^([0-9])*$/;
    //     if (arg.length < 6)
    //         return '密码太短，不足6位';
    //     if (arg.length > 16)
    //         return '密码长度不得超过16位';
    //     if (!patter.test(arg) || (patter1.test(arg) || patter2.test(arg)))
    //         return '密码需由字母和数字组成';
    //
    //     return 'true';
    // }
    function _imgCode($me,formToken) {
        $me.attr("src" , "/feapi/randCode/createVerifyCode?formtoken="+formToken+"&s="+new Date().getTime());
    }

    return {
        show:function (data){
            var data = data||{};
            formToken = data.token;
            var template = juicer.to_html(registerTpl, {});
            callback = data.callback;
            var me = this;
            if (registerDialog) {
                $(".mui-register-msg").addClass("hide").html("");
                registerDialog.show();
                //$("#J_registerImgCode").trigger("click");
                _imgCode($("#J_registerImgCode") , formToken);
                return;
            }
            registerDialog = dialog({
                content:template,
                id:"J_muiRegister",
                isMove:data.isMove||"",
                customClass:'mui-dialog-register-custom',
                confirm:function (art){
                    var param = {};
                    param.formtoken = formToken;
                    param.mobile = $("#J_rUsername").val()||"";
                    param.password = $("#J_rPassword").val()||"";
                    param.smscode = $("#J_smsCode").val()||"";
                    param.imgcode = $("#J_rImgCode").val()||"";
                    var errormsg = "";
                    if (!param.mobile) errormsg = "请填写用户名";
                    else if (!param.password) errormsg = "请填写密码";
                    else if (!param.imgcode) errormsg = "请填写图片验证码";
                    else if (!param.smscode) errormsg = "请填写手机验证码";
                    if (!errormsg) {
                        $.ajax({
                            url:'/feapi/users/regV3',
                            //contentType: "application/json",
                            dataType:"json",
                            //data: param,
                            data: param , //$.toJSON (param),
                            type:"post",
                            success:function (res){
                                var code = res.code;
                                var data , user;
                                if (code==200000 && (data = res.data) && (user = data.user)){
                                    isLogin = true;
                                    track.init(user);
                                    // XXD_TRACK._trackEvent({
                                    //     category: "webapp_partner_reg",
                                    //     action: "reg_success_webapp",
                                    //     label: "注册成功",
                                    //     value: res.data.user.userId,
                                    //     custval: (window.location.href).split('?')[0]
                                    // });
                                    ga('send', 'event',"注册", "注册成功", window.location.href);
                                    window["userToken"] = data["userToken"];
                                    if (callback) callback(data);
                                    art.close();
                                } else {
                                    $(".mui-register-msg").removeClass("hide").html(res.info);
                                }
                            },
                            error:function (data){
                                $.log (data);
                            }
                        });
                    } else {
                        $(".mui-register-msg").removeClass("hide").html(errormsg);
                    }
                }
            });
            _imgCode($("#J_registerImgCode") , formToken);
            if (!window["dialogMap"]) {
                window["dialogMap"] = $.Map();
            }
            window["dialogMap"].put("registerDialog" , registerDialog);

            $("#J_muiRegisterToMuiLogin").on("click" , function (ev){
                "use strict";
                var dialogMap = window["dialogMap"];
                var loginDialog = dialogMap.get("loginDialog");
                registerDialog.close();
                if (loginDialog) {
                    if (loginDialog) loginDialog.show();
                    _imgCode($("#J_loginImgCode") , formToken);
                } else {
                    var login;
                    if ((login=data.login))login.show(data);
                }
                ev && event.preventDefault();
            });
        }
    };
});