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
        "userDetailInfo": {
            "code": 200000,
            "data": {
                "baseInfo": {
                    "income": "",
                    "note": "",
                    "occupation": "",
                    "gender": "1",
                    "city": "310115",
                    "companytel": "",
                    "createdate": 1511770278000,
                    "userid": 2298213,
                    "idcardtype": "1",
                    "modifydate": 1528440780000,
                    "province": "310000",
                    "interest": "",
                    "companyaddr": "",
                    "ability": "",
                    "homeaddr": "北中路278",
                    "nativeplace": "福建省",
                    "birthdayStr": "1989-10-04",
                    "createip": "10.96.1.131",
                    "degree": "15",
                    "socialinsurcode": "",
                    "usertype": "1",
                    "idcardno": "350426************5",
                    "realname": "黄明聪",
                    "companyindustry": "11",
                    "maritalstatus": "",
                    "hometel": ""
                },
                "userDetailInfo": {
                    "referer": "",
                    "headimg": "http://www.xinxindai.com:80/userCenter/static/images/user/personal_r2_c2.png",
                    "latestLoginTime": 1542157310000,
                    "expiredate": 1511752683000,
                    "addip": "10.96.1.131",
                    "userid": 2298213,
                    "creditLevel": "HR",
                    "isopenaccount": "1",
                    "nickname": "18***41",
                    "isVipAppro": "1",
                    "email": "215178231@qq.com",
                    "isRealnameAppro": "1",
                    "coupon": 1,
                    "coins": 273,
                    "mobile": "186******41",
                    "hasinitremind": 0,
                    "signed": "1",
                    "usertype": "1",
                    "regsource": "XXD_ANDROID_INVESTMENT",
                    "isMobileAppro": "1",
                    "isEmailAppro": "1",
                    "lastLoginTime": "2018年11月13日 17:15:55",
                    "infoPercent": 70,
                    "addtime": 1511752683000,
                    "vipCode": "FD551",
                    "payPassword": "1",
                    "status": "1",
                    "username": "18613233341"
                }
            }
        },
        "assetStatistics": {
            "code": 200000,
            "data": {
                "sanbiaoMap": {
                    "COLLECTINTEREST": 0.0,
                    "EFFECTIVEMONEY": 0.0,
                    "COLLECTEDINTEREST": 0.0
                },
                "other": {
                    "COLLECTINTEREST": 0.0,
                    "EFFECTIVEMONEY": 0.0,
                    "COLLECTEDINTEREST": 0.0
                },
                "rryMap": {
                    "COLLECTINTEREST": 0.0,
                    "EFFECTIVEMONEY": 0.0,
                    "COLLECTEDINTEREST": 0.0
                },
                "xinshoubiaoMap": {
                    "COLLECTINTEREST": 0.0,
                    "EFFECTIVEMONEY": 0.0,
                    "COLLECTEDINTEREST": 0.0
                },
                "percents": [{
                    "name": "frozen",
                    "sum": 0.0
                }, {
                    "name": "usable",
                    "sum": 0.0
                }, {
                    "name": "xszx",
                    "sum": 0.0
                }, {
                    "name": "yjdj",
                    "sum": 0.0
                }, {
                    "name": "xyb",
                    "sum": 110.5
                }, {
                    "name": "yyp",
                    "sum": 0.0
                }, {
                    "name": "xsb",
                    "sum": 0.0
                }, {
                    "name": "sb",
                    "sum": 0.0
                }, {
                    "name": "other",
                    "sum": 0.0
                }],
                "yuejindoujinMap": {
                    "COLLECTINTEREST": 0.0,
                    "EFFECTIVEMONEY": 0.0,
                    "COLLECTEDINTEREST": 0.0
                },
                "qitiandashengMap": {
                    "COLLECTINTEREST": 0.0,
                    "EFFECTIVEMONEY": 100.0,
                    "COLLECTEDINTEREST": 0.29
                },
                "stepMap": {
                    "COLLECTINTEREST": 0.0,
                    "EFFECTIVEMONEY": 0.0,
                    "COLLECTEDINTEREST": 0.0
                },
                "mapAccount": {
                    "dueInInterestSumTotal": 10.5,
                    "repaymentSum": 0.0,
                    "sumEarnedThisYear": 388.14,
                    "drawTotal": 12222.1,
                    "sumXSCP30T": 0.0,
                    "sumYyp": 0.0,
                    "cashRecharge": 11805.0,
                    "frozen": 0.0,
                    "cashingRecharge": 2.02,
                    "sumXFD": 0.0,
                    "sumStep": 0.0,
                    "sumXinYuanBao": 110.5,
                    "sumTotal": 110.5,
                    "sumXinShouBiao": 0.0,
                    "activityRecharge": 0.0,
                    "loanSum": 0.0,
                    "sumRry": 0.0,
                    "sumYueJinDouJin": 0.0,
                    "usable": 0.0,
                    "sumEarnedThisMonth": 0.0,
                    "sumSanBiao": 0.0,
                    "awardRecharge": 0.0,
                    "sumCollectionThisMonth": 0.0,
                    "sumQiTianDaSheng": 0.0
                },
                "xfdMap": {
                    "COLLECTINTEREST": 0.0,
                    "EFFECTIVEMONEY": 0.0,
                    "COLLECTEDINTEREST": 0.0
                },
                "xscp30tMap": {
                    "COLLECTINTEREST": 0.0,
                    "EFFECTIVEMONEY": 0.0,
                    "COLLECTEDINTEREST": 0.0
                },
                "yypMap": {
                    "COLLECTINTEREST": 0.0,
                    "EFFECTIVEMONEY": 0.0,
                    "COLLECTEDINTEREST": 0.0
                },
                "xinyuanbaoMap": {
                    "COLLECTINTEREST": 10.5,
                    "EFFECTIVEMONEY": 10700.0,
                    "COLLECTEDINTEREST": 374.77
                }
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