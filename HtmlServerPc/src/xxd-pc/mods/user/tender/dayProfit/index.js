require(['base', 'paging', "trackBase", 'store', 'side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, paging, track, store, side, jui, header, footer, dialog) {

    header.init();
    footer.init();

    var token = store && store.get("token") || {},
        startTime = "2000-01-01", //查询出借产品开始时间
        endTime = $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd');//查询出借产品结束时间

    side.tabs({
        tabsObject: $("#J_tabs"),//tab 栏
    });
    //左侧菜单
    side.leftMenu(1);

    //表格内容
    function investTable(tableData) {
        var title = '<tr class="title"><th>日期</th><th>金额(元)</th><th>说明</th></tr>';
        var contentArray = [];
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            contentArray.push("<tr>");
            contentArray.push("<td>"+$.fnDateToString(row.createDate, 'yyyy-MM-dd  HH:mm:ss') + "</span></a></td>");
            contentArray.push("<td>" + side.numberFormat(row.money) + "</td>");
            contentArray.push("<td>" + row.remarks + "</td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };

    function getTable(object) {
        var incomeDetailRecord = store && store.get("incomeDetailRecord") || {};
        var $incomeDetailRecord = object.incomeObject;
        var a = 0;

        function _ajax(pagingObj) {
            //收益
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                $incomeDetailRecord.html(investTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.incomePadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                        startTime:startTime,
                        endTime:endTime
                    },
                    token: token,
                    callback: function (data) {
                        side.getLeftHeight();
                        //累计收益字段值渲染
                        $('#allIncome').html(data.collectedInterest);
                        //记录
                        var data = data.fundUsertradeList;
                        a++;
                        var tableData = data.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $incomeDetailRecord.html(investTable(tableData));
                        incomeDetailRecord['total'] = data.total;
                        incomeDetailRecord['pageSize'] = 10;
                        incomeDetailRecord['pageIndex'] = data.pageNum;
                        if (a == 1) {
                            paging(incomeDetailRecord);
                        }
                        if (incomeDetailRecord.total == 0) {
                            $incomeDetailRecord.append("<tr class='no-record'><td colspan='8'>当前无收益记录！</td> </tr>");
                        }
                    },
                    error: function () {
                        $incomeDetailRecord.append("<tr class='no-record'><td colspan='8'>当前无收益记录！</td> </tr>");
                    }
                });
            }
        }
        if (true || !$.isEmptyObject(incomeDetailRecord)) {
            $.extend(incomeDetailRecord, {
                $dom: object.incomePagination,
                callback: function (pagingObj) {
                    _ajax(pagingObj);
                }
            });
            _ajax(incomeDetailRecord);
        }

        //收入
        var inRecordObj = store && store.get("inRecordObj") || {};
        var $inTableRecord = object.inTableObject;
        var inNumber = 0;
        function _inajax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                $inTableRecord.html(investTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.inPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    token: token,
                    data: {
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                    },
                    callback: function (data) {
                        var data = data.fundUsertradeList;
                        inNumber++;
                        var tableData = data.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $inTableRecord.html(investTable(tableData));
                        inRecordObj['total'] = data.total;
                        inRecordObj['pageSize'] = 10;
                        inRecordObj['pageIndex'] = data.pageNum;
                        if (inNumber == 1) {
                            paging(inRecordObj);
                        }
                        if (inRecordObj.total == 0) {
                            $inTableRecord.append("<tr class='no-record'><td colspan='11'>当前无转入记录！</td> </tr>");
                        }
                    },
                    error: function () {
                        $inTableRecord.append("<tr class='no-record'><td colspan='11'>当前无转入记录！</td> </tr>");
                    }
                });
            }
        }

        if (true || !$.isEmptyObject(inRecordObj)) {
            $.extend(inRecordObj, {
                $dom: object.inPagination,
                callback: function (pagingObj) {
                    _inajax(pagingObj);
                }
            });
            _inajax(inRecordObj);
        }

        //转出
        var outRecordObj = store && store.get("outRecordObj") || {};
        var $outTableRecord = object.outTableObject;
        var outNumber = 0;
        function _outajax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                $outTableRecord.html(investTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.outPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    token: token,
                    data: {
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                    },
                    callback: function (data) {
                        var data = data.fundUsertradeList;
                        outNumber++;
                        var tableData = data.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $outTableRecord.html(investTable(tableData));
                        outRecordObj['total'] = data.total;
                        outRecordObj['pageSize'] = 10;
                        outRecordObj['pageIndex'] = data.pageNum;
                        if (outNumber == 1) {
                            paging(outRecordObj);
                        }
                        if (outRecordObj.total == 0) {
                            $outTableRecord.append("<tr class='no-record'><td colspan='11'>当前无转出记录！</td> </tr>");
                        }
                    },
                    error: function () {
                        $outTableRecord.append("<tr class='no-record'><td colspan='11'>当前无转出记录！</td> </tr>");
                    }
                });
            }
        }

        if (true || !$.isEmptyObject(outRecordObj)) {
            $.extend(outRecordObj, {
                $dom: object.outPagination,
                callback: function (pagingObj) {
                    _outajax(pagingObj);
                }
            });
            _outajax(outRecordObj);
        }
    }

    var map = {
        incomeObject: $("#incomeTable"),
        incomePadingUrl: '/tradeCenter/fundUsertrade/RRYInvestmentDetail?type=1'+'?'+new Date().getTime(),
        incomePagination: $(".incomeTable-page"),
        inTableObject: $("#inTable"),
        inPadingUrl: '/tradeCenter/fundUsertrade/RRYInvestmentDetail?type=2'+'?'+new Date().getTime(),
        inPagination: $(".inTable-page"),
        outTableObject:$("#outTable"),
        outPadingUrl: '/tradeCenter/fundUsertrade/RRYInvestmentDetail?type=3'+'?'+new Date().getTime(),
        outPagination: $(".outTable-page"),
    };

    getTable(map);
    side.getLeftHeight();


}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

