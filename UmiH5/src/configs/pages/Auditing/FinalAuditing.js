import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import CompanyCredit from "../../views/Credit/CompanyCredit";
import PersonCredit from "../../views/Credit/PersonCredit";
import OtherCredit from "../../views/Credit/OtherCredit";
import PatchRecord from "../../views/OrderPatch/PatchRecord";
import ReadRefundOrder from "../../views/Order/ReadRefundOrder";
import FinalApprovalOpinion from "../../views/OrderApproval/FinalApprovalOpinion";
import InvoiceInfo from "../../views/Finance/InvoiceInfo";
import DebtInfo from "../../views/Finance/DebtInfo";
import DealInfo from "../../views/Finance/DealInfo";
import PropertyInfo from "../../views/Finance/PropertyInfo";
import CautionerInfo from "../../views/Order/CautionerInfo";
import CoBorrowerInfo from "../../views/Order/CoBorrowerInfo";
import FinalCreditCalculate from "../../views/Credit/FinalCreditCalculate";
import FinalCreditApprovalResult from "../../views/OrderApproval/FinalCreditApprovalResult";
import DataActions from "Actions";

//审核管理/终审审核 1300-1399
const DataActionTypes = DataActions.GetActionTypes("Auditing_FinalAuditing");

export default {
    Name: "FinalAuditing",
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
        Properties: AssignProporties({}, [GetBaseInfoTab(), GetCreditTab(), GetCautionerInfoTab(), GetCoBorrowerInfoTab(), GetCreditInfoTab(), GetAuditOpinionTab()])
    }
}

function GetCreditInfoTab() {
    return {
        Name: "CreditInfoTab",
        Type: "View",
        TabLabel: "授信信息",
        TabIcon: "audit",
        Properties: AssignProporties({}, [FinalCreditCalculate(DataActionTypes), FinalCreditApprovalResult(DataActionTypes)])
    }
}

function GetCoBorrowerInfoTab() {
    return {
        Name: "CoBorrowerInfoTab",
        Type: "View",
        TabLabel: "共借人信息",
        TabIcon: "audit",
        Properties: AssignProporties({}, [CoBorrowerInfo(DataActionTypes)])
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
        Properties: AssignProporties({}, [PatchRecord(DataActionTypes), ReadRefundOrder(DataActionTypes), FinalApprovalOpinion(DataActionTypes)])
    }
}

function GetCautionerInfoTab() {
    return {
        Name: "CautionerInfo",
        Type: "View",
        TabLabel: "担保人信息",
        TabIcon: "audit",
        Properties: AssignProporties({}, [CautionerInfo(DataActionTypes)])
    }
}

function GetCreditTab() {
    return {
        Name: "CreditTab",
        Type: "View",
        TabLabel: "征信信息",
        TabIcon: "audit",
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetCreditInfo",
        GetEntityDataActionType: DataActionTypes.GetCreditInfo,//获取终审征信信息
        Properties: AssignProporties({}, [CompanyCredit(DataActionTypes), PersonCredit(DataActionTypes), OtherCredit(DataActionTypes)])
    }
}

function GetBaseInfoTab() {
    return {
        Name: "BaseInfoTab",
        Type: "View",
        TabLabel: "基本信息",
        TabIcon: "home",
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetFinalBaseInfo",
        GetEntityDataActionType: DataActionTypes.GetFinalBaseInfo,//获取终审征信信息
        Properties: AssignProporties({}, [InvoiceInfo(DataActionTypes), DebtInfo(DataActionTypes), DealInfo(DataActionTypes), PropertyInfo(DataActionTypes)])
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
        EditView: "OrderInfo"
    },
    {
        Name: "ToOrderDetail",
        Type: "Page/ToPage",
        PageUrl: "/CreditManage/OrderDetail?OrderCode=#{OrderCode}"
    },
    //获取终审基本信息 GetFinalBaseInfo: 1301,
    {
        Name: "GetFinalBaseInfo",
        Type: "EntityEdit/GetEntityData",
        EditView: "BaseInfoTab",
        EditPropertiyViewList: ["InvoiceInfo2", "DebtInfo2", "DealInfo2", "PropertyInfo2"]
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
        Name: "SaveOtherCredit2",
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
        EditView: "FinalCreditCalculate2"
    },
    //保存授信测算信息 SaveFinalCreditCalculate: 1309,
    {
        Name: "SaveFinalCreditCalculate",
        Type: "EntityEdit/SaveEntityData",
        EditView: "FinalCreditCalculate2"
    },
    //获取终审授信结论信息  GetFinalCreditApprovalResult: 1310,
    {
        Name: "GetFinalCreditApprovalResult",
        Type: "EntityEdit/GetEntityData",
        EditView: "FinalCreditApprovalResult2"
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
        EditPropertiyViewList: ["PatchRecord2", "ReadRefundOrder"]
    },
    //获取审核意见 GetApprovalOpinion: 1313,
    {
        Name: "GetApprovalOpinion",
        Type: "EntityEdit/GetEntityData",
        EditView: "AuditOpinionTab",
        EditPropertiyViewList: ["FinalApprovalOpinion2", "ApprovalLeftRightButtonView"]
    },
    //保存审核意见 SaveApprovalOpinion: 1314
    {
        Name: "SaveApprovalOpinion",
        Type: "EntityEdit/SaveEntityDataViews",
        EditPropertiyViewList: ["FinalApprovalOpinion2", "ApprovalLeftRightButtonView"],
        SetDisabledViewList: ["FinalApprovalOpinion2", "ApprovalLeftRightButtonView",
            "InvoiceInfo2", "DebtInfo2", "DealInfo2", "PropertyInfo2",
            "InvoiceInfoButtonView", "DebtInfoButtonView", "DealInfoButtonView", "PropertyInfoButtonView",
            "CompanyCredit2", "PersonCredit2", "OtherCredit2",
            "CompanyCreditButtonView", "PersonCreditButtonView", "OtherCreditButtonView",
            "CautionerInfo2", "CautionerInfoButtonView", "CoBorrowerInfo2", "CoBorrowerInfoButtonView",
            "FinalCreditCalculate2", "FinalCreditCalculateButtonView", "FinalCreditApprovalResult2", "FinalCreditApprovalResultButtonView"]
    }]
}