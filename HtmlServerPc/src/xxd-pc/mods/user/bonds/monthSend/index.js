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
    var map = {
        creditorObject: $("#creditorTable"),
        creditorPadingUrl: '/tradeCenter/investBiz/bondsListByToken',
        loanPagination: $(".creditorTable-page"),
        pageSize: 5
    };
    side.getCreditor(map);
    var monthSendStatus = $.getUrlParam('monthSendStatus', location.search);

    //当前是已退出产品是不显示待收收益
    if(monthSendStatus == 2 || monthSendStatus ==3){
        $('.dueInIncome').addClass('hide');
    }

    /*
     var sysStatus = [
     {"status": "0", "value": "出借中", "class": "hha"},
     {"status": "1", "value": "出借成功", "class": "blue"},
     {"status": "2", "value": "已退出", "class": "pink"},
     {"status": "3", "value": "提前退出", "class": "red"},
     {"status": "4", "value": "正在退出", "class": "green"},
     {"status": "5", "value": "收益中", "class": "orange"},
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

    var token = store && store.get("token") || {};
    var joinId = $.getUrlParam('join', location.search);

    var investmentAmount, penalty, penaltyApr, redEnvelopeAmount, productId;    //退出表格需要的数据

    $(document).on('click', '.verifyUrl', function () {
        $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
    });
    $(document).on('click', '.refresh', function () {
        $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
    });

    //月月派出借详情
    getYYPdetail();
    function getYYPdetail() {
        $.xxdAjax({
            url: '/tradeCenter/investBiz/YYPInvestmentDetail/' + joinId,
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
                    $('.J_yypName').html(row.name + row.periodName);
                    //出借详情
                    var content = [];
                    content.push("<tr class='table-content'><td>" + row.investmentAmount + "</td>");
                    if (row.floatingRate) {
                        content.push("<td>" + row.plannedAnnualRate + "%<span class='font-special'>+" + row.floatingRate+ "%</span></td>");
                    } else {
                        content.push("<td>" + row.plannedAnnualRate + "%</td>");
                    }
                    content.push("<td>" + row.frozenPeriod + row.frozenPeriodUnit + "</td>");
                    if(monthSendStatus != 2 && monthSendStatus !=3){
                        content.push("<td>" + row.dueInIncome + "元</td>");
                    }
                    content.push("<td>" + row.receivedIncome + "元</td>");
                    // content.push("<td>" + row.repaymentMethod + "</td>"); //回款方式列删除
                    if (row.redEnvelopeList) {
                        if (row.redEnvelopeList.length > 0) {
                            var red = row.redEnvelopeList[0];
                            if (row.redEnvelopeList.length == 1) {
                                content.push('<td class="red-even no-pointer">' + red.sourceDesc + red.amount + '元</td>');
                            } else {
                                content.push('<td class="red-even">' + red.sourceDesc + red.amount + '元');
                                content.push('<span class="red-packet"><i></i><em>' + row.redEnvelopeList[1].sourceDesc + row.redEnvelopeList[1].amount + '元</em></span></td>');
                            }
                        } else {
                            content.push('<td>未使用红包</td>');
                        }
                    } else {
                        content.push('<td>未使用红包</td>');
                    }
                    content.push("<td class='main-color'><a target='_blank' href='/yypplan/agreement/" + row.productId + "/" + joinId + ".html'>查看协议</a></td>");
                    if (row.newStatus == 'SERVICE_EXPIRED_APPLY_QUIT') {
                        content.push('<td class="main-color"><a href="#" class="J_quitnormal J_quitbtn">申请退出</a></td></tr>');
                    } else if (row.newStatus == 'EXPIRED_APPLICATION_QUIT_SUCCESS') {
                        content.push('<td class="main-color"><a href="#" class="no-quit">退出中，请稍等</a></td>');
                    } else if (row.newStatus == 'QUIT_SUCCESS') {
                        content.push('<td class="main-color"><a href="#" class="no-quit">申请退出</a></td>');
                    } else if (row.newStatus == 'ADVANCE_QUIT_SUCCESS') {
                        // content.push('<td class="main-color"><a href="#" class="no-quit">提前退出</a></td>');
                        content.push('<td class="main-color"></td>');
                    } else {
                        // if (row.isQuit) {
                        //     if (row.reglintstStatus == 3) {
                        //         if (row.joinStatus == 1) {
                        //             content.push('<td class="main-color"><a href="#" class="J_quit J_quitbtn">提前退出</a></td>');
                        //         }
                        //         else if (row.joinStatus == 3) {
                        //             content.push('<td class="main-color"><a href="#" class="no-quit">提前退出</a></td>');
                        //         }
                        //         else if (row.joinStatus == 2) {
                        //             content.push('<td class="main-color"><a href="#" class="no-quit">提前退出</a></td>');
                        //         }
                        //         else if (row.joinStatus == 4) {
                        //             content.push('<td class="main-color"><a href="#" class="no-quit">提前退出</a></td>');
                        //         } else {
                        //             content.push('<td class="main-color"><a href="#" class="no-quit">提前退出</a></td>');
                        //         }
                        //     } else {
                        //         content.push('<td class="main-color"><a href="#" class="no-quit">提前退出</a></td>');
                        //     }
                        // } else {
                        //     content.push('<td class="main-color"><a href="#" class="no-quit">提前退出</a></td>');
                        // }
                        if (row.isQuit) {
                            if (row.reglintstStatus == 3) {
                                if (row.joinStatus == 1) {
                                    content.push('<td class="main-color"></td>');
                                }
                                else if (row.joinStatus == 3) {
                                    content.push('<td class="main-color"></td>');
                                }
                                else if (row.joinStatus == 2) {
                                    content.push('<td class="main-color"></td>');
                                }
                                else if (row.joinStatus == 4) {
                                    content.push('<td class="main-color"></td>');
                                } else {
                                    content.push('<td class="main-color"></td>');
                                }
                            } else {
                                content.push('<td class="main-color"></td>');
                            }
                        } else {
                            content.push('<td class="main-color"></td>');
                        }
                    }
                    content.push("</tr>");
                    $('#haveTable').append(content.join(""));
                    if (row.redEnvelopeList) {
                        if (row.redEnvelopeList.length > 0) {
                            if (row.redEnvelopeList.length >= 1) {
                                for (var i = 2; i < row.redEnvelopeList.length; i++) {
                                    var item = row.redEnvelopeList[i];
                                    $('.red-packet').append('<em>' + item.sourceDesc + item.amount + '元</em>');
                                }
                            }
                        }
                    }
                    //退出参数
                    investmentAmount = row.investmentAmount;
                    penalty = row.penalty;
                    penaltyApr = row.penaltyApr;
                    if (row.redEnvelopeAmount) {    //扣除红包有则有金额，没有则写成0
                        redEnvelopeAmount = row.redEnvelopeAmount;
                    } else {
                        redEnvelopeAmount = 0;
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

    function tradeRecordTable(tableData) {
        var title = '<tr class="title"><th>序号</th><th>日期</th><th>交易行为</th>'
            + '<th>备注</th></tr>';
        var contentArray = [];
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            $.each(operatorType, function (i, v) {
                if (row.status == v.status) {
                    row.status = v.value;
                }
            });
            contentArray.push("<tr>");
            contentArray.push("<td>" + (i + 1) + "</td>");
            contentArray.push("<td>" + $.fnDateToString(row.addTime, 'yyyy-MM-dd  HH:mm:ss') + "</td>");
            contentArray.push("<td>" + row.pvalue + "</td>");
            contentArray.push("<td>" + row.remark + "</td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };

    function returnRecordTable(tableData) {
        var title = '<tr class="title"><th>序号</th><th>日期</th><th>返息明细</th>'
            + '<th>金额</th></tr>';
        var contentArray = [];
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            $.each(operatorType, function (i, v) {
                if (row.status == v.status) {
                    row.status = v.value;
                }
            });
            contentArray.push("<tr>");
            contentArray.push("<td>" + (i + 1) + "</td>");
            contentArray.push("<td>" + $.fnDateToString(row.realtime, 'yyyy-MM-dd HH:mm:ss') + "</td>");
            contentArray.push("<td>您出借的" + row.name + "第" + row.repayTerms + "/" + row.regTerms + "期的出借利息:" + row.realinterest + "元已到账</td>");                                   // todo  交易平台
            contentArray.push("<td>" + row.realinterest + "元</td>");
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
                    url: object.tradePadingUrl+'?'+new Date().getTime(),
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
                            $tradeTableRecord.append("<tr class='no-record'><td colspan='5'><a href='/promotion/yyp.html'>当前尚无返息记录，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $tradeTableRecord.append("<tr class='no-record'><td colspan='5'><a href='/promotion/yyp.html'>当前尚无返息记录，去看看！</a></td> </tr>");
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


        //返息记录
        var returnMatchRecord = store && store.get("returnMatchRecord") || {};
        var $returnMatchRecord = object.returnObject;
        var b = 0;

        function _exitAjax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $returnMatchRecord.html(returnRecordTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.returnPadingUrl+'?'+new Date().getTime(),
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        currentPage: pageIndex,
                        pageSize: 5
                    },
                    token: token,
                    callback: function (data) {
                        b++;
                        var tableData = data.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $returnMatchRecord.html(returnRecordTable(tableData));
                        returnMatchRecord['total'] = data.total;
                        returnMatchRecord['pageSize'] = 5;
                        returnMatchRecord['pageIndex'] = data.pageNum;
                        if (b == 1) {
                            paging(returnMatchRecord);
                        }
                        if (returnMatchRecord.total == 0) {
                            $returnMatchRecord.append("<tr class='no-record'><td colspan='4'><a href='/promotion/yyp.html'>当前尚无返息记录，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $returnMatchRecord.append("<tr class='no-record'><td colspan='4'><a href='/promotion/yyp.html'>当前尚无返息记录，去看看！</a></td> </tr>");
                    }
                });
            }
        }

        if (true || !$.isEmptyObject(returnMatchRecord)) {
            $.extend(returnMatchRecord, {
                $dom: object.returnPagination,
                callback: function (pagingObj) {
                    _exitAjax(pagingObj);
                }
            });
            _exitAjax(returnMatchRecord);
        }
    }

    var tradeRecordMap = {
        tradeObject: $("#dealTable"),
        tradePadingUrl: '/tradeCenter/investBiz/getYYPTransactionRecord/' + joinId,
        tradePagination: $(".dealTable-page"),
        returnObject: $("#returnTable"),
        returnPadingUrl: '/tradeCenter/investBiz/getYYPReturnRatesRecord/' + joinId,
        returnPagination: $(".returnTable-page")
    };
    getTable(tradeRecordMap);

    //提前退出
    var flagPurchase = true;
    $('body').on('click', '.J_quit', function () {
        dialog({
            content: "<div class='dimension quit'>"
            + "<i class='c_close close_x'>×</i>"
            + "<h5>提前退出</h5>"
            + "<div class='investment-focus'>"
            + "<p class='top-info'>1、该服务计划当前处于服务期中，您申请提前退出会产生违约行为，会被收取加入本金" + penaltyApr + "%的手续费，且只能获得产品持有期间的收益。</p>"
            + "<p class='top-info'>2、如果您加入时使用了红包，使用的红包金额将会被同时扣除，且红包不会退回。</p>"
            + "<p class='top-info'>3、历史平均退出约1-3个工作日，具体视债权转让交易撮合情况而定。</p>"
            + "<p class='amount-exit'>退出资产："
            + "<input type='text' disabled value='" + investmentAmount + "'><span class='default-mark'>?</span>"
            + "<span class='default-tip hide'>仅支持全额退出<i></i></span></p>"
            + "<em class='money-tip'>将收取手续费：<span>" + penalty + "</span>元</em>"
            + "<em class='money-tip'>扣除红包金额：<span>" + redEnvelopeAmount + "</span>元</em>"
            + "<p class='password-box'>支付密码："
            + "<input type='password' placeholder='请输入支付密码' class='password'>"
            + "<a href='/user/iforgetpaypassword.html' target='_blank' class='forgot'>忘记密码？</a></p>"
            + "<p class='verification-tip'>图片验证码："
            + "<input type='text' placeholder='请输入图片验证码' class='verification-code'></p>"
            + "<div class='verification-box clearfix'>"
            + "<img src='/userCenter/kaptcha.jpg' alt='' class='verifyUrl'><a href='#' class='refresh'><i></i></a></div>"
            + "<p class='pop-error hide'></p><a href='#' class='btn active J_affirm'>确认退出</a>"
            + "<a href='#' class='btn next c_close' id='cancel'>取消</a>"
            + "</div>"
            + "</div>",
            id: "",
            confirm: function (art) {

            },
            cancel: function (art) {
                art.remove();
            }
        });
    });
    $('body').on('mousemove', '.default-mark', function () {
        $('.default-tip').removeClass('hide');
    });
    $('body').on('mouseout', '.default-mark', function () {
        $('.default-tip').addClass('hide');
    });

    //确认退出
    $('body').on('click', '.J_affirm', function () {
        //退出对象
        var quitObj = {
            'joinId': joinId,
            'productId': productId,
            'productType': 97,
            'quitAmount': investmentAmount,
            'remark': ''
        };
        //支付密码和图片验证码校验
        if (flagPurchase) {
            flagPurchase = false;
            side.passwordVerify(function (data) {
                if (data.data) {
                    if (data.data.code == -4) {
                        $('.pop-error').html('验证码错误，请重新输入!').removeClass('hide');
                        $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
                        flagPurchase = true;
                    } else if (data.data.code == 0) {
                        $('.pop-error').html('').addClass('hide');
                        $('.J_affirm').addClass('waiting').html('退出中，请稍等...');

                        //退出接口
                        side.earlyQuit(quitObj, function (data) {
                            if (data && data.code == "200000") {
                                if (data.data.resultCode == 0) {
                                    $('.mui-dialog').remove();
                                    side.thisDialog('退出申请提交成功！');
                                    $('.J_quitbtn').removeClass('J_quit').addClass('no-quit').html('退出中，请稍等');
                                } else {
                                    $('.pop-error').html(data.data.desc).removeClass('hide');
                                    $('.J_affirm').removeClass('waiting').html('确认出借');
                                }
                            } else {
                                $('.pop-error').html(data.message).removeClass('hide');
                                $('.J_affirm').removeClass('waiting').html('确认出借');
                            }
                            flagPurchase = true;
                        }, function () {
                            $('.pop-error').html('网路错误，请重试').removeClass('hide');
                            $('.J_affirm').removeClass('waiting').html('确认出借');
                            flagPurchase = true;
                        });
                    } else if (data.data.code == -5) {
                        $('.pop-error').html("为了您的出借安全，请<a href='/personal/changepassword.html'>设置支付密码</a>后重新出借").removeClass('hide');
                        flagPurchase = true;
                    } else {
                        $('.pop-error').html(data.data.message).removeClass('hide');
                        $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
                        flagPurchase = true;
                    }
                } else if (data.code >= '200300' && data.code < '200400') {
                    //登录失效，跳登录页
                    $('.pop-error').html("登录失效，请点击重新&nbsp;<a href='/user/ilogin.html'>登录</a>").removeClass('hide');
                    flagPurchase = true;
                } else {
                    $('.pop-error').html(data.message).removeClass('hide');
                    $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
                    flagPurchase = true;
                }
            }, function () {
                $('.pop-error').html('支付失败，请刷新重试!').removeClass('hide');
                $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
                flagPurchase = true;
            });
        }
    });

    //到期退出
    var ontimeProductname;
    var ontimeAmount;
    var ontimeInterest;
    var ontimeForfeit;
    var quitnormalObj;
    var ontimeCurrent;
    var clickFlag = 0;
    $('body').on('click', '.J_quitnormal', function () {
        $.ajax({
            url: '/tradeCenter/InvestOrder/quitApply',
            type: 'put',
            dataType: "json",
            async: false,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                "data": {
                    "joinId": joinId,
                    "productId": productId,
                    "productType": 97
                }
            }),
            beforeSend: function (request) {
                request.setRequestHeader('clientId', 'XXD_INTEGRATION_PLATFORM');
                request.setRequestHeader('clientTime', new Date().getTime());
                request.setRequestHeader('token', token);
            },
            success: function (data) {
                if (data.code == '200000') {
                    if (data.data.resultCode != 0) {
                        dialog({
                            id: "",
                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>申请退出</div>" +
                            "<div class='m-con-bd'>" +
                            "<div class='filed-user'>  " +
                            "<p style='text-align:center;'>" + data.data.message + "</p> </div> " +
                            "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='top:0; right:135px;'>确认</a></p> </div>" +
                            "</div>"
                            + "</div>",
                            cancel: function (clo) {
                                clo.close();
                            },
                            confirm: function (clo) {
                                clo.close();
                            }
                        });
                    } else {
                        ontimeProductname = data.data.pname;
                        ontimeAmount = parseFloat(data.data.account);
                        ontimeInterest = parseFloat(data.data.interest);
                        ontimeForfeit = parseFloat(data.data.forfeit);
                        ontimeCurrent = ontimeAmount + ontimeInterest;
                        quitnormalObj = {
                            'joinId': joinId,
                            'productId': productId,
                            'productType': 97,
                            'quitAmount': parseFloat(ontimeAmount) + parseFloat(ontimeInterest),
                            'remark': ''
                        };
                        dialog({
                            id: "",
                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>申请退出</div>" +
                            "<div class='m-con-bd'>" +
                            "<div class='filed-user'>  " +
                            "<p>服务名称：" + ontimeProductname + "<br/>退出资产：" + ontimeCurrent + "元（服务收益请参考实际到账收益）<br/>退出费用：" + ontimeForfeit + "元<br/><span style='display:inline; font-size:14px; color:#999;'>历史平均退出约1-3个工作日，具体视债券转让交易撮合情况而定</span></p></div> " +
                            "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>确认退出</a><a class='btn btn_right right c_close' >取消</a></p> </div>" +
                            "</div>"
                            + "</div>",
                            cancel: function (clo) {
                                clo.close();
                            },
                            confirm: function (dir) {
                                if (clickFlag == 0) {
                                    clickFlag = 1;
                                    side.earlyQuit(quitnormalObj, function (data) {
                                        if (data && data.code == "200000") {
                                            dir.close();
                                            if (data.data.resultCode == 0) {
                                                dialog({
                                                    id: "",
                                                    content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>申请退出</div>" +
                                                    "<div class='m-con-bd'>" +
                                                    "<div class='filed-user'>  " +
                                                    "<p style='text-align:center;'>退出申请提交成功！</p> </div> " +
                                                    "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='top:0; right:135px;'>确认</a></p> </div>" +
                                                    "</div>"
                                                    + "</div>",
                                                    cancel: function (clo) {
                                                        window.location.reload()
                                                    },
                                                    confirm: function (clo) {
                                                        window.location.reload()
                                                    }
                                                });
                                                $('.J_quitbtn').removeClass('J_quitnormal').addClass('no-quit').html('申请退出');
                                            } else {
                                                dir.close();
                                                dialog({
                                                    id: "",
                                                    content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>申请退出</div>" +
                                                    "<div class='m-con-bd'>" +
                                                    "<div class='filed-user'>  " +
                                                    "<p style='text-align:center;'>" + data.data.desc + "</p> </div> " +
                                                    "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='top:0; right:135px;'>确认</a></p> </div>" +
                                                    "</div>"
                                                    + "</div>",
                                                    cancel: function (clo) {
                                                        clo.close();
                                                    },
                                                    confirm: function (clo) {
                                                        clo.close();
                                                    }
                                                });
                                            }
                                            clickFlag = 0;
                                        }
                                    }, function () {
                                        dir.close();
                                        dialog({
                                            id: "",
                                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>申请退出</div>" +
                                            "<div class='m-con-bd'>" +
                                            "<div class='filed-user'>  " +
                                            "<p style='text-align:center;'>" + data.data.desc + "</p> </div> " +
                                            "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='top:0; right:135px;'>确认</a></p> </div>" +
                                            "</div>"
                                            + "</div>",
                                            cancel: function (clo) {
                                                clo.close();
                                            },
                                            confirm: function (clo) {
                                                clo.close();
                                            }
                                        });
                                        clickFlag = 0;
                                    });
                                }
                            }
                        });
                    }
                }
            },
            error: function () {
                alert('网络异常，请重试！');
                return false;
            }
        });
    });

    side.getLeftHeight();

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});




