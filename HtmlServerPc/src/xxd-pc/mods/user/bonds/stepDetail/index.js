require(['base','paging', "trackBase", 'store','side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, paging,track, store,side, jui, header, footer, dialog) {

    header.init();
    footer.init();

    side.tabs({
        tabsObject: $("#J_tabs"),//tab 栏
    });
    //左侧菜单
    side.leftMenu(1);
    var map = {
        creditorObject: $("#creditorTable"),
        creditorPadingUrl: '/tradeCenter/investBiz/bondsListByToken',
        loanPagination: $(".creditorTable-page"),
        pageSize:5
    };
    side.getCreditor(map);



    //出借详情
    var token = store && store.get("token") || {};
    var joinId = $.getUrlParam('join', location.search);

    var investmentAmount, redEnvelopeAmount, productId ,interestPeriod;    //退出表格需要的数据
    
    getBBGSdetail();
    function getBBGSdetail() {
        $.xxdAjax({
            url: '/tradeCenter/step/investmentDetail/' + joinId,
            type: 'get',
            clientId: 'XXD_FRONT_END',
            data: {},
            callbacks: function (data) {
                //删除当前行有的内容
                var trs = $('#haveTable tr');
                $.each(trs, function (i, v) {
                    if (!$(v).hasClass('title')) {
                        $(v).remove();
                    }
                });
                if ((data.code == "200000") || data.data) {
                    var row = data.data;
                    //渲染标题
                    $('.J_bbgsName').html(row.name+row.periodName+'期');
                    //出借详情
                    var content=[];
                    content.push("<tr class='table-content'><td>" + side.numberFormat(row.initialInvestmentAmount) + "元</td>");
                    content.push("<td>" + side.numberFormat(row.holdingAmount) + "元</td>");
                    content.push("<td>" + row.interestPeriod + "天</td>");
                    content.push("<td>" + row.dueInIncome + "元</td>");
                    // content.push("<td>" + row.repaymentMethod + "</td>"); 回款方式列删除
                    if(row.redEnvelopeList){
                        if (row.redEnvelopeList.length >0) {
                            var red=row.redEnvelopeList[0];
                            if (row.redEnvelopeList.length == 1) {
                                content.push('<td class="red-even no-pointer">' + red.sourceDesc + red.amount + '元</td>');
                            }else{
                                content.push('<td class="red-even">' + red.sourceDesc + red.amount + '元');
                                content.push('<span class="red-packet"><i></i><em>' + row.redEnvelopeList[1].sourceDesc + row.redEnvelopeList[1].amount + '元</em></span></td>');
                            }
                        } else {
                            content.push('<td>未使用红包</td>');
                        }
                    }else{
                        content.push('<td>未使用红包</td>');
                    }
                    content.push("<td class='main-color'><a target='_blank' href='/step/protocol/"+joinId+".html'>查看协议</a></td>");
                    content.push("</tr>");
                    $('#haveTable').append(content.join(""));
                    if(row.redEnvelopeList){
                        if (row.redEnvelopeList.length >0) {
                            if (row.redEnvelopeList.length >= 1) {
                                for (var i = 2;i < row.redEnvelopeList.length;i++) {
                                    var item = row.redEnvelopeList[i];
                                    $('.red-packet').append('<em>' + item.sourceDesc + item.amount + '元</em>');
                                }
                            }
                        }
                    }
                    //退出参数
                    interestPeriod = row.interestPeriod;
                    investmentAmount = row.investmentAmount;
                    if(row.redEnvelopeAmount){    //扣除红包有则有金额，没有则写成0
                        redEnvelopeAmount = row.redEnvelopeAmount;
                    }else{
                        redEnvelopeAmount=0;
                    }
                    productId = row.productId;
                } else {
                    $('#haveTable').append("<tr class='no-record'><td colspan='9'>暂无数据！</td> </tr>")
                }
            },
            error: function () {
                $('#haveTable').append("<tr class='no-record'><td colspan='9'>暂无数据！</td> </tr>");
            }
        });
    }

    //交易记录
    //表格内容
    var operatorType = [
        {'status': 0, 'value': '出借'},
        {'status': 1, 'value': '退出'}
    ];
    var channel = [    //交易平台
        {'status': 1, 'value': 'PC'},
        {'status': 2, 'value': 'WEBAPP'},
        {'status': 3, 'value': 'APP'},
        {'status': 4, 'value': 'APP'},
        {'status': 5, 'value': 'APP'},
    ];
    function tradeRecordTable(tableData) {
        var title = '<tr class="title"><th>序号</th><th>日期</th><th>交易行为</th>'
            + '<th>交易平台</th></tr>';
        var contentArray = [];
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            $.each(operatorType, function (i, v) {
                if (row.operatorType == v.status) {
                    row.operatorType = v.value;
                }
            });
            $.each(channel, function (i, v) {
                if (row.channel == v.status) {
                    row.channel = v.value;
                }
            });
            contentArray.push("<tr>");
            contentArray.push("<td>" + (i + 1) + "</td>");
            contentArray.push("<td>" + $.fnDateToString(row.addTime, 'yyyy-MM-dd  HH:mm:ss') + "</td>");
            contentArray.push("<td>" + row.operatorType + "</td>");
            contentArray.push("<td>" + row.channel + "</td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };
    function getTable(object) {
        var tradeRecord = store && store.get("tradeRecord") || {};
        var $tradeTableRecord = object.tradeObject;
        var a = 0;

        function _ajax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $tradeTableRecord.html(tradeRecordTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.tradePadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        currentPage: pageIndex,
                        pageSize: 5
                    },
                    token: token,
                    callback: function (data) {
                        a++;
                        var tableData = data.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $tradeTableRecord.html(tradeRecordTable(tableData));
                        tradeRecord['total'] = data.total;
                        tradeRecord['pageSize'] = 5;
                        tradeRecord['pageIndex'] = data.pageNum;
                        if (a == 1) {
                            paging(tradeRecord);
                        }
                        if (tradeRecord.total == 0) {
                            $tradeTableRecord.append("<tr class='no-record'><td colspan='4'><a href='/step/stepDetail.html'>当前尚无交易记录，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $tradeTableRecord.append("<tr class='no-record'><td colspan='4'><a href='/step/stepDetail.html'>当前尚无交易记录，去看看！</a></td> </tr>");
                    }
                });
            }
        }

        if (true || !$.isEmptyObject(tradeRecord)) {
            $.extend(tradeRecord, {
                $dom: object.tradePagination,
                callback: function (pagingObj) {
                    _ajax(pagingObj);
                }
            });
            _ajax(tradeRecord);
        }
    }

    var tradeRecordMap = {
        tradeObject: $("#dealTable"),
        tradePadingUrl: '/tradeCenter/step/getStepTransactionRecord/'+joinId+'?'+new Date().getTime(),
        tradePagination: $(".dealTable-page")
    };
    getTable(tradeRecordMap);

    side.getLeftHeight();


}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});


