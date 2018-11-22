require(['base', 'paging',"trackBase", 'store','side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($,paging, track, store,side, jui, header, footer, dialog) {

    header.init();
    footer.init();

    side.tabs({
        tabsObject: $("#J_tabs"),//tab 栏
    });
    //左侧菜单
    side.leftMenu(1);

    var token = store && store.get("token") || {},
        startTime = "2000-01-01", //查询出借产品开始时间
        monthSendStatus,
        monthSendNew,
        endTime = $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd');//查询出借产品结束时间

    /*
    var sysStatus = [
        {"status": "-1", "value": "支付失败", "class": "red"},
        {"status": "0", "value": "支付中", "class": "orange"},
        {"status": "1", "value": "收益中", "class": "orange"},
        {"status": "2", "value": "已退出", "class": "green"},
        {"status": "3", "value": "提前退出", "class": "red"},
        {"status": "4", "value": "退出中", "class": "orange"}
    ];
    */

    var sysStatus = [
        {"status": "EXPIRED_APPLICATION_QUIT_SUCCESS", "value": "退出中", "class": "orange"},
        {"status": "QUIT_SUCCESS", "value": "已退出", "class": "green"},
        {"status": "ADVANCE_QUIT_SUCCESS", "value": "已提前退出", "class": "orange"},
        {"status": "JOIN_SUCCESS_START_INTEREST", "value": "募集中", "class": "blue"},
        {"status": "START_INTEREST_SERVICE_EXPIRED", "value": "收益中", "class": "orange"},
        {"status": "SERVICE_EXPIRED_APPLY_QUIT", "value": "可申请退出", "class": "red"}
    ];

    //表格内容
    function investTable(tableData) {
        var title = '<tr class="title"><th>基本信息</th><th>历史年化收益</th><th>加入金额</th>'
            + '<th>待收收益</th><th>已收收益</th><th>服务期</th><th>可申请退出时间</th><th>状态</th><th>操作</th></tr>';
        var contentArray = [];
        var classColor;
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            monthSendStatus = row.status;
            monthSendNew = row.newStatus;
            $.each(sysStatus, function (i, v) {
                if (row.newStatus == v.status) {
                    row.newStatus = v.value;
                    classColor = v.class;
                }
            });
            contentArray.push("<tr>");
            contentArray.push("<td><a href='/promotion/yyp.html' target='_blank'>" + row.name +"-"+row.periodName+ "期</a></td>");
            if(row.floatApr){
                contentArray.push("<td>" + row.apr + "%<span class='font-special'>+" + row.floatApr+ "%</span></td>");
            }else{
                contentArray.push("<td>" + row.apr + "%</td>");
            }
            contentArray.push("<td>" + side.numberFormat(row.account) + "元</td>");
            contentArray.push("<td>" + side.numberFormat(row.interest) + "元</td>");
            contentArray.push("<td>" + side.numberFormat(row.realInterest) + "元</td>");
            contentArray.push("<td>" + row.period+row.periodUnit + "</td>");
            if(monthSendNew == 'JOIN_SUCCESS_START_INTEREST'){
                contentArray.push("<td></td>");
            }else{
                contentArray.push("<td>"+$.fnDateToString(row.endDate, 'yyyy-MM-dd')+"</td>");
            }
            contentArray.push("<td><i class='" + classColor + "'>" + row.newStatus + "</i></td>");
            contentArray.push("<td class='main-color'><a href='/usercenter/bonds/monthSend.html?join="+row.joinId+"&monthSendStatus="+monthSendStatus+"'>查看详情</a></td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };
    //已退出的表格
    function outTable(tableData) {
        var title = '<tr class="title"><th>基本信息</th><th>历史年化收益</th><th>加入金额</th>'
            + '<th>实际收益</th><th>服务期</th><th>状态</th><th>操作</th></tr>';
        var contentArray = [];
        var classColor;
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            monthSendStatus = row.status;
            $.each(sysStatus, function (i, v) {
                if (row.newStatus == v.status) {
                    row.newStatus = v.value;
                    classColor = v.class;
                }
            });
            contentArray.push("<tr>");
            contentArray.push("<td><a href='/promotion/yyp.html' target='_blank'>" + row.name +"-"+row.periodName+ "期</a></td>");
            if(row.floatApr){
                contentArray.push("<td>" + row.apr + "%<span class='font-special'>+" + row.floatApr+ "%</span></td>");
            }else{
                contentArray.push("<td>" + row.apr + "%</td>");
            }
            contentArray.push("<td>" + side.numberFormat(row.account) + "元</td>");
            contentArray.push("<td>" + side.numberFormat(row.realInterest) + "元</td>");
            contentArray.push("<td>" + row.period+row.periodUnit + "</td>");
            contentArray.push("<td><i class='" + classColor + "'>" + row.newStatus + "</i></td>");
            contentArray.push("<td class='main-color'><a href='/usercenter/bonds/monthSend.html?join="+row.joinId+"&monthSendStatus="+monthSendStatus+"'>查看详情</a></td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };

    function getTable(object) {
        var matchRecord = store && store.get("matchRecord") || {};
        var $matchTableRecord = object.InvestObject;
        var a = 0;

        function _ajax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $matchTableRecord.html(investTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.monthPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        type: 1,
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                        startTime:startTime,
                        endTime:endTime
                    },
                    token: token,
                    callback: function (data) {
                        a++;
                        var tableData = data.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $matchTableRecord.html(investTable(tableData));
                        matchRecord['total'] = data.total;
                        matchRecord['pageSize'] = 10;
                        matchRecord['pageIndex'] = data.pageNum;
                        if (a == 1) {
                            paging(matchRecord);
                        }
                        if (matchRecord.total == 0) {
                            $matchTableRecord.append("<tr class='no-record'><td colspan='9'><a href='/promotion/yyp.html'>当前尚未加入，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $matchTableRecord.append("<tr class='no-record'><td colspan='9'><a href='/promotion/yyp.html'>当前尚未加入，去看看！</a></td> </tr>");
                    }
                });
            }
        }
        if (true || !$.isEmptyObject(matchRecord)) {
            $.extend(matchRecord, {
                $dom: object.InvestPagination,
                callback: function (pagingObj) {
                    _ajax(pagingObj);
                }
            });
            _ajax(matchRecord);
        }


        //退出
        var exitMatchRecord = store && store.get("exitMatchRecord") || {};
        var $exitMatchRecord = object.exitObject;
        var b = 0;
        function _exitAjax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $exitMatchRecord.html(outTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.exitPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        type:2,
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                        startTime:startTime,
                        endTime:endTime
                    },
                    token: token,
                    callback: function (data) {
                        b++;
                        var tableData = data.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $exitMatchRecord.html(outTable(tableData));
                        exitMatchRecord['total'] = data.total;
                        exitMatchRecord['pageSize'] = 10;
                        exitMatchRecord['pageIndex'] = data.pageNum;
                        if (b == 1) {
                            paging(exitMatchRecord);
                        }
                        if (exitMatchRecord.total == 0) {
                            $exitMatchRecord.append("<tr class='no-record'><td colspan='8'><a href='/promotion/yyp.html'>当前无退出记录，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $exitMatchRecord.append("<tr class='no-record'><td colspan='8'><a href='/promotion/yyp.html'>当前无退出记录，去看看！</a></td> </tr>");
                    }
                });
            }
        }
        if (true || !$.isEmptyObject(exitMatchRecord)) {
            $.extend(exitMatchRecord, {
                $dom: object.exitPagination,
                callback: function (pagingObj) {
                    _exitAjax(pagingObj);
                }
            });
            _exitAjax(exitMatchRecord);
        }


    }

    var map = {
        InvestObject: $("#haveTable"),
        monthPadingUrl: '/tradeCenter/investBiz/myInvestmentProductsByToken/YYP'+'?'+new Date().getTime(),
        InvestPagination: $(".haveTable-page"),
        exitObject: $("#outTable"),
        exitPadingUrl: '/tradeCenter/investBiz/myInvestmentProductsByToken/YYP'+'?'+new Date().getTime(),
        exitPagination: $(".outTable-page"),
    };


    getTable(map);

    side.getLeftHeight();


}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

