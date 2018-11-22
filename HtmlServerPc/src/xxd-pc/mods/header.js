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

        var $dropdownArrow = $(".j_investDropdown a");
        //增加判断当前用户类型
        var token = $.readCookie('Token');
        var isPurchased;
        if(token){
            $.xxdAjax({
                url: '/investmentAPI/home/investStatus',
                clientId: 'XXD_FRONT_END',
                type: 'post',
                data: {},
                token:token,
                callbacks: function (data) {
                    if(data.code == "200000"){
                        isPurchased = data.data;
                    }else{
                        isPurchased = false;
                    }
                },
                error:function () {
                    isPurchased = false;
                }
            });
        }
        var $dropdownArrow2 = $(".j_informationDropdown a");
        $(".j_investDropdown").on("mouseover" , function (){
            tip.init({
                self:this,
                formatCallback:function (data){
                    var contentArray = [];
                    if(!isPurchased){
                        contentArray.push("<ul class='invest-dropdown'>");
                        contentArray.push("<li class='hot'><a href='/detail/thirtytender.html'>新元宝（新手专享）</a><i></i></li>");
                    }else{
                        contentArray.push("<ul class='invest-dropdown'>");
                    }
                    contentArray.push("<li><a href='/detail/monthgold.html'>月进斗金</a></li>");
                    contentArray.push("<li><a href='/xplan/search/list.html'>新元宝</a></li>");
                    // contentArray.push("<li><a href='/promotion/yyp.html'>月月派</a></li>");
                    contentArray.push("<li><a href='/borrow/search/list.html'>散标直投</a></li>");
                    contentArray.push("<li><a href='/detail/consumptionList.html'>新宜贷</a></li>");
                    contentArray.push("<li><a href='/traderequest/tradeRequestMoreSearch.html'>债权转让</a></li></ul>");
                    return contentArray.join("");
                },
                hideCall:function (){
                    $dropdownArrow.removeClass("dropdown-hover");
                },
                showCall:function (){
                    $dropdownArrow.addClass("dropdown-hover");
                }
            });
        });

        /*$(".j_informationDropdown").on("mouseover" , function (){
            tip.init({
                self:this,
                formatCallback:function (data){
                    var tpl = "<ul class='invest-dropdown'>" +
                        "<li><a href='/html/help/safesecurity.html'>安全保障</a><i></i></li>" +
                        "<li><a href='/html/help/datadisclose.html'>平台数据</a></li>" +
                        "<li><a href='/html/help/runreports.html'>运营报告</a></li>" +
                        "<li><a href='/html/help/qualihonor.html'>荣誉资质</a></li>" +
                        "<li><a href='/html/help/compprofile.html'>关于我们</a></li>" +
                        "</ul>";
                    return tpl;
                },
                hideCall:function (){
                    $dropdownArrow2.removeClass("dropdown-hover");
                },
                showCall:function (){
                    $dropdownArrow2.addClass("dropdown-hover");
                }
            });
        });*/

        $(document).delegate(".j_userDropdown" , "mouseover" , function (){
            tip.init({
                self:this,
                formatCallback:function (data){
                    var tpl = "<ul class='user-dropdown'>" +
                        "<li><a href='/usercenter/accountInfo.html'>我的新新贷</a></li>" +
                        /*"<li><a href='ownerOrder/ownerOrderList/1.html'>我的商城</a></li>" +*/
                        "<li><a href='/usercenter/recharge.html'>账户充值</a></li>" +
                        "<li><a href='/account/message.html'>站内信</a></li></li>" +
                        "<li><a href='/user/logout.html'>退出登录</a></li>" +
                        "</ul>";
                    return tpl;
                }
            });
        });

        //企业注册
        function isLogin(callback){
            $.xxdAjax({
                url: '/userCenter/user/beInLogging',
                clientId: 'XXD_FRONT_END',
                type: 'GET',
                data: {},
                token:token,
                callbacks: function (result) {
                    if(result.code == "200000"){
                        callback && callback(true);
                    }else{
                        callback && callback(false);
                    }
                },
                error:function () {
                    callback && callback(false);
                    alert('网络异常，请重试！');
                    return false;
                }
            });
        }
        function companyType(callback) {
            $.xxdAjax({
                url: '/userCenter/user/userInfoByToken',
                clientId: 'XXD_FRONT_END',
                type: 'GET',
                data: {},
                token:token,
                callbacks: function (result) {
                    if(result.code == "200000"){
                        var dataList;
                        if(result.data.code==0 && (dataList=result.data.data)){
                            callback && callback(dataList.usertype);
                        }
                    }
                },
                error:function () {
                    alert('网络异常，请重试！');
                    return false;
                }
            });
        }
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
        $(document).on('click','#J_borrowMoney',function () {
            isLogin(function (data) {
                if(data===true){
                    companyType(function (result) {
                        if(result=="2"){
                            dialog({
                                id:"J_dialogBorrow",
                                content:"<div class='dialog-borrow' id='J_dialogTips'>" +
                                "<div class='content-tips'><i class='close c_close'></i><h4>提示</h4>" +
                                "<p>请重新申请企业用户</p>" +
                                "<div class='go-to'>"+
                                "<button class='c_confirm' id='J_companyCenter'>前往注册</button></div></div>",
                                confirm:function (){
                                    //前往开户
                                    clearCookie('Token');
                                    loginOut(function (data) {
                                        if(data==true){
                                            window.location.href='/usercenter/company/register.html';
                                        }
                                    });
                                },
                                cancel:function (art) {
                                    art.close();
                                }
                            });
                        }else{
                            window.location.href="/borrowApply/toBorrowPage.html";
                        }

                    });
                }else{
                    window.location.href="/borrowApply/toBorrowPage.html";
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
        //存管弹框
        /*var token = $.readCookie("__dialogState");
         if (!token) { //11月20日放开
         var _dialogState = dialog({
         content:"<div class='state-wrap'><div class='state-bg c_confirm'></div>" +
         "<a target='_blank' class='state-img'></a>" +
         "<a target='_blank' class='state-btn'></a>" +
         "<i class='c_close'></i></div>",
         id:"J_dialogState",
         confirm:function (art){
         $.createCookie("__dialogState" ,"1",7);
         art.close();
         },
         cancel:function (art) {
         art.close();
         $.createCookie("__dialogState" ,"1",7);
         }
         });
         setTimeout(function (){
         if (_dialogState) _dialogState.close();
         } , 1000*60*10);
         }
         $('.state-img,.state-btn').click(function () {
         $.createCookie("__dialogState" ,"1",7);
         window.open("/html/storagepage/index.html","_blank");
         });*/
    }
    return {
        init:init
    };
});