require(['base', "trackBase", 'store', 'side', 'juicer', 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
    ], function ($, track, store, side, jui, header, footer, dialog) {

        header.init();
        footer.init();

        var token = store && store.get("token") || {},
            classColor,
            type = 3, //类型
            startTime = "2000-01-01", //查询出借产品开始时间
            newtenderStatus,
            endTime = $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd');//查询出借产品结束时间

        /*
        var sysStatus = [
            {"status": "-1", "value": "支付失败", "class": "red"},
            {"status": "0", "value": "支付中", "class": "orange"},
            {"status": "1", "value": "收益中", "class": "orange"},
            {"status": "2", "value": "已退出", "class": "green"},
            {"status": "3", "value": "提前退出", "class": "red"},
            {"status": "4", "value": "退出中", "class": "orange"}
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

        //左侧菜单
        side.leftMenu(1);
        //日期时间插件
        side.date(".user-date");

        //查询我的出借产品
        getMyInvestment();
        function getMyInvestment() {
            $.xxdAjax({
                url: '/tradeCenter/investBiz/myInvestmentProductsByToken/XSB',
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
                            $('#incomeTable').append("<tr class='no-record'><td colspan='10'><a href='/detail/newtender-3.html'>当前尚未加入，去看看！</a></td> </tr>")
                            return;
                        }
                        $.each(data.data.list, function (i, item) {
                            newtenderStatus = item.status;
                            $.each(sysStatus, function (i, v) {
                                if (item.newStatus == v.status) {
                                    item.newStatus = v.value;
                                    classColor = v.class;
                                }
                            });
                            var contentArray = [];
                            if(item.period == '3'){
                                contentArray.push('<tr>' + '<td>' + '<a href="/detail/newtender-3.html" target="_blank">');
                            }else{
                                contentArray.push('<tr>' + '<td>' + '<a href="/detail/newtender.html" target="_blank">');
                            }
                            contentArray.push(item.name +  '<span>' + $.fnDateToString(item.addDate, 'yyyy-MM-dd  HH:mm:ss') + '</span></a>');
                            contentArray.push('</td>' + '<td>' + item.joinApr + '%</td>' + '<td>' + item.period + item.periodUnit + '</td>' + '<td>');
                            contentArray.push(side.numberFormat(item.account) + '元</td>' + '<td>' + side.numberFormat(item.interest) + '元</td>');
                            contentArray.push('<td><i class="' + classColor + '">' + item.newStatus + '</i></td>');
                            contentArray.push('<td>'+ $.fnDateToString(item.paymentDate, 'yyyy-MM-dd  HH:mm:ss')+'</td>');
                            contentArray.push('<td class="main-color"><a href="/usercenter/bonds/newtender.html?join=' + item.joinId + '&newtenderStatus='+newtenderStatus+ '">查看详情</a></td>');
                            contentArray.push('<td class="main-color"><a href="/xsb/contractForTender/' + item.productId + '.html?productSign=XSB&join=' + item.joinId + '">查看协议</a></td>');
                            if(item.newStatus == '可申请退出'){
                                contentArray.push("<td class='main-color'><a href='#' class='J_quitbtn J_quitnormal' value='" + item.joinId + "' alt='" + item.productId + "'>申请退出</a></td></tr>");
                            }else{
                                contentArray.push("<td class='main-color'><a href='#' class='J_quitbtn no-quit'>申请退出</a></td></tr>");
                            }
                            $('#incomeTable').append(contentArray.join(""));

                        });
                    } else {
                        $('#incomeTable').append("<tr class='no-record'><td colspan='10'><a href='/detail/newtender-3.html'>当前尚未加入，去看看！</a></td> </tr>")
                    }
                },
                error: function () {
                    $('#incomeTable').append("<tr class='no-record'><td colspan='10'><a href='/detail/newtender-3.html'>当前尚未加入，去看看！</a></td> </tr>")
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

    //到期退出
    var ontimeProductname;
    var ontimeAmount;
    var ontimeInterest;
    var ontimeForfeit;
    var quitnormalObj;
    var ontimeCurrent;
    var clickFlag = 0;
    $('body').on('click', '.J_quitnormal', function () {
        joinId = $(this).attr('value');
        productId = $(this).attr('alt');
        $.ajax({
            url:'/tradeCenter/InvestOrder/quitApply',
            type:'put',
            dataType:"json",
            async:false,
            contentType:"application/json;charset=utf-8",
            data: JSON.stringify({
                "data": {
                    "joinId": joinId,
                    "productId": productId,
                    "productType": 16
                }
            }),
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
                request.setRequestHeader('clientTime',new Date().getTime());
                request.setRequestHeader('token',token);
            },
            success:function(data){
                if(data.code == '200000'){
                    if(data.data.resultCode != 0){
                        dialog({
                            id: "",
                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>申请退出</div>" +
                            "<div class='m-con-bd'>" +
                            "<div class='filed-user'>  " +
                            "<p style='text-align:center;'>" + data.data.message + "</p> </div> " +
                            "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='top:0; right:135px;'>确认</a></p> </div>" +
                            "</div>"
                            + "</div>",
                            cancel:function (clo) {
                                clo.close();
                            },
                            confirm:function (clo) {
                                clo.close();
                            }
                        });
                    }else{
                        ontimeProductname = data.data.pname;
                        ontimeAmount = parseFloat(data.data.account);
                        ontimeInterest = parseFloat(data.data.interest);
                        ontimeForfeit = parseFloat(data.data.forfeit);
                        ontimeCurrent = ontimeAmount + ontimeInterest;
                        quitnormalObj = {
                            'joinId': joinId,
                            'productId': productId,
                            'productType': 16,
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
                                if(clickFlag == 0){
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
                                                    cancel:function (clo) {
                                                        window.location.reload()
                                                    },
                                                    confirm:function (clo) {
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
                                                    cancel:function (clo) {
                                                        clo.close();
                                                    },
                                                    confirm:function (clo) {
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
                                            cancel:function (clo) {
                                                clo.close();
                                            },
                                            confirm:function (clo) {
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
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    });

        side.getLeftHeight();


    },
    function (err) {
        var con = null;
        if ((con = window.console)) con.log(err);
        else alert(err);
    }
);



