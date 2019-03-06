require(['base', "trackBase", 'store', 'detail', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', 'md'
], function ($, track, store, detail, jui, header, footer, dialog, md) {
    header.init();
    footer.init();
    var userDO = store && store.get("userDO") || {};
    track.init(userDO);

    var errorTip = "",
        $error = $(".error-tip"),
        remAmount = detail.delcommafy($('#remAmount').html()), //剩余可投
        accountBalance,//账户余额
        bidDetail = store && store.get("bidDetail") || {},
        isLogin = store && store.get("isLogin"),
        bidCode = bidDetail.bidCode,
        plannedAnnualRate = bidDetail.plannedAnnualRate,
        tenderAmountDown = bidDetail.tenderAmountDown, //最低要投
        tenderAmountUp = bidDetail.tenderAmountUp, //最高可投
        leastPeriodValue = bidDetail.leastPeriodValue,
        leftTenderAmount = bidDetail.leftTenderAmount, //剩余可投
        bidAmount = bidDetail.bidAmount;
    //风险测评新增内容start
    var typeName = bidDetail.typeName,
        lastCount = bidDetail.count,
        investmentAmount = bidDetail.investmentAmount,
        nextTestTime = bidDetail.nextTestTime,
        surplusAmount = bidDetail.surplusAmount,
        availableBalance = $('#accountBalance').html(),
        quota = bidDetail.quota;
    if (investmentAmount == '') {
        investmentAmount = 0;
    }
    if (surplusAmount == '') {
        surplusAmount = 0;
    }
    if (quota == '') {
        quota = 0;
    }
    if (isLogin) {
       
    }
    $('body').on('click', '.J_getNewTest', function () {
        if (lastCount == 0) {
            ratherTest();
        } else {
            window.location.href = '/usercenter/questionnaire.html?location=1';
        }
    });
    $('body').on('click', '.close-x', function () {
        $('.mui-dialog').remove();
    });
    //测评达五次以上
    function ratherTest() {
        $('.mui-dialog').remove();
        dialog({
            content: "<div class='dimension operate-tip'>"
                + "<i class='c_close close_x'>×</i>"
                + "<h5>确认投标金额</h5>"
                + "<div class='tip-content'>"
                + "<p class='red'>您输入的投标金额大于平台剩余可投额度：" + detail.numberFormat(surplusAmount) + "元，请重新调整。</p>"
                + "<p>您今年测评测试已达5次上限，" + $.fnDateToString(nextTestTime, 'yyyy-MM-dd') + "日后可重新开始测评。详情可拨打客服电话4000-69-521进行咨询。</p>"
                + "<a href='#' class='btn close-x'>好的</a>"
                + "</div>"
                + "</div>",
            id: "",
            confirm: function (art) {

            },
            cancel: function (art) {
                art.remove();
            }
        });
    }

    //可以重新测评
    function newNextTest() {
        $('.mui-dialog').remove();
        dialog({
            content: "<div class='dimension operate-tip'>"
                + "<i class='c_close close_x'>×</i>"
                + "<h5>确认投标金额</h5>"
                + "<div class='tip-content'>"
                + "<p class='red'>您输入的投标金额大于平台剩余可投额度：" + detail.numberFormat(surplusAmount) + "元，请重新调整。</p>"
                + "<p>详情可拨打客服电话4000-69-521进行咨询</p>"
                + "<a href='#' class='btn small-btn close-x'>好的</a>"
                + "<a href='#' class='btn  small-btn J_getNewTest next'>重新测评</a>"
                + "</div>"
                + "</div>",
            id: "",
            confirm: function (art) {

            },
            cancel: function (art) {
                art.remove();
            }
        });
    }

    //风险测评新增内容end

    if (isLogin) {
        accountBalance = detail.delcommafy($('#accountBalance').html());

    }
    if (isLogin && (remAmount != 0)) {
        //资金出借风险提示函
        $('.risk-protocol').removeClass('hide');
    }
    //选项卡判断
    detail.tabs({
        tabsObject: $("#consumptionNav"),//tab 栏
        loanTableObject: $("#J_loanRecord"),
        loanPadingUrl: '/integrationPlatform/bids/' + bidCode + '/loans?' + new Date().getTime(),
        loanPagination: $(".loanRecord-page"),
        tenderTableObject: $("#J_tenderRecord"),
        tenderPadingUrl: '/integrationPlatform/bids/' + bidCode + '/investments?' + new Date().getTime(),
        tenderPagination: $(".tenderRecord-page"),
    }, '');

    //全投
    $('#allInvest').click(function () {
        if (tenderAmountUp != 0) {
            var least = tenderAmountUp < accountBalance ? tenderAmountUp : accountBalance;
            if (remAmount > least) {
                $('#investMoney').val(least);
            } else {
                $('#investMoney').val(remAmount);
            }
        } else {
            if (remAmount > accountBalance) {
                $('#investMoney').val(accountBalance);
            } else {
                $('#investMoney').val(remAmount);
            }
        }
    });

    //还款记录
    repaymentFillTable();
    function repaymentFillTable() {
        $.xxdAjax({
            url: '/integrationPlatform/bids/' + bidCode + '/repayments?' + new Date().getTime(),
            clientId: 'XXD_FRONT_END',
            type: 'get',
            data: {},
            callbacks: function (data) {
                if ((data.code == "200000") || data.data) {
                    if (data.data.length == 0) {
                        $('#J_repaymentRecord').append("<tr class='no-record'><td colspan='6'>没有还款记录</td> </tr>");
                    }
                    $.each(data.data, function (i, item) {
                        if (item.actualRepaymentPayedDate) {
                            $('#J_repaymentRecord').append('<tr><td>' + item.porder + '</td><td>' + $.fnDateToString(item.dueRepaymentDate, 'yyyy-MM-dd') + '</td><td>'
                                + $.fnDateToString(item.actualRepaymentPayedDate, 'yyyy-MM-dd') + '</td><td>' + detail.numberFormat(item.actualRepaymentPayedAmount)
                                + '</td><td>' + item.dueRepaymentAmount + '</td><td>' + item.status.message + '</td></tr>');
                        } else {
                            $('#J_repaymentRecord').append('<tr><td>' + item.porder + '</td><td>' + $.fnDateToString(item.dueRepaymentDate, 'yyyy-MM-dd') + '</td><td></td><td>'
                                + detail.numberFormat(item.actualRepaymentPayedAmount) + '</td><td>' + item.dueRepaymentAmount + '</td><td>' + item.status.message + '</td></tr>');
                        }
                    });
                } else {
                    $('#J_repaymentRecord').append("<tr class='no-record'><td colspan='6'>没有还款记录</td> </tr>");
                }
            },
            error: function () {
                $('#J_repaymentRecord').append("<tr class='no-record'><td colspan='6'>没有还款记录</td> </tr>");
            }
        });
    }


    //历史收益
    $('#investMoney').on("blur", function () {
        var $me = $(this);
        var val = this.value;
        val = val.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
        val = val.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        val = val.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
        if (val.indexOf(".") < 0 && val != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            val = parseFloat(val);
        }
        $me.val(val);
        if (isNaN(val)) {
            val = 0;
            $('#earnings').html(0);
            $('#investMoney').val(0);
        }
        if (isLogin && (val > accountBalance)) {
            errorTip = "账户余额不够！请先去充值";
            $error.html(errorTip).removeClass("hide");
        } else if ((val < tenderAmountDown) && (tenderAmountDown <= leftTenderAmount)) {
            errorTip = "您的出借额最低不能低于" + tenderAmountDown + "元";
            $error.html(errorTip).removeClass("hide");
        } else if ((val > tenderAmountUp) && (tenderAmountUp != 0)) {
            errorTip = "您的出借额最大不能大于" + tenderAmountUp + "元";
            $error.html(errorTip).removeClass("hide");
        } else if ((val == 0) || (val == "")) {
            errorTip = "您的出借额是0元，请重新输入金额";
            $error.html(errorTip).removeClass("hide");
        } else {
            var income = rateEarning(plannedAnnualRate / 100, bidAmount, +$('#investMoney').val(), leastPeriodValue);
            $('#earnings').html(income);
            $error.html("").addClass("hide");
        }
    });
    //增加键盘弹起事件
    $("#investMoney").keyup(function () {
        var thisVal = $(this).val();
        var lessMoney = accountBalance < remAmount ? accountBalance : remAmount;
        if (!isLogin) {
            lessMoney = remAmount;
        }
        if (tenderAmountUp != 0) {
            var least = tenderAmountUp < lessMoney ? tenderAmountUp : lessMoney;
            if (thisVal > least) {
                $('#investMoney').val(least);
            }
        } else {
            if (thisVal > lessMoney) {
                $('#investMoney').val(lessMoney);
            }
        }
    });


    function rateEarning(rate, borrowMoney, capital, month) {
        var modeRepay = $('#modeRepay').html();
        if (modeRepay == '等额本息') {
            var totalAmount = month * (borrowMoney * rate / 12 * Math.pow((1 + rate / 12), month)) / (Math.pow((1 + rate / 12), month) - 1);
            var totalRate = (totalAmount - borrowMoney).toFixed(2);
        } else {
            var totalRate = (borrowMoney * rate / 12 * month).toFixed(2);
        }
        var proRarnings = (totalRate * capital / borrowMoney).toFixed(2);
        return proRarnings;
    }


    if (isLogin) {
        //出借按钮的状态
        if (remAmount == 0) {
            $('#J_buyWrap p').addClass('hide');
            $('#toBid').addClass('disable').html('已抢光');
        }
    }
    //点击去授权
    $(document).on('click', '#J_goAuthorized', function () {
        $('#J_submitAuthoriz').submit();
    });

    //出借按钮
    $('#toBid').click(function () {
        //增加资金出借风险提示函
        if ($(".risk-protocol >input").prop('checked') == false) {
            errorTip = "请确认您已知晓并接受上述风险";
            $error.html(errorTip).removeClass("hide");
            return;
        }
        var val = $('#investMoney').val(),
            income = rateEarning(plannedAnnualRate / 100, bidAmount, +$('#investMoney').val(), leastPeriodValue),
            allIncome = (+val + +income).toFixed(2);

        //风险测评新增判断start     剩余可投 surplusAmount   账户余额 availableBalance    需要加入的金额 val
        //进取型就不用这些弹窗了
        if ((typeName != '进取型') && (lastCount != '')) {
            surplusAmount = parseInt(surplusAmount);
            availableBalance = parseInt(availableBalance);
            val = parseInt(val);
            if (surplusAmount > availableBalance) {
                if (val > surplusAmount && surplusAmount > availableBalance) {
                    if (lastCount == 0) {
                        ratherTest();
                    } else {
                        newNextTest();
                    }
                    return;
                }
            } else if (availableBalance > surplusAmount) {
                if (surplusAmount < val && val < availableBalance) {
                    if (lastCount == 0) {
                        ratherTest();
                    } else {
                        newNextTest();
                    }
                    return;
                }
            }
        }
        //风险测评新增判断end

        //弹框参数
        var formatVal = detail.numberFormat(+val);
        var investmentObj = {
            bidName: bidDetail.bidName,
            bidCode: bidDetail.bidCode,
            investMoney: formatVal,
            plannedAnnualRate: $('#tableEarnings').html(),
            leastPeriod: $('#leastPeriod').html(),
            actualPayment: formatVal,
            allIncome: allIncome,
        }

        //风险测评
        detail.riskAssessment(function () {
            if (isLogin && (val > accountBalance)) {
                errorTip = "账户余额不够！请先去充值";
                $error.html(errorTip).removeClass("hide");
            } else if ((val < tenderAmountDown) && (tenderAmountDown <= leftTenderAmount)) {
                errorTip = "您的出借额最低不能低于" + tenderAmountDown + "元";
                $error.html(errorTip).removeClass("hide");
            } else if ((val > tenderAmountUp) && (tenderAmountUp != 0)) {
                errorTip = "您的出借额最大不能大于" + tenderAmountUp + "元";
                $error.html(errorTip).removeClass("hide");
            } else if ((val == 0) || (val == "")) {
                errorTip = "您的出借额是0元，请重新输入金额";
                $error.html(errorTip).removeClass("hide");
            } else {
                $error.html('').addClass("hide");
                detail.showInvestmentXYD(val, investmentObj);
            }
        }, function () {
            // investment(investmentObj);
            detail.showInvestmentXYD(val, investmentObj);
        })
    });
    var flagPurchase = true;
    //确认出借按钮
    $('body').on('click', '.J_purchase', function () {
        var investObj = {
            productCategory: 1,
            productId: bidCode,
            productType: 20,
            redEnvelopeCode: '',
            tenderAmount: +$('#investMoney').val()
        }
        if ($(".authorization >input").prop('checked') == false) {
            $('.pop-error').html('请勾选同意资金出借风险提示函').removeClass('hide');
            return;
        }
        //支付密码校验
        if (flagPurchase) {
            flagPurchase = false;
            detail.passwordVerify(function (data) {
                if (data.data) {
                    if (data.data.code == -4) {
                        $('.pop-error').html('验证码错误，请重新输入!').removeClass('hide');
                        $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
                        flagPurchase = true;
                    } else if (data.data.code == 0) {
                        $('.pop-error').html('').addClass('hide');
                        $('.J_purchase').addClass('waiting').html('出借中，请稍等...');
                        //出借接口
                        detail.investOrder(investObj, function (data) {
                            if (data.code == 200000) {
                                if (data.data.bizStatus.code == "SUCCESS") {
                                    $.createCookie("tenderType", 20);
                                    $.createCookie("historyUrl", window.location.href);
                                    window.location.href = '/detail/purchaseSuccess.html';
                                    flagPurchase = true;
                                } else if (data.data.bizStatus.message == '应监管需要，您需要先开通银行存管账户才能顺利出借哦~') {
                                    window.location.href = '/detail/investFail.html';
                                    flagPurchase = true;
                                } else {
                                    $('.pop-error').html(data.data.bizStatus.message).removeClass('hide');
                                    $('.J_purchase').removeClass('waiting').html('确认出借');
                                    flagPurchase = true;
                                }
                            } else if (data.message == '应监管需要，您需要先开通银行存管账户才能顺利出借哦~') {
                                window.location.href = '/detail/investFail.html';
                                flagPurchase = true;
                            } else {
                                $('.pop-error').html(data.message).removeClass('hide');
                                $('.J_purchase').removeClass('waiting').html('确认出借');
                                flagPurchase = true;
                            }
                        }, function () {
                            $('.pop-error').html('出借失败，请刷新重试!').removeClass('hide');
                            $('.J_purchase').removeClass('waiting').html('确认出借');
                            flagPurchase = true;
                        }, function () {
                            $('.pop-error').html('请求超时，请检查您的网络和出借记录，避免重复出借').removeClass('hide');
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


    //出借弹框
    function investment(obj) {
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
                // "<div class='authorization'><input type='checkbox'>我已同意 <a href='/introduce/risknotice-agreement.jsp' target='_blank'>《新新贷资金出借风险提示函》</a></div> " +
                "<div class='authorization'><input type='checkbox'>我已同意 <a href='/user/regRiskWarning.html' target='_blank'>《资金出借风险提示函》</a></div> " +
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
    }

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});
