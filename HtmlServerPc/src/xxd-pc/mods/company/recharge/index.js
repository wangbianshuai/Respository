require(['base', "trackBase", 'store', 'juicer'
    , 'companyHeader', 'footer', "dialog", 'backTop', 'json', "requirejs"
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
    function num(obj){
        obj.val(obj.val().replace(/[^\d.]/g,""));
        obj.val(obj.val().replace(/^\./g,""));
        obj.val(obj.val().replace(/\.{2,}/g,"."));
        obj.val(obj.val().replace(".","$#$").replace(/\./g,"").replace("$#$","."));
        obj.val(obj.val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'));
    }
    $('#quickAmount').on('keyup',function(){
        num($(this));
    });
    $('#bankAmount').on('keyup',function(){
        num($(this));
    });
    $('#errorTip1').fadeOut(0);
    $('#errorTip2').fadeOut(0);
    $('.bluetipexc').find('strong').fadeOut(0);
    $.each($('.menu ul li'),function(){
        $(this).find('div').css('display','none');
    });
    $('.menu ul li').eq(0).addClass('showTab');
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

    $('body').append('<form action="" id="newForm1" name="newForm1" method="post" target="_blank"></form>');
    $('#newForm1').append('<input type="text" id="amt" name="amt" />');
    $('#newForm1').append('<input type="text" id="back_notify_url" name="back_notify_url" />');
    $('#newForm1').append('<input type="text" id="client_tp" name="client_tp" />');
    $('#newForm1').append('<input type="text" id="code" name="code" />');
    $('#newForm1').append('<input type="text" id="login_id" name="login_id" />');
    $('#newForm1').append('<input type="text" id="mchnt_cd" name="mchnt_cd" />');
    $('#newForm1').append('<input type="text" id="mchnt_txn_ssn" name="mchnt_txn_ssn" />');
    $('#newForm1').append('<input type="text" id="page_notify_url" name="page_notify_url" />');
    $('#newForm1').append('<input type="text" id="signature" name="signature" />');
    $('#newForm1').append('<input type="text" id="ver" name="ver" />');
    $('body').append('<form action="" id="newForm2" name="newForm2" method="post" target="_blank"></form>');
    $('#newForm2').append('<input type="text" id="amt2" name="amt" />');
    $('#newForm2').append('<input type="text" id="back_notify_url2" name="back_notify_url" />');
    $('#newForm2').append('<input type="text" id="login_id2" name="login_id" />');
    $('#newForm2').append('<input type="text" id="mchnt_cd2" name="mchnt_cd" />');
    $('#newForm2').append('<input type="text" id="mchnt_txn_ssn2" name="mchnt_txn_ssn" />');
    $('#newForm2').append('<input type="text" id="page_notify_url2" name="page_notify_url" />');
    $('#newForm2').append('<input type="text" id="signature2" name="signature" />');

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

    /*tab栏切换*/
    var allBtn = ['quick-btn', 'banking-btn', 'offline-btn'];
    var allRecharge = ['quick-recharge', 'banking-recharge', 'offline-recharge'];
    var allInfo = ['quick-info', 'banking-info', 'offline-info'];
    $('.quick-btn,.banking-btn,.offline-btn').on('click', function (e) {
        $('.m-con-hd a').removeClass('active');
        $('.recharge-list').hide();
        $('.warmth-warn').hide();
        for (var i = 0; i < allBtn.length; i++) {
            if (allBtn[i] == e.target.className) {
                $(e.target).addClass('active');
                $('.' + allRecharge[i]).fadeIn(0);
                $('.' + allInfo[i]).fadeIn(0);
            }
        }
    });

    /*显示提示*/
    $('.bluetipexc').hover(function(){
        $(this).find('strong').fadeIn(0);
    },function(){
        $(this).find('strong').fadeOut(0);
    });

    //判断三码用户
    var userFlag = 0;
    var eventStatus = false;

    function userType(o) {
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
                        userFlag = 1;
                        dialog({
                            id: "",
                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                            "<div class='m-con-bd'>" +
                            "<div class='filed-user'>  " +
                            "<p>绑定的银行卡已失效，请先解绑银行卡后重新绑定银行卡</p> </div> " +
                            "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>去解绑银行卡</a><a class='btn btn_right right c_close' >暂不解绑</a></p> </div>" +
                            "</div>"
                            + "</div>",
                            cancel: function (clo) {
                                clo.close();
                            },
                            confirm: function () {
                                window.location.href = '/usercenter/company/bundled.html';
                            }
                        });
                    } else {
                        o && o.cb && o.cb()
                    }
                } else {
                    o && o.cb && o.cb()
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    }

    //绑卡
    $('body').append('<form action="" id="newForm4" name="newForm4" method="post" target="_blank"></form>');
    $('#newForm4').append('<input type="text" id="back_notify_url4" name="back_notify_url" />');
    $('#newForm4').append('<input type="text" id="client_tp4" name="client_tp" />');
    $('#newForm4').append('<input type="text" id="code4" name="code" />');
    $('#newForm4').append('<input type="text" id="login_id4" name="login_id" />');
    $('#newForm4').append('<input type="text" id="mchnt_cd4" name="mchnt_cd" />');
    $('#newForm4').append('<input type="text" id="mchnt_txn_ssn4" name="mchnt_txn_ssn" />');
    $('#newForm4').append('<input type="text" id="page_notify_url4" name="page_notify_url" />');
    $('#newForm4').append('<input type="text" id="signature4" name="signature" />');
    $('#newForm4').append('<input type="text" id="ver4" name="ver" />');
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
                                    window.location.href = '/usercenter/company/';
                                }
                            });
                        }else{
                            alert(data.data.message);
                            return false;
                        }
                    }else{
                        huarunData = data.data.data.fuiouParams;
                        huarunUrl = data.data.data.fuiou_bind_card_page_url;
                        $('#newForm4').attr('action',huarunUrl);
                        $('#back_notify_url4').val(huarunData.back_notify_url);
                        $('#client_tp4').val(huarunData.client_tp);
                        $('#code4').val(huarunData.code);
                        $('#login_id4').val(huarunData.login_id);
                        $('#mchnt_cd4').val(huarunData.mchnt_cd);
                        $('#mchnt_txn_ssn4').val(huarunData.mchnt_txn_ssn);
                        $('#page_notify_url4').val(huarunData.page_notify_url);
                        $('#signature4').val(huarunData.signature);
                        $('#ver4').val(huarunData.ver);
                        $('#newForm4').submit();
                        dialog({
                            id: "",
                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                            "<div class='m-con-bd'>" +
                            "<div class='filed-user'>  " +
                            "<p>绑定银行卡完成前请不要关闭此窗口，完成绑定后请根据您的状况点击下面的按钮</p> </div> " +
                            "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>已完成绑定</a><a class='btn btn_right right c_close' >暂不绑定</a></p> </div>" +
                            "</div>"
                            + "</div>",
                            cancel:function (clo) {
                                clo.close();
                                // window.location.reload();
                                reloadCardCheck();
                            },
                            confirm:function (clo) {
                                clo.close();
                                // window.location.reload();
                                reloadCardCheck();
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

    /**
     * 点击"已完成绑定"，"暂不绑定"弹窗按钮时，
     * 重新获取绑卡状态，如果未绑卡，不再弹出提示绑卡的弹窗
     */
    function reloadCardCheck(){
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
                        // alert(data.data.message);
                        return false;
                    } else {
                        $.each(bankList, function (index, item) {
                            if (item.bankCode == data.data.data.bankcode) {
                                if (item.imgUrl == '' || item.imgUrl == undefined || item.imgUrl == null) {
                                    $('.defaullogos').html(item.bankName + '(' + data.data.data.bankaccount + ')');
                                }else{
                                    $('.defaullogos').html('<img src="' + item.imgUrl + '">(' + data.data.data.bankaccount + ')');
                                }
                            }else{

                            }
                        });
                        $('.bluetipexc').find('strong').find('label').html('单笔限额' + data.data.data.singleLimit + '元<br/>单日限额' + data.data.data.dailyLimit + '元<br/>单月限额' + data.data.data.monthlyLimit + '元');
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
    function cardCheck(o) {
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
                            $('.defaullogos').html('请选择银行卡');
                            $('.bluetipexc').css('display','none');
                            dialog({
                                id: "",
                                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                "<div class='m-con-bd'>" +
                                "<div class='filed-user'>  " +
                                "<p>您暂未绑定银行卡，请先完成绑卡，再进行充值操作</p> </div> " +
                                "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>绑定银行卡</a><a class='btn btn_right right c_close' >暂不绑定</a></p> </div>" +
                                "</div>"
                                + "</div>",
                                cancel: function (clo) {
                                    clo.close();
                                },
                                confirm: function (clo) {
                                    clo.close();
                                    // window.location.href = '/usercenter/bundled.html';
                                    bindCard();
                                }
                            });
                            return false;
                        }else{
                            alert(data.data.message);
                            return false;
                        }
                    } else {
                        o ? userType(o) : userType();
                        $.each(bankList, function (index, item) {
                            if (item.bankCode == data.data.data.bankcode) {
                                if (item.imgUrl == '' || item.imgUrl == undefined || item.imgUrl == null) {
                                    $('.defaullogos').html(item.bankName + '(' + data.data.data.bankaccount + ')');
                                }else{
                                    $('.defaullogos').html('<img src="' + item.imgUrl + '">(' + data.data.data.bankaccount + ')');
                                }
                            }else{

                            }
                        });
                        $('.bluetipexc').find('strong').find('label').html('单笔限额' + data.data.data.singleLimit + '元<br/>单日限额' + data.data.data.dailyLimit + '元<br/>单月限额' + data.data.data.monthlyLimit + '元');
                    }
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    }

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
                            return false;
                        }else{
                            cardCheck();
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

    /* 输入框验证 */
    $('#quickAmount').on('focus',function(){
        $('#errorTip1').fadeOut(0);
    });
    $('#bankAmount').on('focus',function(){
        $('#errorTip2').fadeOut(0);
    });

    //快速充值
    function quickIncome(){
        $.ajax({
            url:'/accountCenter/account/recharge/doRecharge',
            type:'post',
            async:false,
            cache:false,
            headers:{'Content-Type':'application/json'},
            data:'{"data":{"platformSource":"pc","rechargeAmount":"' + $('#quickAmount').val() + '","rechargeType":"14"}}',
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
                            dialog({
                                id: "",
                                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                "<div class='m-con-bd'>" +
                                "<div class='filed-user'>  " +
                                "<p>您暂未绑定银行卡，请先完成绑卡，再进行充值操作</p> </div> " +
                                "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>绑定银行卡</a><a class='btn btn_right right c_close' >暂不绑定</a></p> </div>" +
                                "</div>"
                                + "</div>",
                                cancel: function (clo) {
                                    clo.close();
                                },
                                confirm: function (clo) {
                                    clo.close();
                                    // window.location.href = '/usercenter/bundled.html';
                                    bindCard();
                                }
                            });
                        }else{
                            $('#errorTip1').fadeIn(0).html(data.data.message);
                        }
                        return false;
                    }else{
                        cardCheck();
                        $('#newForm1').attr('action',data.data.data.requestUrl);
                        $('#amt').val(data.data.data.fuiouParams.amt);
                        $('#back_notify_url').val(data.data.data.fuiouParams.back_notify_url);
                        $('#client_tp').val(data.data.data.fuiouParams.client_tp);
                        $('#code').val(data.data.data.fuiouParams.code);
                        $('#login_id').val(data.data.data.fuiouParams.login_id);
                        $('#mchnt_cd').val(data.data.data.fuiouParams.mchnt_cd);
                        $('#mchnt_txn_ssn').val(data.data.data.fuiouParams.mchnt_txn_ssn);
                        $('#page_notify_url').val(data.data.data.fuiouParams.page_notify_url);
                        $('#signature').val(data.data.data.fuiouParams.signature);
                        $('#ver').val(data.data.data.fuiouParams.ver);
                        $('#newForm1').submit();
                        dialog({
                            id: "",
                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                            "<div class='m-con-bd'>" +
                            "<div class='filed-user'>  " +
                            "<p>充值完成前请不要关闭此窗口，完成操作后根据您的情况点击下面按钮。</p> </div> " +
                            "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>充值完成</a><a class='btn btn_right right c_close' >暂不充值</a></p> </div>" +
                            "</div>"
                            +"</div>",
                            cancel: function (clo) {
                                clo.close();
                            },
                            confirm: function () {
                                window.location.href = '/usercenter/fundRecord/dealDetail.html';
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

    //网银充值
    function bankIncome(){
        $.ajax({
            url:'/accountCenter/account/recharge/doRecharge',
            type:'post',
            async:false,
            cache:false,
            headers:{'Content-Type':'application/json'},
            data:'{"data":{"platformSource":"pc","rechargeAmount":"' + $('#bankAmount').val() + '","rechargeType":"13"}}',
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
                            dialog({
                                id: "",
                                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                "<div class='m-con-bd'>" +
                                "<div class='filed-user'>  " +
                                "<p>您暂未绑定银行卡，请先完成绑卡，再进行充值操作</p> </div> " +
                                "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>绑定银行卡</a><a class='btn btn_right right c_close' >暂不绑定</a></p> </div>" +
                                "</div>"
                                + "</div>",
                                cancel: function (clo) {
                                    clo.close();
                                },
                                confirm: function (clo) {
                                    clo.close();
                                    // window.location.href = '/usercenter/bundled.html';
                                    bindCard();
                                }
                            });
                        }else{
                            $('#errorTip1').fadeIn(0).html(data.data.message);
                        }
                        return false;
                    }else{
                        $('#newForm2').attr('action',data.data.data.requestUrl);
                        $('#amt2').val(data.data.data.amt);
                        $('#back_notify_url2').val(data.data.data.back_notify_url);
                        $('#login_id2').val(data.data.data.login_id);
                        $('#mchnt_cd2').val(data.data.data.mchnt_cd);
                        $('#mchnt_txn_ssn2').val(data.data.data.mchnt_txn_ssn);
                        $('#page_notify_url2').val(data.data.data.page_notify_url);
                        $('#signature2').val(data.data.data.signature);
                        $('#newForm2').submit();
                        dialog({
                            id: "",
                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                            "<div class='m-con-bd'>" +
                            "<div class='filed-user'>  " +
                            "<p>充值完成前请不要关闭此窗口，完成操作后根据您的情况点击下面按钮。</p> </div> " +
                            "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>充值完成</a><a class='btn btn_right right c_close' >暂不充值</a></p> </div>" +
                            "</div>"
                            +"</div>",
                            cancel: function (clo) {
                                clo.close();
                            },
                            confirm: function () {
                                window.location.href = '/usercenter/fundRecord/dealDetail.html';
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

    //快捷充值流程
    $("#quickBtn").on("click", function () {
        if (userFlag == 1) {
            dialog({
                id: "",
                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                "<div class='m-con-bd'>" +
                "<div class='filed-user'>  " +
                "<p>绑定的银行卡已失效，请先解绑银行卡后重新绑定银行卡</p> </div> " +
                "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>去解绑银行卡</a><a class='btn btn_right right c_close' >暂不解绑</a></p> </div>" +
                "</div>"
                + "</div>",
                cancel: function (clo) {
                    clo.close();
                },
                confirm: function () {
                    window.location.href = '/usercenter/bundled.html';
                }
            });
        } else {
            timer = new Date();
            myTime = timer.getTime();
            $('#errorTip1').fadeOut(0);
            $('#errorTip2').fadeOut(0);
            $.ajax({
                url: '/userCenter/user/userInfoByToken',
                type: 'get',
                async: false,
                cache: false,
                beforeSend: function (request) {
                    request.setRequestHeader('clientId', 'XXD_INTEGRATION_PLATFORM');
                    request.setRequestHeader('clientTime', myTime);
                    request.setRequestHeader('token', fakeToken);
                },
                success: function (data) {
                    if (data.code != '200000') {
                        if (data.code == '200403' || data.code == '200406' || data.code == '200407' || data.code == '200408' || data.code == '200600' || data.code == '200601' || data.code == '200602') {
                            alert(data.message);
                            return false;
                        } else if (data.code == '200400') {
                            alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                            return false;
                        } else if (data.code == '200301' || data.code == '200302' || data.code == '200303' || data.code == '200304' || data.code == '200305') {
                            alert('登录状态异常，请重新登录！');
                            window.location.href = '/user/delSessionAndForwardToLogin.html';
                            return false;
                        } else if (data.code == '100500' || data.code == '100600' || data.code == '100700' || data.code == '100900') {
                            alert(data.message);
                            return false;
                        } else {
                            alert(data.message);
                            return false;
                        }
                    } else {
                        if (data.data.code != 0) {
                            if (data.data.code == -99) {
                                dialog({
                                    id: "",
                                    content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                    "<div class='m-con-bd'>" +
                                    "<div class='filed-user'>  " +
                                    "<p>您暂未绑定银行卡，请先完成绑卡，再进行充值操作</p> </div> " +
                                    "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>绑定银行卡</a><a class='btn btn_right right c_close' >暂不绑定</a></p> </div>" +
                                    "</div>"
                                    + "</div>",
                                    cancel: function (clo) {
                                        clo.close();
                                    },
                                    confirm: function (clo) {
                                        clo.close();
                                        // window.location.href = '/usercenter/bundled.html';
                                        bindCard();
                                    }
                                });
                                return false;
                            } else {
                                $('#errorTip2').fadeIn(0).html(data.data.message);
                                return false;
                            }
                        } else {
                            if (data.data.data.isopenaccount != 1) {
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
                            } else {
                                cardCheck({
                                    cb: function () {
                                        quickIncome();
                                    }
                                })
                            }
                        }
                    }
                },
                error: function () {
                    alert('网络异常，请重试！');
                    return false;
                }
            });
        }
    });

    //网银充值流程
    $("#bankBtn").on("click", function () {
        if(userFlag == 1){
            dialog({
                id: "",
                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                "<div class='m-con-bd'>" +
                "<div class='filed-user'>  " +
                "<p>绑定的银行卡已失效，请先解绑银行卡后重新绑定银行卡</p> </div> " +
                "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>去解绑银行卡</a><a class='btn btn_right right c_close' >暂不解绑</a></p> </div>" +
                "</div>"
                + "</div>",
                cancel: function (clo) {
                    clo.close();
                },
                confirm: function () {
                    window.location.href = '/usercenter/bundled.html';
                }
            });
        }else{
            timer = new Date();
            myTime = timer.getTime();
            $('#errorTip1').fadeOut(0);
            $('#errorTip2').fadeOut(0);
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
                                bankIncome();
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
    });
}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});