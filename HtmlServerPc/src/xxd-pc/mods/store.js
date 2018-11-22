/**
 * Created by wanwenwei on 2016/10/17.
 */
define(['base'],function($ ) {
    var global = window["GLOBAL_STATIC_DATA"];
    var hash = $.Map();
    var ad = null , rotate = [] , userDO;
    if (global && (userDO=global.userDO) && (userId = userDO.id)) {
        window["userId"] = userId;
        hash.put("userDO" , userDO);
    }
    if (global &&  (ad = global.ad) &&  ad.code=="200000" ) {
        var rotateOri = ad.data.items && ad.data.items;
        for (var i = 0 ,j  = rotateOri.length; i  < j; i++){
            var item = rotateOri[i];
            var _obj = {
                imgurl:item.extendUrl,
                linkurl:item.textHref,
                title:item.text,
                imgId:item.id,
                content:""
            };
            rotate.push(_obj);
        }
        hash.put("rotate" , rotate);
    }

    //初始化数据
    var detailQTDS,detailYJDJ,detailXSB,bidDetail;
    if (global && (detailQTDS = global.detailQTDS) && detailQTDS.code =='200000') { //七天大胜
        hash.put("detailQTDS", detailQTDS.data);
    }else if(global && (detailYJDJ = global.detailYJDJ) && detailYJDJ.code =='200000'){
        hash.put("detailYJDJ", detailYJDJ.data);
    }else if(global && (detailXSB = global.detailXSB) && detailXSB.code =='200000'){
        hash.put("detailXSB", detailXSB.data);
    }else if(global && (bidDetail = global.bidDetail) && bidDetail.code =='200000'){
        hash.put("bidDetail", bidDetail.data);
    }else if(global && (bidDetail = global.detailThirtyTender) && bidDetail.code =='200000'){
        hash.put("detailThirtyTender", bidDetail.data);
    }

    var detailRecordObj = {} , detailMatchRecordObj = {},detailloanRecordObj={},
        detailtenderRecordObj={},detailConsumeRecord={},detailthirtyRecord;

    if (global && (detailRecordObj = global.QTDSRecord) && detailRecordObj.code =='200000') { //七天大胜
        detailRecordObj = detailRecordObj.data;
    } else if (global && (detailRecordObj = global.YJDJRecord) && detailRecordObj.code =='200000') {
        detailRecordObj = detailRecordObj.data;
    } else if (global && (detailRecordObj = global.XSBRecord) && detailRecordObj.code =='200000') {
        detailRecordObj = detailRecordObj.data;
    } else if (global && (detailRecordObj = global.thirtyTenderRecord) && detailRecordObj.code =='200000') {
        detailRecordObj = detailRecordObj.data;
    }
    if (!$.isEmptyObject(detailRecordObj)) {
        var hashPage = $.Map();
        hashPage.put(detailRecordObj.currentPage,detailRecordObj.items);
        hash.put("detailRecord",{
            total:detailRecordObj.totalCount,
            pageIndex:detailRecordObj.currentPage,
            pageSize:detailRecordObj.pageSize,
            hashPage:hashPage
        });
    }


    //债券匹配
    if (global && (detailMatchRecordObj = global.QTDSMatchRecord) && detailMatchRecordObj.code =='200000') {
        detailMatchRecordObj = detailMatchRecordObj.data;
    } else if (global && (detailMatchRecordObj = global.YJDJMatchRecord) && detailMatchRecordObj.code =='200000') {
        detailMatchRecordObj = detailMatchRecordObj.data;
    } else if (global && (detailMatchRecordObj = global.XSBMatchRecord) && detailMatchRecordObj.code =='200000') {
        detailMatchRecordObj = detailMatchRecordObj.data;
    }else if (global && (detailMatchRecordObj = global.detailthirtyRecord) && detailMatchRecordObj.code =='200000') {
        detailMatchRecordObj = detailMatchRecordObj.data;
    }
    if (!$.isEmptyObject(detailMatchRecordObj)) {
        var hashPage = $.Map();
        hashPage.put(detailMatchRecordObj.currentPage,detailMatchRecordObj.items);
        hash.put("detailMatchRecord",{
            total:detailMatchRecordObj.totalCount,
            pageIndex:detailMatchRecordObj.currentPage,
            pageSize:detailMatchRecordObj.pageSize,
            hashPage:hashPage
        });
    }

    //消费贷
    if (global && (detailConsumeRecord = global.bids) && detailConsumeRecord.code =='200000') {
        detailConsumeRecord = detailConsumeRecord.data;
    }
    if (!$.isEmptyObject(detailConsumeRecord)) {
        var hashPage = $.Map();
        hashPage.put(detailConsumeRecord.currentPage,detailConsumeRecord.items);
        hash.put("detailConsumeRecord",{
            total:detailConsumeRecord.totalCount,
            pageIndex:detailConsumeRecord.currentPage,
            pageSize:detailConsumeRecord.pageSize,
            hashPage:hashPage
        });
    }

    //贷款记录
    if (global && (detailloanRecordObj = global.loanRecord) && detailloanRecordObj.code =='200000') {
        detailloanRecordObj = detailloanRecordObj.data;
    }
    if (!$.isEmptyObject(detailloanRecordObj)) {
        var hashPage = $.Map();
        hashPage.put(detailloanRecordObj.currentPage,detailloanRecordObj.items);
        hash.put("detailloanRecordObj",{
            total:detailloanRecordObj.totalCount,
            pageIndex:detailloanRecordObj.currentPage,
            pageSize:detailloanRecordObj.pageSize,
            hashPage:hashPage
        });
    }

    //投标记录
    if (global && (detailtenderRecordObj = global.tenderRecord) && detailtenderRecordObj.code =='200000') {
        detailtenderRecordObj = detailtenderRecordObj.data;
    }
    if (!$.isEmptyObject(detailtenderRecordObj)) {
        var hashPage = $.Map();
        hashPage.put(detailtenderRecordObj.currentPage,detailtenderRecordObj.items);
        hash.put("detailtenderRecordObj",{
            total:detailtenderRecordObj.totalCount,
            pageIndex:detailtenderRecordObj.currentPage,
            pageSize:detailtenderRecordObj.pageSize,
            hashPage:hashPage
        });
    }

    /*var userMonthObj = {};
    //用户中心
    if (global && (userMonthObj = global.tenderRecord) && userMonthObj.code =='200000') {
        userMonthObj = userMonthObj.data;
    }
    if (!$.isEmptyObject(userMonthObj)) {
        var hashPage = $.Map();
        hashPage.put(userMonthObj.currentPage,userMonthObj.items);
        hash.put("userMonthObj",{
            total:userMonthObj.totalCount,
            pageIndex:userMonthObj.currentPage,
            pageSize:userMonthObj.pageSize,
            hashPage:hashPage
        });
    }*/






    //set from token
    if(global){
        hash.put("formtoken" , global.formtoken);
        hash.put("token" , global.token);
        hash.put("isLogin",global.isLogin);
    }
    return hash;
});