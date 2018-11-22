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
        "currentDate": 1542003117172,
        "token": "rZAUSEW7s3E7OTtQCsd_cYQxMV8EpGOJ5QRm2nUr0T3STzAxGsXIrVYP_K_IdJ1p7j83uhUCZXnlzgzWyzUdG5KLm95p9kd7WFChi2ZSSDU"
    }
}

export default { GetData }