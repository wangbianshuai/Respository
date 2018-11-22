/**
 * Created by gaoshanshan_syp on 20/03/2018.
 */
define(['base','tip',"dialog"],function($ ,tip ,dialog) {
    function init (){
        $("#J_productType").on ({
            "mouseover":function (){
                var $this = $(this);
                $this.addClass("menu-active");
            },
            "mouseout":function (){
                var $this = $(this);
                $this.removeClass("menu-active");
            }
        });
        //底部二维码显示
        $(document).delegate(".j_qrCodeTip" , "mouseover" , function (){
            tip.init({
                self:this,
                formatCallback:function (data){
                    return "<div class='qr-code-img'><img src='"+data+"' height='100' width='100'  /></div>";
                }
            });
        });
        $(document).delegate(".j_weiboTip" , "mouseover" , function (){
            tip.init({
                self:this,
                formatCallback:function (data){
                    return "<div class='qr-code-img'><img src='"+data+"' height='100' width='100'  /></div>";
                }
            });
        });
        //头部手机二维码
        $(document).delegate(".j_qrCodeTip.phone" , "mouseover" , function (){
            tip.init({
                self:this,
                formatCallback:function (data){
                    return "<div class='qr-code-img header-code-img'><img src='"+data+"' height='100' width='100'/><span>手机APP下载</span></div>";
                }
            });
        });
        //头部微信点击
        $(document).delegate(".j_qrCodeTip.wechat" , "mouseover" , function (){
            tip.init({
                self:this,
                formatCallback:function (data){
                    return "<div class='qr-code-img header-code-img'><img src='"+data+"' height='100' width='100'/><span>微信服务号</span></div>";
                }
            });
        });
        //  安全退出
        $('#J_safeLogout').on('click',function(){
            loginOut(function (data) {
                if(data==true){
                    window.location.href='/usercenter/company/login.html';
                    clearCookie('Token');
                }
            });
        });
        //清除cookie
        function clearCookie(name) {
            SetCookie(name, "", -1);
        }
        function SetCookie (name, value,eday) {
            var exp = new Date(),domain='.'+location.host.split('.').splice(1,3).join('.');
            exp.setTime(exp.getTime() + (eday*24*60*60*1000));
            window.document.cookie = name + "=" + escape (value) + "; expires=" + exp.toGMTString()+";path=/;domain="+domain;
        }
        // 退出个人账户登录
        function loginOut(callback) {
            $.ajax({
                type    : 'GET',
                url     : '/user/logoutJson.html',
                data    : {},
                contentType:'application/json;charset=UTF-8',
                dataType: 'json',
                success : function (result) {
                    if(result.code == 0){
                        callback && callback(true);
                    }
                },
                error:function () {
                    alert('网络异常，请重试！');
                    return false;
                }
            });
        }
    }
    return {
        init:init
    };
});