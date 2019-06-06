import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

export default class FinalAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_FinalAuditing";
        this.MinActionType = 1300;
        this.MaxActionType = 1399;

        this.Init();
    }

    //获取订单基本信息实体数据
    GetOrderInfoEntityData(id, actionType, data) {
        Common2.GetOrderInfoEntityData.call(this, id, actionType, data);
    }

    //获取终审基本信息
    GetFinalBaseInfo(id, actionType, data) {
        this.DvaActions.Dispatch("FinanceService", "GetFinalBaseInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存终审基本信息
    SaveFinalBaseInfo(id, actionType, data) {
        const { EntityData } = data;
        const payload = { Action: this.GetAction(id, actionType) };

        if (EntityData.ViewName === "CompanyBankInfo" || EntityData.ViewName === "PersonBankInfo") {
            for (let key in EntityData) { if (key !== "ViewName") payload[key] = EntityData[key]; }
        }
        else {
            const editData = {};
            for (let key in EntityData) { if (key !== "ViewName") editData[key] = EntityData[key]; }
            payload[EntityData.ViewName] = editData;
        }

        this.DvaActions.Dispatch("FinanceService", "SaveFinalBaseInfo", payload);
    }

    //获取终审征信信息
    GetCreditInfo(id, actionType, data) {
        this.DvaActions.Dispatch("CreditService", "GetCreditInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存终审基本信息
    SaveCreditInfo(id, actionType, data) {
        const { EntityData } = data;
        const payload = { Action: this.GetAction(id, actionType) };

        const editData = {};
        for (let key in EntityData) { if (key !== "ViewName") editData[key] = EntityData[key]; }
        payload[EntityData.ViewName] = editData;

        this.DvaActions.Dispatch("FinanceService", "ComputeCollectBankInfo", payload);
    }

    //获取担保人信息
    GetCautionerInfo(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetCautionerInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存担保人信息
    SaveCautionerInfo(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "SaveCautionerInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取共借人信息
    GetCoBorrowerInfo(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetCoBorrowerInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存共借人信息
    SaveCoBorrowerInfo(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "SaveCoBorrowerInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取授信测算信息
    GetFinalCreditCalculate(id, actionType, data) {
        this.DvaActions.Dispatch("CreditService", "GetFinalCreditCalculate", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存授信测算信息
    SaveFinalCreditCalculate(id, actionType, data) {
        this.DvaActions.Dispatch("CreditService", "SaveFinalCreditCalculate", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取终审授信结论信息
    GetFinalCreditApprovalResult(id, actionType, data) {
        this.DvaActions.Dispatch("CreditService", "GetFinalCreditApprovalResult", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存终审授信结论信息
    SaveFinalCreditApprovalResult(id, actionType, data) {
        this.DvaActions.Dispatch("CreditService", "SaveFinalCreditApprovalResult", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取补件退单信息
    GetPatchExitOrderInfo(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetPatchExitOrderInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取审核意见
    GetApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存审核意见
    SaveApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "SaveApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }
}