require(['base', 'paging', "trackBase", 'store', 'side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, paging, track, store, side, jui, header, footer, dialog) {

    header.init();
    footer.init();

    side.tabs({
        tabsObject: $("#J_tabs"),//tab 栏
    });

    //日期时间插件
    side.date(".user-date");
    //左侧菜单
    side.leftMenu(1);

    var token = store && store.get("token") || {},
        tenderId, repayMoney,
        holdStartTime = "2000-01-01", //查询出借产品开始时间
        holdEndTime = $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd'),//查询出借产品结束时间
        transferStartTime = '2000-01-01',
        transferEndTime = $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd'),//查询出借产品结束时间
        outStartTime = '2000-01-01',
        outEndTime = $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd'),//查询出借产品结束时间
        inStartTime = '2000-01-01',
        inEndTime = $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd');//查询出借产品结束时间
    var Time = [
        {"startTime": holdStartTime, "endTime": holdEndTime},
        {"startTime": transferStartTime, "endTime": transferEndTime},
        {"startTime": outStartTime, "endTime": outEndTime},
        {"startTime": inStartTime, "endTime": inEndTime},
    ];
    var holdSysStatus = [
        {"status": "0", "value": "投标中"},
        {"status": "1", "value": "还款中"},
        {"status": "2", "value": "还款结束"},
        {"status": "-1", "value": "投标失败"}
    ];
    var sysStatus = [
        {"status": "1", "value": "转让中"},
        {"status": "2", "value": "转让成功"},
        {"status": "3", "value": "转让失败"},
        {"status": "4", "value": "撤销"},
        {"status": "5", "value": "过期"}
    ];


    //表格内容
    function holdTable(tableData) {
        var title = '<tr class="title"> <th>标的名称</th> <th>投标日期</th> <th>投标金额</th> <th>年化收益</th> ' +
            '<th>剩余期数</th> <th>债权价值</th> <th>状态</th> <th>下一回款日</th> <th>操作</th> </tr>';
        var contentArray = [];
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            $.each(holdSysStatus, function (i, v) {
                if (row.borrowTenderStatus == v.status) {
                    row.borrowTenderStatus = v.value;
                }
            });
            contentArray.push("<tr>");
            contentArray.push("<td class='main-color'><a href='/borrow/detail/" + row.borrowId + ".html' target='_blank'>" + row.borrowName + "</a></td>");
            contentArray.push("<td>" + row.borrowTenderTime + "</td>");
            contentArray.push("<td>" + row.effectiveMoney + "元</td>");
            contentArray.push("<td>" + row.rateYear + "%</td>");
            contentArray.push("<td>" + row.remainNumber + "期</td>");
            contentArray.push("<td>" + row.repayCapital + "</td>");
            contentArray.push("<td><i>" + row.borrowTenderStatus + "</i></td>");
            contentArray.push("<td>" + $.fnDateToString(row.nextRepaymentTime, 'yyyy-MM-dd') + "</td>");
            contentArray.push("<td class='main-color'><a href='#' class='J_makOever' tenderId='" + row.tenderId + "' nextTime='" + row.nextRepaymentTime + "'>转让</a></td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };
    function transferTable(tableData) {
        var title = '<tr class="title"> <th>标的名称</th> <th>转让流水号</th> <th>转让日期</th> <th>转让总额</th> ' +
            '<th>年化收益</th> <th>剩余期数</th> <th>状态</th> <th>操作</th> </tr>';
        var contentArray = [];
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            $.each(sysStatus, function (i, v) {
                if (row.status == v.status) {
                    row.status = v.value;
                }
            });
            var fundsSum = (row.repayCapital - row.funds).toFixed(2);
            contentArray.push("<tr>");
            contentArray.push("<td class='main-color'><a href='/traderequest/requestDetail/" + row.requestId + ".html' target='_blank'>" + row.borrowName + "</a></td>");
            contentArray.push("<td>" + row.requestId + "</td>");
            contentArray.push("<td>" + $.fnDateToString(row.addTime, 'yyyy-MM-dd') + "元</td>");
            contentArray.push("<td>" + side.numberFormat(fundsSum) + "</td>");
            contentArray.push("<td>" + row.apr + "%</td>");
            contentArray.push("<td>" + row.remainNumber + "期</td>");
            contentArray.push("<td><i>" + row.status + "</i></td>");
            // contentArray.push("<td class='main-color'><a href='/tradepack/showContract.html?requestId=" + row.requestId + "' target='_blank'>查看合同</a></td>");
            contentArray.push("<td class='main-color'><a href='#' class='J_revocation' requestId='"+row.requestId+"'>撤销</a></td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };
    function outBondsTable(tableData) {
        var title = '<tr class="title"> <th>标的名称</th> <th>转让流水号</th> <th>交易日期</th> <th>年化收益</th> ' +
            '<th>剩余期/天数</th> <th>转出价格</th> <th>状态</th> <th>转让合同</th> </tr>';
        var contentArray = [];
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            $.each(sysStatus, function (i, v) {
                if (row.status == v.status) {
                    row.status = v.value;
                }
            });
            var fund = (row.amount - row.funds).toFixed(2);
            contentArray.push("<tr>");
            contentArray.push("<td class='main-color'><a href='/traderequest/requestDetail/" + row.requestId + ".html' target='_blank'>" + row.borrowName + "</a></td>");
            contentArray.push("<td>" + row.requestId + "</td>");
            contentArray.push("<td>" + $.fnDateToString(row.outTime, 'yyyy-MM-dd') + "元</td>");
            contentArray.push("<td>" + row.apr + "%</td>");
            if (row.type == 13) {
                contentArray.push("<td>" + row.terms + "天</td>");
            } else {
                contentArray.push("<td>" + row.terms + "期</td>");
            }
            contentArray.push("<td>" + fund + "元</td>");
            contentArray.push("<td><i>" + row.status + "</i></td>");
            contentArray.push("<td class='main-color'><a href='/tradepack/showContract.html?requestId=" + row.requestId + "' target='_blank'>查看合同</a></td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };
    function inBondsTable(tableData) {
        var title = '<tr class="title"><th>标的名称</th> <th>转让流水号</th> <th>交易日期</th> <th>年化收益</th> ' +
            '<th>剩余期/天数</th> <th>转入价格</th> <th>状态</th> <th>转让合同</th></tr>';
        var contentArray = [];
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            $.each(sysStatus, function (i, v) {
                if (row.status == v.status) {
                    row.status = v.value;
                }
            });
            var fund = (row.amount - row.funds).toFixed(2);
            contentArray.push("<tr>");
            contentArray.push("<td class='main-color'><a href='/traderequest/requestDetail/" + row.requestId + ".html' target='_blank'>" + row.borrowName + "</a></td>");
            contentArray.push("<td>" + row.requestId + "</td>");
            contentArray.push("<td>" + $.fnDateToString(row.outTime, 'yyyy-MM-dd') + "元</td>");
            contentArray.push("<td>" + row.apr + "%</td>");
            if (row.type == 13) {
                contentArray.push("<td>" + row.terms + "天</td>");
            } else {
                contentArray.push("<td>" + row.terms + "期</td>");
            }
            contentArray.push("<td>" + fund + "元</td>");
            contentArray.push("<td><i>" + row.status + "</i></td>");
            contentArray.push("<td class='main-color'><a href='/tradepack/showContract.html?requestId=" + row.requestId + "' target='_blank'>查看合同</a></td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };

    function getTable(object) {
        //持有中
        var holdBondsRecord = store && store.get("holdBondsRecord") || {};
        var $holdBondsRecord = object.holdBondsObject;
        var a = 0;

        function _holdBondsAjax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $holdBondsRecord.html(holdTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.holdPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        type: 1,
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                        startTime: Time[0].startTime,
                        endTime: Time[0].endTime
                    },
                    token: token,
                    callback: function (data) {
                        //持有中总数据
                        $('.J_totalTradeCount').html(data.totalTradeCount);
                        a++;
                        var tableData = data.date.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $holdBondsRecord.html(holdTable(tableData));
                        holdBondsRecord['total'] = data.date.total;
                        holdBondsRecord['pageSize'] = 10;
                        holdBondsRecord['pageIndex'] = data.date.pageNum;
                        if (a == 1) {
                            paging(holdBondsRecord);
                        }
                        if (holdBondsRecord.total == 0) {
                            $holdBondsRecord.append("<tr class='no-record'><td colspan='9'><a href='/traderequest/tradeRequestMoreSearch.html'>当前尚无持有中债权，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $holdBondsRecord.append("<tr class='no-record'><td colspan='9'><a href='/traderequest/tradeRequestMoreSearch.html'>当前尚无持有中债权，去看看！</a></td> </tr>");
                    }
                });
            }
        }

        if (true || !$.isEmptyObject(holdBondsRecord)) {
            $.extend(holdBondsRecord, {
                $dom: object.holdPagination,
                callback: function (pagingObj) {
                    _holdBondsAjax(pagingObj);
                }
            });
            _holdBondsAjax(holdBondsRecord);
        }
        //转让中
        var transferBondsRecord = store && store.get("transferBondsRecord") || {};
        var $transferBondsRecord = object.transferBondsObject;
        var b = 0;

        function _transferAjax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                $transferBondsRecord.html(transferTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.transferPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        type: 2,
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                        startTime: Time[1].startTime,
                        endTime: Time[1].endTime
                    },
                    token: token,
                    callback: function (data) {
                        //转让中总数据
                        $('.J_transferingCount').html(data.transferingCount);
                        b++;
                        var tableData = data.date.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $transferBondsRecord.html(transferTable(tableData));
                        transferBondsRecord['total'] = data.date.total;
                        transferBondsRecord['pageSize'] = 10;
                        transferBondsRecord['pageIndex'] = data.date.pageNum;
                        if (b == 1) {
                            paging(transferBondsRecord);
                        }
                        if (transferBondsRecord.total == 0) {
                            $transferBondsRecord.append("<tr class='no-record'><td colspan='9'><a href='/traderequest/tradeRequestMoreSearch.html'>当前尚无转让中债权，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $transferBondsRecord.append("<tr class='no-record'><td colspan='9'><a href='/traderequest/tradeRequestMoreSearch.html'>当前尚无转让中债权，去看看！</a></td> </tr>");
                    }
                });
            }
        }

        if (true || !$.isEmptyObject(transferBondsRecord)) {
            $.extend(transferBondsRecord, {
                $dom: object.transferPagination,
                callback: function (pagingObj) {
                    _transferAjax(pagingObj);
                }
            });
            _transferAjax(transferBondsRecord);
        }
        //已转出
        var outBondsRecord = store && store.get("outBondsRecord") || {};
        var $outBondsRecord = object.outBondsObject;
        var c = 0;

        function _outBondsajax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $outBondsRecord.html(outBondsTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.outPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        type: 3,
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                        startTime: Time[2].startTime,
                        endTime: Time[2].endTime
                    },
                    token: token,
                    callback: function (data) {
                        c++;
                        var tableData = data.date.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $outBondsRecord.html(outBondsTable(tableData));
                        outBondsRecord['total'] = data.date.total;
                        outBondsRecord['pageSize'] = 10;
                        outBondsRecord['pageIndex'] = data.date.pageNum;
                        if (c == 1) {
                            paging(outBondsRecord);
                        }
                        if (outBondsRecord.total == 0) {
                            $outBondsRecord.append("<tr class='no-record'><td colspan='8'><a href='/traderequest/tradeRequestMoreSearch.html'>当前尚无已转出债权，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $outBondsRecord.append("<tr class='no-record'><td colspan='8'><a href='/traderequest/tradeRequestMoreSearch.html'>当前尚无已转出债权，去看看！</a></td> </tr>");
                    }
                });
            }
        }

        if (true || !$.isEmptyObject(outBondsRecord)) {
            $.extend(outBondsRecord, {
                $dom: object.outPagination,
                callback: function (pagingObj) {
                    _outBondsajax(pagingObj);
                }
            });
            _outBondsajax(outBondsRecord);
        }
        //已转入
        var inBondsRecord = store && store.get("inBondsRecord") || {};
        var $inBondsRecord = object.inBondsObject;
        var d = 0;

        function _inBondsAjax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $inBondsRecord.html(inBondsTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.inPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        type: 4,
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                        startTime: Time[3].startTime,
                        endTime: Time[3].endTime
                    },
                    token: token,
                    callback: function (data) {
                        d++;
                        var tableData = data.date.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $inBondsRecord.html(inBondsTable(tableData));
                        inBondsRecord['total'] = data.date.total;
                        inBondsRecord['pageSize'] = 10;
                        inBondsRecord['pageIndex'] = data.date.pageNum;
                        if (d == 1) {
                            paging(inBondsRecord);
                        }
                        if (inBondsRecord.total == 0) {
                            $inBondsRecord.append("<tr class='no-record'><td colspan='8'><a href='/traderequest/tradeRequestMoreSearch.html'>当前尚无已转入债权，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $inBondsRecord.append("<tr class='no-record'><td colspan='8'><a href='/traderequest/tradeRequestMoreSearch.html'>当前尚无已转入债权，去看看！</a></td> </tr>");
                    }
                });
            }
        }

        if (true || !$.isEmptyObject(inBondsRecord)) {
            $.extend(inBondsRecord, {
                $dom: object.inPagination,
                callback: function (pagingObj) {
                    _inBondsAjax(pagingObj);
                }
            });
            _inBondsAjax(inBondsRecord);
        }
    }

    var map = {
        holdBondsObject: $("#holdBonds"),
        holdPadingUrl: '/tradeCenter/borrowTender/queryTradeTransferRecord'+'?'+new Date().getTime(),
        holdPagination: $(".holdBonds-page"),
        transferBondsObject: $("#transferBonds"),
        transferPadingUrl: '/tradeCenter/borrowTender/queryTradeTransferRecord'+'?'+new Date().getTime(),
        transferPagination: $(".transferBonds-page"),
        outBondsObject: $("#outBonds"),
        outPadingUrl: '/tradeCenter/borrowTender/queryTradeTransferRecord'+'?'+new Date().getTime(),
        outPagination: $(".outBonds-page"),
        inBondsObject: $("#inBonds"),
        inPadingUrl: '/tradeCenter/borrowTender/queryTradeTransferRecord'+'?'+new Date().getTime(),
        inPagination: $(".inBonds-page"),
    };
    getTable(map);

    //点击搜索按钮
    var serchButtons = ['#serchHoldBonds', '#serchTransferBonds', '#serchOutBonds', '#serchInBonds'];
    var serchInputs = [
        {"startInput": ".hold-start", "endInput": ".hold-end"},
        {"startInput": ".transfer-start", "endInput": ".transfer-end"},
        {"startInput": ".out-start", "endInput": ".out-end"},
        {"startInput": ".in-start", "endInput": ".in-end"},
    ];
    var maps = [
        {
            holdBondsObject: $("#holdBonds"),
            holdPadingUrl: '/tradeCenter/borrowTender/queryTradeTransferRecord',
            holdPagination: $(".holdBonds-page"),
        },
        {
            transferBondsObject: $("#transferBonds"),
            transferPadingUrl: '/tradeCenter/borrowTender/queryTradeTransferRecord',
            transferPagination: $(".transferBonds-page"),
        },
        {
            outBondsObject: $("#outBonds"),
            outPadingUrl: '/tradeCenter/borrowTender/queryTradeTransferRecord',
            outPagination: $(".outBonds-page"),
        },
        {
            inBondsObject: $("#inBonds"),
            inPadingUrl: '/tradeCenter/borrowTender/queryTradeTransferRecord',
            inPagination: $(".inBonds-page"),
        }
    ]
    $.each(serchButtons, function (i, v) {
        $(v).click(function () {
            var start = serchInputs[i].startInput, end = serchInputs[i].endInput,
                startVal = $(start).val(), endVal = $(end).val();
            if ((!startVal) && (!endVal)) {
                return;
            }
            if (endVal !== '') {
                if (endVal < startVal) {
                    alert('开始日期不能大于结束日期');
                    return;
                }
            }
            if (startVal == '') {
                startVal = "2000-01-01";
            }
            if (endVal == '') {
                endVal = $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd');
                ;
            }
            Time[i].startTime = startVal;
            Time[i].endTime = endVal;
            getTable(maps[i]);
        });
    });


    //点击事件的flag
    var flagPurchase = true;
    //点击转让
    $('body').on('click', '.J_makOever', function () {
        tenderId = $(this).attr('tenderId');
        //债权还款日当天不可以转让
        var today = new Date().getTime();
        if ($(this).attr('nextTime') == today) {
            dialog({
                content: "<div class='dimension operate-tip'>"
                + "<i class='c_close close_x'>×</i>"
                + "<h5>提示</h5>"
                + "<div class='tip-content'>"
                + "<p>该笔债权因今日即为债权还款日，当前不可转让！</p>"
                + "<p>该笔债权已取消转让！</p>"
                + "<a href='#' class='btn c_close'>确认</a>"
                + "</div>"
                + "</div>",
                id: "",
                confirm: function (art) {

                },
                cancel: function (art) {
                    art.remove();
                }
            });
        } else {
            //转让债权数据渲染
            $.xxdAjax({
                url: '/tradeCenter/borrowTender/queryTradeRequestDetail',
                clientId: 'XXD_FRONT_END',
                type: 'get',
                data: {
                    tenderId: tenderId
                },
                token: token,
                callback: function (data) {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.resultCode == 0) {
                            var row = data.desc;
                            repayMoney = row.repayCapital - row.funds;   //转让总价
                            dialog({
                                content: "<div class='dimension'>"
                                + "<i class='c_close close_x'>×</i>"
                                + "<h5>转让债权</h5>"
                                + "<div class='investment-focus'>"
                                + "<span>标的名称：<i>" + row.borrowName + "</i></span><span>债权编号：<em>" + row.tenderId + "</em></span>"
                                + "<span>预期待收本息：<i>" + side.numberFormat(row.repaymentAmount) + "</i>元</span><span>年化收益：<em>" + row.rateYear + "%</em></span>"
                                + "<span>已收期数/剩余期数：<em>" + row.receivedNumber + "/" + row.remainNumber + "期</em></span><span>债权价值：<em>" + side.numberFormat(row.repayCapital) + "</em>元</span>"
                                + "<span class='transfer'>转让总价：<i>" + side.numberFormat(repayMoney) + "</i>元</span>"
                                + "<span class='service-charge'>手续费：<i>" + row.transferLowerFee + "</i>元</span>"
                                + "<div class='service-tip'><i class='default-mark'>?</i>"
                                + "<p class='default-tip hide'>债权转让手续费为转让金额的千分之五，最低2元<i></i></p></div>"
                                + "<p class='no-privileges'><input type='checkbox'>无优惠转让</p>"
                                + "<p class='password-box'>支付密码："
                                + "<input type='password' placeholder='请输入支付密码' class='password'><a href='/user/iforgetpaypassword.html' target='_blank'>忘记密码？</a></p>"
                                + "<p class='verification-tip'>图片验证码："
                                + "<input type='text' placeholder='请输入图片验证码' class='verification-code'></p>"
                                + "<div class='verification-box clearfix'>"
                                + "<img src='/userCenter/kaptcha.jpg' alt='' class='verifyUrl'><a href='#' class='refresh'><i></i></a></div>"
                                + "<div class='authorization'><input type='checkbox' checked>我已阅读并同意 <a href='/introduce/agreement_credittrainsfer.jsp' target='_blank'>《债权转让协议》</a></div>"
                                + "<p class='pop-error hide'></p>"
                                + "<a href='#' class='btn active J_submitTransfer'>确认转让</a>"
                                + "<a href='#' class='btn next c_close'>取消转让</a>"
                                + "</div>"
                                + "</div>",
                                id: "",
                                confirm: function (art) {

                                },
                                cancel: function (art) {
                                    art.remove();
                                }
                            });
                        } else {
                            side.thisDialog(data.desc);
                        }
                    } else {
                        side.thisDialog('网络故障，请刷新重试');
                    }
                },
                error: function () {
                    side.thisDialog('网络故障，请刷新重试');
                }
            })
        }

    });
    $('body').on('mousemove', '.default-mark', function () {
        $('.default-tip').removeClass('hide');
    });
    $('body').on('mouseout', '.default-mark', function () {
        $('.default-tip').addClass('hide');
    });
    //确认转让
    $('body').on('click', '.J_submitTransfer', function () {
        transferSubmit();
    });
    function transferSubmit() {
        //验证支付密码与验证码
        if (flagPurchase) {
            flagPurchase = false;
            $.xxdAjax({
                url: '/tradeCenter/borrowTender/assignmentOfCredit',
                clientId: 'XXD_FRONT_END',
                type: 'put',
                token: token,
                data: JSON.stringify({
                    "data": {
                        "requestAmount": repayMoney,
                        "tenderId": tenderId,
                        "payPassword": $.md5($('.password').val()),
                        "verifyCode": $('.verification-code').val()
                    }
                }),
                callbacks: function (data) {
                    $('.J_submitTransfer').addClass('waiting').html('转让中，请稍等...');
                    if (data.code = "200000") {
                        if (data.data) {
                            if (data.data.bizStatus.code == 'SUCCESS') {
                                $('.pop-error').addClass('hide');
                                $('.mui-dialog').remove();
                                side.thisDialog('转让成功！');
                                getTable(maps[0]);
                            } else {
                                $('.pop-error').html(data.data.bizStatus.message).removeClass('hide');
                                $('.J_submitTransfer').removeClass('waiting').html('确认转让');
                            }
                        } else {
                            $('.pop-error').html(data.message).removeClass('hide');
                            $('.J_submitTransfer').removeClass('waiting').html('确认转让');
                        }
                    }
                    flagPurchase = true;
                },
                error: function () {
                    side.thisDialog('网络故障，请刷新重试');
                    $('.J_submitTransfer').removeClass('waiting').html('确认转让');
                    flagPurchase = true;
                }
            })
        }
    }


    side.getLeftHeight();


    //点击撤销
    var requestId;
    $('body').on('click','.J_revocation',function () {
        requestId = $(this).attr('requestId');
        console.log(requestId);
        dialog({
            content: "<div class='dimension operate-tip'>"
            +"<i class='c_close close_x'>×</i>"
            +"<h5>提示</h5>"
            +"<div class='tip-content'>"
            +"<p>撤销此债权转让后，将停止发布转让信息，您将继续持有该笔债权。</p>"
            +"<p class='password-box'>支付密码："
            +"<input type='password' placeholder='请输入支付密码' class='password'>"
            +"<a href='/user/iforgetpaypassword.html' target='_blank' class='forgot'>忘记密码？</a></p>"
            +"<p class='pop-error hide'></p><div class='allbtn'><a href='#' class='btn active J_affirmRevocation' id='affirm'>确认撤销</a>"
            +"<a href='#' class='btn next' id='cancel'>继续等待转让</a></div></div></div>",
            id: "",
            confirm: function (art) {

            },
            cancel: function (art) {
                art.remove();
            }
        });
    });
    //确认撤销
    $('body').on('click','.J_affirmRevocation',function () {
        $.xxdAjax({
            url: '/tradeCenter/borrowTender/undoAssignmentOfCredit',
            clientId: 'XXD_FRONT_END',
            type: 'put',
            data: JSON.stringify({
                "data": {
                    "requestId": requestId,
                    "payPassword": $.md5($('.password').val())
                }
            }),
            token: token,
            callback: function (data) {
                if (data) {
                    if (data.bizStatus) {
                        if(data.bizStatus.code == 'SUCCESS'){
                            $('.mui-dialog').remove();
                            side.thisDialog('撤销成功');
                        }else{
                            $('.pop-error').html(data.bizStatus.message).removeClass('hide');
                        }
                    } else {
                        $('.pop-error').html('网络故障，请刷新重试!').removeClass('hide');
                    }
                } else {
                    $('.pop-error').html('网络故障，请刷新重试!').removeClass('hide');
                }
            },
            error: function () {
                side.thisDialog('网络故障，请刷新重试');
            }
        })
    });

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

