import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";
import { Common, Validate } from "UtilsCommon";

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

    SetGetOrderInfoEntityData(id, actionType, data) {
        return Common2.SetGetOrderInfoEntityData.call(this, id, actionType, data);
    }

    //获取终审基本信息
    GetFinalBaseInfo(id, actionType, data) {
        this.DvaActions.Dispatch("FinanceService", "GetFinalBaseInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存终审基本信息
    SaveFinalBaseInfo(id, actionType, data) {
        const { EntityData, PageData } = data;
        const payload = { Action: this.GetAction(id, actionType), loanApplyId: PageData.OrderCode };
        const editData = { ...data.OldEntityData };
        for (let key in EntityData) { if (key !== "ViewName") editData[key] = EntityData[key]; }

        payload.data = {};
        payload.data[EntityData.ViewName] = editData;

        let type = "";
        //type (string): 信息类型（01开票信息02负债信息03经营信息04资产信息） ,
        if (EntityData.ViewName === "billInfo") type = "01";
        else if (EntityData.ViewName === "debtInfo") type = "02"
        else if (EntityData.ViewName === "businessInfo") type = "03";
        else if (EntityData.ViewName === "assetsInfo") type = "04"

        payload.type = type;

        this.DvaActions.Dispatch("FinanceService", "SaveFinalBaseInfo", payload);
    }

    //获取终审征信信息
    GetCreditInfo(id, actionType, data) {
        this.DvaActions.Dispatch("CreditService", "GetFinalCreditInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存终审征信信息
    SaveCreditInfo(id, actionType, data) {
        const { EntityData, PageData } = data;
        const payload = { Action: this.GetAction(id, actionType), loanApplyId: PageData.OrderCode };

        const editData = { ...data.OldEntityData };
        for (let key in EntityData) { if (key !== "ViewName") editData[key] = EntityData[key]; }
        payload.data = {};
        payload.data[EntityData.ViewName] = editData;

        let type = "";
        //type (string): 信息类型（01企业类征信 02个人类征信 03其他数据） ,
        if (EntityData.ViewName === "enterpriseInfo") type = "01";
        else if (EntityData.ViewName === "personalInfo") type = "02"
        else if (EntityData.ViewName === "otherInfo") type = "03";

        payload.type = type;

        this.DvaActions.Dispatch("CreditService", "SaveFinalCreditInfo", payload);
    }

    //获取担保人信息
    GetCautionerInfo(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetCautionerInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SetGetCautionerInfo(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.IsSuccess === false) return data;

        var CautionerList = [];
        if (data.guarantorLenderList && data.guarantorLenderList.length > 0) {
            CautionerList = data.guarantorLenderList.filter(f => f.type === "01");
        }

        if (!CautionerList || CautionerList.length === 0) CautionerList = [{ Id: Common.CreateGuid(), Title: "担保人一" }];
        else CautionerList.forEach((c, i) => {
            c.Id = Common.CreateGuid();
            c.Title = "担保人" + Common2.GetLenName(i);
            c.NameVisible = c.personType === "01";
            c.IdNumberVisible = c.personType === "01"
            c.CompanyNameVisible = c.personType === "02";
            c.CompanyIdNumberVisible = c.personType === "02"
        });


        return {
            CautionerList: CautionerList
        };
    }

    //保存担保人信息
    SaveCautionerInfo(id, actionType, data) {
        const { EntityData, PageData } = data;
        const payload = { Action: this.GetAction(id, actionType), loanApplyId: PageData.OrderCode };

        EntityData.CautionerList.forEach(d => d.type = "01");

        payload.data = {};
        payload.data.guarantorLenderList = EntityData.CautionerList;

        if (!this.JudgeValidateGuarantotLenderList(id, actionType, payload.data.guarantorLenderList)) return;

        this.DvaActions.Dispatch("OrderService", "SaveCautionerInfo", payload);
    }

    //获取共借人信息
    GetCoBorrowerInfo(id, actionType, data) {
        this.DvaActions.Dispatch("OrderService", "GetCoBorrowerInfo", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SetGetCoBorrowerInfo(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.IsSuccess === false) return data;

        var CoBorrowerList = [];
        if (data.guarantorLenderList && data.guarantorLenderList.length > 0) {
            CoBorrowerList = data.guarantorLenderList.filter(f => f.type === "02");
        }

        if (!CoBorrowerList || CoBorrowerList.length === 0) CoBorrowerList = [{ Id: Common.CreateGuid(), Title: "共同借款人一" }];
        else CoBorrowerList.forEach((c, i) => {
            c.Id = Common.CreateGuid();
            c.Title = "共同借款人" + Common2.GetLenName(i);
            c.NameVisible = c.personType === "01";
            c.IdNumberVisible = c.personType === "01"
            c.CompanyNameVisible = c.personType === "02";
            c.CompanyIdNumberVisible = c.personType === "02"
        });

        return {
            CoBorrowerList: CoBorrowerList
        };
    }

    //保存共借人信息
    SaveCoBorrowerInfo(id, actionType, data) {
        const { EntityData, PageData } = data;
        const payload = { Action: this.GetAction(id, actionType), loanApplyId: PageData.OrderCode };

        EntityData.CoBorrowerList.forEach(d => d.type = "02");

        payload.data = {};
        payload.data.guarantorLenderList = EntityData.CoBorrowerList;

        if (!this.JudgeValidateGuarantotLenderList(id, actionType, payload.data.guarantorLenderList)) return;

        this.DvaActions.Dispatch("OrderService", "SaveCoBorrowerInfo", payload);
    }

    JudgeValidateGuarantotLenderList(id, actionType, dataList) {
        let msg = "";
        for (let i = 0; i < dataList.length; i++) {
            msg = this.JudgeValidateGuarantotLender(dataList[i]);
            if (msg) break;
        }
        if (msg) {
            this.Dispatch(id, actionType, { IsSuccess: false, Message: msg });
            return false;
        }
        return true;
    }

    JudgeValidateGuarantotLender(data) {
        let msg = "";

        if (data.personType === "01") {
            //身份证号
            if (!msg && data.personId) {
                let res = Validate.ValidateIdentityCard(data.personId);
                if (res !== true) msg = "身份证号格式不正确！"
            }
        }

        //联系方式
        if (!msg && data.contactPhone) {
            let res = Validate.ValidateHomePhone(data.contactPhone);
            if (res !== true) res = Validate.ValidateMobile(data.contactPhone);
            if (res !== true) msg = "联系方式需是固定电话或手机格式！"
        }

        //电子邮箱
        if (!msg && data.email) {
            let res = Validate.ValidateEmail(data.email);
            if (res !== true) msg = res;
        }

        return msg;
    }

    //获取授信测算信息
    GetFinalCreditCalculate(id, actionType, data) {
        this.DvaActions.Dispatch("CreditService", "GetFinalCreditCalculate", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //保存授信测算信息
    SaveFinalCreditCalculate(id, actionType, data) {
        const { EntityData, PageData } = data;

        const payload = {
            data: EntityData,
            loanApplyId: PageData.OrderCode,
            Action: this.GetAction(id, actionType)
        };
        this.DvaActions.Dispatch("CreditService", "SaveFinalCreditCalculate", payload);
    }

    //获取终审授信结论信息
    GetFinalCreditApprovalResult(id, actionType, data) {
        this.DvaActions.Dispatch("CreditService", "GetFinalCreditApprovalResult", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SetGetFinalCreditApprovalResult(id, actionType, data) {
        return Common2.SetGetFinalApprovalResult.call(this, id, actionType, data);
    }

    //保存终审授信结论信息
    SaveFinalCreditApprovalResult(id, actionType, data) {
        const { EntityData, PageData } = data;

        const feeResultList = [];

        let msg = "";

        const { InfoManageRate, InfoServiceRate, InfoServiceRate2, FineRate, repaymentWay } = EntityData;

        if (Common.IsNullOrEmpty(repaymentWay)) msg = "请选择还款方式";
        else if (Common.IsNullOrEmpty(InfoManageRate)) msg = "请选择信息管理费率";
        else if (Common.IsNullOrEmpty(InfoServiceRate)) msg = "请选择信息服务费率";
        else if (InfoServiceRate2 !== undefined && Common.IsNullOrEmpty(InfoServiceRate2)) msg = "请选择信息服务费率";
        else if (Common.IsNullOrEmpty(FineRate)) msg = "请选择罚息费率";

        if (!msg && EntityData.ServiceCollectionMethod === EntityData.ServiceCollectionMethod2) msg = "两个信息服务费率收取方式不能相同，请选择不同的收取方式！";

        if (msg) {
            this.Dispatch(id, actionType, { IsSuccess: false, Message: msg })
            return;
        }

        feeResultList.push({
            feeType: "01",
            feeRate: EntityData.InfoManageRate,
            chargeStage: EntityData.ManageCollectionType,
            chargeWay: EntityData.ManageCollectionMethod
        });
        feeResultList.push({
            feeType: "02",
            feeRate: EntityData.InfoServiceRate,
            chargeStage: EntityData.ServiceCollectionType,
            chargeWay: EntityData.ServiceCollectionMethod
        });
        if (EntityData.ServiceCollectionMethod2) {
            feeResultList.push({
                feeType: "02",
                feeRate: EntityData.InfoServiceRate2,
                chargeStage: EntityData.ServiceCollectionType2,
                chargeWay: EntityData.ServiceCollectionMethod2
            });
        }
        feeResultList.push({
            feeType: "03",
            feeRate: EntityData.FineRate
        });

        let approveLoanPeriod = 0, approveLoanPeriodUnit = "";
        if (EntityData.ApprovedLoanPeriodValue) {
            const values = EntityData.ApprovedLoanPeriodValue.split(",");
            approveLoanPeriod = values[0];
            approveLoanPeriodUnit = values[1];
        }

        const editData = {
            approveLoanPeriod: approveLoanPeriod,
            approveInterestRate: EntityData.approveInterestRate,
            approveLoanPeriodUnit: approveLoanPeriodUnit,
            approveLoanAmount: EntityData.approveLoanAmount,
            repaymentWay: EntityData.repaymentWay,
            repaymentPeriodWay: EntityData.periodWay,
            repaymentPeriodWayUnit: EntityData.periodWayUnit,
            annulCalcWay: EntityData.annualCalcWay,
            finalApprovalFeeInfoResult: { feeResultList }
        };

        const payload = {
            data: editData,
            loanApplyId: PageData.OrderCode,
            Action: this.GetAction(id, actionType)
        };
        this.DvaActions.Dispatch("CreditService", "SaveFinalCreditApprovalResult", payload);
    }

    //获取补件退单信息
    GetPatchExitOrderInfo(id, actionType, data) {
        Common2.GetPatchExitOrderInfo.call(this, id, actionType, data, "04")
    }

    //获取补件退单信息
    SetGetPatchExitOrderInfo(id, actionType, data) {
        return Common2.SetGetPatchExitOrderInfo.call(this, id, actionType, data)
    }

    //获取审核意见
    GetApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetFinalApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
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
        this.DvaActions.Dispatch("ApprovalService", "SaveFinalApprovalOpinion", payload);
    }

    GetOrderStatus(id, actionType, data) {
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }

    SetGetOrderStatus(id, actionType, data) {
        return Common2.SetGetOrderStatus.call(this, id, actionType, data);
    }
}
