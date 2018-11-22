define(['base', 'paging', 'store', "md", "laydate", "dialog"], function ($, paging, store, md, laydate, dialog) {
    var token = store && store.get("token") || {};
    var joinId = $.getUrlParam('join', location.search);
    var sysStatus = [
        {"status": "-3", "value": "投标取消", "class": "pink"},
        {"status": "-2", "value": "签约失败", "class": "pink"},
        {"status": "-1", "value": "投标失败", "class": "pink"},
        {"status": "0", "value": "投标中", "class": "yellow"},
        {"status": "1", "value": "还款中", "class": "green"},
        {"status": "2", "value": "还款结束", "class": "green"},
        {"status": "3", "value": "待签约", "class": "orange"}
    ];
    var period=[
        {"periodUnit":"MONTH","val":"个月"},
        {"periodUnit":"DAY","val":"天"},
        {"periodUnit":"YEAR","val":"年"}
    ];
    var common = {
        getStatus:function () {
            var sysStatus = [
                {"status": "-1", "value": "购买失败","class":"red"},
                {"status": "0", "value": "购买中","class":"blue"},
                {"status": "1", "value": "购买成功","class":"yellow"},
                {"status": "2", "value": "到期退出","class":"red"},
                {"status": "3", "value": "提前退出","class":"red"},
                {"status": "4", "value": "正在退出","class":"pink"},
            ];
            return sysStatus;
        },
        getLeftHeight:function () {
            var clocks = setInterval(function(){
                if(parseInt($('.g-left').height()) != parseInt($('.g-right').height())){
                    $('.g-left').css('min-height',$('.g-right').height() + 'px');
                }else{
                    clearInterval(clocks);
                }
            },100);
        },
        tabs: function (object) {
            var $tabs = object.tabsObject;
            var $tabsli = $tabs.find("li"), $tabContents = $(".j_tabContent");
            $tabsli.on("click", function (ev) {
                var $me = $(this);
                var index = $tabsli.index($me);
                $tabsli.removeClass("active").eq(index).addClass("active");
                $tabContents.addClass("hide").eq(index).removeClass("hide");
                var clocks = setInterval(function(){
                    if(parseInt($tabContents.height()) != parseInt($('.g-right').height())){
                        $('.g-left').css('min-height',$('.g-right').height() + 'px');
                    }else{
                        clearInterval(clocks);
                    }
                },100);
            });
        },
        creditorTable:function (tableData) {
            var title = '<tr class="title"><th>借款标题</th><th>借款金额</th><th>借款利率</th>'
                + '<th>借款期限</th><th>债权状态</th><th>投标时间</th><th>债权协议</th></tr>';
            var contentArray = [];
            var classColor;
            for (var i = 0, j = tableData.length; i < j; i++) {
                var row = tableData[i];
                $.each(sysStatus, function (i, v) {
                    if (row.status == v.status) {
                        row.status = v.value;
                        classColor = v.class;
                    }
                });
                $.each(period, function (i, v) {
                    if (row.periodUnit == v.periodUnit) {
                        row.periodUnit = v.val;
                    }
                });
                contentArray.push("<tr>");
                contentArray.push("<td><a href='/borrow/detail/"+row.borrowid+".html' target='_blank'>" + row.name + "</a></td>");
                contentArray.push("<td>" + common.numberFormat(row.account) + "元</td>");
                contentArray.push("<td>" + row.apr + "%</td>");
                contentArray.push("<td>" + row.period + row.periodUnit + "</td>");
                contentArray.push("<td><i class='" + classColor + "'>" + row.status + "</i></td>");
                contentArray.push("<td>" + $.fnDateToString(row.addTime, 'yyyy-MM-dd  HH:mm:ss') + "</td>");
                contentArray.push("<td class='main-color'><a target='_blank' href='/borrow/borrowcontract.html?id="+row.borrowid+"&type=scheme' target='_blank'>查看协议</a></td>");
                contentArray.push("</tr>");
            }
            return title + contentArray.join("");
        },
        getCreditor:function (object) {
            var matchDetailRecord = store && store.get("matchDetailRecord") || {};
            var $matchTableRecord = object.creditorObject;
            var a = 0;

            function _ajax(pagingObj) {
                var hashPage = pagingObj.hashPage || $.Map();
                var pageIndex = pagingObj.pageIndex || 1;
                var tableData;
                if (tableData = hashPage.get(pageIndex)) {
                    //repeat table
                    $matchTableRecord.html(common.creditorTable(tableData));
                } else {
                    $.xxdAjax({
                        url: object.creditorPadingUrl,
                        clientId: 'XXD_FRONT_END',
                        type: 'get',
                        token: token,
                        data: {
                            currentPage: pageIndex,
                            pageSize: object.pageSize || 10,
                            joinId:joinId
                        },
                        callback: function (data) {
                            a++;
                            var tableData = data.list;
                            hashPage.put(data.pageNum, tableData);
                            paging.pagingObj = pagingObj;
                            $matchTableRecord.html(common.creditorTable(tableData));
                            matchDetailRecord['total'] = data.total;
                            matchDetailRecord['pageSize'] = object.pageSize || 10;
                            matchDetailRecord['pageIndex'] = data.pageNum;
                            if (a == 1) {
                                paging(matchDetailRecord);
                            }
                            if (matchDetailRecord.total == 0) {
                                $matchTableRecord.append("<tr class='no-record'><td colspan='7'>债权匹配中，请稍后！</td> </tr>");
                            }
                        },
                        error: function () {
                            $matchTableRecord.append("<tr class='no-record'><td colspan='7'>债权匹配中，请稍后！</td> </tr>");
                        }
                    });
                }
            }
            if (true || !$.isEmptyObject(matchDetailRecord)) {
                $.extend(matchDetailRecord, {
                    $dom: object.loanPagination,
                    callback: function (pagingObj) {
                        _ajax(pagingObj);
                    }
                });
                _ajax(matchDetailRecord);
            }
        },
        leftMenu: function (number) {
            $.each($('.menu ul li'), function () {
                $(this).find('div').css('display', 'none');
            });
            $('.menu ul li').eq(number).addClass('showTab');
            $('.showTab').find('div').css('display', 'block');
            $('.menu ul li a').on('click', function () {
                if ($(this).parent('li').attr('class') == 'showTab') {
                    $(this).parent('li').removeClass('showTab');
                    $(this).parent('li').find('div').css('display', 'none');
                } else {
                    $(this).parent('li').addClass('showTab');
                    $(this).parent('li').find('div').css('display', 'block');
                }
            });
        },
        //日历
        date: function (object) {
            lay(object).each(function () {   //循环给所有绑定
                laydate.render({
                    elem: this,
                    trigger: 'click',
                    theme: '#57a8ff'
                });
            });
        },
        //风险测试
        riskAssessment: function (callback) {
            $.ajax({
                url: "/question/hasComplete.html?" + new Date(),
                data: {},
                type: "POST",
                dataType: 'json',
                success: function (data) {
                    if (data.resultCode == 1) {
                        dialog({
                            content: "<div class='measurement-tip'> " +
                            "<h3><i></i>温馨提示<span class='c_close'>×</span></h3> " +
                            "<p>为了不影响您的投资，请先进行风险承受能力评估（仅需花费您10秒钟）</p> " +
                            "<div><a href='/question/toQuestionPage.html?termCode=riskEva20160117'>开始测试</a></div> " +
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
                "<h5>确认投资</h5> " +
                "<div class='investment-focus'> " +
                "<span>产品名称：" + obj.name + "</span><span class='past-earnings'>历史年化收益：<em class='past-returns'>" + obj.apr + "</em>%</span> " +
                "<span>投资金额：<i>" + obj.val + "元</i></span><span class='expect-income'>预期收益：<i>" + obj.income + "元</i></span> " +
                "<p class='act-pay'>实际支付：<i class='actualPayment'>" + obj.actualPayment + "</i>元</p><div class='discount'>" + obj.discountCoupon + "</div>" +
                "<p class='password-box'>支付密码：" +
                "<input type='password' placeholder='请输入支付密码' class='password'><a href='/user/iforgetpaypassword.html' target='_blank'>忘记密码？</a></p> " +
                "<p class='verification-tip'>图片验证码：" +
                "<input type='text' placeholder='请输入图片验证码' class='verification-code'></p><div class='verification-box clearfix'>" +
                "<img src='/userCenter/kaptcha.jpg" +
                "' alt='' class='verifyUrl'><a href='#' class='refresh'><i></i></a>" +
                "</div> " +
                "<p>账户资金由上海华瑞银行存管保障</p> " +
                "<div class='authorization'><input type='checkbox' checked=checked>我已同意 <a href='/borrow/automaticMatchingProxy.html' target='_blank'>《自动配标委托书》</a></div> " +
                "<div class='authorization'><input type='checkbox' checked=checked>我已阅读并同意 <a href=" + obj.url + " target='_blank'>《" + obj.agreement + "服务协议》</a></div> " +
                "<p class='pop-error hide'></p>" +
                "<a href='#' class='btn J_purchase'>确认投资</a> " +
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
        verification:function () {
            //验证码
            $(document).on('click', '.verifyUrl', function () {
                $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
            });
            $(document).on('click', '.refresh', function () {
                $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
            });
        },
        earlyQuit:function (obj,callback, errorCallback) {
            $.xxdAjax({
                url: '/tradeCenter/InvestOrder/quit',
                clientId: 'XXD_FRONT_END',
                type: 'put',
                token: token,
                data: JSON.stringify({
                    "data": {
                        "joinId": obj.joinId,
                        "productId": obj.productId,
                        "productType": obj.productType,
                        "quitAmount": obj.quitAmount,
                        "remark": obj.remark
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
        thisDialog:function (content) {
            dialog({
                content: "<div class='dimension operate-tip'>"
                +"<i class='c_close close_x'>×</i>"
                +"<h5>提示</h5>"
                +"<div class='tip-content'>"
                +"<p>"+content+"</p>"
                +"<a href='#' class='btn c_close'>确认</a>"
                +"</div>"
                +"</div>",
                id: "",
                confirm: function (art) {

                },
                cancel: function (art) {
                    art.remove();
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
        keyDown: function () {
            $("body").keydown(function () {
                if (event.keyCode == "13") {
                    $('.J_purchase').click();
                }
            });
        },
        numberFormat: function (num) {   //数字变成千分位表达式
            if (typeof num == 'string') {
                num = +num;
            }
            return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
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
