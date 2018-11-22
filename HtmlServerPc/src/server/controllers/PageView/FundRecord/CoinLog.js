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
        "overview": {
            "code": 200000,
            "data": {
                "accumulatedRechargeAmount": 11805.0,
                "totalAssets": 110.5,
                "investmentAmount": 100.0,
                "accumulatedIncome": 388.43,
                "accumulatedWithdrawAmount": 12222.1,
                "dueInIncome": 10.5,
                "availableBalance": 0.0,
                "frozenAmount": 0.0
            }
        },
        "coins": {
            "code": 200000,
            "data": {
                "amount": 5.46,
                "num": 273,
                "ratio": 50
            }
        },
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
        "token": "aI8ociuVILu_aUIDoPdPQWL42QebTzvwbsvNKSFpRLuKT9ZTVmebuLELrVB7wxswhQ-3yFcnw6rFP_FZTrdC_iBfS2MFG-4imWJoHNr067o"
    }
}

export default { GetData }