import { AssignProporties } from "../Common";
import ReadBaseInfo from "../../views/Order/ReadBaseInfo";
import CompanyContactCheck from "../../views/Contact/CompanyContactCheck";
import KinsfolkContactCheck from "../../views/Contact/KinsfolkContactCheck";
import WorkmateContactCheck from "../../views/Contact/WorkmateContactCheck";
import OwnerContactCheck from "../../views/Contact/OwnerContactCheck";
import PatchRecord from "../../views/OrderPatch/PatchRecord";
import ReadRefundOrder from "../../views/Order/ReadRefundOrder";
import FirstTrialPhoneApprovalOpinion from "../../views/OrderApproval/FirstTrialPhoneApprovalOpinion";

//审核管理/初审电核 1600-1699
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 1600
}

export default {
    Name: "FirstTrialPhoneAuditing",
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
        Properties: AssignProporties({}, [GetCompanyContactCheckTab(), GetKinsfolkContactCheckTab(), GetWorkmateContactCheckTab(), GetOwnerContactCheckTab(), GetAuditOpinionTab()])
    }
}

function GetAuditOpinionTab() {
    return {
        Name: "AuditOpinionTab",
        Type: "View",
        TabLabel: "审核意见",
        TabIcon: "audit",
        Properties: AssignProporties({}, [PatchRecord, ReadRefundOrder, FirstTrialPhoneApprovalOpinion])
    }
}

function GetOwnerContactCheckTab() {
    return {
        Name: "OwnerContactCheckTab",
        Type: "View",
        TabLabel: "借款本人核实",
        TabIcon: "audit",
        Properties: AssignProporties({}, [OwnerContactCheck])
    }
}

function GetWorkmateContactCheckTab() {
    return {
        Name: "WorkmateContactCheckTab",
        Type: "View",
        TabLabel: "同事联系人核实",
        TabIcon: "audit",
        Properties: AssignProporties({}, [WorkmateContactCheck])
    }
}

function GetKinsfolkContactCheckTab() {
    return {
        Name: "KinsfolkContactCheckTab",
        Type: "View",
        TabLabel: "亲属联系人核实",
        TabIcon: "audit",
        Properties: AssignProporties({}, [KinsfolkContactCheck])
    }
}

function GetCompanyContactCheckTab() {
    return {
        Name: "CompanyContactCheckTab",
        Type: "View",
        TabLabel: "单位相关信息核实",
        TabIcon: "home",
        Properties: AssignProporties({}, [CompanyContactCheck])
    }
}

function GetEventActions() {
    return []
}