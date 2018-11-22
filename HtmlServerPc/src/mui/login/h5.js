define(['base','dialog','loginTpl','trackBase','juicer'],function($ , dialog ,loginTpl , track, jui) {
    var userToken = window["userToken"]||$.readCookie("userToken") , isLogin = false;
    var baseUrl = "";//"http://www.xinxindai.com",_host = null;
    // if ((_host=location.host)!="www.xinxindai.com"&&_host!="m.xinxindai.com") {
    //     baseUrl = "http://test.xxd.com";
    // }
    var formToken = "";
    $(document).delegate("#J_loginImgCode","click" , function () {
        _imgCode($(this) , formToken);
    });

    function _imgCode($me,formToken) {
        $me.attr("src" , "/feapi/randCode/createVerifyCode?formtoken="+formToken+"&s="+new Date().getTime());
    }
    $.ajax({
        url:'/feapi/dmp/userinfo.html ',
        contentType: "application/json",
        dataType:"json",
        data: {
            userToken:userToken
        },
        type:"get",
        success:function (res){
            if (res && (status=res.status) && status.code==200) {
                track.init(res);
                isLogin = true;
            } else {
                track.init();
            }
        },
        error:function (data){
            $.log (data);
            track.init();
        }
    });

    var loginDialog;
    return {
        show:function (data){
            if (isLogin) return;
            var data = data||{};
            formToken = data.token;
            var template = juicer.to_html(loginTpl, {});
            callback = data.callback;
            var me = this;
            if (loginDialog) {
                $(".mui-login-msg").addClass("hide").html("");
                loginDialog.show();
                _imgCode($("#J_loginImgCode") , formToken);
                return;
            }

            loginDialog = dialog({
                content:template,
                id:"J_muiLogin",
                isMove:data.isMove||"",
                customClass:'mui-dialog-login-custom',
                confirm:function (art){
                    var param = {};
                    param.username = $("#J_username").val()||"",
                        param.password = $("#J_password").val()||"",
                        param.imgcode = $("#J_imgCode").val()||"",
                        param.formtoken = formToken;
                    var errormsg = "";
                    if (!param.username) errormsg = "请填写用户名";
                    else if (!param.password) errormsg = "请填写密码";
                    else if (!param.imgcode) errormsg = "请填写验证码";
                    if(!errormsg) {
                        $.ajax({
                            url:baseUrl+"/feapi/users/login",
                            dataType: 'json',
                            //contentType: "application/json",
                            // jsonp:'jsonpCallback',
                            //data: param,
                            data: param,//$.toJSON (param),
                            type:"POST",
                            success:function (res){
                                var code = res.code;
                                var data , user;
                                if (code==200000 && (data = res.data) && (user = data.user)){
                                    isLogin = true;
                                    track.init(user);
                                    // XXD_TRACK._trackEvent({
                                    //     category: "webapp_partner_reg",
                                    //     action: "login_success_webapp",
                                    //     label: "登录成功",
                                    //     value: res.data.user.userId,
                                    //     custval: (window.location.href).split('?')[0]
                                    // });
                                    ga('send', 'event', '登录', "登录成功", window.location.href);

                                    window["userToken"] = data["userToken"];
                                    if (callback) callback(data);
                                    //$.createCookie("userToken" , data["userToken"] , 1 );

                                    art.close();
                                } else {
                                    $(".mui-login-msg").removeClass("hide").html(res.info);
                                }
                            },
                            error:function (data) {
                                $.log (data);
                            }
                        });
                    } else {
                        //error tip
                        $(".mui-login-msg").removeClass("hide").html(errormsg);
                    }
                }
            });
            _imgCode($("#J_loginImgCode") , formToken);
            if (!window["dialogMap"]) {
                window["dialogMap"] = $.Map();
            }
            window["dialogMap"].put("loginDialog" , loginDialog);

            $("#J_muiLoginToMuiRegister").on("click" , function (ev){
                "use strict";
                var dialogMap = window["dialogMap"];
                var registerDialog = dialogMap.get("registerDialog");
                loginDialog.close();
                if (registerDialog) {
                    if (registerDialog) registerDialog.show();
                    _imgCode($("#J_registerImgCode") , formToken);
                } else {
                    var register;
                    if ((register=data.register)) register.show(data);
                }
                ev && event.preventDefault();
            });
        }
    };
});