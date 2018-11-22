require(['base', 'paging', "trackBase", 'store', 'detail', 'juicer'
        , 'header', 'footer', "dialog", 'backTop', 'json', 'md'
    ], function ($, paging, track, store, detail, jui, header, footer, dialog, md) {
        header.init();
        footer.init();
        var userDO = store && store.get("userDO") || {};
        track.init(userDO);
        //btn 出借按钮 判断
        var detailThirtyTender = store && store.get("detailThirtyTender") || {};
        var token = store && store.get("token") || {};
        var isLogin = store && store.get("isLogin");
        var status = detailThirtyTender.status;
        var meetTermOfPurchase = detailThirtyTender.meetTermOfPurchase;
        var useRedenvelope = detailThirtyTender.useRedenvelope;
        var discountCoupon = '', actualPayment, val;
        var productId = detailThirtyTender.id;
        var step = parseInt(detailThirtyTender.step);
        var isPurchasedProduct = detailThirtyTender.isPurchasedProduct;

        //风险测评新增内容start
        var typeName = detailThirtyTender.typeName,
            lastCount = detailThirtyTender.count,
            investmentAmount = detailThirtyTender.investmentAmount,
            nextTestTime = detailThirtyTender.nextTestTime,
            surplusAmount = detailThirtyTender.surplusAmount,
            quota = detailThirtyTender.quota;
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
            } else if ((typeName == '') || (typeName == '进取型')) {
            } else {
                $('.error-tip').after('<p class="red">您的平台剩余可投额度:' + detail.numberFormat(surplusAmount) + '元</p>' +
                    '<p class="test-tip">您在平台已加入' + detail.numberFormat(investmentAmount) + '元，风险测评给予您的总限额为' + detail.numberFormat(quota) + '元，可投剩余额度为' + detail.numberFormat(surplusAmount) + '元</p>');
            }
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
                    $('.J_noCondition').html('').append("<div class='no-thirty-condition'> " +
                        "<p>您已经不是新手用户了， 查看其他更多新元宝产品。</p>" +
                        "<a href='/xplan/search/list.html'>去看看</a></div>");
                }
                $("#J_buyWrap").html(btn);
            }
            return btn;
        }
        var btn = loginButton(isLogin, status, meetTermOfPurchase);
        //资金出借风险提示函
        if (isLogin && (status == 2) && meetTermOfPurchase) {
            $('.risk-protocol').removeClass('hide');
        }

        //计算利息
        var period = parseInt(detailThirtyTender.period);
        var periodUnit = detailThirtyTender.periodUnit;
        if (periodUnit == 'MONTH') {
            period *= 30;
        }
        var $inputBox = $("#J_numberBox input"), $income = $("#J_income");
        var remAccount = parseFloat(detailThirtyTender.remAccount);
        var lowestTender = detailThirtyTender.lowestTender;
        var usable = detailThirtyTender.usable;
        var mostTender = detailThirtyTender.mostTender;
        var apr = detailThirtyTender.apr, floatApr = detailThirtyTender.floatApr;
        apr = (apr == "") ? 0 : apr;
        floatApr = (floatApr == "") ? 0 : floatApr;
        apr = (parseFloat(apr)) / 100;
        floatApr = (parseFloat(floatApr)) / 100;
        //var rate = (parseFloat(apr) + parseFloat(floatApr)) / 100;    原来的是综合概率，现在拆分来计算
        /*if (isPurchasedProduct) {
            //出借过理财产品了
            apr = parseFloat(apr) / 100;
            floatApr = 0;                    //去掉七天大胜的这个逻辑：客户出借过理财产品的话，直接浮动利率就给为0
        }*/
        //计算收益
        var income = detail.rateEarning(period, apr, floatApr, $inputBox.val());
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
                        var income = detail.rateEarning(period, apr, floatApr, val);
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
                    var income = detail.rateEarning(period, apr, floatApr, val);
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
            var income = detail.rateEarning(period, apr, floatApr, money);
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
        /*if (isPurchasedProduct) {
            $('.new-hot').parent().addClass('hide');    //去掉七天大胜的这个逻辑：客户出借过理财产品的话，直接浮动利率就给为0
        }*/
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
                    if (surplusAmount < val && val < usable) {
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
                name: detailThirtyTender.name,
                apr: detailThirtyTender.apr,
                floatApr: detailThirtyTender.floatApr,
                val: $inputBox.val(),
                income: income,
                actualPayment: actualPayment,
                discountCoupon: discountCoupon,
                url: '/commpd/agree/XSCP30T_agree_' + productId + '.html?productSign=XSCP30T',
                agreement: '新元宝（新手专享）'
            }

            investmentObj.income = detail.rateEarning(period, apr, floatApr, $inputBox.val());
            investmentObj.actualPayment = $inputBox.val();
            investmentObj.discountCoupon = '';
            $('.discount').addClass('hide');
            //未出借过产品，则弹框中的历史年化收益显示浮动利率
            /*if (!isPurchasedProduct) {
                $('.past-returns').html(apr + floatApr);
                investmentObj.apr = apr + floatApr;                       //去掉七天大胜的这个逻辑：客户出借过理财产品的话，直接浮动利率就给为0
            }*/
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
                productType: 93,
                redEnvelopeCode: redEnvelopeCode,
                tenderAmount: val
            }
            //investObj.tenderAmount = parseInt($inputBox.val() || lowestTender);
            investObj.tenderAmount = parseInt($('.actualPayment').html());


            //协议复选框勾选
            if ($(".authorization >input").prop('checked') == false) {
                $('.pop-error').html('请勾选同意新元宝（新手专享）出借相关协议').removeClass('hide');
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
                                        $.createCookie("tenderType", 93);
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
            padingUrl: '/tradeCenter/investProduct/XSCP30T/investmentRecord', //ajax 数据集
            pagination: $(".table-page"), //分页组件
            matchTableObject: $("#J_debenture"),
            matchPadingUrl: '/tradeCenter/investBiz/queryFinanceBorrowList',
            matchPagination: $(".debenture-page")
        }, productId);

        detail.keyDown();

        //表格收益提示
        $('#earningsTip').mouseenter(function () {
            $('#tipContent').removeClass('hide');
        });
        $('#earningsTip').mouseleave(function () {
            $('#tipContent').addClass('hide');
        });

    },
    function (err) {
        var con = null;
        if ((con = window.console)) con.log(err);
        else alert(err);
    }
)
;
