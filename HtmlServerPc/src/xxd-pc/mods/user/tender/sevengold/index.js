require(['base', "trackBase", 'store', 'side', 'juicer', 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
    ], function ($, track, store, side, jui, header, footer, dialog) {

        header.init();
        footer.init();

        var token = store && store.get("token") || {},
            classColor,
            type = 3, //类型
            startTime = "2000-01-01", //查询出借产品开始时间
            sevengoldStatus,
            endTime = $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd');//查询出借产品结束时间

        var sysStatus = [
            {"status": "-1", "value": "支付失败", "class": "red"},
            {"status": "0", "value": "支付中", "class": "orange"},
            {"status": "1", "value": "收益中", "class": "orange"},
            {"status": "2", "value": "已退出", "class": "green"},
            {"status": "3", "value": "提前退出", "class": "red"},
            {"status": "4", "value": "退出中", "class": "orange"}
        ];
        //左侧菜单
        side.leftMenu(1);
        //日期时间插件
        side.date(".user-date");
        //查询我的出借产品
        getMyInvestment();
        function getMyInvestment() {
            $.xxdAjax({
                url: '/tradeCenter/investBiz/myInvestmentProductsByToken/QTDS',
                type: 'get',
                clientId: 'XXD_FRONT_END',
                data: {
                    type: type,
                    pageSize: 10,
                    startTime: startTime,
                    endTime: endTime
                },
                token: token,
                callbacks: function (data) {
                    //删除当前行有的内容
                    var trs = $('#incomeTable tr');
                    $.each(trs, function (i, v) {
                        if (!$(v).hasClass('title')) {
                            $(v).remove();
                        }
                    });
                    if ((data.code == "200000") || data.data) {
                        if ((data.data.list.status == 2) || (data.data.list.status == 3)) {
                            $('#incomeType').html('实际收益');
                        }
                        if (data.data.list.length == '0') {
                            $('#incomeTable').append("<tr class='no-record'><td colspan='9'>当前尚无加入！</td> </tr>")
                            return;
                        }
                        $.each(data.data.list, function (i, item) {
                            sevengoldStatus = item.status;
                            $.each(sysStatus, function (i, v) {
                                if (item.status == v.status) {
                                    item.status = v.value;
                                    classColor = v.class;
                                }
                            });
                            $('#incomeTable').append('<tr>' + '<td>' + '<span>' + item.name +  '</span><span>' + $.fnDateToString(item.addDate, 'yyyy-MM-dd  HH:mm:ss') + '</span>'
                                + '</td>' + '<td>' + item.joinApr + '%</td>' + '<td>' + item.period + item.periodUnit + '</td>' + '<td>' + side.numberFormat(item.account) + '元</td>' + '<td>' + side.numberFormat(item.interest) + '元</td>'
                                + '<td><i class="' + classColor + '">' + item.status + '</i></td>'
                                + '<td>'+ $.fnDateToString(item.paymentDate, 'yyyy-MM-dd  HH:mm:ss')+'</td>'
                                + '<td class="main-color"><a href="/usercenter/bonds/sevengold.html?join=' + item.joinId + '&sevengoldStatus='+sevengoldStatus+'">查看详情</a></td>'
                                + '<td class="main-color"><a href="/commpd/agree/sevengold_' + item.productId + '.html?productSign=QTDS&productJoinId='+item.joinId+'">查看协议</a></td>'
                                + '</tr>');
                        });
                    } else {
                        $('#incomeTable').append("<tr class='no-record'><td colspan='9'>当前尚无加入！</td> </tr>")
                    }
                },
                error: function () {
                    $('#incomeTable').append("<tr class='no-record'><td colspan='9'>当前尚无加入！</td> </tr>")
                }
            })
        }

        //点击搜索按钮
        $('#serchRecord').click(function () {
            var startVal = $('.start-date').val(),
                endVal = $('.end-date').val();
            if ((!startVal) && (!endVal)) {
                startTime = "2000-01-01";
                endTime = $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd');
                getMyInvestment();
                return;
            }
            if (endVal !== '') {
                if (endVal < startVal) {
                    side.thisDialog('开始日期不能大于结束日期');
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
            startTime = startVal;
            endTime = endVal;
            getMyInvestment();
        });


        side.getLeftHeight();


    },
    function (err) {
        var con = null;
        if ((con = window.console)) con.log(err);
        else alert(err);
    }
);



