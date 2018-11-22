require(['base', 'paging', "trackBase", 'store', 'detail', 'juicer'
        , 'header', 'footer', "dialog", 'backTop', 'json', 'md'
    ], function ($, paging, track, store, detail, jui, header, footer, dialog, md) {
        header.init();
        footer.init();
        var userDO = store && store.get("userDO") || {};
        track.init(userDO);
        //btn 出借按钮 判断
        var detailQTDS = store && store.get("detailQTDS") || {};
        var token = store && store.get("token") || {};
        var isLogin = store && store.get("isLogin");
        var status = detailQTDS.status;
        var meetTermOfPurchase = detailQTDS.meetTermOfPurchase;
        var useRedenvelope = detailQTDS.useRedenvelope;
        var discountCoupon = '', actualPayment, val;
        var productId = detailQTDS.id;
        var step = parseInt(detailQTDS.step);
        var isPurchasedProduct = detailQTDS.isPurchasedProduct;
        //出借按钮
        function loginButton(isLogin, status, meetTermOfPurchase) {
            var btn = "";
            if (status == 1) {
                $('.detail-focus .money *').addClass('disable');
                $('.detail-focus .number-box *').addClass('disable focus-disable').removeClass('add-subtract');
                btn = "<a id='J_buy' class='btn disable'>等待发售</a>";
            }
            else if (status == 3 || status == 4) {
                $('.detail-focus .money *').addClass('disable');
                $('.detail-focus .number-box *').addClass('disable focus-disable').removeClass('add-subtract');
                btn = "<a id='J_buy' class='btn disable'>本场已结束</a>";
            }
            if (isLogin) {
                if (status == 2 && meetTermOfPurchase) {
                    btn = "<a class='btn fast-invest' id='J_buy'>立即加入</a>";
                } else if (status == 2 && !meetTermOfPurchase) {
                    $('.detail-focus').html('').append("<div class='no-condition'> " +
                        "<p>您已享受过七天大胜的收益了，</p>" +
                        " <p>更多<span>高手进阶</span>的产品在等着你哦！</p> " +
                        "<a href='/xplan/search/list.html'>马上去选购</a> </div>");
                }
            } else {
                if (status == 2) {
                    btn = "<a class='btn tologin' id='J_buy'>立即登录</a>";
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
        //计算利息
        var period = parseInt(detailQTDS.period);
        var periodUnit = detailQTDS.periodUnit;
        if (periodUnit == 'MONTH') {
            period *= 30;
        }
        var $inputBox = $("#J_numberBox input"), $income = $("#J_income");
        var remAccount = parseFloat(detailQTDS.remAccount);
        var lowestTender = detailQTDS.lowestTender;
        var usable = detailQTDS.usable;
        var mostTender = detailQTDS.mostTender;
        var apr = detailQTDS.apr, floatApr = detailQTDS.floatApr;
        apr = (apr == "") ? 0 : apr;
        floatApr = (floatApr == "") ? 0 : floatApr;
        var rate = (parseFloat(apr) + parseFloat(floatApr)) / 100;
        if (isPurchasedProduct) {
            //出借过理财产品了
            rate = parseFloat(apr) / 100;
        }
        var income = detail.rateEarning(period, rate, $inputBox.val());
        $income.html(income);
        var $error = $(".error-tip");
        var errorTip = "";
        //出借输入框
        if (status == 2) {
            $("#J_numberBox .add-subtract").on("click", function () {
                var $me = $(this);
                var sign = $me.attr("xxd-sign");
                val = parseInt($inputBox.val() || lowestTender);
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
                    $('#J_numberBox input').val(lowestTender);
                    $error.html(errorTip).removeClass("hide");
                } else if (val > mostTender) {
                    errorTip = "您的出借额最大不能大于" + mostTender + "元";
                    $error.html(errorTip).removeClass("hide");
                    $('#J_numberBox input').val(mostTender);
                } else {
                    if ($inputBox != val) {
                        var income = detail.rateEarning(period, rate, val);
                        $income.html(income);
                        $error.html("").addClass("hide");
                    }
                }
            });
            $inputBox.on("blur", function (e) {
                var $me = $(this);
                var val = this.value.replace(/\D/g, '');
                val = parseInt(val);
                $me.val(val);
                //输入为空的时候
                if (isNaN(val)) {
                    val = 0;
                    $income.html(0);
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
                } else if (val > mostTender) {
                    errorTip = "您的出借额最大不能大于" + mostTender + "元";
                    $error.html(errorTip).removeClass("hide");
                } else {
                    var income = detail.rateEarning(period, rate, val);
                    $income.html(income);
                    $error.html("").addClass("hide");
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
            var income = detail.rateEarning(period, rate, money);
            $income.html(income);
            $inputBox.val(money);
            $buttons.removeClass('active');
            $me.addClass("active");
        });
        //立即登录
        $('.tologin').click(function () {
            window.location.href = '/user/ilogin.html';
        });
        //买过理财产品了，头部浮动利率隐藏
        if (isPurchasedProduct) {
            $('.new-hot').parent().addClass('hide');
        }
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
                name: detailQTDS.name,
                apr: detailQTDS.apr,
                val: $inputBox.val(),
                income: income,
                actualPayment: actualPayment,
                discountCoupon: discountCoupon,
                url: '/commpd/agree/sevengold_agree_' + productId + '.html?productSign=QTDS',
                agreement: '七天大胜'
            }

            val = parseInt($inputBox.val() || lowestTender);
            investmentObj.income = detail.rateEarning(period, rate, $inputBox.val());
            investmentObj.actualPayment = $inputBox.val();
            investmentObj.discountCoupon = '';
            $('.discount').addClass('hide');
            //未出借过产品，则弹框中的历史年化收益显示浮动利率
            if (!isPurchasedProduct) {
                $('.past-returns').html(apr + floatApr);
                investmentObj.apr = apr + floatApr;
            }
            //风险测评
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
                } else if (val > mostTender) {
                    errorTip = "您的出借额最大不能大于" + mostTender + "元";
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
                                    debugger

                                    detail.investment(investmentObj);
                                    investmentObj.actualPayment = $inputBox.val() - $('.discount-coupon').val();
                                    $('.actualPayment').html(investmentObj.actualPayment);
                                    $('.discount-coupon').change(function () {
                                        investmentObj.actualPayment = $inputBox.val() - $('.discount-coupon').val();
                                        $('.actualPayment').html(investmentObj.actualPayment);
                                    });
                                } else {
                                    detail.investment(investmentObj);
                                }
                            } else {
                                detail.investment(investmentObj);
                            }
                        }, function () {
                            detail.investment(investmentObj);
                        })
                    } else {
                        detail.investment(investmentObj);
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
                productType: 94,
                redEnvelopeCode: redEnvelopeCode,
                tenderAmount: val
            }
            //investObj.tenderAmount = parseInt($inputBox.val() || lowestTender);
            investObj.tenderAmount = parseInt($('.actualPayment').html());


            //协议复选框勾选
            if($(".authorization >input").prop('checked') == false){
                $('.pop-error').html('请勾选同意七天大胜出借相关协议').removeClass('hide');
                return;
            }

            //支付密码校验
            if(flagPurchase){
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
                                        $.createCookie("tenderType", 94);
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
            padingUrl: '/tradeCenter/investProduct/QTDS/investmentRecord', //ajax 数据集
            pagination: $(".table-page"), //分页组件
            matchTableObject: $("#J_debenture"),
            matchPadingUrl: '/tradeCenter/investBiz/queryFinanceBorrowList',
            matchPagination: $(".debenture-page")
        }, productId);

        detail.keyDown();


        /*$('.number-box input').focus(function () {
            //禁止自动填充，如果得到焦点，则删除readonly属性
            $(this).val(100).removeAttr("readonly");
        });
        $('.number-box input').blur(function () {
            //禁止自动填充，如果失去焦点，则使文本框只读
            $(this).attr("readonly", "");
        });*/

    },
    function (err) {
        var con = null;
        if ((con = window.console)) con.log(err);
        else alert(err);
    }
)
;
