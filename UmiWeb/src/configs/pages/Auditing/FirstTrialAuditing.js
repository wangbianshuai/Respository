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
import CreditCalculate from "../../views/Credit/CreditCalculate";
import PatchRecord from "../../views/OrderPatch/PatchRecord";
import ReadRefundOrder from "../../views/Order/ReadRefundOrder";
import FirstTrialApprovalOpinion from "../../views/OrderApproval/FirstTrialApprovalOpinion";

//审核管理/初审审核 1500-1599
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 1500
}

export default {
    Name: "FirstTrialAuditing",
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
        Properties: AssignProporties({}, [GetBaseInfoTab(), GetCompanyAmountInfoTab(), GetCreditTab(), GetCreditCalculateTab(), GetAuditOpinionTab()])
    }
}

function GetAuditOpinionTab() {
    return {
        Name: "AuditOpinionTab",
        Type: "View",
        TabLabel: "审核意见",
        TabIcon: "audit",
        Properties: AssignProporties({}, [PatchRecord, ReadRefundOrder, FirstTrialApprovalOpinion])
    }
}

function GetCreditCalculateTab() {
    return {
        Name: "CreditCalculateTab",
        Type: "View",
        TabLabel: "授信测算",
        TabIcon: "audit",
        Properties: AssignProporties({}, [CreditCalculate])
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

function GetCompanyAmountInfoTab() {
    return {
        Name: "CompanyAmountInfoTab",
        Type: "View",
        TabLabel: "企业财务信息",
        TabIcon: "audit",
        Properties: AssignProporties({}, [CompanyBankInfo, PersonBankInfo, CollectBankInfo])
    }
}

function GetBaseInfoTab() {
    return {
        Name: "BaseInfoTab",
        Type: "View",
        TabLabel: "基本信息",
        TabIcon: "home",
        Properties: AssignProporties({}, [ReadPersonCardInfo, ReadPersonBaseInfo, ReadCompanyBaseInfo, ReadPersonPropertyInfo, ReadContactInfo])
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
    }]
}