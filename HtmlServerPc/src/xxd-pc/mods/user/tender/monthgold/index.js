require(['base', 'paging', "trackBase", 'store', 'side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, paging, track, store, side, jui, header, footer, dialog) {

    header.init();
    footer.init();

    var token = store && store.get("token") || {},
        type = 3, //类型
        startTime = "2000-01-01", //查询出借产品开始时间
        monthgoldStatus,
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

    //日期时间插件
    side.date(".user-date");
    //左侧菜单
    side.leftMenu(1);

    //表格内容
    function investTable(tableData) {
        var title = '<tr class="title"><th>基本信息</th><th>历史年化收益</th><th>加入金额</th>'
            + '<th>服务期</th><th>历史收益</th><th>状态</th><th>我的债权</th><th>服务协议</th><th>操作</th></tr>';
        var contentArray = [];
        var classColor;
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            monthgoldStatus = row.status ;
            $.each(sysStatus, function (i, v) {
                if (row.newStatus == v.status) {
                    row.newStatus = v.value;
                    classColor = v.class;
                }
            });
            contentArray.push("<tr>");
            contentArray.push("<td><a target='_blank' href='/detail/monthgold.html'><span>" + row.name +"-"+row.periodName+ "期</span>");
            contentArray.push("<span>" + $.fnDateToString(row.addDate, 'yyyy-MM-dd  HH:mm:ss') + "</span></a></td>");
            contentArray.push("<td>" + row.joinApr + "%</td>");
            contentArray.push("<td>" + side.numberFormat(row.account) + "元</td>");
            contentArray.push("<td>" + row.period + row.periodUnit + "</td>");
            contentArray.push("<td>" + side.numberFormat(row.interest) + "元</td>");
            contentArray.push("<td><i class='" + classColor + "'>" + row.newStatus + "</i></td>");
            contentArray.push("<td class='main-color'><a href='/usercenter/bonds/monthgold.html?join="+row.joinId+"&monthgoldStatus="+monthgoldStatus+"'>查看详情</a></td>");
            contentArray.push("<td class='main-color'><a href='/commpd/agree/monthgold_"+row.productId+".html?productSign=YJDJ&productJoinId="+row.joinId+"'>查看协议</a></td>");
            if(row.newStatus == '可申请退出'){
                contentArray.push("<td class='main-color'><a href='#' class='J_quitbtn J_quitnormal' value='" + row.joinId + "' alt='" + row.productId + "'>申请退出</a></td>");
            }else{
                contentArray.push("<td class='main-color'><a href='#' class='J_quitbtn no-quit'>申请退出</a></td>");
            }
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };

    function getTable(object) {
        var matchDetailRecord = store && store.get("matchDetailRecord") || {};
        var $matchTableRecord = object.monthInvestObject;
        var a = 0;

        function _ajax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $matchTableRecord.html(investTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.monthPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        type: type,
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                        startTime:startTime,
                        endTime:endTime
                    },
                    token: token,
                    callback: function (data) {
                        a++;
                        var tableData = data.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $matchTableRecord.html(investTable(tableData));
                        matchDetailRecord['total'] = data.total;
                        matchDetailRecord['pageSize'] = 10;
                        matchDetailRecord['pageIndex'] = data.pageNum;
                        if (a == 1) {
                            paging(matchDetailRecord);
                        }
                        if (matchDetailRecord.total == 0) {
                            $matchTableRecord.append("<tr class='no-record'><td colspan='9'><a href='/detail/monthgold.html'>当前尚未加入，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $matchTableRecord.append("<tr class='no-record'><td colspan='9'><a href='/detail/monthgold.html'>当前尚未加入，去看看！</a></td> </tr>");
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
    }

    var map = {
        monthInvestObject: $("#monthTable"),
        monthPadingUrl: '/tradeCenter/investBiz/myInvestmentProductsByToken/YJDJ'+'?'+new Date().getTime(),
        loanPagination: $(".monthTable-page"),
    };

    getTable(map);


    //点击搜索按钮
    $('#serchRecord').click(function () {
        var startVal = $('.start-date').val(),
            endVal = $('.end-date').val();
        if ((!startVal) && (!endVal)) {
            startTime = "2000-01-01";
            endTime = $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd');
            getTable(map);
            return;
        }
        if (endVal !== '') {
            if (endVal < startVal) {
                side.thisDialog('开始日期不能大于结束日期');
                return;
            }
        }

        if(startVal == ''){
            startVal = "2000-01-01";
        }
        if(endVal == ''){
            endVal =  $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd');;
        }
        startTime = startVal;
        endTime = endVal;
        getTable(map);
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
                    "productType": 95
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
                            'productType': 95,
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

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

