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

    //获取订单详情实体数据
    GetOrderDetailEntityData(id, actionType, data) {
        Common2.GetOrderDetailEntityData.call(this, id, actionType, data);
    }

    //获取订单详情实体数据
    SetGetOrderDetailEntityData(id, actionType, data) {
        data = Common2.SetGetOrderDetailEntityData.call(this, id, actionType, data);

        if (data.IsSuccess === false) return data;

        const loanApplyId = Common.GetQueryString().OrderCode;
        this.DvaActions.Dispatch("OrderService", "GetApprovalOrderDetail", { loanApplyId }).then(res => this.SetGetOrderDetailEntityData2(id, actionType, data, res));

        return false;
    }

    SetGetOrderDetailEntityData2(id, actionType, data, res) {
        if (res && res.approvalBaseList && res.approvalBaseList.length > 0) {
            res.approvalBaseList.forEach(d => {
                if (d.type === "02") data.personalIdentity.ApprovalRemark = d.remark;
                else if (d.type === "03") data.personalBase.ApprovalRemark = d.remark;
                else if (d.type === "04") data.enterprise.ApprovalRemark = d.remark;
                else if (d.type === "05") data.PersonPropertyInfo.ApprovalRemark = d.remark;
                else if (d.type === "06") data.ContactInfo.ApprovalRemark = d.remark;
            })
        }

        this.DispatchToReceive(id, actionType, data)
    }

    //保存审批订单详情
    SaveApprovalOrderDetail(id, actionType, data) {
        const { EntityData, PageData } = data;
        const payload = { Action: this.GetAction(id, actionType), loanApplyId: PageData.OrderCode };

        var type = "";
        var name = EntityData.ViewName;
        if (name === "personalIdentity") type = "02";
        else if (name === "personalBase") type = "03";
        else if (name === "enterprise") type = "04";
        else if (name === "PersonPropertyInfo") type = "05";
        else if (name === "ContactInfo") type = "06";

        payload.data = { approvalBaseList: [{ type, remark: EntityData.ApprovalRemark }] };

        this.DvaActions.Dispatch("OrderService", "SaveApprovalOrderDetail", payload);
    }

    //获取公司财务信息
    GetCompanyFinanceInfo(id, actionType, data) {
        this.DvaActions.Dispatch("FinanceService", "GetCompanyFinanceInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取公司财务信息
    SetGetCompanyFinanceInfo(id, actionType, data) {
        data = this.SetApiResponse(data);

        var CompanyBankList = [], PersonBankList = [];

        if (data.bankcardFlowList && data.bankcardFlowList.length > 0) {
            data.bankcardFlowList.forEach(d => {
                if (d.type === "01") CompanyBankList.push(d);
                else if (d.type === "02") PersonBankList.push(d);
            });
        }
        if (CompanyBankList.length === 0) CompanyBankList = [{ Id: Common.CreateGuid(), Title: "银行卡一" }];
        else CompanyBankList.forEach((c, i) => { c.Id = Common.CreateGuid(); c.Title = "银行卡" + Common2.GetLenName(i); });

        if (PersonBankList.length === 0) PersonBankList = [{ Id: Common.CreateGuid(), Title: "银行卡一" }];
        else PersonBankList.forEach((c, i) => { c.Id = Common.CreateGuid(); c.Title = "银行卡" + Common2.GetLenName(i); });

        data.CompanyBankInfo = { CompanyBankList };
        data.PersonBankInfo = { PersonBankList };

        return data;
    }

    //保存公司财务信息
    SaveCompanyFinanceInfo(id, actionType, data) {
        const { EntityData, PageData } = data;
        const payload = { Action: this.GetAction(id, actionType), data: {}, loanApplyId: PageData.OrderCode };

        if (EntityData.ViewName === "CompanyBankInfo" || EntityData.ViewName === "PersonBankInfo") {
            const type = EntityData.ViewName === "CompanyBankInfo" ? "01" : "02";
            if (EntityData.CompanyBankList) {
                EntityData.CompanyBankList.forEach(d => d.type = type);
                payload.data.bankcardFlowList = EntityData.CompanyBankList;
            }
            else if (EntityData.PersonBankList) {
                EntityData.PersonBankList.forEach(d => d.type = type);
                payload.data.bankcardFlowList = EntityData.PersonBankList;
            }

            let msg = ""
            for (var i = 0; i < payload.data.bankcardFlowList.length > 0; i++) {
                if (Common.IsNullOrEmpty(payload.data.bankcardFlowList[i].bankcardId)) {
                    msg = "请先上传" + payload.data.bankcardFlowList[i].Title + "流水Excel文件！";
                    break;
                }
            }
            if (msg) {
                this.Dispatch(id, actionType, { IsSuccess: false, Message: msg });
                return;
            }

            payload.operateType = "02"
        }
        else {
            const editData = {};
            for (let key in EntityData) { if (key !== "ViewName") editData[key] = EntityData[key]; }

            payload.data[EntityData.ViewName] = editData;

            payload.operateType = "01";
        }

        this.DvaActions.Dispatch("FinanceService", "SaveCompanyFinanceInfo", payload);
    }

    //计算汇总数据
    ComputeCollectBankInfo(id, actionType, data) {
        this.DvaActions.Dispatch("FinanceService", "ComputeCollectBankInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取征信信息
    GetCreditInfo(id, actionType, data) {
        this.DvaActions.Dispatch("CreditService", "GetCreditInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存征信信息
    SaveCreditInfo(id, actionType, data) {
        const { EntityData, PageData } = data;
        const payload = { Action: this.GetAction(id, actionType), loanApplyId: PageData.OrderCode };

        const editData = { ...data.OldEntityData };
        for (let key in EntityData) { if (key !== "ViewName") editData[key] = EntityData[key]; }
        payload.data = {};
        payload.data[EntityData.ViewName] = editData;

        let type = "";
        //type (string): 信息类型（01企业类征信 02个人类征信 03其他数据） 
        if (EntityData.ViewName === "enterpriseInfo") type = "01";
        else if (EntityData.ViewName === "personalInfo") type = "02"
        else if (EntityData.ViewName === "otherInfo") type = "03"

        payload.type = type;

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
        Common2.GetPatchExitOrderInfo.call(this, id, actionType, data, "01")
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
        const { EntityData, PageData } = data;
        const payload = {
            ...EntityData,
            loanApplyId: PageData.OrderCode,
            taskId: PageData.TaskId,
            Action: this.GetAction(id, actionType)
        };
        this.DvaActions.Dispatch("ApprovalService", "SaveFirstTrialApprovalOpinion", payload);
    }

    GetOrderStatus(id, actionType, data) {
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }

    SetGetOrderStatus(id, actionType, data) {
        return Common2.SetGetOrderStatus.call(this, id, actionType, data);
    }
}