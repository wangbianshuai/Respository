const { AssignProporties } = require("../../Common");
const ReadBaseInfo = require("../../views/Order/ReadBaseInfo");
const WhiteKnight = require("../../views/AntiFraud/WhiteKnight");
const PersonHuifa = require("../../views/AntiFraud/PersonHuifa");
const Bairong = require("../../views/AntiFraud/Bairong");
const Tongdun = require("../../views/AntiFraud/Tongdun");
const PersonPengyuan = require("../../views/AntiFraud/PersonPengyuan");
const Zhonghujin = require("../../views/AntiFraud/Zhonghujin");
const CompanyHuifa = require("../../views/AntiFraud/CompanyHuifa");
const CompanyPengyuan = require("../../views/AntiFraud/CompanyPengyuan");
const FraudVerify = require("../../views/AntiFraud/FraudVerify");

//审核管理/反欺诈审核 1200-1299
const DataActionTypes = {
    //获取订单基本信息实体数据
    GetOrderInfoEntityData: 1200,
    //1.	白骑士
    GetBaiqishi: 1201,
    //2.	汇法
    GetHuifa: 1202,
    //3.	百融申请
    GetBairongApply: 1203,
    //4.	百融特殊
    GetBairongSpecial: 1204,
    //5.	同盾
    GetTongdun: 1205,
    //6.	鹏元
    GetPengyuan: 1206,
    //7.	中互金协会
    GetZhonghujin: 1207,
    //8.	汇法
    GetCompanyHuifa: 1208,
    //9.	鹏元企业
    GetCompanyPengyuan: 1210,
    //设置反欺诈请求
    SetAntiFraudRequest: 1211,
    //交叉验证
    GetFraudVerify: 1212
}

module.exports = {
    Name: "AntiFraudAuditing",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "AntiFraudAuditing" }, [ReadBaseInfo(DataActionTypes), GetTabsView()])
}

function GetTabsView() {
    return {
        Name: "TabsView",
        Type: "Tabs",
        Style: { marginTop: 8 },
        TabBarStyle: { backgroundColor: "#ffffff", margin: 0, paddingLeft: 16 },
        Properties: AssignProporties({ Name: "AntiFraudAuditing" }, [GetPertsonTab(), GetCompanyTab(), GetBetweenTab()])
    }
}

function GetPertsonTab() {
    return {
        Name: "PertsonTab",
        Type: "View",
        TabLabel: "个人反欺诈",
        TabIcon: "audit",
        Properties: AssignProporties({ Name: "AntiFraudAuditing" }, [WhiteKnight(DataActionTypes), PersonHuifa(DataActionTypes),
        Bairong(DataActionTypes), Tongdun(DataActionTypes), PersonPengyuan(DataActionTypes), Zhonghujin(DataActionTypes)])
    }
}

function GetCompanyTab() {
    return {
        Name: "PertsonTab",
        Type: "View",
        TabLabel: "企业反欺诈",
        TabIcon: "audit",
        Properties: AssignProporties({ Name: "AntiFraudAuditing" }, [CompanyHuifa(DataActionTypes), CompanyPengyuan(DataActionTypes)])
    }
}


function GetBetweenTab() {
    return {
        Name: "BetweenTab",
        Type: "View",
        TabLabel: "交叉验证",
        TabIcon: "audit",
        Properties: AssignProporties({ Name: "AntiFraudAuditing" }, [FraudVerify(DataActionTypes)])
    }
}

function GetEventActions() {
    return [{
        Name: "GetOrderInfoEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "OrderInfo"
    },
    {
        Name: "ToOrderDetail",
        Type: "Page/OpenUrl",
        PageUrl: "/risk/CreditManage/OrderDetail?OrderCode=#{OrderCode}&LookCode=ee1645b3-f024-37c8-b08a-c734b4657aaa"
    },
    {
        Name: "SearchCustomer",
        Type: "Page/ToQueryCustomer"
    },
    {
        Name: "GetBaiqishi",
        Type: "EntityEdit/GetEntityData",
        EditView: "WhiteKnight2",
        IsAsync: true
    },
    {
        Name: "AllExpandCollapse",
        Type: "Page/SetPropertiesExpandCollapse",
        Properties: ["DishonestyRiskExpandCollapse", "MultiRiskExpandCollapse"]
    },
    {
        Name: "MultiRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["MultiRiskTable"]
    },
    {
        Name: "DishonestyRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["DishonestyRiskTable"]
    },
    //个人汇法
    {
        Name: "GetHuifa",
        Type: "EntityEdit/GetEntityData",
        EditView: "PersonHuifa2",
        IsAsync: true
    },
    {
        Name: "PersonHuifaAllExpandCollapse",
        Type: "Page/SetPropertiesExpandCollapse",
        Properties: ["PersonHuifaRiskExpandCollapse"]
    },
    {
        Name: "PersonHuifaRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["PersonHuifaRiskTable"]
    },
    //百融
    {
        Name: "GetBairongApply",
        Type: "EntityEdit/GetEntityData",
        EditView: "BairongApply",
        IsAsync: true
    },
    {
        Name: "GetBairongSpecial",
        Type: "EntityEdit/GetEntityData",
        EditView: "BairongSpecial",
        IsAsync: true
    },
    {
        Name: "BairongAllExpandCollapse",
        Type: "Page/SetPropertiesExpandCollapse",
        Properties: ["BairongApplyRiskExpandCollapse", "BairongSpecialRiskExpandCollapse"]
    },
    {
        Name: "BairongApplyRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["BairongApplyRiskTable"]
    },
    {
        Name: "BairongSpecialRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["BairongSpecialRiskTable"]
    },
    //同盾
    {
        Name: "GetTongdun",
        Type: "EntityEdit/GetEntityData",
        EditView: "Tongdun2",
        IsAsync: true
    },
    {
        Name: "TongdunAllExpandCollapse",
        Type: "Page/SetPropertiesExpandCollapse",
        Properties: ["TongdunRiskExpandCollapse"]
    },
    {
        Name: "TongdunRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["TongdunRiskTable"]
    },
    //6.	鹏元
    {
        Name: "GetPengyuan",
        Type: "EntityEdit/GetEntityData",
        EditView: "PersonPengyuan2",
        IsAsync: true
    },
    {
        Name: "PersonPengyuanAllExpandCollapse",
        Type: "Page/SetPropertiesExpandCollapse",
        Properties: ["PersonRiskExpandCollapse", "QueryCountRiskExpandCollapse"]
    },
    {
        Name: "PersonRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["PersonRiskTable"]
    },
    {
        Name: "QueryCountRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["QueryCountRiskTable"]
    },
    //中互金协会
    {
        Name: "GetZhonghujin",
        Type: "EntityEdit/GetEntityData",
        EditView: "Zhonghujin2",
        IsAsync: true
    },
    {
        Name: "ZhonghujinAllExpandCollapse",
        Type: "Page/SetPropertiesExpandCollapse",
        Properties: ["ZhonghujinRiskExpandCollapse"]
    },
    {
        Name: "ZhonghujinRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["ZhonghujinRiskTable"]
    },
    //企业汇法
    {
        Name: "GetCompanyHuifa",
        Type: "EntityEdit/GetEntityData",
        EditView: "CompanyHuifa2",
        IsAsync: true
    },
    {
        Name: "CompanyHuifaAllExpandCollapse",
        Type: "Page/SetPropertiesExpandCollapse",
        Properties: ["CompanyHuifaRiskExpandCollapse"]
    },
    {
        Name: "CompanyHuifaRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["CompanyHuifaRiskTable"]
    },
    //企业鹏元
    {
        Name: "GetCompanyPengyuan",
        Type: "EntityEdit/GetEntityData",
        EditView: "CompanyPengyuan2",
        IsAsync: true
    },
    {
        Name: "CompanyPengyuanAllExpandCollapse",
        Type: "Page/SetPropertiesExpandCollapse",
        Properties: ["CompanyRiskExpandCollapse", "CompanyQueryCountRiskExpandCollapse"]
    },
    {
        Name: "CompanyRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["CompanyRiskTable"]
    },
    {
        Name: "CompanyQueryCountRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["CompanyQueryCountRiskTable"]
    },
    //交叉验证
    {
        Name: "GetFraudVerify",
        Type: "EntityEdit/GetEntityData",
        EditView: "FraudVerify2"
    },
    {
        Name: "FraudVerifyAllExpandCollapse",
        Type: "Page/SetPropertiesExpandCollapse",
        Properties: ["UserDataRiskExpandCollapse", "SimilarRiskExpandCollapse", "OperateRiskExpandCollapse"]
    },
    {
        Name: "UserDataRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["userData"]
    },
    {
        Name: "SimilarRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["similar"]
    },
    {
        Name: "OperateRiskExpandCollapse",
        Type: "Page/SetPropertiesVisible",
        Properties: ["operate"]
    }]
}