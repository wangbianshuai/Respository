import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import ReadPersonCardInfo from "../../views/Order/ReadPersonCardInfo";
import ReadPersonBaseInfo from "../../views/Order/ReadPersonBaseInfo";
import ReadCompanyBaseInfo from "../../views/Order/ReadCompanyBaseInfo";
import ReadPersonPropertyInfo from "../../views/Order/ReadPersonPropertyInfo";
import ReadContactInfo from "../../views/Order/ReadContactInfo";
import CompanyBankInfo from "../../views/Finance/CompanyBankInfo";
import PersonBankInfo from "../../views/Finance/PersonBankInfo";
import CollectBankInfo from "../../views/Finance/CollectBankInfo";
import CompanyCredit from "../../views/Credit/CompanyCredit";
import PersonCredit from "../../views/Credit/PersonCredit";
import OtherCredit from "../../views/Credit/OtherCredit";
// import CreditCalculate from "../../views/Credit/CreditCalculate";
import PatchRecord from "../../views/OrderPatch/PatchRecord";
import ReadRefundOrder from "../../views/Order/ReadRefundOrder";
import FirstTrialApprovalOpinion from "../../views/OrderApproval/FirstTrialApprovalOpinion";
import DataActions from "Actions";

//审核管理/初审审核 1500-1599
const DataActionTypes = DataActions.GetActionTypes("Auditing_FirstTrialAuditing");

export default {
    Name: "FirstTrialAuditing",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo(DataActionTypes), GetTabsView()])
}

function GetTabsView() {
    return {
        Name: "TabsView",
        Type: "Tabs",
        Style: { marginTop: 8 },
        TabBarStyle: { backgroundColor: "#ffffff", margin: 0, paddingLeft: 16 },
        Properties: AssignProporties({}, [GetBaseInfoTab(), GetCompanyAmountInfoTab(), GetCreditTab(), GetAuditOpinionTab()])
    }
}

function GetAuditOpinionTab() {
    return {
        Name: "AuditOpinionTab",
        Type: "View",
        TabLabel: "审核意见",
        TabIcon: "audit",
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetPatchExitOrderInfo",
        GetEntityDataActionType: DataActionTypes.GetPatchExitOrderInfo,//获取补件退单信息
        Properties: AssignProporties({}, [PatchRecord(DataActionTypes), ReadRefundOrder(DataActionTypes), FirstTrialApprovalOpinion(DataActionTypes)])
    }
}

// function GetCreditCalculateTab() {
//     return {
//         Name: "CreditCalculateTab",
//         Type: "View",
//         TabLabel: "授信测算",
//         TabIcon: "audit",
//         Properties: AssignProporties({}, [CreditCalculate(DataActionTypes)])
//     }
// }

function GetCreditTab() {
    return {
        Name: "CreditTab",
        Type: "View",
        TabLabel: "征信信息",
        TabIcon: "audit",
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetCreditInfo",
        GetEntityDataActionType: DataActionTypes.GetCreditInfo,
        Properties: AssignProporties({}, [CompanyCredit(DataActionTypes), PersonCredit(DataActionTypes), OtherCredit(DataActionTypes)])
    }
}

function GetCompanyAmountInfoTab() {
    return {
        Name: "CompanyAmountInfoTab",
        Type: "View",
        TabLabel: "企业财务信息",
        TabIcon: "audit",
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetCompanyFinanceInfo",
        GetEntityDataActionType: DataActionTypes.GetCompanyFinanceInfo,
        Properties: AssignProporties({}, [CompanyBankInfo(DataActionTypes), PersonBankInfo(DataActionTypes), CollectBankInfo(DataActionTypes)])
    }
}

function GetBaseInfoTab() {
    return {
        Name: "BaseInfoTab",
        Type: "View",
        TabLabel: "基本信息",
        TabIcon: "home",
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetOrderDetailEntityData",
        GetEntityDataActionType: DataActionTypes.GetOrderDetailEntityData,
        Properties: AssignProporties({}, [ReadPersonCardInfo(DataActionTypes), ReadPersonBaseInfo(DataActionTypes), ReadCompanyBaseInfo(DataActionTypes), ReadPersonPropertyInfo(DataActionTypes), ReadContactInfo(DataActionTypes)])
    }
}

function GetEventActions() {
    return [{
        Name: "AddCompanyBank",
        Type: "DataListView/Add",
        DataListView: "CompanyBankList"
    },
    {
        Name: "DeleteCompanyBank",
        Type: "DataListView/Remove",
        DataListView: "CompanyBankList"
    },
    {
        Name: "AddPersonBank",
        Type: "DataListView/Add",
        DataListView: "PersonBankList"
    },
    {
        Name: "DeletePersonBank",
        Type: "DataListView/Remove",
        DataListView: "PersonBankList"
    },
    //获取实体数据 GetOrderInfoEntityData: 1500,
    {
        Name: "GetOrderInfoEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "OrderInfo"
    },
    {
        Name: "ToOrderDetail",
        Type: "Page/ToPage",
        PageUrl: "/CreditManage/OrderDetail?OrderCode=#{OrderCode}"
    },
    //获取订单详情实体数据 GetOrderDetailEntityData: 1501,
    {
        Name: "GetOrderDetailEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "BaseInfoTab",
        EditPropertiyViewList: ["PersonCardInfo2", "PersonBaseInfo2", "CompanyBaseInfo2", "PersonPropertyInfo2", "ContactInfo2"]
    },
    //保存审批订单详情 SaveApprovalOrderDetail: 1504,
    {
        Name: "SavePersonCardInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PersonCardInfo2"
    },
    {
        Name: "SavePersonBaseInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PersonBaseInfo2"
    },
    {
        Name: "SaveCompanyBaseInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "CompanyBaseInfo2"
    },
    {
        Name: "SavePersonPropertyInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PersonPropertyInfo2"
    },
    {
        Name: "SaveContactInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "ContactInfo2"
    },
    //获取公司财务信息 GetCompanyFinanceInfo: 1505,
    {
        Name: "GetCompanyFinanceInfo",
        Type: "EntityEdit/GetEntityData",
        EditView: "CompanyAmountInfoTab",
        EditPropertiyViewList: ["CompanyBankInfo2", "PersonBankInfo2", "CollectBankInfo2"]
    },
    //保存公司财务信息 SaveCompanyFinanceInfo: 1506,
    {
        Name: "SaveCompanyBankInfo",
        Type: "EntityEdit/SaveEntityData",
        EditView: "CompanyBankInfo2"
    },
    {
        Name: "SavePersonBankInfo",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PersonBankInfo2"
    },
    {
        Name: "SaveCollectBankInfo",
        Type: "EntityEdit/SaveEntityData",
        EditView: "CollectBankInfo2"
    },
    //计算汇总数据 ComputeCollectBankInfo: 1507,
    {
        Name: "ComputeCollectBankInfo",
        Type: "EntityEdit/SaveEntityData",
        EditView: "CollectBankInfo2"
    },
    //获取征信信息 GetCreditInfo: 1508,
    {
        Name: "GetCreditInfo",
        Type: "EntityEdit/GetEntityData",
        EditView: "CreditTab",
        EditPropertiyViewList: ["CompanyCredit2", "PersonCredit2", "OtherCredit2"]
    },
    //保存征信信息 SaveCreditInfo: 1509,
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
    //计算授信额度 ComputeCreditQuota: 1510,
    {
        Name: "ExceCompute",
        Type: "EntityEdit/SaveEntityData",
        EditView: "CreditCalculate2"
    },
    //获取授信额度 GetCreditQuota: 1511,
    {
        Name: "GetCreditQuota",
        Type: "EntityEdit/GetEntityData",
        EditView: "CreditCalculate2"
    },
    //获取补件退单信息 GetPatchExitOrderInfo: 1512,
    {
        Name: "GetPatchExitOrderInfo",
        Type: "EntityEdit/GetEntityData",
        EditView: "AuditOpinionTab",
        EditPropertiyViewList: ["PatchRecord", "ReadRefundOrder"],
        SetGetEntityDataLoad: "SetGetPatchExitOrderInfoLoad"
    },
    //获取审批意见 GetApprovalOpinion: 1513,
    {
        Name: "GetApprovalOpinion",
        Type: "EntityEdit/GetEntityData",
        EditView: "FirstTrialApprovalOpinion",
        EditPropertiyViewList: ["FirstTrialApprovalOpinion2", "ApprovalLeftRightButtonView"]
    },
    //保存审核意见 SaveApprovalOpinion: 1514
    {
        Name: "SaveApprovalOpinion",
        Type: "EntityEdit/SaveEntityDataViews",
        EditPropertiyViewList: ["FirstTrialApprovalOpinion2", "ApprovalLeftRightButtonView"],
        SetDisabledViewList: ["FirstTrialApprovalOpinion2", "ApprovalLeftRightButtonView",
            "PersonCardInfo2", "PersonBaseInfo2", "CompanyBaseInfo2", "PersonPropertyInfo2", "ContactInfo2",
            "PersonCardInfoButtonView", "PersonBaseInfoButtonView", "CompanyBaseInfoButtonView", "PersonPropertyInfoButtonView", "ContactInfoButtonView",
            "CompanyBankInfo2", "PersonBankInfo2", "CollectBankInfo2",
            "CompanyBankInfoButtonView", "PersonBankInfoButtonView", "CollectBankInfoButtonView",
            "CompanyCredit2", "CompanyCreditButtonView", "PersonCredit2", "PersonCreditButtonView", "OtherCredit2", "OtherCreditButtonView"]
    }]
}