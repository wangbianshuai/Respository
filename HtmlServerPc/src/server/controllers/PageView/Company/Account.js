async function GetData(ctx) {
    ctx.IsLog = false;
    ctx.body = {
        globalData: GetGlobalData(),
        global: GetGlobal(),
        companyDetailInfo: GetCompanyDetailInfo(),
        companyLoanInfoList:GetCompanyLoanInfoList()
    }
}

function GetCompanyDetailInfo() {
    return {
        // 账户余额
        accountBalance: 0,
        // 待还总额
        returnedAmount: 0,
        // 累计借款
        accumulatedLoan: 0
    }
}

//  // 年利率
//  private String annualRate;
//  // 借款金额
//  private double loanAmount;
//  // 借款标题
//  private String loanTitle;
//  // 借款类型
//  private String loanType;
//  // 下一还款日期
//  private Timestamp repaymentTime;
//  // 期限
//  private String term;

function GetCompanyLoanInfoList(){
    return []
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
                    "city": "",
                    "companytel": "",
                    "createdate": 1542073124000,
                    "userid": 2398268,
                    "idcardtype": "1",
                    "modifydate": 1542074627000,
                    "province": "",
                    "interest": "",
                    "companyaddr": "",
                    "ability": "",
                    "homeaddr": "",
                    "nativeplace": "陕西省",
                    "birthdayStr": "1982-01-01",
                    "createip": "172.16.14.72",
                    "degree": "15",
                    "socialinsurcode": "",
                    "usertype": "3",
                    "idcardno": "610101************0",
                    "realname": "测试企业1号",
                    "companyindustry": "电力、热力、燃气及水生产和供应业",
                    "maritalstatus": "",
                    "hometel": ""
                },
                "userDetailInfo": {
                    "referer": "",
                    "headimg": "http://test.xxd.com:80/userCenter/static/images/user/personal_r2_c2.png",
                    "latestLoginTime": 1542093733000,
                    "expiredate": 1542073124000,
                    "addip": "172.16.14.72",
                    "userid": 2398268,
                    "creditLevel": "HR",
                    "isopenaccount": "1",
                    "nickname": "14***01",
                    "isVipAppro": "1",
                    "email": "",
                    "isRealnameAppro": "1",
                    "coupon": 4,
                    "coins": 0,
                    "mobile": "145******01",
                    "hasinitremind": 0,
                    "signed": "0",
                    "usertype": "3",
                    "regsource": "XXD_FRONT_END",
                    "isMobileAppro": "1",
                    "isEmailAppro": "0",
                    "lastLoginTime": "2018年11月13日 15:10:00",
                    "infoPercent": 55,
                    "addtime": 1542073124000,
                    "vipCode": "CS017",
                    "payPassword": "1",
                    "status": "1",
                    "username": "14501850001"
                }
            }
        },
        "nickName": "测试企业1号",
        "link": {
            "code": 200000,
            "data": {
                "items": [{
                    "textHref": "//www.sfia.org.cn/",
                    "text": "上海金融信息行业协会"
                }, {
                    "textHref": "//www.wdzj.com/",
                    "text": "网贷之家"
                }, {
                    "textHref": "//www.nifa.org.cn/nifa/index.html",
                    "text": "中国互联网金融协会"
                }, {
                    "textHref": "//www.xinxindai.com",
                    "text": "网贷平台"
                }, {
                    "textHref": "//www.wjchina.org/",
                    "text": "网金中国"
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
        "token": "rZAUSEW7s3E7OTtQCsd_cdeVw89e79ydUFvw1VDqmUxky8HRFEJtcdXc2w4dBxXt2CDr6v0bvn_QCb7-nn68yEvwqD3oel4Qni8mdtgygjA"
    }
}

export default { GetData }