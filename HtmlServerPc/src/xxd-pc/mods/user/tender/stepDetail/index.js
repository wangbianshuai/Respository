require(['base', 'paging', "trackBase", 'store','side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($,paging,track, store,side, jui, header, footer, dialog) {

    header.init();
    footer.init();

    side.tabs({
        tabsObject: $("#J_tabs"),//tab 栏
    });
    //左侧菜单
    side.leftMenu(1);

    var token = store && store.get("token") || {},
        startTime = "2000-01-01", //查询出借产品开始时间
        stepDetailStatus,
        endTime = $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd');//查询出借产品结束时间

    var sysStatus = [
        {"status": "-1", "value": "支付失败", "class": "red"},
        {"status": "0", "value": "支付中", "class": "orange"},
        {"status": "1", "value": "收益中", "class": "orange"},
        {"status": "2", "value": "已退出", "class": "green"},
        {"status": "3", "value": "提前退出", "class": "red"},
        {"status": "4", "value": "退出中", "class": "orange"}
    ];
    //表格内容
    function investTable(tableData) {
        var title = '<tr class="title"><th>基本信息</th><th>历史年化收益</th><th>初始加入金额</th>'
            + '<th>当前持有</th><th>待收收益</th><th>已计息天数</th><th>操作</th></tr>';
        var contentArray = [];
        var classColor;
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            stepDetailStatus = row.status;
            $.each(sysStatus, function (i, v) {
                if (row.status == v.status) {
                    row.status = v.value;
                    classColor = v.class;
                }
            });
            contentArray.push("<tr>");
            contentArray.push("<td><span>" + row.name + "</span>");
            contentArray.push("<span>" + $.fnDateToString(row.addDate, 'yyyy-MM-dd  HH:mm:ss') + "</span></td>");
            contentArray.push("<td>" + row.plannedAnnualRate + "%</td>");
            contentArray.push("<td>" + side.numberFormat(row.account) + "元</td>");
            contentArray.push("<td>" + row.remaCapital + "元</td>");
            contentArray.push("<td>" + side.numberFormat(row.interest) + "元</td>");
            contentArray.push("<td>" + row.holdingDays + "天</td>");
            contentArray.push("<td class='main-color'><a href='/usercenter/bonds/stepDetail.html?join="+row.joinId+"&stepDetailStatus="+stepDetailStatus+"'>查看详情</a></td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };

    function getTable(object) {
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
                $exitMatchRecord.html(investTable(tableData));
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
                        $exitMatchRecord.html(investTable(tableData));
                        exitMatchRecord['total'] = data.total;
                        exitMatchRecord['pageSize'] = 10;
                        exitMatchRecord['pageIndex'] = data.pageNum;
                        if (b == 1) {
                            paging(exitMatchRecord);
                        }
                        if (exitMatchRecord.total == 0) {
                            $exitMatchRecord.append("<tr class='no-record'><td colspan='8'>当前尚无退出记录！</td> </tr>");
                        }

                        //侧栏高度
                        side.getLeftHeight();
                    },
                    error: function () {
                        $exitMatchRecord.append("<tr class='no-record'><td colspan='8'>当前尚无退出记录！</td> </tr>");
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
        exitObject: $("#outTable"),
        exitPadingUrl: '/tradeCenter/investBiz/myInvestmentProductsByToken/BBGS'+'?'+new Date().getTime(),
        exitPagination: $(".outTable-page")
    };

    getTable(map);




}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});