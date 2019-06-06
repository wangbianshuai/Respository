import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

export default class FirstTrialPhoneAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_FirstTrialPhoneAuditing";
        this.MinActionType = 1600;
        this.MaxActionType = 1699;

        this.Init();
    }

    //获取实体数据
    GetOrderInfoEntityData(id, actionType, data) {
        Common2.GetOrderInfoEntityData.call(this, id, actionType, data);
    }

    SetGetOrderInfoEntityData(id, actionType, data) {
        return Common2.SetGetOrderInfoEntityData.call(this, id, actionType, data);
    }

    //获取公司联系人核实
    GetCompanyContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "GetCompanyContactCheck", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存公司联系人核实
    SaveCompanyContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "SaveCompanyContactCheck", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取亲属联系人核实
    GetKinsfolkContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "GetKinsfolkContactCheck", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存亲属联系人核实
    SaveKinsfolkContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "SaveKinsfolkContactCheck", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取本人核实
    GetOwnerContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "GetOwnerContactCheck", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存本人核实
    SaveOwnerContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "SaveOwnerContactCheck", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取同事联系核实
    GetWorkmateContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "GetWorkmateContactCheck", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存同事联系核实
    SaveWorkmateContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "SaveWorkmateContactCheck", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取审核意见
    GetApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetFirstTrialPhoneApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取补件退单信息
    SaveApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "SaveFirstTrialPhoneApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取补件退单信息
    GetPatchExitOrderInfo(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetPatchExitOrderInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取补件退单信息
    SetGetPatchExitOrderInfo(id, actionType, data) {
        return Common2.SetGetPatchExitOrderInfo.call(this, id, actionType, data)
    }

    GetOrderStatus(id, actionType, data) {
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }
}