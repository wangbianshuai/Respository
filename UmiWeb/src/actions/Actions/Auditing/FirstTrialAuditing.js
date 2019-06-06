import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";
import { Common } from "UtilsCommon";

export default class FirstTrialAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_FirstTrialAuditing";
        this.MinActionType = 1500;
        this.MaxActionType = 1599;

        this.Init();
    }

    //获取订单基本信息实体数据
    GetOrderInfoEntityData(id, actionType, data) {
        Common2.GetOrderInfoEntityData.call(this, id, actionType, data);
    }

    SetGetOrderInfoEntityData(id, actionType, data) {
        return Common2.SetGetOrderInfoEntityData.call(this, id, actionType, data);
    }

    //获取订单详情实体数据
    GetOrderDetailEntityData(id, actionType, data) {
        Common2.GetOrderDetailEntityData.call(this, id, actionType, data);
    }

    //获取订单详情实体数据
    SetGetOrderDetailEntityData(id, actionType, data) {
        return Common2.SetGetOrderDetailEntityData.call(this, id, actionType, data);
    }

    //获取行业
    GetAllIndustry(id, actionType, data) {
        Common2.GetAllIndustry.call(this, id, actionType, data);
    }

    //获取行业
    SetGetAllIndustry(id, actionType, data) {
        return Common2.SetGetAllIndustry.call(this, id, actionType, data)
    }

    //保存审批订单详情
    SaveApprovalOrderDetail(id, actionType, data) {
        const { EntityData } = data;
        const payload = { Action: this.GetAction(id, actionType) };

        const editData = {};
        for (let key in EntityData) { if (key !== "ViewName") editData[key] = EntityData[key]; }
        payload[EntityData.ViewName] = editData;

        this.DvaActions.Dispatch("OrderService", "SaveApprovalOrderDetail", payload);
    }

    //获取公司财务信息
    GetCompanyFinanceInfo(id, actionType, data) {
        this.DvaActions.Dispatch("FinanceService", "GetCompanyFinanceInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取公司财务信息
    SetGetCompanyFinanceInfo(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (!data.CompanyBankList || data.CompanyBankList.length === 0) data.CompanyBankList = [{ Id: Common.CreateGuid(), Title: "银行卡一" }];
        else data.CompanyBankList.forEach((c, i) => { c.Id = Common.CreateGuid(); c.Title = "银行卡" + Common2.GetLenName(i); });

        if (!data.PersonBankList || data.PersonBankList.length === 0) data.PersonBankList = [{ Id: Common.CreateGuid(), Title: "银行卡一" }];
        else data.PersonBankList.forEach((c, i) => { c.Id = Common.CreateGuid(); c.Title = "银行卡" + Common2.GetLenName(i); });

        data.CompanyBankInfo = { CompanyBankList: data.CompanyBankList };
        data.PersonBankInfo = { PersonBankList: data.PersonBankList };

        return data;
    }

    //保存公司财务信息
    SaveCompanyFinanceInfo(id, actionType, data) {
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

        this.DvaActions.Dispatch("FinanceService", "SaveCompanyFinanceInfo", payload);
    }

    //计算汇总数据
    ComputeCollectBankInfo(id, actionType, data) {
        const { EntityData } = data;
        const payload = { Action: this.GetAction(id, actionType) };

        const editData = {};
        for (let key in EntityData) { if (key !== "ViewName") editData[key] = EntityData[key]; }
        payload[EntityData.ViewName] = editData;

        this.DvaActions.Dispatch("FinanceService", "ComputeCollectBankInfo", payload);
    }

    //获取征信信息
    GetCreditInfo(id, actionType, data) {
        this.DvaActions.Dispatch("CreditService", "GetCreditInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存征信信息
    SaveCreditInfo(id, actionType, data) {
        const { EntityData } = data;
        const payload = { Action: this.GetAction(id, actionType) };

        const editData = { ...data.OldEntityData };
        for (let key in EntityData) { if (key !== "ViewName") editData[key] = EntityData[key]; }
        payload[EntityData.ViewName] = editData;

        this.DvaActions.Dispatch("CreditService", "SaveCreditInfo", payload);
    }

    //计算授信额度
    ComputeCreditQuota(id, actionType, data) {
        this.DvaActions.Dispatch("CreditService", "ComputeCreditQuota", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取授信额度
    GetCreditQuota(id, actionType, data) {
        this.DvaActions.Dispatch("CreditService", "GetCreditQuota", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取补件退单信息
    GetPatchExitOrderInfo(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetPatchExitOrderInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取补件退单信息
    SetGetPatchExitOrderInfo(id, actionType, data) {
        return Common2.SetGetPatchExitOrderInfo.call(this, id, actionType, data)
    }

    //保存审核意见
    GetApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetFirstTrialApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存审核意见
    SaveApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "SaveFirstTrialApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    GetOrderStatus(id, actionType, data) {
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }
}