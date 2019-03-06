export default [
    {
        Name: "ApiService",
        ServiceName: "ApiService",
        ActionList: [
            get2("GetNow", "System/GetNow", "Now", "Now")
        ]
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
        Name: "BizService2",
        ServiceName: "BizApiService2",
        ActionList: [
            post("SubmitOpinion", "interaction/opinion", "Opinion", null, false, true)
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
            get("GetYYP", "YYP/brief", "YYP"),
            get("CheckAuthorizedQuota", null, "AuthorizedQuota", null, true),
            post("InvestOrder", "InvestOrder", "InvestOrder", null, true),
            get("GetInvestProduct", null, "InvestProduct", "data", false, true),
            get("GetInvestmentRecord", null, "InvestmentRecord", "data"),
            get("QueryFinanceBorrowList", null, "FinanceBorrowList", "data"),
            post("RedenvelopeRecord", "redenvelope/redenvelopeRecord", "RedenvelopeRecord", null, true),
            get("GetRecommend", null, "Recommend"),
            get("IsInvestBBGS", "investBiz/isInvestProduct?productCode=BBGS", "IsInvestBBGS", "data", true),
            get("IsInvestQTDS", "investBiz/isInvestProduct?productCode=QTDS", "IsInvestQTDS", "data", true),
            get("IsInvestRRY", "investBiz/isInvestProduct?productCode=RRY", "IsInvestRRY", "data", true),
            get("IsInvestXSB", "investBiz/isInvestProduct?productCode=XSB", "IsInvestXSB", "data", true),
        ]
    },
    {
        Name: "UserCenterService",
        ServiceName: "UserCenterApiService",
        ActionList: [
            get("GetUserInfo", "user/userInfoByToken", "UserInfo", "data", true),
            get("GetQuestionUser", "questionUser/getQuestionUserByToken", "QuestionUser", "data", true),
            post("ValidatePayPwdByTokenWithValidate", "user/validatePayPwdByTokenWithValidate", "PayPwdByTokenWithValidate", null, true)
        ]
    },
    {
        Name: "InvestmentService",
        ServiceName: "InvestmentApiService",
        ActionList: [
            post("InvestStatus", "home/investStatus", "InvestStatus", null, true),
            get("Overview", "asset/overview", "Overview", "data", true)
        ]
    },
    {
        Name: "XxdService",
        ServiceName: "XxdApiService",
        ActionList: [
            get("Logout", "user/logoutJson.html", "Logout"),
            post("HasComplete", "question/hasComplete.html", "HasComplete")
        ]
    },
    {
        Name: "IntegrationService",
        ServiceName: "IntegrationApiService",
        ActionList: [
            get("GetBidsDetail", null, "BidsDetail", "data"),
            get("GetBidsBorrower", null, "BidsBorrower", "data"),
            get("GetBidsInfoDisclosures", null, "BidsInfoDisclosures", "data"),
            get("GetBidsRepayments", null, "BidsRepayments", "data"),
            get("GetBidsInvestments", null, "BidsInvestments"),
            get("GetBidsList", null, "BidsList")
        ]
    }
];

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", IsProxy: true, StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, IsProxy: true, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

function get2(actionName, url, stateName, dataKey) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey }
}