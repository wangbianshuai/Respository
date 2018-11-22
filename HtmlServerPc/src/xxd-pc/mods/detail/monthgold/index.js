require(['base', 'paging', "trackBase", 'store', 'detail', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs", 'md'
], function ($, paging, track, store, detail, jui, header, footer, dialog, md) {
    header.init();
    footer.init();
    var userDO = store && store.get("userDO") || {};
    track.init(userDO);
//btn 出借按钮 判断
    var detailYJDJ = store && store.get("detailYJDJ") || {},
        token = store && store.get("token") || {},
        isLogin = store && store.get("isLogin"),
        status = detailYJDJ.status,
        maxAmount = detailYJDJ.maxAmount,
        meetTermOfPurchase = detailYJDJ.meetTermOfPurchase,
        useRedenvelope = detailYJDJ.useRedenvelope,
        discountCoupon = '', actualPayment, val,
        productId = detailYJDJ.id,
        myMoney = $('.limit').html();

    //风险测评新增内容start
    var typeName = detailYJDJ.typeName,
        lastCount = detailYJDJ.count,
        investmentAmount = detailYJDJ.investmentAmount,
        nextTestTime = detailYJDJ.nextTestTime,
        surplusAmount = detailYJDJ.surplusAmount,
        quota = detailYJDJ.quota;
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
        var btn = loginButton(isLogin, status, meetTermOfPurchase);
        if (typeName == '保守型') {
            if (lastCount == 0) {
                $('#J_buyWrap').html('<p class="noAssessment">根据您的风险测评结果，您无法在平台进行出借！</p>' +
                    '<p>您今年测试测评已达5次上线，' + $.fnDateToString(nextTestTime, "yyyy-MM-dd") + '后可重新开始测评。</p>');
            } else {
                $('#J_buyWrap').html('<p class="noAssessment">根据您的风险测评结果，您无法在平台进行出借！<a class="J_getNewTest">重新测评</a></p>');
            }
        } else if ((typeName == '')  || (typeName == '进取型') ) {
        } else {
            $("#J_buy").before('<p class="red">您的平台剩余可投额度:' + detail.numberFormat(surplusAmount) + '元</p>' +
                '<p class="test-tip">您在平台已加入' + detail.numberFormat(investmentAmount) + '元，风险测评给予您的总限额为' + detail.numberFormat(quota) + '元，可投剩余额度为' + detail.numberFormat(surplusAmount) + '元</p>');
        }
    } else {
        $("#J_buyWrap").append('');
        var btn = loginButton(isLogin, status, meetTermOfPurchase);
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
    //出借按钮
    function loginButton(isLogin, status, meetTermOfPurchase) {
        var btn = "";
        if (status == 1) {
            $('.detail-focus .money *').addClass('disable');
            $('.detail-focus .number-box *').addClass('disable focus-disable').removeClass('add-subtract');
            btn = "<a href='#' id='J_buy' class='btn disable'>等待发售</a>";
        }
        else if (status == 3 || status == 4) {
            $('.detail-focus .money *').addClass('disable');
            $('.detail-focus .number-box *').addClass('disable focus-disable').removeClass('add-subtract');
            btn = "<a href='#' id='J_buy' class='btn disable'>本场已结束</a>";
        }
        if (isLogin) {
            if (status == 2 && meetTermOfPurchase) {
                btn = "<a href='#' class='btn fast-invest month-btn' id='J_buy'>立即加入</a>";
            } else if (status == 2 && !meetTermOfPurchase) {
                $('.detail-focus .number-box *').addClass('disable focus-disable').removeClass('add-subtract');
                btn = "<a href='#' class='btn disable' id='J_buy'>您的加入限额已满</a>";
            }
        }
        if (btn) {
            $("#J_buyWrap").html(btn);
        }
        return btn;
    }

    if (!isLogin) {
        $('#J_buy').css('margin', '10px 0 60px');
    }

    //资金出借风险提示函
    if (isLogin && (status == 2) && meetTermOfPurchase) {
        $('.risk-protocol').removeClass('hide');
    }

    //计算利息
    var period = parseInt(detailYJDJ.period);
    var periodUnit = detailYJDJ.periodUnit;
    if (periodUnit == 'MONTH') {
        period *= 30;
    }
    var $inputBox = $("#J_numberBox input"), $income = $("#J_income");
    var remAccount = parseFloat(detailYJDJ.remAccount);
    var lowestTender = detailYJDJ.lowestTender;
    var usable = detailYJDJ.usable;
    var mostTender = detailYJDJ.mostTender;
    var apr = detailYJDJ.apr, floatApr = detailYJDJ.floatApr;
    apr = (apr == "") ? 0 : apr;
    floatApr = (floatApr == "") ? 0 : floatApr;
    apr = (parseFloat(apr)) / 100;
    floatApr = (parseFloat(floatApr)) / 100;
    var $error = $(".error-tip");
    var income = detail.rateEarning(period, apr, floatApr, $inputBox.val());
    var step = parseInt(detailYJDJ.step);
    $income.html(income);

    //个人剩余可投额度显示
    //$('.limit').html(maxAmount > usable ? usable : maxAmount);

    //出借输入框
    var errorTip = "";
    if (status == 2) {
        $("#J_numberBox .add-subtract").on("click", function () {
            var $me = $(this);
            var sign = $me.attr("xxd-sign"), val = parseInt($inputBox.val() || lowestTender);
            if (sign == "minus" && val > step) {
                val = val - step;
            } else if (sign == "plus" && val < remAccount) {
                val = val + step;
            }
            $inputBox.val(val);
            if (val >= remAccount) {
                errorTip = "目前最大可加入金额为" + remAccount + "，不可再增加投入额";
                $error.html(errorTip).removeClass("hide");
            } else if (val % step) {
                errorTip = "输入金额不是以出借单位" + step + "的整数倍递增";
                $error.html(errorTip).removeClass("hide");
            } else if (isLogin && (val > usable)) {
                errorTip = "账户余额不够！请先去充值";
                $error.html(errorTip).removeClass("hide");
            } else if (val < lowestTender) {
                errorTip = "您的出借额最低不能低于" + lowestTender + "元";
                $error.html(errorTip).removeClass("hide");
                $('#J_numberBox input').val(lowestTender);
            } else if (isLogin && (val > maxAmount)) {
                errorTip = "您的出借额最大不能大于" + maxAmount + "元";
                $error.html(errorTip).removeClass("hide");
                $('#J_numberBox input').val(maxAmount);
            } else {
                if ($inputBox != val) {
                    var income = detail.rateEarning(period, apr, floatApr, val);
                    $income.html(income);
                    $error.html("").addClass("hide");
                }
            }
            myMoney = myMoney + '';
            myMoney = parseInt(myMoney.replace(/,/g, ""));
            var limitMoney = myMoney - $inputBox.val();
            if (limitMoney < 0) limitMoney = 0;
            $('.limit').html(detail.numberFormat(limitMoney));
        });
        $inputBox.on("blur", function (e) {
            var $me = $(this);
            val = this.value.replace(/\D/g, '');
            val = parseInt(val);
            $me.val(val);
            //输入为空的时候
            if (isNaN(val)) {
                val = 0;
                $income.html(0);
                $('.limit').html($('.limit').html());
            }
            $('.number-box input').val(val);
            if (val % step) {
                errorTip = "输入金额不是以出借单位" + step + "的整数倍递增";
                $error.html(errorTip).removeClass("hide");
            } else if (isLogin && (val > usable)) {
                errorTip = "账户余额不够！请先去充值";
                $error.html(errorTip).removeClass("hide");
            } else if (val < lowestTender) {
                errorTip = "您的出借额最低不能低于" + lowestTender + "元";
                $error.html(errorTip).removeClass("hide");
            } else if (isLogin && ( val > maxAmount)) {
                errorTip = "您的出借额最大不能大于" + maxAmount + "元";
                $error.html(errorTip).removeClass("hide");
            } else {
                var income = detail.rateEarning(period, apr, floatApr, val);
                $income.html(income);
                $error.html("").addClass("hide");
            }
            myMoney = myMoney + '';
            myMoney = parseInt(myMoney.replace(/,/g, ""));
            var limitMoney = myMoney - $inputBox.val();
            if (limitMoney < 0) limitMoney = 0;
            $('.limit').html(detail.numberFormat(limitMoney));
        });
    }

    var $buttons = $("#J_money button");
    $buttons.on("click", function () {
        var $me = $(this);
        if ($me.hasClass("disable")) {
            return;
        }
        var money = parseInt($me.val());
        var income = detail.rateEarning(period, apr, floatApr, money);
        $income.html(income);
        $inputBox.val(money);
        $buttons.removeClass('active');
        $me.addClass("active");
        if (isLogin) {
            myMoney = myMoney + '';
            myMoney = parseInt(myMoney.replace(/,/g, ""));
            var limitMoney = myMoney - $inputBox.val();
            if (limitMoney < 0) limitMoney = 0;
            $('.limit').html(detail.numberFormat(limitMoney));
        }
    });

    //立即登录
    $('.tologin').click(function () {
        window.location.href = '/user/ilogin.html';
    });

    //点击去授权
    $(document).on('click','#J_goAuthorized',function(){
        $('#J_submitAuthoriz').submit();
    });
    //立即出借按钮
    $('.fast-invest').click(function () {
        //增加资金出借风险提示函
        if ($(".risk-protocol >input").prop('checked') == false) {
            errorTip = "请确认您已知晓并接受上述风险";
            $error.html(errorTip).removeClass("hide");
            return;
        }
        val = parseInt($inputBox.val() || lowestTender);

        //风险测评新增判断start     剩余可投 surplusAmount   账户余额 usable    需要加入的金额 val
        //进取型就不用这些弹窗了
        if((typeName != '进取型' ) && (lastCount != '')){
            surplusAmount = parseInt(surplusAmount);
            usable = parseInt(usable);
            val = parseInt(val);
            if (surplusAmount > usable) {
                if (val > surplusAmount &&  surplusAmount > usable) {
                    if (lastCount == 0) {
                        ratherTest();
                    }else{
                        newNextTest();
                    }
                    return;
                }
            } else if (usable > surplusAmount) {
                if (surplusAmount < val && val< usable) {
                    if (lastCount == 0) {
                        ratherTest();
                    }else{
                        newNextTest();
                    }
                    return;
                }
            }
        }
        //风险测评新增判断end

        //弹框参数
        var investmentObj = {
            name: detailYJDJ.name,
            apr: detailYJDJ.apr,                       // todo   暂时没有加浮动利率的需求。
            val: $inputBox.val(),
            income: income,
            actualPayment: actualPayment,
            discountCoupon: discountCoupon,
            url: '/commpd/agree/monthgold_agree_' + productId + '.html?productSign=YJDJ',
            agreement: '月进斗金'
        }
        investmentObj.income = detail.rateEarning(period, apr, floatApr, $inputBox.val());
        investmentObj.actualPayment = $inputBox.val();
        investmentObj.discountCoupon = '';
        $('.discount').addClass('hide');
        //风险测评1
        detail.riskAssessment(function () {
            if (val % step) {
                errorTip = "输入金额不是以出借单位" + step + "的整数倍递增";
                $error.html(errorTip).removeClass("hide");
            } else if (val > usable) {
                errorTip = "账户余额不够！请先去充值";
                $error.html(errorTip).removeClass("hide");
            } else if (val < lowestTender) {
                errorTip = "您的出借额最低不能低于" + lowestTender + "元";
                $error.html(errorTip).removeClass("hide");
            } else if (val > maxAmount) {
                errorTip = "您的出借额最大不能大于" + maxAmount + "元";
                $error.html(errorTip).removeClass("hide");
            } else {
                $error.html('').addClass("hide");
                //红包请求
                if (useRedenvelope == 'Y') {
                    detail.redReturns($inputBox.val(), function (data) {
                        if (data.code == "200000") {
                            if (data.data) {
                                investmentObj.discountCoupon = "<p class='discount-tip'>优惠抵扣：</p>" +
                                    "<select name='' class='discount-coupon'>" +
                                    "<option value='0'>-无优惠抵用券-</option>";
                                for (var i = 0; i < data.data.length; i++) {
                                    var v = data.data[i];
                                    investmentObj.discountCoupon += "<option value='" + v.faceValue + "' redCode='" + v.redCode + "'>" + v.name + "</option>";
                                }
                                investmentObj.discountCoupon += "</select>";
                                investmentObj.actualPayment = $inputBox.val();
                                $('.discount').removeClass('hide');
                                // detail.investment(investmentObj);
                                detail.showInvestment(investmentObj);
                                investmentObj.actualPayment = $inputBox.val() - $('.discount-coupon').val();
                                $('.actualPayment').html(investmentObj.actualPayment);
                                $('.discount-coupon').change(function () {
                                    investmentObj.actualPayment = $inputBox.val() - $('.discount-coupon').val();
                                    $('.actualPayment').html(investmentObj.actualPayment);
                                });
                            } else {
                                detail.showInvestment(investmentObj);
                            }
                        } else {
                            detail.showInvestment(investmentObj);
                        }
                    }, function () {
                        detail.showInvestment(investmentObj);
                    })
                } else {
                    detail.showInvestment(investmentObj);
                }
            }
        });
    });

    var flagPurchase = true;
    //确认出借
    $('body').on('click', '.J_purchase', function () {
        var redEnvelopeCode = $(".discount-coupon").find("option:selected").attr("redcode") || '';
        var investObj = {
            productCategory: 0,
            productId: productId,
            productType: 95,
            redEnvelopeCode: redEnvelopeCode,
            tenderAmount: val
        }
        investObj.tenderAmount = parseInt($('.actualPayment').html());

        //协议复选框勾选
        if ($(".authorization >input").prop('checked') == false) {
            $('.pop-error').html('请勾选同意月进斗金出借相关协议').removeClass('hide');
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
                                    $.createCookie("startDate", data.data.startDate);
                                    $.createCookie("expireDate", data.data.expireDate);
                                    $.createCookie("tenderType", 95);
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

    })

    //选项卡判断
    detail.tabs({
        tabsObject: $("#J_tabs"),//tab 栏
        tableObject: $("#J_tableRecord"), //table 表格对象
        padingUrl: '/tradeCenter/investProduct/YJDJ/investmentRecord', //ajax 数据集
        pagination: $(".table-page"), //分页组件
        matchTableObject: $("#J_debenture"),
        matchPadingUrl: '/tradeCenter/investBiz/queryFinanceBorrowList',
        matchPagination: $(".debenture-page")
    }, productId)
    detail.keyDown();


    //请求系统时间
    var systemtime;
    getSystemTime();
    function getSystemTime() {
        $.ajax({
            url: '/feapi/currentTime',
            type: 'get',
            data: {},
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    systemtime = data.data.currentTime;
                } else {
                    systemtime = new Date().getTime();
                }
                getCountDown();
            }
        });
    }

    //倒计时
    function getCountDown() {
        var openTime = detailYJDJ.openTime;
        var closeTime = detailYJDJ.closeTime;
        var currentTime = systemtime;
        if (openTime && openTime > currentTime || status == 1) {
            $('#J_countDown').html("<div class='waiting'>加入还未开始，请耐心等待~</div>");
        } else if (closeTime && closeTime < currentTime || status == 3) {
            $('#J_countDown').html("<div class='waiting'>本场已结束，请等待下一场～</div>");
        } else {
            $('#J_countDown').html("<div class='count'> " +
                "<p>本次加入距离结束还剩：</p> " +
                "<div class='count-down'>" +
                "<span class='hour1'></span><span class='hour2'></span><i>:</i><span class='minute1'></span><span class='minute2'></span><i>:</i><span class='second1'></span><span class='second2'></span>" +
                "<div class='line'></div>" +
                " </div> " +
                "<div class='count-tip'><i>小时</i><i>分钟</i><i>秒</i></div> </div>");
            function getCountDown() {
                // currentTime = getSystemTime();
                currentTime = currentTime + 1000;
                var remainTime = closeTime - currentTime,
                    remainSecond = parseInt(remainTime / 1000);
                var hour = Math.floor(remainSecond / 3600),
                    hour1 = parseInt(hour / 10),
                    hour2 = hour % 10,
                    minute = Math.floor((remainSecond - hour * 3600) / 60),
                    minute1 = parseInt(minute / 10),
                    minute2 = minute % 10,
                    second = Math.floor(remainSecond - hour * 3600 - minute * 60),
                    second1 = parseInt(second / 10),
                    second2 = second % 10;
                $('.hour1').html(hour1);
                $('.hour2').html(hour2);
                $('.minute1').html(minute1);
                $('.minute2').html(minute2);
                $('.second1').html(second1);
                $('.second2').html(second2);
                if (currentTime >= closeTime) {
                    $('#J_countDown').html("<div class='waiting'>本场已结束，请等待下一场发售～</div>");
                    status = 3;
                    var btn = loginButton(isLogin, status, meetTermOfPurchase);   //让按钮成为灰色
                    if (btn) {
                        $("#J_buyWrap").html(btn);
                    }
                }
            }

            setInterval(getCountDown, 1000);
        }
    }

    $('#monthgoldAgree').on('click',function(){
        window.open('/commpd/agree/monthgold_agree_' + productId + '.html?productSign=YJDJ','_blank');
    })

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});