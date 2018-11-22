export default [
    {
        Name: "PageView",
        ServiceName: "ApiService",
        ActionList: [
            post("GetConsumptionDetail", "PageView/GetConsumptionDetail", "ConsumptionDetail")
        ].concat(GetPageViewActionList().map(m => get(`Get${m}`, `PageView/Get${m}`, m)))
    },
    {
        Name: "BizService",
        ServiceName: "BizApiService",
        ActionList: [
            get("GetLink", "bulletin/link?pageSize=50&currentPage=1", "Link", "items"),
            get("GetAd", "bulletin/ad?currentPage=1&pageSize=10", "Ad", "items"),
            get("GetAchievement", "bulletin/operationData", "Achievement"),
            get("GetAnnouncement", "bulletin/announcement?pageSize=5&currentPage=1", "Announcement", "items"),
            get("GetNews", "bulletin/news?currentPage=1&pageSize=8", "News", "items"),
            get("GetMedia", "bulletin/media?currentPage=1&pageSize=8", "Media", "items"),
            get("GetInvestmentRank", "bulletin/investmentRank?currentPage=1&pageSize=5", "InvestmentRank"),
            get("GetPartner", "bulletin/partner?currentPage=1&pageSize=10", "Partner", "items"),
            get("GetMore", "bulletin/more", "More", "items")
        ]
    },
    {
        Name: "TradeCenterService",
        ServiceName: "TradeCenterApiService",
        ActionList: [
            get("GetZQZR", "ZQZR/brief?pageSize=5&currentPage=1", "ZQZR", "items"),
            get("GetSBZT", "SBZT/brief?pageSize=5&currentPage=1", "SBZT", "items"),
            get("GetThirtyTender", "XSCP30T/brief", "ThirtyTender"),
            get("GetYJDJ", "YJDJ/brief", "YJDJ"),
            get("GetXYB", "XYB/brief", "XYB"),
            get("GetYYP", "YYP/brief", "YYP")
        ]
    },
    {
        Name: "UserCenterService",
        ServiceName: "UserCenterApiService",
        ActionList: [
            get("GetUserInfo", "user/userInfoByToken", "UserInfo", "data", true)
        ]
    },
    {
        Name: "InvestmentService",
        ServiceName: "InvestmentApiService",
        ActionList: [
            post("InvestStatus", "home/investStatus", "InvestStatus", null, true)
        ]
    }
];

function GetPageViewActionList() {
    return [
        "Home",
        "ConsumptionList",
        "AuthorizStatus",
        "InvestFail",
        "Monthgold",
        "NewTender",
        "PurchaseSuccess",
        "ThirtyTender",
        "Coupon",
        "InviteFriendsDetail",
        "BondsGoldIngot",
        "BondsMonthGold",
        "BondsSonthSend",
        "BondsNewTender",
        "BondsSevenGold",
        "BondsStepDetail",
        "BondsThirtyTender",
        "UserCenterError",
        "OpenaccountError",
        "OpenaccountSuccess",
        "UserCenterSuccess",
        "CompanyAccountInfo",
        "CompanyAccount",
        "CompanyAuthentication",
        "CompanyBundled",
        "CompanyDealDetail",
        "CompanyLogin",
        "CompanyRecharge",
        "CompanyRegister",
        "CompanySecuritySettings",
        "CompanyUserLicense",
        "UserlicenseAgree",
        "CompanyWithdraw",
        "FundRecordCoinLog",
        "FundRecordDealDetail",
        "FundRecordOpenAccount",
        "FundRecordRecharge",
        "FundRecordWithdraw",
        "UserCenterBorrow",
        "UserCenterIdentity",
        "UserCenterMessage",
        "UserCenterAccount"
    ]
}

function get(actionName, url, stateName, dataKey, isToken) {
    return { ActionName: actionName, Url: url, Method: "GET", IsProxy: true, StateName: stateName, DataKey: dataKey, IsToken: isToken }
}

function post(actionName, url, stateName, dataKey, isToken) {
    return { ActionName: actionName, Url: url, IsProxy: true, StateName: stateName, DataKey: dataKey, IsToken: isToken }
}