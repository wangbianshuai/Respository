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

//审核管理/终审审核 1300-1399
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 1300
}

export default {
    Name: "FinalAuditing",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [ReadBaseInfo, GetTabsView()])
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
        Properties: AssignProporties({}, [FinalCreditCalculate, FinalCreditApprovalResult])
    }
}

function GetCoBorrowerInfoTab() {
    return {
        Name: "CoBorrowerInfoTab",
        Type: "View",
        TabLabel: "共借人信息",
        TabIcon: "audit",
        Properties: AssignProporties({}, [CoBorrowerInfo])
    }
}

function GetAuditOpinionTab() {
    return {
        Name: "AuditOpinionTab",
        Type: "View",
        TabLabel: "审核意见",
        TabIcon: "audit",
        Properties: AssignProporties({}, [PatchRecord, ReadRefundOrder, FinalApprovalOpinion])
    }
}

function GetCautionerInfoTab() {
    return {
        Name: "CautionerInfo",
        Type: "View",
        TabLabel: "担保人信息",
        TabIcon: "audit",
        Properties: AssignProporties({}, [CautionerInfo])
    }
}

function GetCreditTab() {
    return {
        Name: "CreditTab",
        Type: "View",
        TabLabel: "征信信息",
        TabIcon: "audit",
        Properties: AssignProporties({}, [CompanyCredit, PersonCredit, OtherCredit])
    }
}

function GetBaseInfoTab() {
    return {
        Name: "BaseInfoTab",
        Type: "View",
        TabLabel: "基本信息",
        TabIcon: "home",
        Properties: AssignProporties({}, [InvoiceInfo, DebtInfo, DealInfo, PropertyInfo])
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
    }]
}