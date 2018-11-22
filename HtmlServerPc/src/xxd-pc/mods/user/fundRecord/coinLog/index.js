require(['base', 'paging', "trackBase", 'store', 'side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, paging, track, store, side, jui, header, footer, dialog) {

    header.init();
    footer.init();

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

    var global = window["GLOBAL_STATIC_DATA"],
        messageCode;  //短信验证码

    side.tabs({
        tabsObject: $("#J_tabs"),//tab 栏
    });
    //左侧菜单
    side.leftMenu(0);
    side.verification();

    var type = [
        {"status": "0", "value": "全部"},
        {"status": "1", "value": "获得"},
        {"status": "2", "value": "兑换"}
    ];
    var limit = [
        {"status": "0", "value": "全部"},
        {"status": "1", "value": "1个月"},
        {"status": "2", "value": "2个月"},
        {"status": "3", "value": "3个月"},
        {"status": "6", "value": "6个月"},
        {"status": "12", "value": "12个月"},
        {"status": "13", "value": "12个月以上"}
    ];
    var token = store && store.get("token") || {};
    var tradeType = [
        {"tradeType": "1", "value": "plus"},
        {"tradeType": "2", "value": "minus"}
    ];
    var db={
        xxdCoin:function (o) {
            $.xxdAjax({
                url:"/investmentAPI/prize/xxdCoin",
                clientId:"XXD_FRONT_END",
                type: 'get',
                token: token,
                callbacks:function(result){
                    var total;
                    if(result.data && (total=result.data)){
                        o && o.cb(total);
                    }
                },
                error: function () {
                    side.thisDialog('网络异常，请刷新重试');
                }


            });
        },
        overview:function (o) {
            $.xxdAjax({
                url:"/investmentAPI/asset/overview",
                clientId:"XXD_FRONT_END",
                type: 'get',
                token: token,
                callbacks:function(result){
                    var total;
                    if(result.data && (total=result.data)){
                        o && o.cb(total);
                    }
                },
                error: function () {
                    side.thisDialog('网络异常，请刷新重试');
                }

            })
        }
    };
    var showData={
        showXxdCoin:function () {
            db.xxdCoin({
                cb:function (data) {
                    var amount;
                    if(data.num){
                        $('#J_totalAmount,#J_totalAmount1').html(data.num);
                    }
                    if(data.amount){
                        amount=(data.amount).toFixed(2);
                        $('#J_convertMoney,#J_convertMoney1').html(amount);
                    }
                }
            });
        },
        showOverview:function () {
            db.overview({
                cb:function (data) {
                    var user;
                    if(data.availableBalance){
                        user=(data.availableBalance).toFixed(2);
                        $('#J_userMoney').html(user);
                    }
                }
            })
        }
    };
    //动态数据改变
    function dataChange() {
        showData.showOverview();
        showData.showXxdCoin();
    }
    //新新币明细
    function rechargeTable(tableData) {
        var title = "<tr class='title'><th class='one'>时间</th><th class='two'>交易类型</th>"
            + "<th class='three'>新新币数量</th><th class='four'>记录备注</th></tr>"
        var contentArray = [];
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            var classType;
            $.each(tradeType, function (i, v) {
                if (row.tradeType == v.tradeType) {
                    classType = v.value;
                }
            });
            contentArray.push("<tr>");
            contentArray.push("<td>" + $.fnDateToString(row.tradeTime, 'yyyy-MM-dd HH:mm:ss') + "</td>");
            contentArray.push("<td>" + row.name + "</td>");
            if (classType == 'minus') {
                contentArray.push("<td class='" + classType + "'>-" + row.tradeNum + "</td>");
            } else {
                contentArray.push("<td class='" + classType + "'>+" + row.tradeNum + "</td>");
            }
            contentArray.push("<td>" + row.tradeExplain + "</td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };
    function getTable(object) {
        //记录
        var rechargeMatchRecord = store && store.get("rechargeMatchRecord") || {};
        var $rechargeMatchRecord = object.rechargeObject;
        var b = 0;

        function _rechargeAjax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $rechargeMatchRecord.html(rechargeTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.rechargePadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        type: object.type,
                        limit: object.limit,
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                    },
                    token: token,
                    callback: function (data) {
                        b++;
                        var tableData = data.items;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $rechargeMatchRecord.html(rechargeTable(tableData));
                        rechargeMatchRecord['total'] = data.totalCount;
                        rechargeMatchRecord['pageSize'] = data.pageSize;
                        rechargeMatchRecord['pageIndex'] = data.pageNum;
                        if (b == 1) {
                            paging(rechargeMatchRecord);
                        }
                        if (rechargeMatchRecord.total == 0) {
                            $rechargeMatchRecord.append("<tr class='no-record'><td colspan='4'>暂无新新币交易记录！</td>  </tr>");
                        }
                        side.getLeftHeight();
                    },
                    error: function () {
                        $rechargeMatchRecord.append("<tr class='no-record'><td colspan='4'>暂无新新币交易记录！</td> </tr>");
                    }
                });
            }
        }

        if (true || !$.isEmptyObject(rechargeMatchRecord)) {
            $.extend(rechargeMatchRecord, {
                $dom: object.rechargePagination,
                callback: function (pagingObj) {
                    _rechargeAjax(pagingObj);
                }
            });
            _rechargeAjax(rechargeMatchRecord);
        }

    }

    var map = {
        rechargeObject: $("#rechargeTable"),
        type: type[0].status,
        limit: limit[0].status,
        rechargePadingUrl: '/investmentAPI/prize/xxdCoins',
        rechargePagination: $(".rechargeRecord-page")
    };
    getTable(map);

    //条件筛选
    var typeIndex = 0, limitIndex = 0;
    $.each($('.J_timeimit a'), function (i, v) {
        $(v).click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            limitIndex = i || 0;
            $('#rechargeTable,.pagination').html('');
            getTable({
                rechargeObject: $("#rechargeTable"),
                type: type[typeIndex].status,
                limit: limit[i].status,
                rechargePadingUrl: '/investmentAPI/prize/xxdCoins',
                rechargePagination: $(".rechargeRecord-page")
            });
        });
    });
    $.each($('.J_dealType a'), function (i, v) {
        $(v).click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            typeIndex = i || 0;
            $('#rechargeTable,.pagination').html('');
            getTable({
                rechargeObject: $("#rechargeTable"),
                type: type[i].status,
                limit: limit[limitIndex].status,
                rechargePadingUrl: '/investmentAPI/prize/xxdCoins',
                rechargePagination: $(".rechargeRecord-page")
            });
        });
    });

    //判断当前用户是否开过户
    var isopenaccount ;
    accountCheck();
    function accountCheck(){
        $.xxdAjax({
            url: '/userCenter/user/userInfoByToken',
            type: 'get',
            clientId: 'XXD_INTEGRATION_PLATFORM',
            token:token,
            data:{},
            callbacks: function (data) {
                isopenaccount = data.data.data.isopenaccount;
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
                            window.location.href = 'openAccount.html';
                        }
                    });
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }



    //计算新新币兑换人民币
    $('.J_xxCoinNumber').blur(function () {
        var value = $('.J_xxCoinNumber').val();
        value = (value / 50).toFixed(2);
        $('.J_discounting').html(value);
    });

    //新新币兑换
    $('#conversion').click(function () {
        if(isopenaccount != 1){
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
            return;
        }
        if ($('.J_xxCoinNumber').val() == '') {
            thisDialog('请输入兑换新新币个数！');
            return;
        }
        getXXCoin();
    });
    function getXXCoin() {
        $.xxdAjax({
            url: '/accountCenter/user/exchangeXXDCoinWithoutPicVerifyCodeWithoutPayPwdValidate',
            type: 'post',
            clientId: 'XXD_FRONT_END',
            data: JSON.stringify({
                "data": {
                    "xxCoinNumber": $('.J_xxCoinNumber').val()
                }
            }),
            token: token,
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data.code == 0) {
                        dialog({
                            content: "<div class='dimension operate-tip'>"
                            + "<i class='c_close close_x'>×</i>"
                            + "<h5>提示</h5>"
                            + "<div class='tip-content'>"
                            + "<p>兑换成功</p>"
                            + "<p><i class='J_countDown'>3</i>秒后自动关闭</p>"
                            + "<a href='#' class='btn c_close'>兑换成功</a>"
                            + "</div>"
                            + "</div>",
                            id: "",
                            confirm: function (art) {

                            },
                            cancel: function (art) {
                                $('.J_xxCoinNumber').val('');
                                getTable(map);
                                dataChange();
                                art.remove();
                                window.clearTimeout(timer);
                                $('#J_tabs li').removeClass('active').eq(1).addClass('active');
                                $('.j_tabContent').addClass('hide').eq(1).removeClass('hide');
                            }
                        });
                        var a = 3;
                        var timer = setInterval(function () {
                            a--;
                            $('.J_countDown').html(a);
                            if (a == 0) {
                                //关闭弹框
                                $('.J_xxCoinNumber').val('');
                                getTable(map);
                                dataChange();
                                $('.mui-dialog').remove();
                                window.clearTimeout(timer);
                                $('#J_tabs li').removeClass('active').eq(1).addClass('active');
                                $('.j_tabContent').addClass('hide').eq(1).removeClass('hide');

                            }
                        }, 1000);
                    } else {
                        side.thisDialog(data.data.message);
                    }
                } else {
                    side.thisDialog(data.message);
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }

    //单独的弹框关闭，需要获取焦点
    function thisDialog(content) {
        dialog({
            content: "<div class='dimension operate-tip'>"
            + "<i class='c_close close_x'>×</i>"
            + "<h5>提示</h5>"
            + "<div class='tip-content'>"
            + "<p>" + content + "</p>"
            + "<a href='#' class='btn c_close'>确认</a>"
            + "</div>"
            + "</div>",
            id: "",
            confirm: function (art) {
                $('.J_xxCoinNumber')[0].focus();
            },
            cancel: function (art) {
                art.remove();
                $('.J_xxCoinNumber')[0].focus();
            }
        });
    }
    /*
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
                                    window.location.href = 'openAccount.html';
                                }
                            });
                            return false;
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
    */


}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});
