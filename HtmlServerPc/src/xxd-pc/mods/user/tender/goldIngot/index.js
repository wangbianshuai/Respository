require(['base', 'paging', "trackBase", 'store', 'side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, paging, track, store, side, jui, header, footer, dialog) {

    header.init();
    footer.init();

    side.tabs({
        tabsObject: $("#J_tabs"),//tab 栏
    });
    //左侧菜单
    side.leftMenu(1);


    var token = store && store.get("token") || {},
        startTime = "2000-01-01", //查询出借产品开始时间
        goldIngotStatus,
        goldIngotNew,
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
    //不四舍五入直接截断
    function numberFormat(num) {
        if (typeof num == 'string') {
            num = +num;
        }
        var num2 = num.toFixed(3);
        return num2.substring(0, num2.lastIndexOf('.') + 3).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,'); // 123456.78
    }

    //持有中
    function investTable(tableData) {
        var title = '<tr class="title"><th>基本信息</th><th>历史年化收益</th><th>加入金额</th>'
            + '<th>平均历史收益</th><th>服务期</th><th>状态</th><th>可申请退出时间</th><th>操作</th></tr>';
        var contentArray = [];
        var classColor;
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            goldIngotStatus = row.status;
            goldIngotNew = row.newStatus;
            $.each(sysStatus, function (i, v) {
                if (row.newStatus == v.status) {
                    row.newStatus = v.value;
                    classColor = v.class;
                }
            });
            contentArray.push("<tr>");
            contentArray.push("<td><a href='/xplan/detail/" + row.productId + ".html' target='_blank'>" + row.name + "-" + row.periodName + "</a></td>");
            // if (row.floatApr) {
            //     contentArray.push("<td>" + row.apr + "%+" + row.floatApr + "%</td>");
            // } else {
            //     contentArray.push("<td>" + row.apr + "%</td>");
            // }
            contentArray.push("<td>" + row.apr + "%</td>");
            contentArray.push("<td>" + side.numberFormat(row.account) + "元</td>");
            /*interest：预计产品收益，aprIncome活动收益（产品收益） raiseInterestAmount：加息券收益 floatAprIncome 活动加息标收益*/
            if (row.raiseInterestAmount && row.raiseInterestAmount != 0) {
                if (row.floatAprIncome && row.floatAprIncome != 0) {
                    //加息标+加息券
                    var allIncome = numberFormat(Number(row.floatAprIncome) + Number(row.raiseInterestAmount));

                    contentArray.push("<td>" + numberFormat(row.aprIncome) + "元+" + allIncome + "元</td>");
                } else {
                    //加息券
                    contentArray.push("<td>" + numberFormat(row.aprIncome) + "元+" + numberFormat(row.raiseInterestAmount) + "元</td>");
                }
            } else {
                if (row.floatAprIncome && row.floatAprIncome != 0) {
                    //加息标
                    contentArray.push("<td>" + numberFormat(row.aprIncome) + "元+" + numberFormat(row.floatAprIncome) + "元</td>");
                } else {
                    //普通标
                    contentArray.push("<td>" + numberFormat(row.aprIncome) + "元</td>");
                }

            }
            contentArray.push("<td>" + row.closeterm + row.periodUnit + "</td>");
            contentArray.push("<td><i class='" + classColor + "'>" + row.newStatus + "</i></td>");
            if (row.newStatus == '募集中') {
                contentArray.push("<td></td>");
            } else {
                contentArray.push("<td>" + $.fnDateToString(row.endDate, 'yyyy-MM-dd') + "</td>");
            }
            contentArray.push("<td class='main-color'><a href='/usercenter/bonds/goldIngot.html?join=" + row.joinId + "&goldIngotStatus=" + goldIngotStatus + "&goldIngotNew=" + goldIngotNew + "'>查看详情</a></td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };
    //已退出
    function outTable(tableData) {
        var title = '<tr class="title"><th>基本信息</th><th>历史年化收益</th><th>加入金额</th>'
            + '<th>实际收益</th><th>服务期</th><th>状态</th><th>操作</th></tr>';
        var contentArray = [];
        var classColor;
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            goldIngotStatus = row.status;
            $.each(sysStatus, function (i, v) {
                if (row.newStatus == v.status) {
                    row.newStatus = v.value;
                    classColor = v.class;
                }
            });
            contentArray.push("<tr>");
            contentArray.push("<td><a href='/xplan/detail/" + row.productId + ".html' target='_blank'>" + row.name + "-" + row.periodName + "</a></td>");
            // if (row.floatApr) {
            //     contentArray.push("<td>" + row.apr + "%+" + row.floatApr + "%</td>");
            // } else {
            //     contentArray.push("<td>" + row.apr + "%</td>");
            // }
            contentArray.push("<td>" + row.apr + "%</td>");
            contentArray.push("<td>" + side.numberFormat(row.account) + "元</td>");
            /*interest：预计产品收益，aprIncome活动收益（产品收益） raiseInterestAmount：加息券收益 floatAprIncome 活动加息标收益*/
            if (row.raiseInterestAmount && row.raiseInterestAmount != 0) {
                if (row.floatAprIncome && row.floatAprIncome != 0) {
                    //加息标+加息券
                    var allIncome = numberFormat(Number(row.floatAprIncome) + Number(row.raiseInterestAmount));

                    contentArray.push("<td>" + numberFormat(row.aprIncome) + "元+" + allIncome + "元</td>");
                } else {
                    //加息券
                    contentArray.push("<td>" + numberFormat(row.aprIncome) + "元+" + numberFormat(row.raiseInterestAmount) + "元</td>");
                }
            } else {
                if (row.floatAprIncome && row.floatAprIncome != 0) {
                    //加息标
                    contentArray.push("<td>" + numberFormat(row.aprIncome) + "元+" + numberFormat(row.floatAprIncome) + "元</td>");
                } else {
                    //普通标
                    contentArray.push("<td>" + numberFormat(row.aprIncome) + "元</td>");
                }

            }
            // contentArray.push("<td>" + side.numberFormat(row.interest) + "元</td>");
            contentArray.push("<td>" + row.closeterm + row.periodUnit + "</td>");
            contentArray.push("<td><i class='" + classColor + "'>" + row.newStatus + "</i></td>");
            contentArray.push("<td class='main-color'><a href='/usercenter/bonds/goldIngot.html?join=" + row.joinId + "&goldIngotStatus=" + goldIngotStatus + "'>查看详情</a></td>");
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
                    url: object.investPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        type: 1,
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                        startTime: startTime,
                        endTime: endTime
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
                            $matchTableRecord.append("<tr class='no-record'><td colspan='8'><a href='/xplan/search/list.html' target='_blank'>当前尚无持有中记录，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $matchTableRecord.append("<tr class='no-record'><td colspan='8'><a href='/xplan/search/list.html' target='_blank'>当前尚无持有中记录，去看看！</a></td> </tr>");
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
                        type: 2,
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                        startTime: startTime,
                        endTime: endTime
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
                            $exitMatchRecord.append("<tr class='no-record'><td colspan='8'><a href='/xplan/search/list.html' target='_blank'>当前无退出记录，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $exitMatchRecord.append("<tr class='no-record'><td colspan='8'><a href='/xplan/search/list.html' target='_blank'>当前无退出记录，去看看！</a></td> </tr>");
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
        investPadingUrl: '/tradeCenter/investBiz/myInvestmentProductsByToken/XYB'+'?'+new Date().getTime(),
        InvestPagination: $(".haveTable-page"),
        exitObject: $("#exitTable"),
        exitPadingUrl: '/tradeCenter/investBiz/myInvestmentProductsByToken/XYB'+'?'+new Date().getTime(),
        exitPagination: $(".exitTable-page"),
    };
    getTable(map);

    side.getLeftHeight();
}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

