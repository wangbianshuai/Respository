const { AssignProporties } = require("../../Common");
const ReadBaseInfo = require("../../views/Order/ReadBaseInfo");
const CompanyCredit = require("../../views/Credit/CompanyCredit");
const PersonCredit = require("../../views/Credit/PersonCredit");
const OtherCredit = require("../../views/Credit/OtherCredit");
const PatchRecord = require("../../views/OrderPatch/PatchRecord");
const ReadRefundOrder = require("../../views/Order/ReadRefundOrder");
const FinalApprovalOpinion = require("../../views/OrderApproval/FinalApprovalOpinion");
const InvoiceInfo = require("../../views/Finance/InvoiceInfo");
const DebtInfo = require("../../views/Finance/DebtInfo");
const DealInfo = require("../../views/Finance/DealInfo");
const PropertyInfo = require("../../views/Finance/PropertyInfo");
const CautionerInfo = require("../../views/Order/CautionerInfo");
const CoBorrowerInfo = require("../../views/Order/CoBorrowerInfo");
const FinalCreditCalculate = require("../../views/Credit/FinalCreditCalculate");
const FinalCreditApprovalResult = require("../../views/OrderApproval/FinalCreditApprovalResult");

//审核管理/终审审核 1300-1399
const DataActionTypes = {
    //获取订单基本信息实体数据
    GetOrderInfoEntityData: 1300,
    //获取终审基本信息
    GetFinalBaseInfo: 1301,
    //保存终审基本信息
    SaveFinalBaseInfo: 1302,
    //获取终审征信信息
    GetCreditInfo: 1303,
    //保存终审征信信息
    SaveCreditInfo: 1304,
    //获取担保人信息
    GetCautionerInfo: 1305,
    //保存担保人信息
    SaveCautionerInfo: 1306,
    //获取共借人信息
    GetCoBorrowerInfo: 1307,
    //保存共借人信息
    SaveCoBorrowerInfo: 1308,
    //获取授信测算信息
    GetFinalCreditCalculate: 1309,
    //保存授信测算信息
    SaveFinalCreditCalculate: 1310,
    //获取终审授信结论信息
    GetFinalCreditApprovalResult: 1311,
    //保存终审授信结论信息
    SaveFinalCreditApprovalResult: 1312,
    //获取补件退单信息
    GetPatchExitOrderInfo: 1313,
    //获取审核意见
    GetApprovalOpinion: 1314,
    //保存审核意见
    SaveApprovalOpinion: 1315,
    //获取工单状态
    GetOrderStatus: 1316
}

module.exports = {
    Name: "FinalAuditing",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "FinalAuditing" }, [ReadBaseInfo(DataActionTypes), GetTabsView()])
}

function GetTabsView() {
    return {
        Name: "TabsView",
        Type: "Tabs",
        Style: { marginTop: 8 },
        TabBarStyle: { backgroundColor: "#ffffff", margin: 0, paddingLeft: 16 },
        Properties: AssignProporties({ Name: "FinalAuditing" }, [GetBaseInfoTab(), GetCreditTab(), GetCautionerInfoTab(), GetCoBorrowerInfoTab(), GetCreditInfoTab(), GetAuditOpinionTab()])
    }
}

function GetCreditInfoTab() {
    return {
        Name: "CreditInfoTab",
        Type: "View",
        TabLabel: "授信信息",
        TabIcon: "audit",
        Properties: AssignProporties({ Name: "FinalAuditing" }, [FinalCreditCalculate(DataActionTypes), FinalCreditApprovalResult(DataActionTypes)])
    }
}

function GetCoBorrowerInfoTab() {
    return {
        Name: "CoBorrowerInfoTab",
        Type: "View",
        TabLabel: "共借人信息",
        TabIcon: "audit",
        Properties: AssignProporties({ Name: "FinalAuditing" }, [CoBorrowerInfo(DataActionTypes)])
    }
}

function GetAuditOpinionTab() {
    return {
        Name: "AuditOpinionTab",
        Type: "View",
        TabLabel: "审核意见",
        TabIcon: "audit",
        Entity: { PrimaryKey: "OrderCode", PropertyPrimaryKey: "loanApplyId" },
        EventActionName: "GetPatchExitOrderInfo",
        GetEntityDataActionType: DataActionTypes.GetPatchExitOrderInfo,//获取补件退单信息
        Properties: AssignProporties({ Name: "FinalAuditing" }, [PatchRecord(DataActionTypes, false, true), ReadRefundOrder(DataActionTypes, false, true), FinalApprovalOpinion(DataActionTypes)])
    }
}

function GetCautionerInfoTab() {
    return {
        Name: "CautionerInfo",
        Type: "View",
        TabLabel: "担保人信息",
        TabIcon: "audit",
        Properties: AssignProporties({ Name: "FinalAuditing" }, [CautionerInfo(DataActionTypes)])
    }
}

function GetCreditTab() {
    return {
        Name: "CreditTab",
        Type: "View",
        TabLabel: "征信信息",
        TabIcon: "audit",
        Entity: { PrimaryKey: "OrderCode", PropertyPrimaryKey: "loanApplyId" },
        EventActionName: "GetCreditInfo",
        GetEntityDataActionType: DataActionTypes.GetCreditInfo,//获取终审征信信息
        Properties: AssignProporties({ Name: "FinalAuditing" }, [CompanyCredit(DataActionTypes), PersonCredit(DataActionTypes), OtherCredit(DataActionTypes)])
    }
}

function GetBaseInfoTab() {
    return {
        Name: "BaseInfoTab",
        Type: "View",
        TabLabel: "基本信息",
        TabIcon: "home",
        Entity: { PrimaryKey: "OrderCode", PropertyPrimaryKey: "loanApplyId" },
        EventActionName: "GetFinalBaseInfo",
        GetEntityDataActionType: DataActionTypes.GetFinalBaseInfo,//获取终审征信信息
        Properties: AssignProporties({ Name: "FinalAuditing" }, [InvoiceInfo(DataActionTypes), DebtInfo(DataActionTypes), DealInfo(DataActionTypes), PropertyInfo(DataActionTypes)])
    }
}

function GetEventActions() {
    return [{
        Name: "AddCautioner",
        Type: "DataListView/Add",
        DataListView: "CautionerList"
    },
    {
        Name: "DeleteCautioner",
        Type: "DataListView/Remove",
        DataListView: "CautionerList"
    },
    {
        Name: "AddCoBorrower",
        Type: "DataListView/Add",
        DataListView: "CoBorrowerList"
    },
    {
        Name: "DeleteCoBorrower",
        Type: "DataListView/Remove",
        DataListView: "CoBorrowerList"
    },
    //获取订单基本信息实体数据 GetOrderInfoEntityData: 1300,
    {
        Name: "GetOrderInfoEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "OrderInfo",
        SetGetEntityDataLoad: "GetOrderInfoDataLoad"
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
    //获取终审基本信息 GetFinalBaseInfo: 1301,
    {
        Name: "GetFinalBaseInfo",
        Type: "EntityEdit/GetEntityData",
        EditView: "BaseInfoTab",
        EditPropertiyViewList: ["InvoiceInfo2", "DebtInfo2", "DealInfo2", "PropertyInfo2"],
        SetGetEntityDataLoad: "GetFinalBaseInfoDataLoad"
    },
    //保存终审基本信息 SaveFinalBaseInfo: 1302,
    {
        Name: "SaveInvoiceInfo",
        Type: "EntityEdit/SaveEntityData",
        EditView: "InvoiceInfo2"
    },
    {
        Name: "SaveDebtInfo",
        Type: "EntityEdit/SaveEntityData",
        EditView: "DebtInfo2"
    },
    {
        Name: "SaveDealInfo",
        Type: "EntityEdit/SaveEntityData",
        EditView: "DealInfo2"
    },
    {
        Name: "SavePropertyInfo",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PropertyInfo2"
    },
    //获取终审征信信息 GetCreditInfo: 1303,
    {
        Name: "GetCreditInfo",
        Type: "EntityEdit/GetEntityData",
        EditView: "CreditTab",
        EditPropertiyViewList: ["CompanyCredit2", "PersonCredit2", "OtherCredit2"]
    },
    //保存终审基本信息 SaveCreditInfo: 1304,
    {
        Name: "SaveCompanyCredit",
        Type: "EntityEdit/SaveEntityData",
        EditView: "CompanyCredit2"
    },
    {
        Name: "SavePersonCredit",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PersonCredit2"
    },
    {
        Name: "SaveOtherCredit",
        Type: "EntityEdit/SaveEntityData",
        EditView: "OtherCredit2"
    },
    //获取担保人信息 GetCautionerInfo: 1305,
    {
        Name: "GetCautionerInfo",
        Type: "EntityEdit/GetEntityData",
        EditView: "CautionerInfo2"
    },
    //保存担保人信息 SaveCautionerInfo: 1306,
    {
        Name: "SaveCautionerInfo",
        Type: "EntityEdit/SaveEntityData",
        EditView: "CautionerInfo2"
    },
    //获取共借人信息 GetCoBorrowerInfo: 1306,
    {
        Name: "GetCoBorrowerInfo",
        Type: "EntityEdit/GetEntityData",
        EditView: "CoBorrowerInfo2"
    },
    //保存共借人信息 SaveCoBorrowerInfo: 1307,
    {
        Name: "SaveCoBorrowerInfo",
        Type: "EntityEdit/SaveEntityData",
        EditView: "CoBorrowerInfo2"
    },
    //获取授信测算信息  GetFinalCreditCalculate: 1308,
    {
        Name: "GetFinalCreditCalculate",
        Type: "EntityEdit/GetEntityData",
        EditView: "FinalCreditCalculate2",
        SetGetEntityDataLoad: "GetFinalCreditCalculateDataLoad"
    },
    //保存授信测算信息 SaveFinalCreditCalculate: 1309,
    {
        Name: "SaveFinalCreditCalculate",
        Type: "EntityEdit/SaveEntityData",
        EditView: "FinalCreditCalculate2",
        SuccessCallback: "SaveFinalCreditCalculateCallback"
    },
    //获取终审授信结论信息  GetFinalCreditApprovalResult: 1310,
    {
        Name: "GetFinalCreditApprovalResult",
        Type: "EntityEdit/GetEntityData",
        EditView: "FinalCreditApprovalResult2",
        SetGetEntityDataLoad: "GetFinalCreditApprovalResultDataLoad"
    },
    //保存终审授信结论信息  SaveFinalCreditApprovalResult: 1311,
    {
        Name: "SaveFinalCreditApprovalResult",
        Type: "EntityEdit/SaveEntityData",
        EditView: "FinalCreditApprovalResult2"
    },
    //获取补件退单信息  GetPatchExitOrderInfo: 1312,
    {
        Name: "GetPatchExitOrderInfo",
        Type: "EntityEdit/GetEntityData",
        EditView: "AuditOpinionTab",
        EditPropertiyViewList: ["PatchRecord", "ReadRefundOrder"],
        SetGetEntityDataLoad: "SetGetPatchExitOrderInfoLoad"
    },
    //获取审核意见 GetApprovalOpinion: 1313,
    {
        Name: "GetApprovalOpinion",
        Type: "EntityEdit/GetEntityData",
        EditView: "FinalApprovalOpinion",
        EditPropertiyViewList: ["FinalApprovalOpinion2", "ApprovalOpinionRightButtonView"]
    },
    //保存审核意见 SaveApprovalOpinion: 1314
    {
        Name: "SaveApprovalOpinion",
        Type: "EntityEdit/SaveEntityDataViews",
        ToPageUrl: "/Orders/HandledOrderList",
        EditPropertiyViewList: ["FinalApprovalOpinion2", "ApprovalOpinionRightButtonView"],
        SetDisabledViewList: ["FinalApprovalOpinion2", "ApprovalOpinionRightButtonView",
            "InvoiceInfo2", "DebtInfo2", "DealInfo2", "PropertyInfo2",
            "InvoiceInfoButtonView", "DebtInfoButtonView", "DealInfoButtonView", "PropertyInfoButtonView",
            "CompanyCredit2", "PersonCredit2", "OtherCredit2",
            "CompanyCreditButtonView", "PersonCreditButtonView", "OtherCreditButtonView",
            "CautionerInfo2", "CautionerInfoButtonView", "CoBorrowerInfo2", "CoBorrowerInfoButtonView",
            "FinalCreditCalculate2", "FinalCreditCalculateButtonView", "FinalCreditApprovalResult2", "FinalCreditApprovalResultButtonView"]
    },
    {
        Name: "ToAttachPage5",
        Type: "Page/ToAttachPage"
    },
    {
        Name: "ToAttachPage6",
        Type: "Page/ToAttachPage",
        DirType: 3 // 3：重审补单
    },
    {
        Name: "ToAttachPage2",
        Type: "Page/ToAttachPage",
        DirType: 5 //5：终审审核附件
    }]
}