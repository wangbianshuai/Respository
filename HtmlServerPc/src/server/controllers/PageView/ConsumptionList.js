async function GetData(ctx) {
    ctx.IsLog = false;
    ctx.body = {
        globalData: GetGlobalData(),
        global: GetGlobal()
    }
}

function GetGlobal() {
    return {
        staticHost: "//static.xinxindai.com",
        xxdVersion: "1.7.4"
    }
}

function GetGlobalData() {
    return {
        "isLogin": true,
        "nickName": "18***41",
        "link": {
            "code": 200000,
            "data": {
                "items": [{
                    "textHref": "//www.sfia.org.cn/",
                    "text": "上海金融信息行业协会"
                }, {
                    "textHref": "//www.nifa.org.cn/nifa/index.html",
                    "text": "中国互联网金融协会"
                }, {
                    "textHref": "//www.wdzj.com/",
                    "text": "网贷之家"
                }, {
                    "textHref": "//www.wjchina.org/",
                    "text": "网金中国"
                }, {
                    "textHref": "//www.xinxindai.com",
                    "text": "网贷平台"
                }, {
                    "textHref": "//bbs.xinxindai.com/",
                    "text": "P2P网贷论坛"
                }, {
                    "textHref": "//finance.ifeng.com/itfinance/",
                    "text": "凤凰互联网金融"
                }, {
                    "textHref": "//www.zixinke.com",
                    "text": "资信客"
                }, {
                    "textHref": "//www.shengcai18.com/",
                    "text": "生菜网"
                }, {
                    "textHref": "//iof.hexun.com",
                    "text": "和讯互联网金融"
                }, {
                    "textHref": "//www.icaifu.com/",
                    "text": "研报下载"
                }, {
                    "textHref": "//shanghai.roadoor.com/",
                    "text": "上海贷款"
                }, {
                    "textHref": "//www.dimeng.net",
                    "text": "网贷系统"
                }, {
                    "textHref": "//h.shlxhd.gov.cn/xinxindai.lx",
                    "text": "新新贷党支部"
                }]
            }
        },
        "bids": {
            "code": 200000,
            "data": {
                "pageSize": 10,
                "currentPage": 1,
                "totalCount": 50,
                "items": [{
                    "leastPeriodValue": 3,
                    "productId": "2c9093f65bd29951015bd2a0f981000a",
                    "bidAmount": 1400,
                    "plannedAnnualRate": 8,
                    "rOW_ID": 1,
                    "productCategory": "P001",
                    "leftTenderAmount": 0,
                    "bidCode": "BID201807150000491",
                    "id": "492",
                    "leastPeriodType": "MONTH",
                    "bidName": "消费贷",
                    "riskGrade": "A1",
                    "productType": "1001",
                    "status": {
                        "code": "REPAYING",
                        "message": "还款中"
                    }
                }, {
                    "leastPeriodValue": 3,
                    "productId": "2c9093f65bd29951015bd2a0f981000a",
                    "bidAmount": 1520,
                    "plannedAnnualRate": 8,
                    "rOW_ID": 2,
                    "productCategory": "P001",
                    "leftTenderAmount": 0,
                    "bidCode": "BID201806300000481",
                    "id": "482",
                    "leastPeriodType": "MONTH",
                    "bidName": "消费贷",
                    "riskGrade": "A1",
                    "productType": "1001",
                    "status": {
                        "code": "REPAYING",
                        "message": "还款中"
                    }
                }, {
                    "leastPeriodValue": 3,
                    "productId": "2c9093f65bd29951015bd2a0f981000a",
                    "bidAmount": 3040,
                    "plannedAnnualRate": 8,
                    "rOW_ID": 3,
                    "productCategory": "P001",
                    "leftTenderAmount": 0,
                    "bidCode": "BID201806260000473",
                    "id": "474",
                    "leastPeriodType": "MONTH",
                    "bidName": "消费贷",
                    "riskGrade": "A1",
                    "productType": "1001",
                    "status": {
                        "code": "REPAYING",
                        "message": "还款中"
                    }
                }, {
                    "leastPeriodValue": 3,
                    "productId": "2c9093f65bd29951015bd2a0f981000a",
                    "bidAmount": 1400,
                    "plannedAnnualRate": 8,
                    "rOW_ID": 4,
                    "productCategory": "P001",
                    "leftTenderAmount": 0,
                    "bidCode": "BID201806250000471",
                    "id": "472",
                    "leastPeriodType": "MONTH",
                    "bidName": "消费贷",
                    "riskGrade": "A1",
                    "productType": "1001",
                    "status": {
                        "code": "REPAYING",
                        "message": "还款中"
                    }
                }, {
                    "leastPeriodValue": 3,
                    "productId": "2c9093f65bd29951015bd2a0f981000a",
                    "bidAmount": 2800,
                    "plannedAnnualRate": 8,
                    "rOW_ID": 5,
                    "productCategory": "P001",
                    "leftTenderAmount": 0,
                    "bidCode": "BID201806200000467",
                    "id": "468",
                    "leastPeriodType": "MONTH",
                    "bidName": "消费贷",
                    "riskGrade": "A1",
                    "productType": "1001",
                    "status": {
                        "code": "REPAYING",
                        "message": "还款中"
                    }
                }, {
                    "leastPeriodValue": 3,
                    "productId": "2c9093f65bd29951015bd2a0f981000a",
                    "bidAmount": 4200,
                    "plannedAnnualRate": 8,
                    "rOW_ID": 6,
                    "productCategory": "P001",
                    "leftTenderAmount": 0,
                    "bidCode": "BID201806190000465",
                    "id": "466",
                    "leastPeriodType": "MONTH",
                    "bidName": "消费贷",
                    "riskGrade": "A1",
                    "productType": "1001",
                    "status": {
                        "code": "REPAY_OVER",
                        "message": "还款结束"
                    }
                }, {
                    "leastPeriodValue": 3,
                    "productId": "2c9093f65bd29951015bd2a0f981000a",
                    "bidAmount": 4200,
                    "plannedAnnualRate": 8,
                    "rOW_ID": 7,
                    "productCategory": "P001",
                    "leftTenderAmount": 0,
                    "bidCode": "BID201806160000463",
                    "id": "464",
                    "leastPeriodType": "MONTH",
                    "bidName": "消费贷",
                    "riskGrade": "A1",
                    "productType": "1001",
                    "status": {
                        "code": "REPAYING",
                        "message": "还款中"
                    }
                }, {
                    "leastPeriodValue": 3,
                    "productId": "2c9093f65bd29951015bd2a0f981000a",
                    "bidAmount": 4200,
                    "plannedAnnualRate": 8,
                    "rOW_ID": 8,
                    "productCategory": "P001",
                    "leftTenderAmount": 0,
                    "bidCode": "BID201806150000461",
                    "id": "462",
                    "leastPeriodType": "MONTH",
                    "bidName": "消费贷",
                    "riskGrade": "A1",
                    "productType": "1001",
                    "status": {
                        "code": "REPAYING",
                        "message": "还款中"
                    }
                }, {
                    "leastPeriodValue": 3,
                    "productId": "2c9093f65bd29951015bd2a0f981000a",
                    "bidAmount": 4200,
                    "plannedAnnualRate": 8,
                    "rOW_ID": 9,
                    "productCategory": "P001",
                    "leftTenderAmount": 0,
                    "bidCode": "BID201806130000459",
                    "id": "460",
                    "leastPeriodType": "MONTH",
                    "bidName": "消费贷",
                    "riskGrade": "A1",
                    "productType": "1001",
                    "status": {
                        "code": "REPAYING",
                        "message": "还款中"
                    }
                }, {
                    "leastPeriodValue": 3,
                    "productId": "2c9093f65bd29951015bd2a0f981000a",
                    "bidAmount": 1400,
                    "plannedAnnualRate": 8,
                    "rOW_ID": 10,
                    "productCategory": "P001",
                    "leftTenderAmount": 0,
                    "bidCode": "BID201806120000457",
                    "id": "458",
                    "leastPeriodType": "MONTH",
                    "bidName": "消费贷",
                    "riskGrade": "A1",
                    "productType": "1001",
                    "status": {
                        "code": "REPAYING",
                        "message": "还款中"
                    }
                }]
            }
        },
        "currentDate": 1542000611950,
        "token": "rZAUSEW7s3E7OTtQCsd_cYQxMV8EpGOJ5QRm2nUr0T3STzAxGsXIrVYP_K_IdJ1p7j83uhUCZXnlzgzWyzUdG5KLm95p9kd7WFChi2ZSSDU"
    }
}

export default { GetData }