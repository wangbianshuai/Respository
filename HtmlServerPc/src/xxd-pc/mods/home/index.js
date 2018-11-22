require(['base', "trackBase", 'rotate', 'store', 'sbztTpl', 'zqzrTpl', 'juicer'
        , 'header', 'footer', 'backTop', 'json'
    ], function ($, track, rotate, store, sbztTpl, zqzrTpl, jui, header, footer) {
        header.init();
        footer.init();
        function fnZbzt(data) {
            var template = juicer.to_html(sbztTpl, data);
            $("#J_scattered").html(template);
            footer.process();
        }

        function fnZqzr(data) {
            var template = juicer.to_html(zqzrTpl, data);
            $("#J_assignment").html(template);
        }

        function fnBbgs(data) {
            var $bbgs = $("#J_bbgs");
            $bbgs.find(".rate span").html(data.plannedAnnualRateFrom + "% - " + data.plannedAnnualRateTo + "%");
            $bbgs.find(".money").html("起投金额：" + data.leastTenderAmountLabel);
            $bbgs.find(".limit").html("起投期限：" + data.leastPeriod + "个月");
        }

        function fnQtds(data) {
            var $qtds = $("#J_qtds");
            $qtds.find(".rate i").html(data.plannedAnnualRate);
            $qtds.find(".dimension-buy li").eq(1).find("span").html(data.leastPeriod + data.leastPeriodUnit);
            $qtds.find(".dimension-buy li").eq(2).find("span").html(data.leastTenderAmountLabel);
            var floatingRate = data.floatingRate;
            if (floatingRate) $qtds.find(".plus").html("+" + data.floatingRate + "%");
            $qtds.find(".count").html("累计加入：" + data.accumulatedInvestors);
            var status;
            var $btn = $qtds.find(".dimension-btn a");
            if ((status = data.status) && status.code != 'SELLING') {
                $btn.addClass("disable").html(status.message);
            } else if (status && status.code == 'SELLING') {
                $btn.removeClass("disable").html("立即加入");
            }
        }

        // function fnRry(data){
        //     var $rry = $("#J_rry");
        //     $rry.find(".count").html("累计加入："+data.accumulatedInvestors);
        //     $rry.find(".rate span").html(data.plannedAnnualRate+"%");
        //     $rry.find(".limit").html("万元收益："+(data.plannedAnnualRateFormat)+"元/日");
        //     $rry.find(".money").html("起投金额："+data.leastTenderAmountLabel);
        // }


        $.ajax({
            url: '/feapi/combine/invoke.html',
            contentType: "application/json",
            dataType: "json",
            data: {
                t: "v"
            },
            type: "get",
            success: function (res) {
                if (res) {
                    var sbzt, zqzr, bbgs, qtds, rry;
                    if ((sbzt = res.SBZT) && sbzt.code == 200000) {
                        var sbztData = sbzt.data;
                        fnZbzt(sbztData);
                    }
                    if ((zqzr = res.ZQZR) && zqzr.code == 200000) {
                        var zqzrData = zqzr.data;
                        fnZqzr(zqzrData);
                    }
                    if ((bbgs = res.BBGS) && bbgs.code == 200000) {
                        var bbgsData = bbgs.data;
                        fnBbgs(bbgsData);
                    }

                    if ((qtds = res.QTDS) && qtds.code == 200000) {
                        var qtdsData = qtds.data;
                        fnQtds(qtdsData);
                    }
                    // if ( (rry = res.RRY) && rry.code==200000 ){
                    //     var rryData = rry.data;
                    //     fnRry(rryData);
                    // }

                }
            },
            error: function (data) {
                $.log(data);
            }
        });


        var userDO = store && store.get("userDO") || {};
        track.init(userDO);
        var rotateObj = store && store.get("rotate") || [];
        rotate.sliderBox({
            object: '#J_rotate',
            sliderType: '1',
            sliderSpeed: 4000,
            animateSpeed: 1200,
            title: false,
            info: false,
            arrow: true,
            dataType: "json", /*html, jsonp*/
            data: rotateObj,
            minWidth: 1200
        });
        //倒计时
        $(".j_countdown").each(function () {
            var $this = $(this);
            var surplus = $this.attr("data-activite-time");
            console.log(surplus);
            console.log(surplus);
            function _countdown(surplus) {
                if (surplus > 0) {
                    surplus -= 1000;
                    var timeString = $.countdown(surplus);
                    $this.find('span').html(timeString);
                    setTimeout(function () {
                        _countdown(surplus);
                    }, 1000);
                } else {
                    // $this.html("本场已结束");
                    $this.hide();
                }
            }

            if ($.isNumeric(surplus)) {
                surplus = parseInt(surplus, 10);
                if (surplus <= 0) {
                    $this.hide();
                    return;
                }
                _countdown(surplus);
            }
        });

        //散标.债券、新闻.媒体
        $("#J_scatteredAndAssignment li , #J_titleNews .menu").on("click", function () {
            var $this = $(this);
            $this.addClass("active").siblings().removeClass("active")
            var tag = $this.attr("tag");
            $("#" + tag).removeClass("hide");
            var brotherTag = $this.siblings().attr("tag");
            $("#" + brotherTag).addClass("hide");
        });

        //合作伙伴

        var timer, _recursion = function ($ul, start, end, callback) {
            function _fn() {
                if (start == end) {
                    timer = null;
                    if (callback) callback($ul, start, end);
                    return;
                }
                if (start > end) start -= 25;
                else start += 25;
                $ul.css("marginLeft", start);
                timer = setTimeout(_fn, 100);
            }

            _fn();
        }
        var $partner = $("#J_partner"), $ul = $partner.find("ul"), countPartner = $ul.find("li").length,
            $leftAndRight = $("#J_partner").find(".left ,.right");
        if (countPartner * 150 - 1050 <= 0) $leftAndRight.addClass("hide");
        $leftAndRight.on("click", function (e) {
            if (timer) return;
            var $this = $(this), callback;
            var curPosition = $(".wrap-partner ul").css("marginLeft"), newPosition = 0;
            curPosition = curPosition ? parseInt(curPosition.replace(/px/g, "")) : 0;
            if ($this.hasClass("left")) {
                if (Math.abs(curPosition) < Math.abs(countPartner * 150 - 1050)) {
                    newPosition = curPosition - 150;
                } else {
                    $ul.append($ul.find("li").eq(0).clone(true));
                    newPosition = curPosition - 150;
                    callback = function ($ul, curPosition, newPosition) {
                        $ul.css("marginLeft", newPosition + 150).find("li").eq(0).remove();
                    }
                }
            } else {
                if (Math.abs(curPosition) > 0) {
                    newPosition = curPosition + 150;
                } else {
                    $ul.prepend($ul.find("li").eq(countPartner - 1).clone(true)).css("marginLeft", curPosition - 150);
                    newPosition = curPosition;
                    curPosition = curPosition - 150;
                    callback = function ($ul, curPosition, newPosition) {
                        $ul.css("marginLeft", newPosition).find("li").eq(countPartner).remove();
                    }
                }
            }
            if (curPosition != newPosition) {
                _recursion($ul, curPosition, newPosition, callback);
            }
        });


        //跑马灯效果
        marquee();
        function marquee() {
            var tag = $('.tag-hot span');
            $.each(tag, function (i, v) {
                var index = 1;
                if ($(v).width() <= 62) {
                    $(v).parent().parent().css('width', $(v).width() + "px");
                    return;
                } else {
                    $(v).append($(v).html());
                    setInterval(function () {
                        index++;
                        if (index >= ($(v).width() / 2)) {
                            index = 0;
                        }
                        $(v).css({'left': -index + 'px'});
                    }, 100);
                }
            });
        }
        //    月月派按钮浮层
        $('#download-qr-code,.dimension-mobile-btn').on('mouseover',function(){
            $('#download-qr-code').show();
        });

        $('#download-qr-code,.dimension-mobile-btn').on('mouseout',function(){
            $('#download-qr-code').hide();
        });
    },
    function (err) {
        var con = null;
        if ((con = window.console)) con.log(err);
        else alert(err);
    }
);

