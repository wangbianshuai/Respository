require(['base', "trackBase", 'store', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, track, store, jui, header, footer, dialog) {
    header.init();
    footer.init();
    var clocks = setInterval(function(){
        if(parseInt($('.g-left').height()) < parseInt($('.g-right').height())){
            $('.g-left').css('min-height',$('.g-right').height() + 'px');
        }else{
            clearInterval(clocks);
        }
    },100);
    $('#noCard').css('display','none');
    $('#hasCard').css('display','none');
    $('#J_changeCardBtn').css('display','none');
    $('.g-right .m-con-wrap .bundled li .mark span.bklogo-js').css('background-image','none');
    $.each($('.menu ul li'),function(){
        $(this).find('div').css('display','none');
    });
    $('.menu ul li').eq(3).addClass('showTab');
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
        window.location.href = '/user/delSessionAndForwardToLogin.html';
        return false;
    }else{
        if(fakeToken.substring(0,1) == '\"'){
            fakeToken = fakeToken.substr(1,fakeToken.length - 2);
        }
    }

    var domain,version=window.version,proTocol=window.location.protocol;
    if(document.domain == 'stage.xxd.com'){
        domain = proTocol+'//stage-static.xxd.com/pc/'+version+'/build/img/';
    }else if(document.domain == 'dev.xxd.com'){
        domain = proTocol+'//dev-static.xxd.com/pc/'+version+'/build/img/';
    }else if(document.domain == 'uat.xxd.com'){
        domain = proTocol+'//uat-static.xxd.com/pc/'+version+'/build/img/';
    }else if(document.domain == 'www.xinxindai.com'){
        domain = proTocol+'//static.xinxindai.com/pc/'+version+'/build/img/';
    }else if(document.domain == 'test.xxd.com'){
        domain = proTocol+'//test-static.xinxindai.com/pc/'+version+'/build/img/';
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

    //判断三码用户
    function userType(){
        $.ajax({
            url:'/userCenter/user/queryUserInfoForCg',
            type:'post',
            async:false,
            cache:false,
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
                request.setRequestHeader('clientTime',myTime);
                request.setRequestHeader('token',fakeToken);
            },
            success:function(data){
                if(data.data.data.accountType == 0){
                    if(data.data.data.cardStatus == 1){
                        dialog({
                            id: "",
                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                            "<div class='m-con-bd'>" +
                            "<div class='filed-user'>  " +
                            "<p>绑定的银行卡已失效，请先解绑银行卡后重新绑定银行卡</p> </div> " +
                            "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>确认</a></p> </div>" +
                            "</div>"
                            + "</div>",
                            cancel:function (clo) {
                                clo.close();
                            },
                            confirm:function (clo) {
                                clo.close();
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
    //查询银行卡信息
    function cardCheck(){
        $.ajax({
            url:'/userCenter/user/bank/userBandedBankOutSideUse',
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
                        if(data.data.code == -99){
                            $('#noCard').css('display','block');
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
                        }else{
                            alert(data.data.message);
                            return false;
                        }
                    }else{
                        userType();
                        $('#hasCard').css('display','block');
                        $('#J_changeCardBtn').css('display','block');
                        $.each(bankList,function(index,item){
                            if(item.bankCode == data.data.data.bankcode){
                                if(item.imgUrl == '' || item.imgUrl == undefined || item.imgUrl == null){
                                    $('.g-right .m-con-wrap .bundled li .mark span.bklogo-js').html(item.bankName);
                                }else{
                                    $('.g-right .m-con-wrap .bundled li .mark span.bklogo-js').css('background-image','url(' + item.imgUrl + ')');
                                }
                            }else{
                                
                            }
                        });
                        $('.cardno').find('span').eq(3).html(data.data.data.bankaccount);
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
                    }
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    }

    /*
    //查询更换信息
    function changeCheck(){
       $.ajax({
            url:'../userCenter/user/bank/userCheckingBankCardInfo',
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
                        alert(data.data.message);
                        return false;
                    }else{
                        if(data.data.data.existCheckingBankCard == 0){
                            $('.changeCardinfo').fadeOut(0);
                            $('.changeCardfix').fadeOut(0);
                        }else{
                            $('.changeCardinfo').fadeIn(0);
                            $('.changeCardfix').fadeIn(0);
                            $('#J_changeCardBtn').html('更换审核中');
                            $('#J_changeCardBtn').addClass('checking');
                            $('#J_changeCardBtn').attr('disabled','disabled');
                            $('#changeCardnumber').val('**** **** **** ' + data.data.data.checkingBankCardInfo.bankaccount.substring(data.data.data.checkingBankCardInfo.bankaccount.length - 4,data.data.data.checkingBankCardInfo.bankaccount.length));
                            $.each(bankList,function(index,item){
                                if(data.data.data.checkingBankCardInfo.bankcode == item.bankCode){
                                    $('#changeCardbank').val(item.bankName)
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
    }
    */
        
    //查询开户信息
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
                    cardCheck();
                    if(data.data.code != 0){
                        alert(data.data.message);
                        return false;
                    }else{
                        if(data.data.data.isopenaccount != 1){
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
                                    window.location.href = '/usercenter/openAccount.html';
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
    }

    accountCheck();

    //绑卡
    function bindCard(){
        $.ajax({
            url:'/userCenter/user/changeCard/openFuiouChangeCardPage/staticPc?source=2',
            type:'post',
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
                        if(data.data.code == -5){
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
                                    window.location.href = '/usercenter/openAccount.html';
                                }
                            });
                        }else{
                            alert(data.data.message);
                            return false;
                        }
                    }else{
                        huarunData = data.data.data.fuiouParams;
                        huarunUrl = data.data.data.fuiou_bind_card_page_url;
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
                        dialog({
                            id: "",
                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                            "<div class='m-con-bd'>" +
                            "<div class='filed-user'>  " +
                            "<p>绑定银行卡完成前请不要关闭此窗口，完成绑定后请根据您的情况点击下面的按钮</p> </div> " +
                            "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>已完成绑定</a><a class='btn btn_right right c_close' >暂不绑定</a></p> </div>" +
                            "</div>"
                            + "</div>",
                            cancel:function (clo) {
                                window.location.reload();
                            },
                            confirm:function () {
                                window.location.reload();
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

    //解绑
    function unbindCard(){
        $.ajax({
            url:'/userCenter/user/changeCard/openFuiouUnbindCard/staticPc?source=2',
            type:'post',
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
                        if(data.data.code == -5){
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
                                    window.location.href = '/usercenter/openAccount.html';
                                }
                            });
                        }else{
                            alert(data.data.message);
                            return false;
                        }
                    }else{
                        huarunData = data.data.data.fuiouParams;
                        huarunUrl = data.data.data.fuiou_unbind_card_page_url;
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
                        dialog({
                            id: "",
                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                            "<div class='m-con-bd'>" +
                            "<div class='filed-user'>  " +
                            "<p>解绑银行卡完成前请不要关闭此窗口，完成解绑后请根据您的状况点击下面按钮</p> </div> " +
                            "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>已完成解绑</a><a class='btn btn_right right c_close' >暂不解绑</a></p> </div>" +
                            "</div>"
                            + "</div>",
                            cancel:function (clo) {
                                window.location.reload();
                            },
                            confirm:function () {
                                window.location.reload();
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

    //绑卡流程
    $("#J_addBankCard").on("click", function () {
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
                    if(data.data.code != 0){
                        alert(data.data.message);
                        return false;
                    }else{
                        if(data.data.data.isopenaccount != 1){
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
                                    window.location.href = '/usercenter/openAccount.html';
                                }
                            });
                        }else{
                            bindCard();
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

    //解绑流程
    $("#J_changeCardBtn").on("click", function () {
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
                    if(data.data.code != 0){
                        alert(data.data.message);
                        return false;
                    }else{
                        if(data.data.data.isopenaccount != 1){
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
                                    window.location.href = '/usercenter/openAccount.html';
                                }
                            });
                        }else{
                            unbindCard();
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