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

    side.tabs({
        tabsObject: $("#J_tabs"),//tab 栏
    });
    //左侧菜单
    side.leftMenu(0);
    var token = store && store.get("token") || {};

    var sysStatus = [
        {"status": "1", "value": "成功"},
        {"status": "2", "value": "成功"},
        {"status": "3", "value": "失败"}
    ];
    var capitaltype = [
        {"status": "0", "value": "全部"},
        {"status": "1", "value": "投标"},
        {"status": "2", "value": "借款"},
        {"status": "3", "value": "还款"},
        {"status": "4", "value": "充值"},
        {"status": "5", "value": "提现"},
        {"status": "6", "value": "奖励"},
        {"status": "7", "value": "收款"},
        {"status": "8", "value": "冻结"},
        {"status": "9", "value": "其他"}
    ];
    var limit = [
        {"status": "-1", "value": "全部"},
        {"status": "0", "value": "最近一周"},
        {"status": "1", "value": "1个月"},
        {"status": "2", "value": "2个月"},
        {"status": "3", "value": "3个月"},
        {"status": "6", "value": "6个月"},
        {"status": "12", "value": "12个月"},
        {"status": "13", "value": "12个月以上"}
    ];
    var type = [
        {"status": "0", "value": "全部"},
        {"status": "1", "value": "处理中"},
        {"status": "2", "value": "成功"},
        {"status": "3", "value": "失败"}
    ];


    //表格内容
    function capitalTable(tableData) {
        var title = "<tr class='title'><th class='one'>日期&nbsp;&nbsp;|&nbsp;&nbsp;交易流水号</th>"
            + "<th class='two'>类型</th><th class='three'>发生金额(元)</th>"
            + "<th class='four'>可用余额(元)</th><th>备注</th></tr>";
        var contentArray = [];
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            contentArray.push("<tr>");
            contentArray.push("<td><span>" + $.fnDateToString(row.tradingDate, 'yyyy-MM-dd   HH:mm:ss') + "</span><span>" + row.busiId + "</span></td>");
            contentArray.push("<td>" + row.operateType + "</td>");
            contentArray.push("<td>" + row.tradingAmount + "元</td>");
            contentArray.push("<td>" + row.balance + "元</td>");
            contentArray.push("<td>" + row.remark + "</td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };
    function rechargeTable(tableData) {
        var title = "<tr class='title'><th class='one'>充值时间&nbsp;&nbsp;|&nbsp;&nbsp;流水单账号</th>"
            + "<th class='two'>充值方式</th><th class='three'>充值金额(元)</th><th class='four'>支付方式</th>"
            + "<th>充值状态</th></tr>";
        var contentArray = [];
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            contentArray.push("<tr>");
            contentArray.push("<td><span>" + $.fnDateToString(row.addTime, 'yyyy-MM-dd   HH:mm:ss') + "</span><span>" + row.rechargeId + "</span></td>");
            contentArray.push("<td>" + row.bankCode + "</td>");
            contentArray.push("<td>" + row.rechargeAmount + "元</td>");
            contentArray.push("<td>" + row.partnerName + "</td>");
            contentArray.push("<td>" + row.statusRemark + "</td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };
    function withdrawTable(tableData) {
        var title = "<tr class='title'><th class='one'>提现时间&nbsp;&nbsp;|&nbsp;&nbsp;流水单账号</th>"
            + "<th class='two'>提现银行&nbsp;&nbsp;|&nbsp;&nbsp;提现账号</th><th class='three'>提现总额(元)</th>"
            + "<th class='four'>到账金额(元)</th><th class='five'>手续费(元)</th><th>状态</th></tr>";
        var contentArray = [];
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            contentArray.push("<tr>");
            contentArray.push("<td><span>" + $.fnDateToString(row.addTime, 'yyyy-MM-dd   HH:mm:ss') + "</span><span>" + row.cashId + "</span></td>");
            contentArray.push("<td>" + row.bankCode +row.account+ "</td>");
            contentArray.push("<td>" + row.drawmoneyAmount + "元</td>");
            contentArray.push("<td>" + row.drawmoneyRealAmount + "元</td>");
            contentArray.push("<td>" + row.fee + "元</td>");
            contentArray.push("<td>" + row.statusRemark + "</td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };

    function getTable(object) {
        if(object.capitalPadingUrl) {
            //资金记录
            var matchCapitalRecord = store && store.get("matchCapitalRecord") || {};
            var $matchCapitalRecord = object.capitalObject;
            var a = 0;

            function _ajax(pagingObj) {
                var hashPage = pagingObj.hashPage || $.Map();
                var pageIndex = pagingObj.pageIndex || 1;
                var tableData;
                if (tableData = hashPage.get(pageIndex)) {
                    //repeat table
                    $matchCapitalRecord.html(capitalTable(tableData));
                } else {
                    $.xxdAjax({
                        url: object.capitalPadingUrl+'?'+new Date().getTime(),
                        clientId: 'XXD_FRONT_END',
                        type: 'get',
                        data: {
                            type: object.capitaltype,
                            currentPage: pageIndex,
                            pageSize: pagingObj.pageSize || 10,
                            limit: object.limit
                        },
                        token: token,
                        callback: function (data) {
                            a++;
                            var tableData = data.items;
                            hashPage.put(data.pageNum, tableData);
                            paging.pagingObj = pagingObj;
                            $matchCapitalRecord.html(capitalTable(tableData));
                            matchCapitalRecord['total'] = data.totalCount;
                            matchCapitalRecord['pageSize'] = data.pageSize;
                            matchCapitalRecord['pageIndex'] = data.pageNum;
                            if (a == 1) {
                                paging(matchCapitalRecord);
                            }
                            if (matchCapitalRecord.total == 0) {
                                $matchCapitalRecord.append("<tr class='no-record'><td colspan='5'>暂无资金记录！</td> </tr>");
                            }
                        },
                        error: function () {
                            $matchCapitalRecord.append("<tr class='no-record'><td colspan='5'>暂无资金记录！</td> </tr>");
                        }
                    });
                }
            }

            if (true || !$.isEmptyObject(matchCapitalRecord)) {
                $.extend(matchCapitalRecord, {
                    $dom: object.capitalPagination,
                    callback: function (pagingObj) {
                        _ajax(pagingObj);
                    }
                });
                _ajax(matchCapitalRecord);
            }
        }
      if(object.rechargePadingUrl){
        //充值记录
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
                    url: object.rechargePadingUrl+'?'+new Date().getTime(),
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        type: object.type,
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                        limit: object.limit
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
                            $rechargeMatchRecord.append("<tr class='no-record'><td colspan='5'>暂无充值记录！</td>  </tr>");
                        }
                    },
                    error: function () {
                        $rechargeMatchRecord.append("<tr class='no-record'><td colspan='5'>暂无充值记录！</td> </tr>");
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
        if(object.withdrawPadingUrl) {
            //提现记录
            var withdrawMatchRecord = store && store.get("withdrawMatchRecord") || {};
            var $withdrawMatchRecord = object.withdrawObject;
            var c = 0;

            function _withdrawAjax(pagingObj) {
                var hashPage = pagingObj.hashPage || $.Map();
                var pageIndex = pagingObj.pageIndex || 1;
                var tableData;
                if (tableData = hashPage.get(pageIndex)) {
                    //repeat table
                    $withdrawMatchRecord.html(withdrawTable(tableData));
                } else {
                    $.xxdAjax({
                        url: object.withdrawPadingUrl+'?'+new Date().getTime(),
                        clientId: 'XXD_FRONT_END',
                        type: 'get',
                        data: {
                            type: object.type,
                            currentPage: pageIndex,
                            pageSize: pagingObj.pageSize || 10,
                            limit: object.limit
                        },
                        token: token,
                        callback: function (data) {
                            c++;
                            var tableData = data.items;
                            hashPage.put(data.pageNum, tableData);
                            paging.pagingObj = pagingObj;
                            $withdrawMatchRecord.html(withdrawTable(tableData));
                            withdrawMatchRecord['total'] = data.totalCount;
                            withdrawMatchRecord['pageSize'] = data.pageSize;
                            withdrawMatchRecord['pageIndex'] = data.pageNum;
                            if (c == 1) {
                                paging(withdrawMatchRecord);
                            }
                            if (withdrawMatchRecord.total == 0) {
                                $withdrawMatchRecord.append("<tr class='no-record'><td colspan='6'>暂无提现记录！</td> </tr>");
                            }
                        },
                        error: function () {
                            $withdrawMatchRecord.append("<tr class='no-record'><td colspan='6'>暂无提现记录！</td> </tr>");
                        }
                    });
                }
            }

            if (true || !$.isEmptyObject(withdrawMatchRecord)) {
                $.extend(withdrawMatchRecord, {
                    $dom: object.withdrawPagination,
                    callback: function (pagingObj) {
                        _withdrawAjax(pagingObj);
                    }
                });
                _withdrawAjax(withdrawMatchRecord);
            }
        }
    }

    var map = {
        capitalObject: $("#capitalTable"),
        capitaltype: capitaltype[0].status,
        limit: limit[0].status,
        capitalPadingUrl: '/investmentAPI/asset/tradingRecord',
        capitalPagination: $(".capitalRecord-page"),
        rechargeObject: $("#rechargeTable"),
        type: type[0].status,
        limit: limit[0].status,
        rechargePadingUrl: '/investmentAPI/asset/rechargeRecord',
        rechargePagination: $(".rechargeRecord-page"),
        withdrawObject: $("#withdrawTable"),
        type: type[0].status,
        limit: limit[0].status,
        withdrawPadingUrl: '/investmentAPI/asset/drawmoneyRecord',
        withdrawPagination: $(".withdrawRecord-page"),
    };
    getTable(map);


    //筛选点击
    $('.J_capitalType a,.J_capitalLimit a,.J_rechargeStatus a ,.J_rechargeLimit a ,.J_withdrawStatus a,.J_withdrawLimit a').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    //资金记录点击筛选
    var capitalTypeIndex = 0,capitalLimitIndex = 0;
    $.each($('.J_capitalType a'), function (i, v) {
        $(v).click(function () {
            capitalTypeIndex = i || 0;
            getTable({
                capitalObject: $("#capitalTable"),
                capitaltype: capitaltype[i].status,
                limit:limit[capitalLimitIndex].status,
                capitalPadingUrl: '/investmentAPI/asset/tradingRecord',
                capitalPagination: $(".capitalRecord-page")
            });
        });
    });
    $.each($('.J_capitalLimit a'), function (i, v) {
        $(v).click(function () {
            capitalLimitIndex = i || 0;
            getTable({
                capitalObject: $("#capitalTable"),
                capitaltype: capitaltype[capitalTypeIndex].status,
                limit: limit[i].status,
                capitalPadingUrl: '/investmentAPI/asset/tradingRecord',
                capitalPagination: $(".capitalRecord-page")
            });
        });
    });
    //充值记录点击筛选
    var rechargeTypeIndex = 0,rechargeLimitIndex = 0;
    $.each($('.J_rechargeStatus a'), function (i, v) {
        $(v).click(function () {
            rechargeTypeIndex = i || 0;
            getTable({
                rechargeObject: $("#rechargeTable"),
                type: type[i].status,
                limit: limit[rechargeLimitIndex].status,
                rechargePadingUrl: '/investmentAPI/asset/rechargeRecord',
                rechargePagination: $(".rechargeRecord-page"),
            });
        });
    });
    $.each($('.J_rechargeLimit a'), function (i, v) {
        $(v).click(function () {
            rechargeLimitIndex = i || 0;
            getTable({
                rechargeObject: $("#rechargeTable"),
                type: type[rechargeTypeIndex].status,
                limit: limit[i].status,
                rechargePadingUrl: '/investmentAPI/asset/rechargeRecord',
                rechargePagination: $(".rechargeRecord-page"),
            });
        });
    });
    //提现记录点击筛选
    var withdrawTypeIndex = 0,withdrawLimitIndex = 0;
    $.each($('.J_withdrawStatus a'), function (i, v) {
        $(v).click(function () {
            withdrawTypeIndex = i || 0;
            getTable({
                withdrawObject: $("#withdrawTable"),
                type: type[i].status,
                limit: limit[withdrawLimitIndex].status,
                withdrawPadingUrl: '/investmentAPI/asset/drawmoneyRecord',
                withdrawPagination: $(".withdrawRecord-page"),
            });
        });
    });
    $.each($('.J_withdrawLimit a'), function (i, v) {
        $(v).click(function () {
            withdrawLimitIndex = i || 0;
            getTable({
                withdrawObject: $("#withdrawTable"),
                type: type[withdrawTypeIndex].status,
                limit: limit[i].status,
                withdrawPadingUrl: '/investmentAPI/asset/drawmoneyRecord',
                withdrawPagination: $(".withdrawRecord-page"),
            });
        });
    });

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

    side.getLeftHeight();

});
