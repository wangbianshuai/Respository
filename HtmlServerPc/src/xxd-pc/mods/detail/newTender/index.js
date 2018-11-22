require(['base', 'paging', "trackBase", 'store', 'detail', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', 'md'
], function ($, paging, track, store, detail, jui, header, footer, dialog, md) {
    header.init();
    footer.init();
    var userDO = store && store.get("userDO") || {};
    track.init(userDO);
    //btn 出借按钮 判断
    var detailXSB = store && store.get("detailXSB") || {};
    var token = store && store.get("token") || {};
    var isLogin = store && store.get("isLogin");
    var status = detailXSB.status;
    var meetTermOfPurchase = detailXSB.meetTermOfPurchase;
    var useRedenvelope = detailXSB.useRedenvelope;
    var discountCoupon = '', actualPayment, val;
    var productId = detailXSB.id;
    //出借按钮
    function loginButton(isLogin, status, meetTermOfPurchase) {
        var btn = "";
        if (status == 1) {
            $('.in-copies *').addClass('disable focus-disable');
            btn = "<a href='#' id='J_buy' class='btn disable'>等待发售</a>";
        }
        else if (status == 3 || status == 4) {
            $('.in-copies *').addClass('disable focus-disable');
            btn = "<a href='#' id='J_buy' class='btn disable'>今日已结束</a>";
        }
        if (isLogin) {
            if (status == 2 && meetTermOfPurchase) {
                $('.new-hand-tip').addClass('hide');
                btn = "<a href='#' class='btn fast-invest' id='J_buy'>立即加入</a>";
            } else if (status == 2 && !meetTermOfPurchase) {
                $('.new-hand-tip').removeClass('hide');
                btn = "<a href='#' class='btn disable' id='J_buy'>立即加入</a>";
            } else {
                $('.new-hand-tip').addClass('hide');
            }
        } else {
            if (status == 2) {
                btn = "<a href='#' class='btn tologin' id='J_buy'>立即登录</a>";
            }
        }
        return btn;
    }

    //资金出借风险提示函
    if(isLogin && (status == 2) && meetTermOfPurchase){
        $('.risk-protocol').removeClass('hide');
    }

    var btn = loginButton(isLogin, status, meetTermOfPurchase);
    if (btn) {
        $("#J_buyWrap").html(btn);
    }
    if(status==3 || status==4){
        $('.btn').addClass('marginbot');
    }
    //计算利息
    var period = parseInt(detailXSB.period);
    var periodUnit = detailXSB.periodUnit;
    if (periodUnit == 'MONTH') {
        period *= 30;
    }
    ;
    var $inputBox = $("#J_numberBox"), $income = $("#J_income");
    var remAccount = parseFloat(detailXSB.remAccount);
    var lowestTender = detailXSB.lowestTender;
    var usable = detailXSB.usable;
    var mostTender = detailXSB.mostTender;
    var apr = detailXSB.apr, floatApr = detailXSB.floatApr;
    apr = (apr == "") ? 0 : apr;
    floatApr = (floatApr == "") ? 0 : floatApr;
    apr = (parseFloat(apr)) / 100;
    floatApr = (parseFloat(floatApr)) / 100;
    var $error = $(".error-tip");
    var income = detail.rateEarning(period, apr,floatApr, $inputBox.val());
    var step = parseInt(detailXSB.step);
    $income.html(income);
    var errorTip = "";
    if(status == 2){
        $inputBox.on("blur", function (e) {
            var $me = $(this);
            val = this.value.replace(/\D/g, '');
            val = parseInt(val);
            $me.val(val);
            //输入为空的时候
            if (isNaN(val)) {
                val = 0;
                $income.html(0);
            }
            $('#J_numberBox').val(val);
            if(status == 2 && meetTermOfPurchase){
                if (val % step) {
                    errorTip = "输入金额不是以出借单位" + step + "的整数倍递增";
                    $error.html(errorTip).removeClass("hide");
                } else if (isLogin && (val > usable)) {
                    errorTip = "账户余额不够！请先去充值";
                    $error.html(errorTip).removeClass("hide");
                } else if (val < lowestTender) {
                    errorTip = "您的出借额最低不能低于" + lowestTender + "元";
                    $error.html(errorTip).removeClass("hide");
                }else if (val > remAccount) {
                    errorTip = "您的出借额最大不能大于" + remAccount + "元";
                    $error.html(errorTip).removeClass("hide");
                } else {
                    var income = detail.rateEarning(period, apr,floatApr, val);
                    $income.html(income);
                    $error.html("").addClass("hide");
                }
            }
        });
    }

    var $buttons = $("#J_money button");
    $buttons.on("click", function () {
        var $me = $(this);
        if ($me.hasClass("disable")) {
            return;
        }
        var money = parseInt($me.val());
        var income = detail.rateEarning(period, apr,floatApr, money);
        $income.html(income);
        $inputBox.val(money);
        $buttons.removeClass('active');
        $me.addClass("active");
    });
    //立即登录
    $('.tologin').click(function () {
        window.location.href = '/user/ilogin.html';
    });
    //页面底部的协议跳转
    $('.productSign').click(function () {
        window.open('/xsb/contractForTender/'+productId+'.html?productSign=XSB');
    });
    //点击去授权
    $(document).on('click','#J_goAuthorized',function(){
        $('#J_submitAuthoriz').submit();
    });
    //立即出借按钮
    $('.fast-invest').click(function () {
        //增加资金出借风险提示函
        if($(".risk-protocol >input").prop('checked') == false){
            errorTip = "请确认您已知晓并接受上述风险";
            $error.html(errorTip).removeClass("hide");
            return;
        }
        //弹框参数
        var investmentObj = {
            name: detailXSB.name,
            apr: detailXSB.apr,                             // todo   暂时没有加浮动利率的需求。
            val: $inputBox.val(),
            income: income,
            actualPayment: actualPayment,
            discountCoupon: discountCoupon,
            url: '/xsb/contractForTender/'+productId+'.html?productSign=XSB',
            agreement: '新手标'
        }
        val = parseInt($inputBox.val() || lowestTender);
        investmentObj.income = detail.rateEarning(period, apr,floatApr, $inputBox.val());
        investmentObj.actualPayment = $inputBox.val();
        investmentObj.discountCoupon = '';
        $('.discount').addClass('hide');
        if (val % step) {
            errorTip = "输入金额不是以出借单位" + step + "的整数倍递增";
            $error.html(errorTip).removeClass("hide");
        } else if (val > usable) {
            errorTip = "账户余额不够！请先去充值";
            $error.html(errorTip).removeClass("hide");
        } else if (val < lowestTender) {
            errorTip = "您的出借额最低不能低于" + lowestTender + "元";
            $error.html(errorTip).removeClass("hide");
        } else if (val > remAccount) {
            errorTip = "您的出借额最大不能大于" + remAccount + "元";
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

    //确认出借
    var flagPurchase = true;
    $('body').on('click', '.J_purchase', function () {
        var redEnvelopeCode = $(".discount-coupon").find("option:selected").attr("redcode") || '';
        var investObj = {
            productCategory: 0,
            productId: productId,
            productType: 16,
            redEnvelopeCode: redEnvelopeCode,
            tenderAmount: val
        }

        //协议复选框勾选
        if($(".authorization >input").prop('checked') == false){
            $('.pop-error').html('请勾选同意新手标出借相关协议').removeClass('hide');
            return;
        }

        //investObj.tenderAmount = parseInt($inputBox.val() || lowestTender);
        investObj.tenderAmount = parseInt($('.actualPayment').html());
        //支付密码校验
        if(flagPurchase){
            flagPurchase = false;
            detail.passwordVerify(function (data) {
                if(data.data){
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
                                    $.createCookie("tenderType", 16);
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
                        },function () {
                            $('.pop-error').html('请求超时，请检查您的网络和出借记录，避免重复出借').removeClass('hide');
                            flagPurchase = true;
                        });
                    } else if(data.data.code == -5){
                        $('.pop-error').html("为了您的出借安全，请<a href='/personal/changepassword.html'>设置支付密码</a>后重新出借").removeClass('hide');
                        flagPurchase = true;
                    }else{
                        $('.pop-error').html(data.data.message).removeClass('hide');
                        $('.verifyUrl').attr('src', '/userCenter/kaptcha.jpg?' + new Date().getTime());
                        flagPurchase = true;
                    }
                } else if(data.code >='200300' && data.code <'200400'){
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
        padingUrl: '/tradeCenter/investProduct/XSB/investmentRecord', //ajax 数据集
        pagination: $(".table-page"), //分页组件
        matchTableObject: $("#J_debenture"),
        matchPadingUrl: '/tradeCenter/investBiz/queryFinanceBorrowList',
        matchPagination: $(".debenture-page")
    }, productId);
    detail.keyDown();



}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

