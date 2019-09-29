import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";
import { Common } from "UtilsCommon";

export default class AntiFraudAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_AntiFraudAuditing";
        this.MinActionType = 1200;
        this.MaxActionType = 1299;

        this.Init();
    }

    //获取订单基本信息实体数据
    GetOrderInfoEntityData(id, actionType, data) {
        Common2.GetOrderInfoEntityData2.call(this, id, actionType, data);
    }

    SetGetOrderInfoEntityData(id, actionType, data) {
        /*requestId	工单号name	姓名idNumber	身份证mobile	手机号orgCode	同一社会码orgName	企业名称*/
        const request = {};
        const data2 = this.SetApiResponse(data);
        const { personalIdentity, personalBase, enterprise } = data2;
        if (personalIdentity) {
            request.name = personalIdentity.name;
            request.idNumber = personalIdentity.idCard;
        }
        if (personalBase) request.mobile = personalBase.commonUsePhone;
        if (enterprise) {
            request.orgCode = enterprise.socialCreditId;
            request.orgName = enterprise.companyName;
        }

        if (data2.IsSuccess !== false) this.Dispatch(id, this.ActionTypes.SetAntiFraudRequest, request);

        return Common2.SetGetOrderInfoEntityData.call(this, id, actionType, data);
    }

    GetQueryRequest(request) {
        if (!request) return "";

        const list = [];
        for (var key in request) list.push(`${key}=${request[key]}`);
        return "?" + list.join("&");
    }

    //1.	白骑士
    GetBaiqishi(id, actionType, data) {
        this.DvaActions.Dispatch("AntiFraudService", "GetBaiqishi", { PathQuery: this.GetQueryRequest(data.AsyncRequest), Action: this.GetAction(id, actionType) });
    }

    SetGetBaiqishi(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.IsSuccess === false) return { DishonestyRiskExpandCollapse: data.Message, MultiRiskExpandCollapse: data.Message }

        data.DishonestyRiskExpandCollapse = data.shixin && data.shixin.length > 0 ? "" : "未命中";
        data.DishonestyRiskTable = this.SetItemResults(data.shixin);

        data.MultiRiskExpandCollapse = data.duotou && data.duotou.length > 0 ? "" : "未命中";
        data.MultiRiskTable = this.SetItemResults(data.duotou);
        return data;
    }

    SetItemResults(dataList) {
        const list = [];
        let rowSpan = 1;
        dataList && dataList.forEach(d => {
            const { item, results } = d;
            rowSpan = 1;
            if (results && results.length > 0) {
                results.forEach((r, i) => {
                    rowSpan = i === 0 ? results.length : 0;
                    list.push({ item, ...r, rowSpan, key: Common.CreateGuid() })
                })
            }
            else list.push({ item, rowSpan, key: Common.CreateGuid() });
        });
        return list;
    }

    //2.	汇法
    GetHuifa(id, actionType, data) {
        this.DvaActions.Dispatch("AntiFraudService", "GetHuifa", { PathQuery: this.GetQueryRequest(data.AsyncRequest), Action: this.GetAction(id, actionType) });
    }

    SetGetHuifa(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.IsSuccess === false) return { PersonHuifaRiskExpandCollapse: data.Message };

        const res = {};
        res.PersonHuifaRiskExpandCollapse = data && data.length > 0 ? "" : "未命中";
        res.PersonHuifaRiskTable = this.SetItemResults(data);

        return res;
    }

    //3.	百融申请
    GetBairongApply(id, actionType, data) {
        this.DvaActions.Dispatch("AntiFraudService", "GetBairongApply", { PathQuery: this.GetQueryRequest(data.AsyncRequest), Action: this.GetAction(id, actionType) });
    }

    SetGetBairongApply(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.IsSuccess === false) return { BairongApplyRiskExpandCollapse: data.Message };

        const res = {};
        res.BairongApplyRiskExpandCollapse = data && data.length > 0 ? "" : "未命中";
        res.BairongApplyRiskTable = this.SetItemResults(data);

        return res;
    }

    //4.	百融特殊
    GetBairongSpecial(id, actionType, data) {
        this.DvaActions.Dispatch("AntiFraudService", "GetBairongSpecial", { PathQuery: this.GetQueryRequest(data.AsyncRequest), Action: this.GetAction(id, actionType) });
    }

    SetGetBairongSpecial(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.IsSuccess === false) return { BairongSpecialRiskExpandCollapse: data.Message };

        const res = {};
        res.BairongSpecialRiskExpandCollapse = data && data.length > 0 ? "" : "未命中";
        res.BairongSpecialRiskTable = this.SetItemResults(data);

        return res;
    }

    //5.	同盾
    GetTongdun(id, actionType, data) {
        this.DvaActions.Dispatch("AntiFraudService", "GetTongdun", { PathQuery: this.GetQueryRequest(data.AsyncRequest), Action: this.GetAction(id, actionType) });
    }

    SetGetTongdun(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.IsSuccess === false) return { TongdunRiskExpandCollapse: data.Message };

        const res = {};
        res.TongdunRiskExpandCollapse = data && data.length > 0 ? "" : "未命中";
        res.TongdunRiskTable = this.SetItemResults(data);

        return res;
    }

    //6.	鹏元
    GetPengyuan(id, actionType, data) {
        this.DvaActions.Dispatch("AntiFraudService", "GetPengyuan", { PathQuery: this.GetQueryRequest(data.AsyncRequest), Action: this.GetAction(id, actionType) });
    }

    SetGetPengyuan(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.IsSuccess === false) return { PersonRiskExpandCollapse: data.Message, QueryCountRiskExpandCollapse: data.Message }

        data.PersonRiskExpandCollapse = data.fxList && data.fxList.length > 0 ? "" : "未命中";
        data.PersonRiskTable = this.SetItemResults(data.fxList);

        data.QueryCountRiskExpandCollapse = data.cxList && data.cxList.length > 0 ? "" : "未命中";
        data.QueryCountRiskTable = this.SetItemResults(data.cxList);
        return data;
    }

    //7.	中互金协会
    GetZhonghujin(id, actionType, data) {
        this.DvaActions.Dispatch("AntiFraudService", "GetZhonghujin", { PathQuery: this.GetQueryRequest(data.AsyncRequest), Action: this.GetAction(id, actionType) });
    }

    SetGetZhonghujin(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.IsSuccess === false) return { ZhonghujinRiskExpandCollapse: data.Message };

        const res = {};
        res.ZhonghujinRiskExpandCollapse = data && data.length > 0 ? "" : "未命中";
        res.ZhonghujinRiskTable = this.SetItemResults(data);

        return res;
    }

    //8.	汇法
    GetCompanyHuifa(id, actionType, data) {
        this.DvaActions.Dispatch("AntiFraudService", "GetCompanyHuifa", { PathQuery: this.GetQueryRequest(data.AsyncRequest), Action: this.GetAction(id, actionType) });
    }

    SetGetCompanyHuifa(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.IsSuccess === false) return { CompanyHuifaRiskExpandCollapse: data.Message };

        const res = {};
        res.CompanyHuifaRiskExpandCollapse = data && data.length > 0 ? "" : "未命中";
        res.CompanyHuifaRiskTable = this.SetItemResults(data);

        return res;
    }

    //9.	鹏元企业
    GetCompanyPengyuan(id, actionType, data) {
        this.DvaActions.Dispatch("AntiFraudService", "GetCompanyPengyuan", { PathQuery: this.GetQueryRequest(data.AsyncRequest), Action: this.GetAction(id, actionType) });
    }

    SetGetCompanyPengyuan(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.IsSuccess === false) return { CompanyRiskExpandCollapse: data.Message, CompanyQueryCountRiskExpandCollapse: data.Message }

        data.CompanyRiskExpandCollapse = data.fxList && data.fxList.length > 0 ? "" : "未命中";
        data.CompanyRiskTable = this.SetItemResults(data.fxList);

        data.CompanyQueryCountRiskExpandCollapse = data.cxList && data.cxList.length > 0 ? "" : "未命中";
        data.CompanyQueryCountRiskTable = this.SetItemResults(data.cxList);
        return data;
    }

    //交叉验证
    GetFraudVerify(id, actionType, data) {
        const queryString = "?applyId=" + data.EntityData.OrderCode;
        this.DvaActions.Dispatch("AntiFraudService", "GetFraudVerify", { PathQuery: queryString, Action: this.GetAction(id, actionType) });
    }

    SetGetFraudVerify(id, actionType, data) {
        data = this.SetApiResponse(data);

        if (data.IsSuccess === false) return { UserDataRiskExpandCollapse: data.Message, OperateRiskExpandCollapse: data.Message, SimilarRiskExpandCollapse: data.Message }

        data.UserDataRiskExpandCollapse = data.userData && data.userData.length > 0 ? "" : "未命中";

        data.OperateRiskExpandCollapse = data.operate && data.operate.length > 0 ? "" : "未命中";

        data.SimilarRiskExpandCollapse = data.similar && data.similar.length > 0 ? "" : "未命中";

        return data;
    }
}