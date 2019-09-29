const { AssignProporties } = require("../../Common");
const ReadBaseInfo = require("../../views/Order/ReadBaseInfo");
const CompanyContactCheck = require("../../views/Contact/CompanyContactCheck");
const KinsfolkContactCheck = require("../../views/Contact/KinsfolkContactCheck");
const WorkmateContactCheck = require("../../views/Contact/WorkmateContactCheck");
const OwnerContactCheck = require("../../views/Contact/OwnerContactCheck");
const PatchRecord = require("../../views/OrderPatch/PatchRecord");
const ReadRefundOrder = require("../../views/Order/ReadRefundOrder");
const FirstTrialPhoneApprovalOpinion = require("../../views/OrderApproval/FirstTrialPhoneApprovalOpinion");

//审核管理/初审电核 1600-1699
const DataActionTypes = {
    //获取实体数据
    GetOrderInfoEntityData: 1600,
    //获取公司联系人核实
    GetCompanyContactCheck: 1601,
    //保存公司联系人核实
    SaveCompanyContactCheck: 1602,
    //获取亲属联系人核实
    GetKinsfolkContactCheck: 1603,
    //保存亲属联系人核实
    SaveKinsfolkContactCheck: 1604,
    //获取本人核实
    GetOwnerContactCheck: 1605,
    //保存本人核实
    SaveOwnerContactCheck: 1606,
    //获取同事联系核实
    GetWorkmateContactCheck: 1607,
    //保存同事联系核实
    SaveWorkmateContactCheck: 1608,
    //获取审核意见
    GetApprovalOpinion: 1609,
    //保存审核意见
    SaveApprovalOpinion: 1610,
    //获取补件退单信息
    GetPatchExitOrderInfo: 1611,
    //获取工单状态
    GetOrderStatus: 1612
}

module.exports = {
    Name: "FirstTrialPhoneAuditing",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "FirstTrialPhoneAuditing" }, [ReadBaseInfo(DataActionTypes), GetTabsView()])
}

function GetTabsView() {
    return {
        Name: "TabsView",
        Type: "Tabs",
        Style: { marginTop: 8 },
        TabBarStyle: { backgroundColor: "#ffffff", margin: 0, paddingLeft: 16 },
        Properties: AssignProporties({ Name: "FirstTrialPhoneAuditing" }, [GetCompanyContactCheckTab(), GetKinsfolkContactCheckTab(), GetWorkmateContactCheckTab(), GetOwnerContactCheckTab(), GetAuditOpinionTab()])
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
        Properties: AssignProporties({ Name: "FirstTrialPhoneAuditing" }, [PatchRecord(DataActionTypes, false, true), ReadRefundOrder(DataActionTypes), FirstTrialPhoneApprovalOpinion(DataActionTypes)])
    }
}

function GetOwnerContactCheckTab() {
    return {
        Name: "OwnerContactCheckTab",
        Type: "View",
        TabLabel: "借款本人核实",
        TabIcon: "audit",
        Properties: AssignProporties({ Name: "FirstTrialPhoneAuditing" }, [OwnerContactCheck(DataActionTypes)])
    }
}

function GetWorkmateContactCheckTab() {
    return {
        Name: "WorkmateContactCheckTab",
        Type: "View",
        TabLabel: "同事联系人核实",
        TabIcon: "audit",
        Properties: AssignProporties({ Name: "FirstTrialPhoneAuditing" }, [WorkmateContactCheck(DataActionTypes)])
    }
}

function GetKinsfolkContactCheckTab() {
    return {
        Name: "KinsfolkContactCheckTab",
        Type: "View",
        TabLabel: "亲属联系人核实",
        TabIcon: "audit",
        Properties: AssignProporties({ Name: "FirstTrialPhoneAuditing" }, [KinsfolkContactCheck(DataActionTypes)])
    }
}

function GetCompanyContactCheckTab() {
    return {
        Name: "CompanyContactCheckTab",
        Type: "View",
        TabLabel: "单位相关信息核实",
        TabIcon: "home",
        Properties: AssignProporties({ Name: "FirstTrialPhoneAuditing" }, [CompanyContactCheck(DataActionTypes)])
    }
}

function GetEventActions() {
    return [
        //获取实体数据 GetOrderInfoEntityData: 1600,
        {
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
        //获取公司联系人核实 GetCompanyContactCheck: 1601,
        {
            Name: "GetCompanyContactCheck",
            Type: "EntityEdit/GetEntityData",
            EditView: "CompanyContactCheck2"
        },
        //保存公司联系人核实 SaveCompanyContactCheck: 1602,
        {
            Name: "SaveCompanyContactCheck",
            Type: "EntityEdit/SaveEntityData",
            EditView: "CompanyContactCheck2"
        },
        //获取亲属联系人核实 GetKinsfolkContactCheck: 1603,
        {
            Name: "GetKinsfolkContactCheck",
            Type: "EntityEdit/GetEntityData",
            EditView: "KinsfolkContactCheck2"
        },
        //保存亲属联系人核实 SaveKinsfolkContactCheck: 1604,
        {
            Name: "SaveKinsfolkContactCheck",
            Type: "EntityEdit/SaveEntityData",
            EditView: "KinsfolkContactCheck2"
        },
        //获取本人核实 GetOwnerContactCheck: 1605,
        {
            Name: "GetOwnerContactCheck",
            Type: "EntityEdit/GetEntityData",
            EditView: "OwnerContactCheck2"
        },
        //保存本人核实 SaveOwnerContactCheck: 1606,
        {
            Name: "SaveOwnerContactCheck",
            Type: "EntityEdit/SaveEntityData",
            EditView: "OwnerContactCheck2"
        },
        //获取同事联系核实 GetWorkmateContactCheck: 1607,
        {
            Name: "GetWorkmateContactCheck",
            Type: "EntityEdit/GetEntityData",
            EditView: "WorkmateContactCheck2"
        },
        //保存同事联系核实 SaveWorkmateContactCheck: 1608,
        {
            Name: "SaveWorkmateContactCheck",
            Type: "EntityEdit/SaveEntityData",
            EditView: "WorkmateContactCheck2"
        },
        //获取审核意见 GetApprovalOpinion: 1609,
        {
            Name: "GetApprovalOpinion",
            Type: "EntityEdit/GetEntityData",
            EditView: "FirstTrialPhoneApprovalOpinion",
            EditPropertiyViewList: ["FirstTrialPhoneApprovalOpinion2", "ApprovalLeftRightButtonView"]
        },
        //保存审核意见 SaveApprovalOpinion: 1610,
        {
            Name: "SaveApprovalOpinion",
            Type: "EntityEdit/SaveEntityDataViews",
            ToPageUrl: "/Orders/HandledOrderList",
            EditPropertiyViewList: ["FirstTrialPhoneApprovalOpinion2", "ApprovalLeftRightButtonView"],
            SetDisabledViewList: ["FirstTrialPhoneApprovalOpinion2", "ApprovalLeftRightButtonView",
                "CompanyContactCheck2", "KinsfolkContactCheck2", "OwnerContactCheck2", "WorkmateContactCheck2",
                "CompanyContactCheckButtonView", "KinsfolkContactCheckButtonView", "OwnerContactCheckButtonView", "WorkmateContactCheckButtonView"]
        },
        //获取补件退单信息 GetPatchExitOrderInfo: 1611,
        {
            Name: "GetPatchExitOrderInfo",
            Type: "EntityEdit/GetEntityData",
            EditView: "AuditOpinionTab",
            EditPropertiyViewList: ["PatchRecord", "ReadRefundOrder"],
            SetGetEntityDataLoad: "SetGetPatchExitOrderInfoLoad"
        },
        {
            Name: "CompanyContactCheckClearEdit",
            Type: "EntityEdit/ClearPropertyValue",
            EditView: "CompanyContactCheck2"
        },
        {
            Name: "KinsfolkContactCheckClearEdit",
            Type: "EntityEdit/ClearPropertyValue",
            EditView: "KinsfolkContactCheck2"
        },
        {
            Name: "OwnerContactCheckClearEdit",
            Type: "EntityEdit/ClearPropertyValue",
            EditView: "OwnerContactCheck2"
        },
        {
            Name: "WorkmateContactCheckClearEdit",
            Type: "EntityEdit/ClearPropertyValue",
            EditView: "WorkmateContactCheck2"
        },
        {
            Name: "ToAttachPage1",
            Type: "Page/ToAttachPage",
            DirType: 1 // 1：初审补单
        },
        {
            Name: "ToAttachPage5",
            Type: "Page/ToAttachPage"
        }
    ]
}