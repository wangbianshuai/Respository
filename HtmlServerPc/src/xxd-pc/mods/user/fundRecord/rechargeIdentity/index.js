require(['base', "trackBase", 'store', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, track, store, jui, header, footer, dialog){
    header.init();
    footer.init();
    $('#errorTip1').fadeOut(0);
    var timer = new Date();
    var myTime = timer.getTime();
    var ran = '?' + Math.random();
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
        window.location.href = '/user/delSessionAndForwardToLogin.html';
        return false;
    }else{
        if(fakeToken.substring(0,1) == '\"'){
            fakeToken = fakeToken.substr(1,fakeToken.length - 2);
        }
    }
    
    $('body').append('<form action="" id="newForm1" name="newForm1" method="post" target="_blank"></form>');
    $('#newForm1').append('<input type="text" id="auto_compen_amt" name="auto_compen_amt" />');
    $('#newForm1').append('<input type="text" id="auto_compen_term" name="auto_compen_term" />');
    $('#newForm1').append('<input type="text" id="auto_fee_amt" name="auto_fee_amt" />');
    $('#newForm1').append('<input type="text" id="auto_fee_term" name="auto_fee_term" />');
    $('#newForm1').append('<input type="text" id="auto_lend_amt" name="auto_lend_amt" />');
    $('#newForm1').append('<input type="text" id="auto_lend_term" name="auto_lend_term" />');
    $('#newForm1').append('<input type="text" id="auto_repay_amt" name="auto_repay_amt" />');
    $('#newForm1').append('<input type="text" id="auto_repay_term" name="auto_repay_term" />');
    $('#newForm1').append('<input type="text" id="back_notify_url" name="back_notify_url" />');
    $('#newForm1').append('<input type="text" id="bank_nm" name="bank_nm" />');
    $('#newForm1').append('<input type="text" id="card_no" name="card_no" />');
    $('#newForm1').append('<input type="text" id="certif_id" name="certif_id" />');
    $('#newForm1').append('<input type="text" id="certif_tp" name="certif_tp" />');
    $('#newForm1').append('<input type="text" id="city_id" name="city_id" />');
    $('#newForm1').append('<input type="text" id="client_tp" name="client_tp" />');
    $('#newForm1').append('<input type="text" id="code" name="code" />');
    $('#newForm1').append('<input type="text" id="cust_nm" name="cust_nm" />');
    $('#newForm1').append('<input type="text" id="email" name="email" />');
    $('#newForm1').append('<input type="text" id="mchnt_cd" name="mchnt_cd" />');
    $('#newForm1').append('<input type="text" id="mchnt_txn_ssn" name="mchnt_txn_ssn" />');
    $('#newForm1').append('<input type="text" id="mobile_no" name="mobile_no" />');
    $('#newForm1').append('<input type="text" id="page_notify_url" name="page_notify_url" />');
    $('#newForm1').append('<input type="text" id="parent_bank_id" name="parent_bank_id" />');
    $('#newForm1').append('<input type="text" id="signature" name="signature" />');
    $('#newForm1').append('<input type="text" id="usr_attr" name="usr_attr" />');
    $('#newForm1').append('<input type="text" id="ver" name="ver" />');
    $('#newForm1').append('<input type="text" id="auth_st" name="auth_st" />');

    $('body').append('<div class="mui-dialog hide" id="userTypebox" style="z-index: 10000;"><div class="mui-dialog-inner  clearfix"><div class="openornot"><a class="c_close" href="#" id="type3">×</a><div class="m-con-hd">修改身份</div><div class="m-con-bd"><div class="filed-user">  <p>您可以通过下列按钮进行身份选择</p> </div> <div class="filed-user">  <p class="clearfix"><a class="btn_left left c_confirm" id="type1">出借人</a><a class="btn btn_right right c_close" id="type2">借款人</a></p> </div></div></div></div><span class="after"></span></div>')

    $('#type1').click(function(){
        $('#showIdKind').val('1');
        $('#userTypenew').html('出借人');
        $('#userTypebox').addClass('hide');
    });
    $('#type2').click(function(){
        $('#showIdKind').val('2');
        $('#userTypenew').html('借款人');
        $('#userTypebox').addClass('hide');
    });
    $('#type3').click(function(){
        $('#userTypebox').addClass('hide');
    });
    $('#showIdKindclick').click(function(){
        $('#userTypebox').removeClass('hide');
    });

    /* 判断是否实名认证 */
    var mobileNo = '';//手机号
    function realName(){
        $.ajax({
            url:'/userCenter/user/appro/realname',
            type:'get',
            async:false,
            cache:false,
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
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
                        window.location.href = '/user/delSessionAndForwardToLogin.html';
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
                        if(data.data.code == -1){                       
                            $.ajax({
                                url:'/userCenter/user/appro/realnameStatus',
                                type:'get',
                                async:false,
                                cache:false,
                                beforeSend:function(request){
                                    request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
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
                                            window.location.href = '/user/delSessionAndForwardToLogin.html';
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
                                            if(data.data.code == -1){

                                            }else{
                                                alert(data.data.message);
                                                return false;
                                            }
                                        }else{
                                            if(data.data.data.status == 0){
                                                dialog({
                                                    id: "",
                                                    content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                                    "<div class='m-con-bd'>" +
                                                    "<div class='filed-user'>  " +
                                                    "<p>实名认证正在人工审核中，您可在完善个人资料页面查看审核进度</p> </div> " +
                                                    "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>立即查看</a></p> </div>" +
                                                    "</div>"
                                                    + "</div>",
                                                    cancel:function (clo) {
                                                        window.location.href = '/personal/info.html';
                                                    },
                                                    confirm:function () {
                                                        window.location.href = '/personal/info.html';
                                                    }
                                                });
                                            }else{
                                                
                                            }
                                        }
                                    }
                                },
                                error:function(){
                                    alert('网络异常，请重试！');
                                    return false;
                                }
                            });  
                        }else{
                            alert(data.data.message);
                            return false;
                        }
                    }else{
                        if(data.data.data.status == 0){
                            dialog({
                                id: "",
                                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                "<div class='m-con-bd'>" +
                                "<div class='filed-user'>  " +
                                "<p>实名认证正在人工审核中，您可在完善个人资料页面查看审核进度</p> </div> " +
                                "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>立即查看</a></p> </div>" +
                                "</div>"
                                + "</div>",
                                cancel:function (clo) {
                                    window.location.href = '/personal/info.html';
                                },
                                confirm:function () {
                                    window.location.href = '/personal/info.html';
                                }
                            });
                        }else{
                            $("#step1").addClass("disnone");
                            $(".stepsecond").addClass("step-current");
                            $("#step2").removeClass("disnone"); 
                            $('#showRealname').val(data.data.data.realname);
                            $('#showIdcode').val(data.data.data.idcardnumbername);
                            $('#showMobile').val(mobileNo);
                        }
                    }    
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    }

    //判断是否手机认证
    function realMobile(){
        $.ajax({
            url:'/userCenter/user/appro/queryMobileApproInfoByToken',
            type:'get',
            async:false,
            cache:false,
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
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
                        window.location.href = '/user/delSessionAndForwardToLogin.html';
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
                        if(data.data.code == -1){
                            
                        }else{
                            alert(data.data.message);
                            return false;
                        }
                        realName();
                    }else{
                        mobileNo = data.data.data.mobileno;
                        realName();
                    }
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    }

    function accountCheck(){
        $.ajax({
            url:'/userCenter/user/userInfoByToken',
            type:'get',
            async:false,
            cache:false,
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
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
                        window.location.href = '/user/delSessionAndForwardToLogin.html';
                        return false;
                    }else if(data.code == '100500' || data.code == '100600' || data.code == '100700' || data.code == '100900'){
                        alert(data.message);
                        return false;
                    }else{
                        alert(data.message);
                        return false;
                    }
                }else{
                    if(data.data.data.userAttr == 1){
                        $('#showIdKind').val('1');
                        $('#userTypenew').html('出借人');
                    }else if(data.data.data.userAttr == 2){
                        $('#showIdKind').val('2');
                        $('#userTypenew').html('借款人');
                    }
                    if(data.data.data.isopenaccount != 1){
                        realMobile();
                    }else{
                        dialog({
                            id: "",
                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                            "<div class='m-con-bd'>" +
                            "<div class='filed-user'>  " +
                            "<p style='text-align:center;'>您已经开通存管账户，无法重复操作</p> </div> " +
                            "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>我知道了</a></p> </div>" +
                            "</div>"
                            + "</div>",
                            cancel:function (clo) {
                                window.location.href = '/usercenter/accountInfo.html';
                            },
                            confirm:function () {
                                window.location.href = '/usercenter/accountInfo.html';
                            }
                        });
                    }
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    }

    accountCheck();

    /* 输入框验证 */
    $('#realName').on('focus',function(){
        $('#errorTip1').fadeOut(0);
    });
    $('#idCode').on('focus',function(){
        $('#errorTip1').fadeOut(0);
    });

    var reg = /^(?!.*[%\'\"?])/g;
    /* 实名认证-认证信息 */
    $("#btn-step1").on("click",function(){
        if(reg.test($('#realName').val()) === false){
            $('#errorTip1').fadeIn(0);
            $('#errorTip1').html('真实姓名包含非法字符');
            return false;
        }
        if(reg.test($('#idCode').val()) === false){
            $('#errorTip1').fadeIn(0);
            $('#errorTip1').html('证件号码包含非法字符');
            return false;
        }else{
            timer = new Date();
            myTime = timer.getTime();
            $.ajax({
                url:'/userCenter/user/appro/autoRealname',
                type:'post',
                async:false,
                cache:false,
                headers:{'Content-Type':'application/json'},
                data:'{"data":{"realName":"' + $('#realName').val() + '","idCardNumber":"' + $('#idCode').val() + '","cardType":"1"}}',
                beforeSend:function(request){
                    request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
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
                            window.location.href = '/user/delSessionAndForwardToLogin.html';
                            return false;
                        }else if(data.code == '100500' || data.code == '100600' || data.code == '100700' || data.code == '100900'){
                            alert(data.message);
                            return false;
                        }else{
                            alert(data.message);
                            return false;
                        }
                    }else{
                        if(data.data.code < 0){
                            if(data.data.code == -11){
                                $('#errorTip1').fadeOut(0);
                                dialog({
                                    id: "",
                                    content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                    "<div class='m-con-bd'>" +
                                    "<div class='filed-user'>  " +
                                    "<p>" + data.data.message +  "</p> </div> " +
                                    "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>立即认证</a><a class='btn btn_right right c_close' >暂不认证</a></p> </div>" +
                                    "</div>"
                                    + "</div>",
                                    cancel:function (clo) {
                                        clo.close();
                                    },
                                    confirm:function () {
                                        window.location.href = '/personal/info.html';
                                    }
                                });
                            }else{
                                $('#errorTip1').fadeIn(0).html(data.data.message);
                            }
                            
                            return false;
                        }else{
                            realName();
                        }
                    }
                },
                error:function(){
                    alert('网络异常，请重试！');
                    return false;
                }
            });
        }
    });

    /* 认证信息-华润开户 */
    var huarunData;
    var huarunUrl;
    $("#btn-step2").on("click",function(){
        timer = new Date();
        myTime = timer.getTime();
        $.ajax({
            url:'/userCenter/user/userInfoByToken',
            type:'get',
            async:false,
            cache:false,
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
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
                        window.location.href = '/user/delSessionAndForwardToLogin.html';
                        return false;
                    }else if(data.code == '100500' || data.code == '100600' || data.code == '100700' || data.code == '100900'){
                        alert(data.message);
                        return false;
                    }else{
                        alert(data.message);
                        return false;
                    }
                }else{
                    if(data.data.data.isopenaccount != 1){
                        if($('#showIdKind').val() == null || $('#showIdKind').val() == undefined || $('#showIdKind').val() == ''){
                            $('#showIdKind').val(1);
                        }
                        $.ajax({
                            url:'/userCenter/user/capitalAccount/openFuiouOpenAccountPage/staticHtml',
                            type:'post',
                            async:false,
                            cache:false,
                            headers:{'Content-Type':'application/json'},
                            data:'{"data":{"user_attr":"' + $("#showIdKind").val() + '"}}',
                            beforeSend:function(request){
                                request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
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
                                        window.location.href = '/user/delSessionAndForwardToLogin.html';
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
                                        if(data.data.code == -3){
                                            dialog({
                                                id: "",
                                                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                                "<div class='m-con-bd'>" +
                                                "<div class='filed-user'>  " +
                                                "<p style='text-align:center;'>您还没有认证您的手机号码</p> </div> " +
                                                "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>立即认证</a><a class='btn btn_right right c_close' >暂不认证</a></p> </div>" +
                                                "</div>"
                                                + "</div>",
                                                cancel:function (clo) {
                                                    clo.close();
                                                },
                                                confirm:function () {
                                                    window.location.href = '/personal/info.html';
                                                }
                                            });
                                        }else if(data.data.code == -4){
                                             dialog({
                                                id: "",
                                                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                                "<div class='m-con-bd'>" +
                                                "<div class='filed-user'>  " +
                                                "<p style='text-align:center;'>您还没有进行实名认证</p> </div> " +
                                                "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>立即认证</a><a class='btn btn_right right c_close' >暂不认证</a></p> </div>" +
                                                "</div>"
                                                + "</div>",
                                                cancel:function (clo) {
                                                    clo.close();
                                                },
                                                confirm:function () {
                                                    window.location.href = '/personal/info.html';
                                                }
                                            });
                                        }else{
                                            alert(data.data.message);
                                            return false;
                                        }
                                    }else{
                                        huarunData = data.data.data.fuiouParams;
                                        huarunUrl = data.data.data.fuiou_open_capital_account_page_url;
                                        $('#newForm1').attr('action',huarunUrl);
                                        $('#auto_compen_amt').val(huarunData.auto_compen_amt);
                                        $('#auto_compen_term').val(huarunData.auto_compen_term);
                                        $('#auto_fee_amt').val(huarunData.auto_fee_amt);
                                        $('#auto_fee_term').val(huarunData.auto_fee_term);
                                        $('#auto_lend_amt').val(huarunData.auto_lend_amt);
                                        $('#auto_lend_term').val(huarunData.auto_lend_term);
                                        $('#auto_repay_amt').val(huarunData.auto_repay_amt);
                                        $('#auto_repay_term').val(huarunData.auto_repay_term);
                                        $('#back_notify_url').val(huarunData.back_notify_url);
                                        $('#bank_nm').val(huarunData.bank_nm);
                                        $('#card_no').val(huarunData.card_no);
                                        $('#certif_id').val(huarunData.certif_id);
                                        $('#certif_tp').val(huarunData.certif_tp);
                                        $('#city_id').val(huarunData.city_id);
                                        $('#client_tp').val(huarunData.client_tp);
                                        $('#code').val(huarunData.code);
                                        $('#cust_nm').val(huarunData.cust_nm);
                                        $('#email').val(huarunData.email);
                                        $('#mchnt_cd').val(huarunData.mchnt_cd);
                                        $('#mchnt_txn_ssn').val(huarunData.mchnt_txn_ssn);
                                        $('#mobile_no').val(huarunData.mobile_no);
                                        $('#page_notify_url').val(huarunData.page_notify_url);
                                        $('#parent_bank_id').val(huarunData.parent_bank_id);
                                        $('#signature').val(huarunData.signature);
                                        $('#usr_attr').val(huarunData.usr_attr);
                                        $('#ver').val(huarunData.ver);
                                        $('#auth_st').val(huarunData.auth_st);
                                        $('#newForm1').submit();
                                        dialog({
                                            id: "",
                                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                            "<div class='m-con-bd'>" +
                                            "<div class='filed-user'>  " +
                                            "<p>开户完成前请不要关闭此窗口，完成操作后请根据您的情况点击下面的按钮</p> </div> " +
                                            "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>已完成开户</a><a class='btn btn_right right c_close' >暂不开户</a></p> </div>" +
                                            "</div>"
                                            + "</div>",
                                            cancel:function (clo) {
                                                clo.close();
                                            },
                                            confirm:function (dir) {
                                                timer = new Date();
                                                myTime = timer.getTime();
                                                $.ajax({
                                                    url:'/userCenter/user/userInfoByToken',
                                                    type:'get',
                                                    async:false,
                                                    cache:false,
                                                    beforeSend:function(request){
                                                        request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
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
                                                                window.location.href = '/user/delSessionAndForwardToLogin.html';
                                                                return false;
                                                            }else if(data.code == '100500' || data.code == '100600' || data.code == '100700' || data.code == '100900'){
                                                                alert(data.message);
                                                                return false;
                                                            }else{
                                                                alert(data.message);
                                                                return false;
                                                            }
                                                        }else{
                                                            if(data.data.data.isopenaccount != 1){
                                                                dir.close();
                                                                dialog({
                                                                    id: "",
                                                                    content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                                                    "<div class='m-con-bd'>" +
                                                                    "<div class='filed-user'>  " +
                                                                    "<p style='text-align:center;'>开户失败，请重新尝试！</p> </div> " +
                                                                    "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>确认</a></p> </div>" +
                                                                    "</div>"
                                                                    + "</div>",
                                                                    cancel:function (clo) {
                                                                        clo.close();
                                                                    },
                                                                    confirm:function () {
                                                                        window.location.href = '/personal/info.html';
                                                                    }
                                                                });
                                                                return false;
                                                            }else{
                                                                window.location.href = '/usercenter/accountInfo.html';
                                                            }
                                                        }
                                                    },
                                                    error:function(){
                                                        alert('网络异常，请重试！');
                                                        return false;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
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
                            "<p style='text-align:center;'>您已经开通存管账户，无法重复操作</p> </div> " +
                            "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>我知道了</a></p> </div>" +
                            "</div>"
                            + "</div>",
                            cancel:function (clo) {
                                window.location.href = '/usercenter/accountInfo.html';
                            },
                            confirm:function () {
                                window.location.href = '/usercenter/accountInfo.html';
                            }
                        });
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