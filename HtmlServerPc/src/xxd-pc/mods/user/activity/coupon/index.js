require(['base', 'paging', "trackBase", 'store', 'side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, paging, track, store, side, jui, header, footer, dialog) {

    header.init();
    footer.init();
    //左侧菜单
    side.leftMenu(4);
    // side.tabs({
    //     tabsObject: $("#J_tabs"),//tab 栏
    // });
    var token = store && store.get("token") || {};
    var tabStatus = $.getUrlParam('type', location.search);
    console.log(tabStatus);
    var envelopes = [
        {'status': 'envelope1', 'value': 1},
        {'status': 'envelope2', 'value': 2},
        {'status': 'envelope3', 'value': 3}
    ]
    var productType = [
        {'type': 2, 'value': "步步高升"},
        {'type': 3, 'value': "七天大胜"},
        {'type': 4, 'value': "月进斗金"},
        {'type': 5, 'value': "新元宝"},
        {'type': 6, 'value': "月月派"},
        {'type': 7, 'value': "散标"},
        {'type': 8, 'value': "债权"}
    ];
    var newPacketStatus = [
        {'status': '0'},
        {'status': '1'},
        {'status': '2'},
        {'status': '3'}
    ];
    var newPackCount = 0;


    //新手红包
    function newPacketTable(tableData) {
        var contentArray = [];
        if (tableData.length == 0) {
            contentArray.push('<li class="title"><span class="th">红包名称</span><span class="th">红包金额</span><span class="th">使用条件</span><span class="th">使用范围</span><span class="th">使用平台</span></li>');
        }
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            contentArray.push('<li class="clearfix"> <div class="goupon-pic"> <p>' + row.title + '</p><span>' + row.statusDescribe + '</span> </div> ');
            contentArray.push('<div class="goupon-info"> <p>金额：<span>' + row.amount + '元</span></p> <p class="nowrap">使用条件：');
            contentArray.push('<span>投标满' + row.amountLimit + '元</span></p><p>使用范围：<span>' + row.productRange + '</span></p> ');
            contentArray.push('<p class="nowrap">有效期：<span>' + $.fnDateToString(row.validDate, 'yyyy-MM-dd  HH:mm:ss') + '</span></p>');
            contentArray.push('<p>使用平台：<span>PC/WAP/APP</span></p></div> </li>');
        }
        return contentArray.join("");
    };

    //新手红包已使用table列表渲染
    function usedPacketTable(tableData) {
        var contentArray = [];
        var title = '<tr class="title"><th>红包名称</th><th>红包金额</th><th>使用时间</th><th>使用产品</th></tr>';
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            contentArray.push('<tr><td>' + row.title + '</td>' +
                '<td>' + row.amount + '元</td>' +
                '<td>' + $.fnDateToString(row.useDate, 'yyyy-MM-dd  HH:mm:ss') + '</td>' +
                '<td>' + row.productRange + '</td></tr>');
        }
        /*productRange 在已使用的状态下是使用产品名称，非使用范围*/
        return title + contentArray.join("");
    }

    //新手红包已过期table列表渲染
    function pastPacketTable(tableData) {
        var contentArray = [];
        var title = '<tr class="title"><th>红包名称</th><th>红包金额</th><th>过期时间</th><th>使用条件</th><th>适用产品</th></tr>'
        for (var i = 0, j = tableData.length; i < j; i++) {
            var row = tableData[i];
            contentArray.push('<tr><td>' + row.title + '</td>' +
                '<td>' + row.amount + '元</td>' +
                '<td>' + $.fnDateToString(row.validDate, 'yyyy-MM-dd  HH:mm:ss') + '</td>' +
                '<td>投标满' + row.amountLimit + '元</td>' +
                '<td>' + row.productRange + '</td></tr>');
        }
        return title + contentArray.join("");
    }


    function getTable(object, callback) {
        //新手红包可使用
        var newPacketRecord = store && store.get("newPacketRecord") || {};
        var $newPacketRecord = object.newPacketObject;
        var a = 0;

        function _ajax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $newPacketRecord.html(newPacketTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.newPacketUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 6,
                        status: object.status
                    },
                    token: token,
                    callback: function (data) {
                        a++;
                        var tableData = data.items;
                        hashPage.put(data.totalPages, tableData);
                        paging.pagingObj = pagingObj;
                        $newPacketRecord.html(newPacketTable(tableData));
                        newPacketRecord['total'] = data.totalCount;
                        newPacketRecord['pageSize'] = data.pageSize;   //data.pageSize
                        newPacketRecord['pageIndex'] = data.pageNum; //data.pageNum
                        newPackCount = newPackCount + data.totalCount;
                        if (callback) {
                            callback()
                        }
                        if (a == 1) {
                            paging(newPacketRecord);
                        }
                        if (newPacketRecord.total == 0) {
                            // $newPacketRecord.append('<li class="clearfix"> <div class="goupon-pic"> <p>暂无新手红包</p> </div> ' +
                            //     '<div class="goupon-info"> <p><span></span></p> <p><span></span></p><p><span></span></p> ' +
                            //     '<p class="last"><span></span></p></div> </li>');
                            $newPacketRecord.append('<li class="center tr"><p class="td">暂无可使用新手红包</p></li>')
                        }
                    },
                    error: function () {
                        // $newPacketRecord.append('<li class="clearfix"> <div class="goupon-pic"> <p>暂无新手红包</p> </div> ' +
                        //     '<div class="goupon-info"> <p><span></span></p> <p><span></span></p><p><span></span></p> ' +
                        //     '<p class="last"><span></span></p></div> </li>');
                        $newPacketRecord.append('<li class="center tr"><p class="td">暂无可使用新手红包</p></li>')
                    }
                });
            }
        }

        if (true || !$.isEmptyObject(newPacketRecord)) {
            $.extend(newPacketRecord, {
                $dom: object.newPacketPagination,
                callback: function (pagingObj) {
                    _ajax(pagingObj);
                }
            });
            _ajax(newPacketRecord);
        }

        //新手红包已使用
        var newUsedRecord = store && store.get("newUsedRecord") || {};
        var $newUsedRecord = object.newUsedObject;
        var b = 0;

        function _newUsedAjax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $newUsedRecord.html(newPacketTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.newUsedPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                        status: object.usedStatus
                    },
                    token: token,
                    callback: function (data) {
                        b++;
                        var tableData = data.items;
                        hashPage.put(data.totalPages, tableData);
                        paging.pagingObj = pagingObj;
                        $newUsedRecord.html(usedPacketTable(tableData));
                        newUsedRecord['total'] = data.totalCount;
                        newUsedRecord['pageSize'] = data.pageSize;   //data.pageSize
                        newUsedRecord['pageIndex'] = data.pageNum;  //data.pageNum
                        newPackCount = newPackCount + data.totalCount;
                        if (callback) {
                            callback()
                        }
                        if (b == 1) {
                            paging(newUsedRecord);
                        }
                        if (newUsedRecord.total == 0) {
                            // $newUsedRecord.append('<li class="clearfix"> <div class="goupon-pic"> <p>暂无优惠券</p> </div> ' +
                            //     '<div class="goupon-info"> <p><span></span></p> <p><span></span></p><p><span></span></p> ' +
                            //     '<p class="last"><span></span></p></div> </li>');
                            $newUsedRecord.append('<tr class="center"><td colspan="4">暂无已使用新手红包</td></tr>');
                        }
                    },
                    error: function () {
                        // $newUsedRecord.append('<li class="clearfix"> <div class="goupon-pic"> <p>暂无优惠券</p> </div> ' +
                        //     '<div class="goupon-info"> <p><span></span></p> <p><span></span></p><p><span></span></p> ' +
                        //     '<p class="last"><span></span></p></div> </li>');
                        $newUsedRecord.append('<tr class="center"><td colspan="4">暂无已使用新手红包</td></tr>');
                    }
                });
            }
        }

        if (true || !$.isEmptyObject(newUsedRecord)) {
            $.extend(newUsedRecord, {
                $dom: object.newUsedPagination,
                callback: function (pagingObj) {
                    _newUsedAjax(pagingObj);
                }
            });
            _newUsedAjax(newUsedRecord);
        }

        //新手红包已过期
        var newPastMatchRecord = store && store.get("newPastMatchRecord") || {};
        var $newPastMatchRecord = object.newPastObject;
        var c = 0;

        function _newPastAjax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $newPastMatchRecord.html(newPacketTable(tableData));
            } else {
                $.xxdAjax({
                    url: object.newPastPadingUrl,
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || 10,
                        status: object.pastStatus
                    },
                    token: token,
                    callback: function (data) {
                        c++;
                        var tableData = data.items;
                        hashPage.put(data.totalPages, tableData);
                        paging.pagingObj = pagingObj;
                        $newPastMatchRecord.html(pastPacketTable(tableData));
                        newPastMatchRecord['total'] = data.totalCount;
                        newPastMatchRecord['pageSize'] = data.pageSize;  //data.pageSize
                        newPastMatchRecord['pageIndex'] = data.pageNum;  //data.pageNum
                        // console.log("新手红包已过期page："+c);
                        newPackCount = newPackCount + data.totalCount;
                        if (callback) {
                            callback()
                        }
                        if (c == 1) {
                            paging(newPastMatchRecord);
                        }
                        if (newPastMatchRecord.total == 0) {
                            // $newPastMatchRecord.append('<li class="clearfix"> <div class="goupon-pic"> <p>暂无优惠券</p> </div> ' +
                            //     '<div class="goupon-info"> <p><span></span></p> <p><span></span></p><p><span></span></p> ' +
                            //     '<p class="last"><span></span></p></div> </li>');
                            $newPastMatchRecord.append('<tr class="center"><td colspan="5">暂无已过期新手红包</td></tr>');
                        }
                    },
                    error: function () {
                        // $newPastMatchRecord.append('<li class="clearfix"> <div class="goupon-pic"> <p>暂无优惠券</p> </div> ' +
                        //     '<div class="goupon-info"> <p><span></span></p> <p><span></span></p><p><span></span></p> ' +
                        //     '<p class="last"><span></span></p></div> </li>');
                        $newPastMatchRecord.append('<tr class="center"><td colspan="5">暂无已过期新手红包</td></tr>');

                    }
                });
            }
        }

        if (true || !$.isEmptyObject(newPastMatchRecord)) {
            $.extend(newPastMatchRecord, {
                $dom: object.newPastPagination,
                callback: function (pagingObj) {
                    _newPastAjax(pagingObj);
                }
            });
            _newPastAjax(newPastMatchRecord);
        }

    }

    function getNewPackTable(object, record, renderFun, callback) {
        //新手红包已过期
        var Record = store && store.get(record) || {};
        var $Record = object.value;
        // var c = 0;
        var size = 10;
        if (object.status == 1 || object.status == "1") {
            size = 6;
        }
        function _Ajax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $Record.html(renderFun(tableData));
            } else {
                $.xxdAjax({
                    url: '/investmentAPI/prize/redEnvelope',
                    clientId: 'XXD_FRONT_END',
                    type: 'get',
                    data: {
                        currentPage: pageIndex,
                        pageSize: pagingObj.pageSize || size,
                        status: object.status
                    },
                    token: token,
                    callback: function (data) {
                        // c++;
                        object.currentPage++;
                        var tableData = data.items;
                        hashPage.put(data.totalPages, tableData);
                        paging.pagingObj = pagingObj;
                        $Record.html(renderFun(tableData));
                        Record['total'] = data.totalCount;
                        Record['pageSize'] = data.pageSize;  //data.pageSize
                        Record['pageIndex'] = data.pageNum;  //data.pageNum
                        newPackCount = newPackCount + data.totalCount;
                        if (callback) {
                            callback()
                        }
                        if (object.currentPage == 1) {
                            paging(Record);
                        }
                        if (Record.total == 0) {
                            object.status == 1? $Record.append('<li class="center tr"><p class="td">暂无可使用新手红包</p></li>'):
                                object.status == 2?$Record.append('<tr class="center"><td colspan="5">暂无已使用新手红包</td></tr>'):
                                    object.status == 3?$Record.append('<tr class="center"><td colspan="5">暂无已过期新手红包</td></tr>'):''
                        }
                    },
                    error: function () {
                        $Record.append('<tr class="center"><td colspan="5">暂无已过期新手红包</td></tr>');

                    }
                });
            }
        }

        if (true || !$.isEmptyObject(Record)) {
            $.extend(Record, {
                $dom: object.pageValue,
                callback: function (pagingObj) {
                    _newPastAjax(pagingObj);
                }
            });
            _Ajax(Record);
        }
    }

    /**
     *  获取新手红包，列表数据
     *  @status：0.全部,1.可使用,2.已使用,3.已过期
     */
    var newPackMap = [
        {value: $('.J_newEnableTable'), pageValue: $(".newEnableTable-page"), status: '1', currentPage: 0},
        {value: $('.J_newUsedTable'), pageValue: $(".newUsedTable-page"), status: '2', currentPage: 0},
        {value: $('.J_newExpiredTable'), pageValue: $(".newExpiredTable-page"), status: '3', currentPage: 0}
    ];
    getNewPackTable(newPackMap[0], "newPacketRecord", newPacketTable, newPack);
    getNewPackTable(newPackMap[1], "newUsedRecord", usedPacketTable,newPack);
    getNewPackTable(newPackMap[2], "newPastMatchRecord", pastPacketTable,newPack);
    function newPack() {
        if (newPackCount == 0) {
            $('.goupons').find('li').eq(0).addClass('hide').removeClass('active');
            $('.goupons').find('li').eq(1).addClass('active');
            $('.goupons-bd').find('.j_tabContent').addClass('hide');
            $('.goupons-bd').find('.j_tabContent').eq(1).removeClass('hide');
        } else {
            $('.goupons').find('li').eq(0).removeClass('hide').addClass('active');
            $('.goupons').find('li').eq(1).removeClass('active');
            $('.goupons-bd').find('.j_tabContent').addClass('hide');
            $('.goupons-bd').find('.j_tabContent').eq(0).removeClass('hide');
        }
        if(tabStatus && tabStatus == 'redEnvelope'){
            $('.goupons').find('li').removeClass('active');
            $('.goupons').find('li').eq(1).addClass('active');
            $('.goupons-bd').find('.j_tabContent').addClass('hide');
            $('.goupons-bd').find('.j_tabContent').eq(1).removeClass('hide');
        }
        if(tabStatus && tabStatus == 'raiseInterestRate'){
            $('.goupons').find('li').removeClass('active');
            $('.goupons').find('li').eq(2).addClass('active');
            $('.goupons-bd').find('.j_tabContent').addClass('hide');
            $('.goupons-bd').find('.j_tabContent').eq(2).removeClass('hide');
        }
    }
    $('.J_newStatus').on('click', 'li', function () {
        $(this).addClass('active').siblings().removeClass('active');
        var index = $(this).index();
        $(this).parents('.j_tabContent').find('.J_statusBox').eq(index).removeClass('hide').siblings().addClass('hide');
        if (index == 0) {
            //    可使用
            newPackMap[0].currentPage = 0;
            getNewPackTable(newPackMap[0], "newPacketRecord", newPacketTable);
        }
        if (index == 1) {
            //    已使用
            newPackMap[1].currentPage = 0;
            getNewPackTable(newPackMap[1], "newUsedRecord", usedPacketTable);
        }
        if (index == 2) {
            // 已过期
            newPackMap[2].currentPage = 0;
            getNewPackTable(newPackMap[2], "newPastMatchRecord", pastPacketTable);
        }
    });

    //红包列表渲染
    var RedTableRender = {
        redTable: function (tableData) {
            var contentArray = [];
            if (tableData.length == 0) {
                contentArray.push('<li class="title"><span>红包名称</span><span>红包金额</span><span>使用条件</span><span>使用范围</span><span>使用平台</span></li>');
            }
            for (var i = 0, j = tableData.length; i < j; i++) {
                var row = tableData[i];

                var termsList, type;
                $.each(row.productScope, function (j, w) {
                    $.each(productType, function (h, u) {
                        if (w.productType == productType[h].type) {
                            type = productType[h].value;
                        }
                    });
                    termsList = w.termsList.join('/') + '个月';
                });
                if(row.isEvent && row.isEvent == 'Y'){
                    termsList = termsList + '(加息标除外)'
                }
                contentArray.push('<li class="clearfix"> <div class="goupon-pic"> <p>' + row.name + '</p><span>' + row.statusDescribe + '</span> </div> ');
                contentArray.push('<div class="goupon-info"> <p class="nowrap">金额：<span>' + row.amount + '元</span></p> <p>使用条件：');
                contentArray.push('<span>投标满' + row.quota + '元</span></p><p>使用范围：<span>' + type + termsList + '</span></p> ');
                contentArray.push('<p class="nowrap">有效期：<span>' + $.fnDateToString(row.effectiveEndTime, 'yyyy-MM-dd  HH:mm:ss') + '</span></p>');
                contentArray.push('<p>使用平台：<span>' + row.platform.join("/") + '</span></p></div> </li>');
            }

            return contentArray.join("");
        },
        redUsedTable: function (tableData) {
            var contentArray = [];
            var title = '<tr class="title"><th>红包名称</th><th>红包金额</th><th>使用时间</th><th>使用产品</th></tr>';

            for (var i = 0, j = tableData.length; i < j; i++) {
                var row = tableData[i];
                contentArray.push('<tr>' +
                    '<td>' + row.name + '</td>' +
                    '<td>' + row.amount + '元</td>' +
                    '<td>' + $.fnDateToString(row.useDate, 'yyyy-MM-dd  HH:mm:ss') + '</td>' +
                    '<td>' + row.productType + '</td>' +
                    '</tr>');
            }
            return title + contentArray.join("");

        },
        redPastTable: function (tableData) {
            var contentArray = [];
            var title = '<tr class="title"><th>红包名称</th><th>红包金额</th><th>过期日期</th><th>使用条件</th><th>适用产品</th></tr>';

            for (var i = 0, j = tableData.length; i < j; i++) {
                var row = tableData[i];
                var termsList, type;
                $.each(row.productScope, function (j, w) {
                    $.each(productType, function (h, u) {
                        if (w.productType == productType[h].type) {
                            type = productType[h].value;
                        }
                    });
                    termsList = w.termsList.join('/') + '个月';
                });
                if(row.isEvent && row.isEvent == 'Y'){
                    termsList = termsList + '(加息标除外)'
                }
                contentArray.push('<tr>' +
                    '<td>' + row.name + '</td>' +
                    '<td>' + row.amount + '元</td>' +
                    '<td>' + $.fnDateToString(row.effectiveEndTime, 'yyyy-MM-dd  HH:mm:ss') + '</td>' +
                    '<td>投资满' + row.quota + '元</td>' +
                    '<td>' + type + termsList + '</td>' +
                    '</tr>');
            }
            return title + contentArray.join("");

        }
    };

    //加息券列表渲染
    var raiseTableRender = {
        raiseTable: function (tableData) {
            var contentArray = [];
            if (tableData.length == 0) {
                contentArray.push('<li class="title"><span>加息券名称</span><span>加息利率</span><span>加息天数</span><span>使用条件</span><span>使用范围</span><span>使用平台</span></li>');
            }
            for (var i = 0, j = tableData.length; i < j; i++) {
                var row = tableData[i];
                var termsList, type , numRaiseDays;
                $.each(row.productScope, function (j, w) {
                    $.each(productType, function (h, u) {
                        if (w.productType == productType[h].type) {
                            type = productType[h].value;
                        }
                    });
                    termsList = w.termsList.join('/') + '个月';
                });
                if(row.isEvent && row.isEvent == 'Y'){
                    termsList = termsList + '(加息标除外)'
                }
                if(row.numRaiseDays && row.numRaiseDays !=null && parseInt(row.numRaiseDays) !=0){
                    numRaiseDays = row.numRaiseDays + '天';
                }else{
                    numRaiseDays = "无限制";
                }
                contentArray.push('<li class="clearfix raiseItem"> <p class="raiseName">' + row.name + '</p> ');
                contentArray.push('<div class="goupon-pic bg-fff"><div>+' + row.raiseInterestRate + '%</div>');
                contentArray.push('<p>加息：' + numRaiseDays + '</p><span>' + row.statusDescribe + '</span> </div>');
                contentArray.push('<div class="goupon-info"><p>使用条件：');
                contentArray.push('<span>投资' + row.minInvest + '元—' + row.maxInvest + '元</span></p><p>使用范围：<span>' + type + termsList + '</span></p> ');
                contentArray.push('<p class="nowrap">有效期：<span>' + $.fnDateToString(row.effectiveEndTime, 'yyyy-MM-dd  HH:mm:ss') + '</span></p>');
                contentArray.push('<p>使用平台：<span>' + row.platform.join("/") + '</span></p></div> </li>');
            }
            return contentArray.join("");
        },
        raiseUsedTable: function (tableData) {
            var contentArray = [];
            var title = '<tr class="title"><th>加息券名称</th><th>加息利率</th><th>加息天数</th><th>使用时间</th><th>使用产品</th></tr>';
            for (var i = 0, j = tableData.length; i < j; i++) {
                var row = tableData[i];
                //validRaiseDays 实际使用天数 numRaiseDays 加息券可加息的天数
                var validRaiseDays;
                if(row.validRaiseDays && row.validRaiseDays !=null && parseInt(row.validRaiseDays) !=0){
                    validRaiseDays = row.validRaiseDays + '天';
                }else{
                    validRaiseDays = "无限制";
                }
                contentArray.push('<tr>' +
                    '<td>' + row.name + '</td>' +
                    '<td>' + row.raiseInterestRate + '%</td><td>' + validRaiseDays + '</td>' +
                    '<td>' + $.fnDateToString(row.useDate, 'yyyy-MM-dd  HH:mm:ss') + '</td>' +
                    '<td>' + row.productType + '</td>' +
                    '</tr>');
            }
            return title + contentArray.join("");

        },
        raisePastTable: function (tableData) {
            var contentArray = [];
            var title = '<tr class="title"><th>加息券名称</th><th>加息利率</th><th>加息天数</th><th>过期日期</th><th>使用条件</th><th>适用产品</th></tr>';
            for (var i = 0, j = tableData.length; i < j; i++) {
                var row = tableData[i];
                var termsList, type, numRaiseDays;
                $.each(row.productScope, function (j, w) {
                    $.each(productType, function (h, u) {
                        if (w.productType == productType[h].type) {
                            type = productType[h].value;
                        }
                    });
                    termsList = w.termsList.join('/') + '个月';
                });
                if(row.isEvent && row.isEvent == 'Y'){
                    termsList = termsList + '(加息标除外)'
                }
                if(row.numRaiseDays && row.numRaiseDays !=null && parseInt(row.numRaiseDays) !=0){
                    numRaiseDays = row.numRaiseDays + '天';
                }else{
                    numRaiseDays = "无限制";
                }
                contentArray.push('<tr>' +
                    '<td>' + row.name + '</td>' +
                    '<td>' + row.raiseInterestRate + '%</td><td>' + numRaiseDays + '</td>' +
                    '<td>' + $.fnDateToString(row.effectiveEndTime, 'yyyy-MM-dd  HH:mm:ss') + '</td>' +
                    '<td>投资' + row.minInvest + '—' + row.maxInvest + '元之间</td>' +
                    '<td>' + type + termsList + '</td>' +
                    '</tr>');
            }
            return title + contentArray.join("");

        }
    };

    /**
     *  获取红包，加息券列表数据
     *  @status：0.全部,1.可使用,2.已使用,3.已过期
     *  @type:   2.优惠券,3.加息券
     */
    function getRedRaise(object, Record, renderFun) {

        var recordObj = store && store.get(Record) || {};

        var $Record = object.value;

        var size = 10;
        if (object.status == 1 || object.status == "1") {
            size = 6;
        }
        function _ajax(pagingObj) {
            var hashPage = pagingObj.hashPage || $.Map();
            var pageIndex = pagingObj.pageIndex || 1;
            var tableData;
            if (tableData = hashPage.get(pageIndex)) {
                //repeat table
                $Record.html(renderFun(tableData));
            } else {
                $.xxdAjax({
                    url: '/tradeCenter/coupon/queryCouponRecordsByUserId',
                    clientId: 'XXD_INTEGRATION_PLATFORM',
                    type: 'get',
                    data: {
                        pageIndex: pageIndex,
                        pageSize: pagingObj.pageSize || size,
                        status: object.status,
                        type: object.type
                    },
                    token: token,
                    callback: function (data) {
                        object.currentPage++;
                        var tableData = data.couponList;
                        hashPage.put(data.totalPages, tableData);
                        paging.pagingObj = pagingObj;
                        $Record.html(renderFun(tableData));
                        recordObj['total'] = data.totalSize;         //data.totalSize
                        recordObj['pageSize'] = data.pageSize;          //data.pageSize
                        recordObj['pageIndex'] = data.pageIndex;  //data.pageIndex
                        if (object.currentPage == 1) {
                            paging(recordObj);
                        }
                        if (data.totalSize == 0) {
                            object.status == 1 && object.type == 2 ? $Record.append('<li class="center tr"><span class="td">暂无可使用红包</span></li>') :
                                object.status == 1 && object.type == 3 ? $Record.append('<li class="center tr"><span class="td">暂无可使用加息券</span></li>') : '';

                            object.status == 2 && object.type == 2 ? $Record.append('<tr class="center"><td colspan="4">暂无已使用红包</td></tr>') :
                                object.status == 2 && object.type == 3 ? $Record.append('<tr class="center"><td colspan="5">暂无已使用加息券</td></tr>') : '';

                            object.status == 3 && object.type == 2 ? $Record.append('<tr class="center"><td colspan="5">暂无已过期红包</td></tr>') :
                                object.status == 3 && object.type == 3 ? $Record.append('<tr class="center"><td colspan="6">暂无已过期加息券</td></tr>') : '';

                        }
                    },
                    error: function () {
                        object.status == 1 && object.type == 2 ? $Record.append('<li class="center tr"><span class="td">暂无可使用红包</span></li>') :
                            object.status == 1 && object.type == 3 ? $Record.append('<li class="center tr"><span class="td">暂无可使用加息券</span></li>') : '';

                        object.status == 2 && object.type == 2 ? $Record.append('<tr class="center"><td colspan="5">暂无已使用红包</td></tr>') :
                            object.status == 2 && object.type == 3 ? $Record.append('<tr class="center"><td colspan="5">暂无已使用加息券</td></tr>') : '';

                        object.status == 3 && object.type == 2 ? $Record.append('<tr class="center"><td colspan="5">暂无已过期红包</td></tr>') :
                            object.status == 3 && object.type == 3 ? $Record.append('<tr class="center"><td colspan="5">暂无已过期加息券</td></tr>') : '';
                    }
                });
            }
        }

        if (true || !$.isEmptyObject(recordObj)) {
            $.extend(recordObj, {
                $dom: object.pageValue,
                callback: function (pagingObj) {
                    _ajax(pagingObj);
                }
            });
            _ajax(recordObj);
        }
    }


    //红包
    var redMap = [
        {value: $(".J_redEnableTable"), pageValue: $(".redEnableTable-page"), status: '1', type: '2', currentPage: 0},
        {value: $(".J_redUsedTable"), pageValue: $(".redUsedTable-page"), status: '2', type: '2', currentPage: 0},
        {value: $(".J_redPastTable"), pageValue: $(".redPastTable-page"), status: '3', type: '2', currentPage: 0},
    ];
    getRedRaise(redMap[0], "redRecord", RedTableRender.redTable);
    getRedRaise(redMap[1], "redUsedRecord", RedTableRender.redUsedTable);
    getRedRaise(redMap[2], "redPastRecord", RedTableRender.redPastTable);
    $('.J_packetStatus').on('click', 'li', function () {
        $(this).addClass('active').siblings().removeClass('active');
        var index = $(this).index();
        $(this).parents('.j_tabContent').find('.J_statusBox').eq(index).removeClass('hide').siblings().addClass('hide');
        if (index == 0) {
            //    可使用
            redMap[0].currentPage = 0;
            getRedRaise(redMap[0], "redRecord", RedTableRender.redTable);
        }
        if (index == 1) {
            //    已使用
            redMap[1].currentPage = 0;
            getRedRaise(redMap[1], "redUsedRecord", RedTableRender.redUsedTable);
        }
        if (index == 2) {
            // 已过期
            redMap[2].currentPage = 0;
            getRedRaise(redMap[2], "redPastRecord", RedTableRender.redPastTable);
        }
    });

    //加息券
    var raiseMap = [
        {value: $(".J_raiseRateTable"), pageValue: $(".raiseRateTable-page"), status: '1', type: '3', currentPage: 0},
        {value: $(".J_raiseRateUsedTable"), pageValue: $(".raiseRateUsedTable-page"), status: '2', type: '3', currentPage: 0},
        {value: $(".J_raiseRatePastTable"), pageValue: $(".raiseRatePastTable-page"), status: '3', type: '3', currentPage: 0},
    ];
    getRedRaise(raiseMap[0], "raiseRateRecord", raiseTableRender.raiseTable);
    getRedRaise(raiseMap[1], "raiseRateUsedRecord", raiseTableRender.raiseUsedTable);
    getRedRaise(raiseMap[2], "raiseRatePastRecord", raiseTableRender.raisePastTable);
    $('.J_rateStatus').on('click', 'li', function () {
        $(this).addClass('active').siblings().removeClass('active');
        var index = $(this).index();
        $(this).parents('.j_tabContent').find('.J_statusBox').eq(index).removeClass('hide').siblings().addClass('hide');
        if (index == 0) {
            //    可使用
            raiseMap[0].currentPage = 0;
            getRedRaise(raiseMap[0], "raiseRateRecord", raiseTableRender.raiseTable);
        }
        if (index == 1) {
            //    已使用
            raiseMap[0].currentPage = 0;
            getRedRaise(raiseMap[1], "raiseRateUsedRecord", raiseTableRender.raiseUsedTable);
        }
        if (index == 2) {
            // 已过期
            raiseMap[2].currentPage = 0;
            getRedRaise(raiseMap[2], "raiseRatePastRecord", raiseTableRender.raisePastTable);
        }
    });


    var listMap = [
        {tabValue:$('.J_newStatus'),contentValue:$('.J_newPacket')},
        {tabValue:$('.J_packetStatus'),contentValue:$('.J_redPacket')},
        {tabValue:$('.J_rateStatus'),contentValue:$('.J_raiseRate')},
    ];
    $('#J_tabs').on('click','li',function(){
        var index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('.j_tabContent').eq(index).removeClass('hide').siblings('.j_tabContent').addClass('hide');

        listMap[index].tabValue.find('li').eq(0).addClass('active').siblings('li').removeClass('active');
        listMap[index].contentValue.find('.J_statusBox').eq(0).removeClass('hide').siblings('.J_statusBox').addClass('hide');
        if (index == 0) {
            //新手红包
            newPackMap[0].currentPage = 0;
            getNewPackTable(newPackMap[0], "newPacketRecord", newPacketTable);
        }
        if (index == 1) {
            // 红包
            redMap[0].currentPage = 0;
            getRedRaise(redMap[0], "redRecord", RedTableRender.redTable);
        }
        if (index == 2) {
            // 加息券
            raiseMap[0].currentPage = 0;
            getRedRaise(raiseMap[0], "raiseRateRecord", raiseTableRender.raiseTable);
        }
    });
    //兑换
    $('.J_couponInput').keyup(function () {
        if ($('.J_couponInput').val().length >= 8) {
            $('.J_getCoupon').removeClass('disable');
        }
    });
    $('.J_getCoupon').click(function () {
        if ($(this).hasClass('disable')) {
            return;
        }
        $.xxdAjax({
            url: '/tradeCenter/coupon/conversionCouponRecord?code=' + $('.J_couponInput').val(),
            type: 'post',
            clientId: 'XXD_FRONT_END',
            token: token,
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        side.thisDialog(data.data.message);
                    } else {
                        side.thisDialog(data.message);
                    }
                } else {
                    side.thisDialog(data.message);
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    });


    side.getLeftHeight();

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});