require(['base','paging', "trackBase", 'store','side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($,paging,track, store,side, jui, header, footer, dialog) {

    header.init();
    footer.init();

    side.tabs({
        tabsObject: $("#J_tabs"),//tab 栏
    });

    //日期时间插件
    side.date(".user-date");
    //左侧菜单
    side.leftMenu(1);
    var inStartTime,inEndTime,receiptStartTime,receiptEndTime;

    var token = store && store.get("token") || {},
        startTime = "2000-01-01", //查询出借产品开始时间
        endTime = $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd');//查询出借产品结束时间
    //收款记录状态
    var receiptStatus = [
        {"status": "0", "value": "未还款"},
        {"status": "1", "value": "已归还"},
        {"status": "2", "value": "已归还"},
        {"status": "3", "value": "已归还"},
        {"status": "4", "value": "提前还款"},
        {"status": "5", "value": "待签约"},
        {"status": "-1", "value": "签约失败"},
        {"status": "", "value": "未知状态"}
    ];
    //投标列表状态
    var sysStatus= [
        {"status": "1", "value": "审核中"},
        {"status": "2", "value": "投标中"},
        {"status": "3", "value": "满标复审"},
        {"status": "4", "value": "还款中"},
        {"status": "5", "value": "还款结束"},
        {"status": "-1", "value": "流标"},
        {"status": "-2", "value": "被撤销"},
        {"status": "-3", "value": "审核失败"},
        {"status": "6", "value": "待签约"},
        {"status": "7", "value": "准备发布"},
        {"status": "-4", "value": "签约失败"},
        {"status": "44", "value": "已转让"},
        {"status": "0", "value": "已转让"}
    ];
    var periodUnits = [
        {"periodUnit":"MONTH","period":"个月"},
        {"periodUnit":"DAY","period":"天"},
        {"periodUnit":"SEASON","period":"个季度"}
    ];

    //表格内容
    function tenderFillTable(tableData) {
        // var title = '<tr class="title"><th>下一回款日</th><th>标的类型</th><th>标题</th>'
        //     + '<th>借款人</th><th>年利率</th><th>服务期</th><th>投标总额</th><th>待收本息</th><th>标的状态</th><th>投标时间</th></tr>';
        var title = '<tr class="title"><th>下一回款日</th><th>标的类型</th><th>标题</th>'
            + '<th>借款人</th><th>年利率</th><th>借款期限</th><th>投标总额</th><th>待收本息</th><th>标的状态</th><th>投标时间</th></tr>';
        var contentArray = [];
        var tenderStatus;
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            $.each(sysStatus, function (i, v) {
                if (row.status == v.status) {
                    tenderStatus = v.value;
                }
            });
            $.each(periodUnits,function (i,v) {
                if (row.periodUnit == v.periodUnit) {
                    row.periodUnit = v.period;
                }
            })
            contentArray.push("<tr>");
            if(row.repayTime){
                contentArray.push("<td>"+$.fnDateToString(row.repayTime, 'yyyy-MM-dd') +"</td>");
            }else{
                contentArray.push("<td>-</td>");
            }
            contentArray.push("<td>" + row.borrowType + "</td>");
            contentArray.push("<td class='main-color' style='max-width: 150px;'><a target='_blank' href='/borrow/detail/"+row.borrowId+".html'>"+row.tenderTitle+"</a></td>");
            //合同判断比较复杂，所有产品都不一样
            if( row.status==4 || row.status==5){
                if(row.type !=8 && row.type !=15 && row.type !=44){
                    if((row.type==9 || row.type == 14 )&& row.contractMode==2){
                        contentArray.push("<td class='borrower'> <span>"+row.borrowNickName+"</span>" +
                            "<a target='_blank' href='/borrow/investorDownloadContractFromXXD.html?id="+row.borrowId+"'>下载合同</a> </td>");
                    }else{
                        contentArray.push("<td class='borrower'> <span>"+row.borrowNickName+"</span>" +
                            "<a target='_blank' href='/borrow/borrowcontract.html?id="+row.borrowId+"'>查看合同</a> </td>");
                    }
                }else if(row.type ==8 || row.type ==15){
                    contentArray.push("<td class='borrower'> <span>"+row.borrowNickName+"</span>" +                                                           // todo  需要userid
                        "<a target='_blank' href='/contractsigning/querycontractdetail.html?bid="+row.borrowId+"&tenderUserId="+row.borrowId+"'>查看合同</a> </td>");
                }else {
                    contentArray.push("<td class='borrower'>"+row.borrowNickName+"</td>");
                }
            }else{
                contentArray.push("<td class='borrower'>"+row.borrowNickName+"</td>");
            }
            contentArray.push("<td>" + row.borrowApr + "%</td>");
            contentArray.push("<td>" + row.period + row.periodUnit + "</td>");
            // contentArray.push("<td>" + side.numberFormat(row.borrowAccount) + "元</td>");
            contentArray.push("<td>" + side.numberFormat(row.tenderTotalAmount) + "元</td>");
            contentArray.push("<td>" + side.numberFormat(row.tenderRepaymentAccount) + "元</td>");
            contentArray.push("<td><i>" + tenderStatus + "</i></td>");
            contentArray.push("<td>" + $.fnDateToString(row.tenderAddtime, 'yyyy-MM-dd') + "</td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    };

    function receiptFillTable(tableData) {
        // var title = '<tr class="title"><th>标题</th><th>借款金额</th><th>年利率</th>'
        //     + '<th>服务期</th><th>投标总额</th><th>应收本息</th><th>应收日期</th><th>实收本息</th><th>实收日期</th><th>期数</th><th>标的状态</th></tr>';
        var title = '<tr class="title"><th>标题</th><th>借款金额</th><th>年利率</th>'
            + '<th>借款期限</th><th>投标总额</th><th>应收本息</th><th>应收日期</th><th>实收本息</th><th>实收日期</th><th>期数</th><th>标的状态</th></tr>';
        var contentArray = [];
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            $.each(receiptStatus, function (i, v) {
                if (row.status == v.status) {
                    row.status = v.value;
                }
            });
            $.each(periodUnits,function (i,v) {
                if (row.periodUnit == v.periodUnit) {
                    row.periodUnit = v.period;
                }
            })
            contentArray.push("<tr>");
            contentArray.push("<td class='main-color' style='max-width: 150px;'><a href='/borrow/detail/"+row.borrowId+".html'>"+row.tenderTitle+"</a></td>");
            // contentArray.push("<td>" + side.numberFormat(row.borrowAccount) + "</td>");
            contentArray.push("<td>" + side.numberFormat(row.tenderTotalAmount) + "元</td>");
            contentArray.push("<td>"+row.borrowApr+"%</td>");
            contentArray.push("<td>" + row.period + row.periodUnit + "</td>");
            contentArray.push("<td>"+side.numberFormat(row.effectiveMoney)+"元</td>");
            contentArray.push("<td>"+side.numberFormat(row.repayAccount)+"元</td>");
            contentArray.push("<td>"+$.fnDateToString(row.repayTime, 'yyyy-MM-dd') +"</td>");
            contentArray.push("<td>"+side.numberFormat(row.repayYesAccount)+"元</td>");
            if(row.repayYesTime){
                contentArray.push("<td>"+$.fnDateToString(row.repayYesTime, 'yyyy-MM-dd') +"</td>");
            }else{
                contentArray.push("<td>-</td>");
            }
            if(row.type == 13){
                contentArray.push("<td>"+row.porder+"/+1</td>");
            }else{
                contentArray.push("<td>"+row.porder+"/"+row.timeLimit+"</td>");
            }
            contentArray.push("<td><i>" + row.status + "</i></td>");
            contentArray.push("</tr>");
        }
        return title + contentArray.join("");
    }

    function getTable(object) {
        var matchDetailRecord = store && store.get("matchDetailRecord") || {};
        var $matchTableRecord = object.tenderTableObject;
        var a = 0;
        //投标列表
        function _ajax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $matchTableRecord.html(tenderFillTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.tenderPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                    },
                    token: token,
                    callback: function (data) {

                        a++;
                        var tableData = data.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $matchTableRecord.html(tenderFillTable(tableData));
                        matchDetailRecord['total'] = data.total;
                        matchDetailRecord['pageSize'] = 10;
                        matchDetailRecord['pageIndex'] = data.pageNum;
                        if (a == 1) {
                            paging(matchDetailRecord);
                        }
                        if (matchDetailRecord.total == 0) {
                            $matchTableRecord.append("<tr class='no-record'><td colspan='10'><a href='/borrow/search/list.html'>当前尚未加入，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $matchTableRecord.append("<tr class='no-record'><td colspan='10'><a href='/borrow/search/list.html'>当前尚未加入，去看看！</a></td> </tr>");
                    }
                });
            }
        }
        if (true || !$.isEmptyObject(matchDetailRecord)) {
            $.extend(matchDetailRecord, {
                $dom: object.tenderPagination,
                callback: function (pagingObj) {
                    _ajax(pagingObj);
                }
            });
            _ajax(matchDetailRecord);
        }
        //收款记录
        var receiptRecordObj = store && store.get("receiptRecordObj") || {};
        var $receiptTableRecord = object.receiptTableObject;
        var receiptnumber = 0;

        function _receiptajax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $receiptTableRecord.html(receiptFillTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.receiptPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    token: token,
                    data: {
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                    },
                    callback: function (data) {
                        receiptnumber++;
                        var tableData = data.list;
                        hashPage.put(data.pageNum, tableData);
                        paging.pagingObj = pagingObj;
                        $receiptTableRecord.html(receiptFillTable(tableData));
                        receiptRecordObj['total'] = data.total;
                        receiptRecordObj['pageSize'] = 10;
                        receiptRecordObj['pageIndex'] = data.pageNum;
                        if (receiptnumber == 1) {
                            paging(receiptRecordObj);
                        }
                        if (receiptRecordObj.total == 0) {
                            $receiptTableRecord.append("<tr class='no-record'><td colspan='11'><a href='/borrow/search/list.html'>当前无收款记录，去看看！</a></td> </tr>");
                        }
                    },
                    error: function () {
                        $receiptTableRecord.append("<tr class='no-record'><td colspan='11'><a href='/borrow/search/list.html'>当前无收款记录，去看看！</a></td> </tr>");
                    }
                });
            }
        }

        if (true || !$.isEmptyObject(receiptRecordObj)) {
            $.extend(receiptRecordObj, {
                $dom: object.receiptPagination,
                callback: function (pagingObj) {
                    _receiptajax(pagingObj);
                }
            });
            _receiptajax(receiptRecordObj);
        }



    }

    var map = {
        tenderTableObject: $("#investTable"),
        tenderPadingUrl: '/tradeCenter/borrowTender/queryTenderRecord',
        tenderPagination: $(".investTable-page"),
        receiptTableObject:$("#receiptTable"),
        receiptPadingUrl: '/tradeCenter/borrowTender/queryCollectionRecord',
        receiptPagination: $(".receiptTable-page"),
    };
    getTable(map);

    //点击搜索按钮

    $('#serchRecord1').click(function () {
        var startVal = $('.in-start').val(),endVal = $('.in-end').val(),matchVal = $('.J_inKeyword').val();
        startTime = startVal , endTime = endVal;
        if((!startVal) && (!endVal) && (!matchVal)){
            getTable({
                tenderTableObject: $("#investTable"),
                tenderPadingUrl: '/tradeCenter/borrowTender/queryTenderRecord',
                tenderPagination: $(".investTable-page")
            });
            return;
        }
        if (endVal !== '') {
            if (endVal < startVal) {
                side.thisDialog('开始日期不能大于结束日期');
                return;
            }
        }
        if(startVal >$.fnDateToString(new Date().getTime(), 'yyyy-MM-dd')){
            side.thisDialog('开始日期不能大于当前日期');
            return;
        }
        if(startVal == ''){
            startTime = "2000-01-01";
        }
        if(endVal == ''){
            endTime =  $.fnDateToString(new Date().getTime(), 'yyyy-MM-dd');
        }
        if(!matchVal){
            getTable({
                tenderTableObject: $("#investTable"),
                tenderPadingUrl: '/tradeCenter/borrowTender/queryTenderRecord?startTime='+startTime+'&endTime='+endTime,
                tenderPagination: $(".investTable-page")
            });
            return;
        }
        if(matchVal){
            getTable({
                tenderTableObject: $("#investTable"),
                tenderPadingUrl: '/tradeCenter/borrowTender/queryTenderRecord?startTime='+startTime+'&endTime='+endTime+'&title='+matchVal,
                tenderPagination: $(".investTable-page")
            });
        }
    });

    $('#serchRecord2').click(function () {
        var startVal = $('.receipt-start').val(),endVal = $('.receipt-end').val(),
            matchVal = $('.J_receiptKeyword').val(),selectVal = $('.J_receiptSelect').val();
        startTime = startVal , endTime = endVal;
        if((!startVal) && (!endVal) && (!matchVal) && (!selectVal)){
            getTable({
                receiptTableObject:$("#receiptTable"),
                receiptPadingUrl: '/tradeCenter/borrowTender/queryCollectionRecord',
                receiptPagination: $(".receiptTable-page")
            });
            return;
        }
        if (endVal !== '') {
            if (endVal < startVal) {
                side.thisDialog('开始日期不能大于结束日期');
                return;
            }
        }
        if(startVal == ''){
            startTime = "2000-01-01";
        }
        if(startVal >$.fnDateToString(new Date().getTime(), 'yyyy-MM-dd')){
            side.thisDialog('开始日期不能大于当前日期');
            return;
        }
        if(selectVal == ''){
            selectVal == '0';
        }
        if(!matchVal){
            if(endVal == ''){
                getTable({
                    receiptTableObject:$("#receiptTable"),
                    receiptPadingUrl: '/tradeCenter/borrowTender/queryCollectionRecord?startTime='+startTime+'&status='+selectVal,
                    receiptPagination: $(".receiptTable-page")
                });
            }else{
                getTable({
                    receiptTableObject:$("#receiptTable"),
                    receiptPadingUrl: '/tradeCenter/borrowTender/queryCollectionRecord?startTime='+startTime+'&endTime='+endTime+'&status='+selectVal,
                    receiptPagination: $(".receiptTable-page")
                });
            }
            return;
        }
        if(matchVal){
            if(endVal == ''){
                getTable({
                    receiptTableObject:$("#receiptTable"),
                    receiptPadingUrl: '/tradeCenter/borrowTender/queryCollectionRecord?startTime='+startTime+'&status='+selectVal+'&title='+matchVal,
                    receiptPagination: $(".receiptTable-page")
                });
            }else{
                getTable({
                    receiptTableObject:$("#receiptTable"),
                    receiptPadingUrl: '/tradeCenter/borrowTender/queryCollectionRecord?startTime='+startTime+'&endTime='+endTime+'&status='+selectVal+'&title='+matchVal,
                    receiptPagination: $(".receiptTable-page")
                });
            }
        }
    });


    side.getLeftHeight();


}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

