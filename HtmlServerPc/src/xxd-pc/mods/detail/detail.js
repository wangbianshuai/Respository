define(['base', 'paging', 'store', "dialog", "md"], function ($, paging, store, dialog, md) {
    var token = store && store.get("token") || {};
    var productName;
    var common = {
        judegName: function () {
            if (window.location.href.indexOf('monthgold') >= 0) {
                return productName = '月进斗金';
            } else if (window.location.href.indexOf('sevengold') >= 0) {
                return productName = '七天大胜';
            } else if (window.location.href.indexOf('newtender') >= 0) {
                return productName = '新手标';
            }
        },
        fillTable: function (tableData) {
            var title = '<tr class="tr-title"><th>序号</th><th>出借人</th><th>加入金额</th><th>加入时间</th></tr>';
            var contentArray = [];
            for (var i = 0, j = tableData.length; i < j; i++) {
                var row = tableData[i];
                var lastClass = "";
                if (i == j - 1) lastClass = "class='last'";
                contentArray.push('<tr ' + lastClass + '>');
                contentArray.push('<td>' + (i + 1) + '</td>');
                contentArray.push('<td>' + row.userName + '</td>');
                contentArray.push('<td>' + row.account + '</td>');
                contentArray.push('<td>' + $.fnDateToString(row.addTime, 'yyyy-MM-dd  HH:mm:ss') + '</td>');
                contentArray.push('</tr>');

            }
            return title + contentArray.join("");
        },
        matchFillTable: function (tableData) {
            common.judegName();
            var title = '<tr class="tr-title"><th>项目名称</th><th>借款金额</th><th>借款利率</th><th>借款期限</th></tr>';
            var contentArray = [];
            for (var i = 0, j = tableData.length; i < j; i++) {
                var row = tableData[i];
                var lastClass = "";
                if (i == j - 1) lastClass = "class='last'";
                contentArray.push('<tr ' + lastClass + '>');
                contentArray.push('<td><a target="_blank" href="' + encodeURI(encodeURI("/borrow/detail/" + row.borrowId + ".html?proname=" + productName)) + '">' + row.name + '</a></td>');
                contentArray.push('<td>' + row.account + '</td>');
                contentArray.push('<td>' + row.apr + '</td>');
                contentArray.push('<td>' + row.period + row.periodUnit + '</td>');
                contentArray.push('</tr>');
            }
            return title + contentArray.join("");
        },
        //新宜贷
        consumpFillTable: function (tableData) {
            var contentArray = [];
            for (var i = 0, j = tableData.length; i < j; i++) {
                var row = tableData[i];
                var proWidth = (row.bidAmount - row.leftTenderAmount) / row.bidAmount * 100;
                contentArray.push('<div class="consumption-list"><div class="list clearfix"><div class="list-infomation">');
                contentArray.push('<div class="account-img f-left"><div class="img-bg grade'+row.riskGrade+'">' +
                    '<p>新新贷根据内部风控部门制定的风险定价策略，将借款项目按从低到高分为 A-E 5个风险评级，不同的风险评级将对应不同的借款利率及风险，请您谨慎选择<i></i></p>' +
                    '</div></div>');
                contentArray.push('<div class="list-focus f-left"><h4><a href="' + '/detail/consumption/' + row.bidCode + '.html' + '" target="_blank">' + row.bidName + '</a><span class="consumption-icon"><i><b></b></i>新宜贷</span></h4>');
                contentArray.push('<p>历史年化收益：<span class="annualized-returns">' + row.plannedAnnualRate.toFixed(2) + '</span><i>%</i></p>');
                contentArray.push('<p class="time-limit">期限：<span class="limit-month">' + row.leastPeriodValue + '</span>个月</p></div></div><div class="f-left consumption-detail">');
                contentArray.push('<p class="surplus">剩余：<span>' + row.leftTenderAmount + '</span>元</p>');
                contentArray.push('<div class="progress-bar"><div class="existing" style="width: ' + proWidth + '%;"></div></div><p>借款金额：<span>' + row.bidAmount + '</span>元</p>');
                if (row.status.code != 'BIDDING') {
                    contentArray.push('<a href="javascript:;" class="purchase no-purchase">已抢光</a></div>');
                    contentArray.push('</div></div></div>');
                } else {
                    contentArray.push('<a href="' + '/detail/consumption/' + row.bidCode + '.html' + '" target="_blank" class="purchase how-purchase">立即加入</a></div>');
                    contentArray.push('</div></div></div>');
                }
            }
            return contentArray.join("");
        },
        //贷款记录
        loanFillTable: function (tableData) {
            var contentArray = [];
            var title = '<tr class="tr-title"><th>借款标题</th><th>借款金额</th><th>借款利率</th><th>借款期限</th><th>状态</th></tr>';
            for (var i = 0, j = tableData.length; i < j; i++) {
                var row = tableData[i];
                var lastClass = "";
                if (i == j - 1) lastClass = "class='last'";
                contentArray.push('<tr ' + lastClass + '>');
                contentArray.push('<td>' + row.bidName + '</td>');
                contentArray.push('<td>' + common.numberFormat(row.bidAmount) + '</td>');
                contentArray.push('<td>' + row.plannedAnnualRate.toFixed(2) + '%</td>');
                contentArray.push('<td>' + row.leastPeriodValue + '个月</td>');
                contentArray.push('<td>' + row.status.message + '</td>');
                contentArray.push('</tr>');

            }
            return title + contentArray.join("");
        },

        //投标记录
        tenderFillTable: function (tableData) {
            var title = '<tr class="tr-title"><th>投标人</th><th>投标金额</th><th>投标时间</th><th>状态</th></tr>';
            var contentArray = [];
            for (var i = 0, j = tableData.length; i < j; i++) {
                var row = tableData[i];
                var lastClass = "";
                if (i == j - 1) lastClass = "class='last'";
                contentArray.push('<tr ' + lastClass + '>');
                contentArray.push('<td>' + row.borrower + '</td>');
                contentArray.push('<td>' + common.numberFormat(row.tenderAmount) + '</td>');
                contentArray.push('<td>' + $.fnDateToString(row.tenderDate, 'yyyy-MM-dd  HH:mm:ss') + '</td>');
                contentArray.push('<td>' + row.status.message + '</td>');
                contentArray.push('</tr>');
            }
            return title + contentArray.join("");
        },
        rateEarning: function (day, rate, floatApr, capital) {
            if (floatApr == 0) {
                var apr = Math.floor(rate * capital / 360 * day * 100)/100;
                return apr;
            } else {
                var apr = Math.floor(rate * capital / 360 * day * 100)/100;
                var float=Math.floor(capital * floatApr / 360 * day*100)/100;
                var sum= (apr+float).toFixed(2);
                return sum;
            }
        },
        tabs: function (object, productId) {
            var me = this;
            var $tabs = object.tabsObject;
            var $tabsli = $tabs.find("li"), $tabContents = $(".j_tabContent");
            $tabsli.on("click", function (ev) {
                var $me = $(this);
                var index = $tabsli.index($me);
                $tabsli.removeClass("active").eq(index).addClass("active");
                $tabContents.addClass("hide").eq(index).removeClass("hide");
            });
            var detailRecord = store && store.get("detailRecord") || {};
            var $tableRecord = object.tableObject;
            if (!$.isEmptyObject(detailRecord)) {
                $.extend(detailRecord, {
                    $dom: object.pagination,
                    callback: function (pagingObj) {
                        var hashPage = pagingObj.hashPage;
                        var pageIndex = pagingObj.pageIndex;
                        var tableData;
                        if (tableData = hashPage.get(pageIndex)) {
                            //repeat table
                            $tableRecord.html(me.fillTable(tableData));
                        } else {
                            $.xxdAjax({
                                url: object.padingUrl,
                                clientId: 'XXD_FRONT_END',
                                type: 'get',
                                data: {
                                    currentPage: pagingObj.pageIndex,
                                    pageSize: pagingObj.pageSize,
                                    reglintstId: productId
                                },
                                callback: function (data) {
                                    var tableData = data.items;
                                    hashPage.put(data.currentPage, tableData);
                                    paging.pagingObj = pagingObj;
                                    $tableRecord.html(me.fillTable(tableData));
                                }
                            });
                        }
                    }
                });
                paging(detailRecord);
            }
            if (detailRecord.total == 0) {
                $tableRecord.append("<tr class='no-record'><td colspan='4'>没有投标记录</td> </tr>");
            }

            //债券匹配

            var matchDetailRecord = store && store.get("matchDetailRecord") || {};
            var $matchTableRecord = object.matchTableObject;
            var a = 0;

            function _ajax(pagingObj) {
                var hashPage = pagingObj.hashPage || $.Map();
                var pageIndex = pagingObj.pageIndex || 1;
                var tableData;
                if (tableData = hashPage.get(pageIndex)) {
                    //repeat table
                    $matchTableRecord.html(me.matchFillTable(tableData));
                } else {
                    $.xxdAjax({
                        url: object.matchPadingUrl,
                        clientId: 'XXD_FRONT_END',
                        type: 'get',
                        data: {
                            currentPage: pageIndex,
                            pageSize: pagingObj.pageSize || 10,
                        },
                        callback: function (data) {
                            a++;
                            var tableData = data.items;
                            hashPage.put(data.currentPage, tableData);
                            paging.pagingObj = pagingObj;
                            $matchTableRecord.html(me.matchFillTable(tableData));
                            matchDetailRecord['total'] = data.totalCount;
                            matchDetailRecord['pageSize'] = 10;
                            matchDetailRecord['pageIndex'] = data.currentPage;
                            if (a == 1) {
                                paging(matchDetailRecord);
                            }
                        }
                    });
                }
            }


            if (true || !$.isEmptyObject(matchDetailRecord)) {
                $.extend(matchDetailRecord, {
                    $dom: object.matchPagination,
                    callback: function (pagingObj) {
                        _ajax(pagingObj);
                    }
                });
                _ajax(matchDetailRecord);
            }
            if (matchDetailRecord.total == 0) {
                $matchTableRecord.append("<tr class='no-record'><td colspan='4'>没有投标记录</td> </tr>");
            }


            //新宜贷页面数据渲染
            var detailConsumeRecord = store && store.get("detailConsumeRecord") || {};
            var $tableConsumeRecord = object.consumeTableObject;
            if (!$.isEmptyObject(detailConsumeRecord)) {
                $.extend(detailConsumeRecord, {
                    $dom: object.consumePagination,
                    callback: function (pagingObj) {
                        var hashPage = pagingObj.hashPage;
                        var pageIndex = pagingObj.pageIndex;
                        var tableData;
                        if (tableData = hashPage.get(pageIndex)) {
                            $tableConsumeRecord.html(me.consumpFillTable(tableData));
                        } else {
                            $.xxdAjax({
                                url: object.consumePadingUrl,
                                clientId: 'XXD_FRONT_END',
                                type: 'get',
                                data: {
                                    keyType: 3,
                                    status: '["BIDDING", "REPAYING","SATISFIED_BID","REPAY_OVER"]',
                                    productCategory: 'P001',
                                    currentPage: pagingObj.pageIndex,
                                    pageSize: pagingObj.pageSize,
                                },
                                callback: function (data) {
                                    var tableData = data.items;
                                    hashPage.put(data.currentPage, tableData);
                                    paging.pagingObj = pagingObj;
                                    $tableConsumeRecord.html(me.consumpFillTable(tableData));
                                    for (var i = 0, j = tableData.length; i < j; i++) {
                                        var row = tableData[i];
                                        if (row.status.code != 'BIDDING') {
                                            $('.how-purchase').eq(i).addClass('no-purchase').html('已抢光').attr("href", "javascript:;");
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
                paging(detailConsumeRecord);
            }

            //贷款记录
            var detailloanRecordObj = store && store.get("detailloanRecordObj") || {};
            var $loanTableRecord = object.loanTableObject;
            var loannumber = 0;

            function _loanajax(pagingObj) {
                var hashPage = pagingObj.hashPage || $.Map();
                var pageIndex = pagingObj.pageIndex || 1;
                var tableData;
                if (tableData = hashPage.get(pageIndex)) {
                    //repeat table
                    $loanTableRecord.html(me.loanFillTable(tableData));
                } else {
                    $.xxdAjax({
                        url: object.loanPadingUrl,
                        clientId: 'XXD_FRONT_END',
                        type: 'get',
                        data: {
                            currentPage: pageIndex,
                            pageSize: pagingObj.pageSize || 10,
                        },
                        callbacks: function (data) {
                            if (data.code == "200000") {
                                data = data.data;
                                $('#totalLoan').html(common.numberFormat(data.sumAmount));
                                $('#noRepay').html(common.numberFormat(data.dueRepaymentAmount));
                                // $('#mastRepay').html(common.numberFormat(data.dueChargeAmount));
                                $('#repayTimes').html(data.normalLoan);
                                $('#noRepayTimes').html(data.overdueCount);
                                $('#firstLoan').html($.fnDateToString(data.firstLoanTime, 'yyyy-MM-dd  HH:mm:ss'));
                                loannumber++;
                                var tableData = data.simplePageInfo.items;
                                hashPage.put(data.simplePageInfo.currentPage, tableData);
                                paging.pagingObj = pagingObj;
                                $loanTableRecord.html(me.loanFillTable(tableData));
                                detailloanRecordObj['total'] = data.simplePageInfo.totalCount;
                                detailloanRecordObj['pageSize'] = 10;
                                detailloanRecordObj['pageIndex'] = data.simplePageInfo.currentPage;
                                if (loannumber == 1) {
                                    paging(detailloanRecordObj);
                                }
                                if (detailloanRecordObj.total == 0) {
                                    $loanTableRecord.append("<tr class='no-record'><td colspan='5'>没有贷款记录</td> </tr>");
                                }
                            } else {
                                $loanTableRecord.append("<tr class='no-record'><td colspan='5'>没有贷款记录</td> </tr>");
                            }
                        }
                    });
                }
            }

            if (true || !$.isEmptyObject(detailloanRecordObj)) {
                $.extend(detailloanRecordObj, {
                    $dom: object.loanPagination,
                    callback: function (pagingObj) {
                        _loanajax(pagingObj);
                    }
                });
                _loanajax(detailloanRecordObj);
            }


            //投标记录
            var detailtenderRecordObj = store && store.get("detailtenderRecordObj") || {};
            var $tenderTableRecord = object.tenderTableObject;
            var tendernumber = 0;

            function _tenderajax(pagingObj) {
                var hashPage = pagingObj.hashPage || $.Map();
                var pageIndex = pagingObj.pageIndex || 1;
                var tableData;
                if (tableData = hashPage.get(pageIndex)) {
                    //repeat table
                    $tenderTableRecord.html(me.tenderFillTable(tableData));
                } else {
                    $.xxdAjax({
                        url: object.tenderPadingUrl,
                        clientId: 'XXD_FRONT_END',
                        type: 'get',
                        data: {
                            currentPage: pageIndex,
                            pageSize: pagingObj.pageSize || 10,
                        },
                        callbacks: function (data) {
                            if (data.code == "200000") {
                                data = data.data;
                                tendernumber++;
                                var tableData = data.items;
                                hashPage.put(data.currentPage, tableData);
                                paging.pagingObj = pagingObj;
                                $tenderTableRecord.html(me.tenderFillTable(tableData));
                                detailtenderRecordObj['total'] = data.totalCount;
                                detailtenderRecordObj['pageSize'] = 10;
                                detailtenderRecordObj['pageIndex'] = data.currentPage;
                                if (tendernumber == 1) {
                                    paging(detailtenderRecordObj);
                                }
                                if (detailtenderRecordObj.total == 0) {
                                    $tenderTableRecord.append("<tr class='no-record'><td colspan='4'>没有投标记录</td> </tr>");
                                }
                            } else {
                                $tenderTableRecord.append("<tr class='no-record'><td colspan='4'>没有投标记录</td> </tr>");
                            }
                        }
                    });
                }
            }

            if (true || !$.isEmptyObject(detailtenderRecordObj)) {
                $.extend(detailtenderRecordObj, {
                    $dom: object.tenderPagination,
                    callback: function (pagingObj) {
                        _tenderajax(pagingObj);
                    }
                });
                _tenderajax(detailtenderRecordObj);
            }
        },


        //风险测试
        riskAssessment: function (callback) {
            $.ajax({
                url: "/question/hasComplete.html?" + new Date().getTime(),
                data: {},
                type: "POST",
                dataType: 'json',
                success: function (data) {
                    if (data.resultCode == 1) {
                        dialog({
                            content: "<div class='measurement-tip'> " +
                            "<h3><i></i>温馨提示<span class='c_close'>×</span></h3> " +
                            "<p>为了不影响您的出借，请先进行风险承受能力评估（仅需花费您10秒钟）</p> " +
                            "<div><a href='/usercenter/questionnaire.html?location=1'>开始测试</a></div> " +
                            "</div>",
                            id: "",
                            confirm: function (art) {
                            },
                            cancel: function (art) {
                                art.remove();
                            }
                        });
                    } else {
                        callback();
                    }
                }
            })
        },
        redReturns: function (val, callback, errorCallback) {
            $.xxdAjax({
                url: '/tradeCenter/redenvelope/redenvelopeRecord',
                clientId: 'XXD_FRONT_END',
                token: token,
                type: 'get',
                data: {
                    'investmentAmount': val,
                },
                callbacks: function (data) {
                    callback(data);
                },
                error: function () {
                    errorCallback()
                }
            });
        },
        investment: function (obj) {
            dialog({
                content: "<div class='dimension'> " +
                "<i class='c_close'>×</i>" +
                "<h5>确认出借</h5> " +
                "<div class='investment-focus'> " +
                "<span>产品名称：" + obj.name + "</span><span class='past-earnings'>历史年化收益：<em class='past-returns'>" + obj.apr + "</em>%<b class='J_floatApr past-floatApr'>+" + obj.floatApr + "%<i></i></b></span> " +
                "<span>出借金额：<i>" + obj.val + "元</i></span><span class='expect-income'>历史收益：<i>" + obj.income + "元</i></span> " +
                "<p class='act-pay'>实际支付：<i class='actualPayment'>" + obj.actualPayment + "</i>元</p><div class='discount'>" + obj.discountCoupon + "</div>" +
                "<p class='password-box'>支付密码：" +
                "<input type='password' placeholder='请输入支付密码' class='password'><a href='/user/iforgetpaypassword.html' target='_blank'>忘记密码？</a></p> " +
                "<p class='verification-tip'>图片验证码：" +
                "<input type='text' placeholder='请输入图片验证码' class='verification-code'></p><div class='verification-box clearfix'>" +
                "<img src='/userCenter/kaptcha.jpg" +
                "' alt='' class='verifyUrl'><a href='#' class='refresh'><i></i></a>" +
                "</div> " +
                "<p>资金由存管银行全程监控</p> " +
                "<div class='authorization'><input type='checkbox'>我已同意 <a href='/borrow/automaticMatchingProxy.html' target='_blank'>《自动配标委托书》</a>" +
                "<a href=" + obj.url + " target='_blank'>《" + obj.agreement + "服务协议》</a>" +
                "<a href='/borrow/esignatureProxy.html' target='_blank'>《电子签名（章）授权委托书》</a></div> " +
                "<p class='pop-error hide'></p>" +
                "<a href='#' class='btn J_purchase'>确认出借</a> " +
                "</div> " +
                "</div>",
                id: "",
                confirm: function (art) {

                },
                cancel: function (art) {
                    art.remove();
                }
            });
            if (!obj.floatApr) {
                $('.J_floatApr').addClass('hide');
            }
            $(document).on('click', '.verifyUrl', function () {
                $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
            });
            $(document).on('click', '.refresh', function () {
                $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
            });
        },
        investmentXYD:function (obj) {
            dialog({
                content: "<div class='dimension'> " +
                "<i class='c_close'>×</i>" +
                "<h5>确认投标</h5> " +
                "<div class='investment-focus'> " +
                "<span class='headline'>借款标题：" + obj.bidName + "</span><span >借款编号：<em class='serial-number'>" + obj.bidCode + "</em></span> " +
                "<span>投标金额：<i>" + obj.investMoney + "</i>元</span><span class='expect-income'>年化收益：<em>" + obj.plannedAnnualRate + "%</em></span> " +
                "<span>投标奖励：<em>无</em></span><span>还款期限：<em>" + obj.leastPeriod + "个月</em></span> " +
                "<span class='act-pay'>实际支付：<i class='actualPayment'>" + obj.actualPayment + "</i>元</span><span>预计到期本息：<i>" + obj.allIncome + "</i>元</span>" +
                // "<br><div class='discount'>" + obj + "</div>" +
                "<p class='password-box'>支付密码：" +
                "<input type='password' placeholder='请输入支付密码' class='password'><a href='/user/iforgetpaypassword.html' target='_blank'>忘记密码？</a></p> " +
                "<p class='verification-tip'>图片验证码：" +
                "<input type='text' placeholder='请输入图片验证码' class='verification-code'></p><div class='verification-box clearfix'>" +
                "<img src='/userCenter/kaptcha.jpg" +
                "' alt='' class='verifyUrl'><a href='#' class='refresh'><i></i></a>" +
                "</div> " +
                "<div class='authorization'><input type='checkbox' checked>我已同意 <a href='/introduce/risknotice-agreement.jsp' target='_blank'>《新新贷资金出借风险提示函》</a></div> " +
                "<p class='pop-error hide'></p>" +
                "<a href='#' class='btn J_purchase'>确认投标</a> " +
                "</div> " +
                "</div>",
                id: "",
                confirm: function (art) {

                },
                cancel: function (art) {
                    art.remove();
                }
            });
            $(document).on('click', '.verifyUrl', function () {
                $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
            });
            $(document).on('click', '.refresh', function () {
                $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
            });
        },
        passwordVerify: function (callback, errorCallback) {
            $.xxdAjax({
                url: '/userCenter/user/validatePayPwdByTokenWithValidate',
                clientId: 'XXD_FRONT_END',
                type: 'post',
                token: token,
                data: JSON.stringify({
                    "data": {
                        "picCode": $('.verification-code').val(),
                        "payPassword": $.md5($('.password').val())
                    }
                }),
                callbacks: function (data) {
                    callback(data);
                },
                error: function () {
                    errorCallback();
                }
            });
        },
        investOrder: function (obj, callback, errorCallback, completeCallback) {
            $.xxdAjax({
                url: '/tradeCenter/InvestOrder',
                clientId: 'XXD_FRONT_END',
                type: 'put',
                token: token,
                data: JSON.stringify({
                    "data": {
                        'productCategory': obj.productCategory,
                        'productId': obj.productId,
                        'productType': obj.productType,
                        'redEnvelopeCode': obj.redEnvelopeCode,
                        'tenderAmount': obj.tenderAmount,
                    }
                }),
                callbacks: function (data) {
                    callback(data);
                },
                error: function () {
                    errorCallback();
                },
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        ajaxTimeoutTest.abort();
                        completeCallback();
                    }
                }
            });
        },
        checkAuthorizedQuota:function(result,successCallback,errorCallback,completeCallback) {
            // var dataJson={'tenderAmount':result.tenderAmount};
            $.xxdAjax({
                url:'/tradeCenter/InvestOrder/checkAuthorizedQuota?tenderAmount='+result.tenderAmount,
                clientId: 'XXD_FRONT_END',
                token:result.token,
                type: 'GET',
                async: false,
                data:{},
                callbacks: function (data) {
                    successCallback(data);
                },
                error: function () {
                    errorCallback();
                },
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        ajaxTimeoutTest.abort();
                        completeCallback();
                    }
                }

            })
        },
        showAuthorizedMsg:function (msg,allStyle) {
            $('.mui-dialog').remove();
            dialog({
                content: "<div class='dimension operate-tip'>"
                + "<i class='c_close close_x'>×</i>"
                + "<h5>抱歉</h5>"
                + "<div class='tip-content'>"
                + "<p>"+msg+"</p>"
                + "<a href='#' class='btn close-x "+ allStyle.wth +"'>好的</a>"
                + "<a href='#' class='btn  small-btn next "+ allStyle.show +"' id='J_goAuthorized'>去授权</a>"
                + "</div>"
                + "</div>",
                id: "",
                confirm: function (art) {

                },
                cancel: function (art) {
                    art.remove();
                }
            });
        },
        //立即出借按钮时候判断
        preInvest:function (tenderAmount,callbacks) {
            var checkResult={
                'token':token,
                'tenderAmount':tenderAmount,
            };
            var msg,submitAll,oDom='',reResult = true;
            common.checkAuthorizedQuota(checkResult,function(data){
                if(data.code==="200000"){
                    //需要去授权的
                    if(data.data.code) {
                        if (data.data.code == "NOT_AUTHORITY" || data.data.code == "AUTHORIZED_QUOTA_INSUFFICIENT" || data.data.code == "AUTHORIZED_TERM_INSUFFICIENT") {
                            $('body').append('<form class="disnone" action="" method="post" id="J_submitAuthoriz" target="_blank"></form>');
                            msg = data.data.message;
                            common.showAuthorizedMsg(msg, {wth: 'small-btn', show: ''});
                            if (data.data.data && (submitAll = data.data.data)) {
                                $.each(submitAll, function (index, item) {
                                    if (index != 'requestUrl') {
                                        oDom += ('<input type="text" name="' + index + '" value="' + item + '"/>');
                                    } else {
                                        $('#J_submitAuthoriz').attr('action', item);
                                    }

                                });
                                $('#J_submitAuthoriz').html(oDom);
                            }
                            reResult = false;
                            callbacks && callbacks(reResult);
                        } else {
                            //直接弹窗
                            msg = data.data.message;
                            common.showAuthorizedMsg(msg, {wth: '', show: 'disnone'});
                            reResult = false;
                            callbacks && callbacks(reResult);
                        }
                    }else{
                        reResult = true;
                        callbacks && callbacks(reResult);
                    }
                }
            },function () {
                msg='网络异常，请刷新重试!';
                common.showAuthorizedMsg(msg,{wth:'',show:'disnone'});
                reResult=false;
                callbacks && callbacks(reResult);
            },function () {
                msg='请求超时，请检查您的网络和出借记录，避免重复出借';
                common.showAuthorizedMsg(msg,{wth:'',show:'disnone'});
                reResult=false;
                callbacks && callbacks(reResult);
            });
        },
        showInvestment:function(investmentObj) {
            //购买授权判断
            var tenderA=investmentObj.actualPayment;
            common.preInvest(tenderA,function(result){
                if(!result){
                    return false;
                }else{
                    common.investment(investmentObj);
                }
            });
        },
        //购买新宜贷产品
        showInvestmentXYD:function(tenderAmount,investmentObj) {
            //购买授权判断
            common.preInvest(tenderAmount,function(result){
                if(!result){
                    return false;
                }else{
                    common.investmentXYD(investmentObj);
                }
            });
        },
        keyDown: function () {
            $("body").keydown(function () {
                if (event.keyCode == "13") {
                    $('.J_purchase').click();
                }
            });
        },
        numberFormat: function (num) {   //数字变成千分位表达式
           if(num || num==0){
               if (typeof num == 'string') {
                   num = +num;
               }
               return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
           }
        },
        delcommafy: function (num) {
            if ((num + "").trim() == "") {
                return "";
            }
            num = num.replace(/,/gi, '');
            return +num;
        }
    };
    return common;
});