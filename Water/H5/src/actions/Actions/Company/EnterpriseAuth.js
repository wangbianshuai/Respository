import BaseIndex from "../../BaseIndex";
import { Common } from "UtilsCommon";

export default class EnterpriseAuth extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Company_EnterpriseAuth";
        this.MinActionType = 900;
        this.MaxActionType = 999;

        this.Init();
    }

    GetStateActionTypes() {
        const { AutoCompanyAppro, GetCompanyInfo } = this.ActionTypes;

        return {
            AutoCompanyAppro: [AutoCompanyAppro],
            ManualCompanyAppro: [AutoCompanyAppro],
            CompanyInfo: [GetCompanyInfo],
        }
    }

    Invoke(id, actionType, data) {
        const { AutoCompanyAppro, GetCompanyInfo,EnterpriseOpenAcntProgressQuery } = this.ActionTypes;

        switch (actionType) {
            case AutoCompanyAppro:
                this.AutoCompanyAppro(id, actionType, data);
                break;
            case GetCompanyInfo: this.GetCompanyInfo(id, actionType, data);
                break;
			case EnterpriseOpenAcntProgressQuery:
				this.EnterpriseOpenAcntProgressQuery(id, actionType, data);
				break;
            default:
                this.Dispatch(id, actionType, data);
                break;
        }
    }

    GetCompanyInfo(id, actionType, data) {
        data = { };
        const token = Common.GetCookie("LoanToken");

        this.DvaActions.Dispatch("UserCenterService", "GetCompanyBasicInfo", { data: data, Token: token, Action: this.GetAction(id, actionType) });
    }

    SetResponseData(id, actionType, data) {
        const { AutoCompanyAppro } = this.ActionTypes
        switch (actionType) {
            case AutoCompanyAppro: return this.SetAutoCompanyAppro(data);
            default: return this.SetApiResponse(data);
        }
    }

    SetAutoCompanyAppro(data) {
        if (data.IsSuccess === false) data.IsValidate = false;
        let isToArtificial = false;
        if (data.Action) isToArtificial = data.Action.isToArtificial;

        if (data.Data && Common.GetIntValue(data.Data.code) === "-4") return { IsSuccess: false, isToArtificial, Code: -4, Message: data.Data.message }
        if (data.Data && Common.GetIntValue(data.Data.code) === "-2") return { IsSuccess: false, isToArtificial, Code: -2, Message: data.Data.message }

        data = this.SetApiResponse(data);
        data.isToArtificial = isToArtificial;
        return data;
    }

    AutoCompanyAppro(id, actionType, data) {
        let msg = this.ValidateName(data.companyName);
        if (!msg) msg = this.ValidateIdNumber(data.buslicenseno);

        if (data.isToArtificial) {
            if (!msg && Common.IsNullOrEmpty(data.buslicense_pic)) msg = "请上传营业执照正本或副本";
        }
        if (msg) this.Dispatch(id, actionType, { IsSuccess: false, Message: msg, IsValidate: false });
        else {
            const methodName = data.isToArtificial ? "ManualCompanyAppro" : "AutoCompanyAppro";
            const action = this.GetAction(id, actionType);
            action.isToArtificial = data.isToArtificial;
            delete data.isToArtificial;

            this.DvaActions.Dispatch("UserCenterService", methodName, { data: data, Action: action });
        }
    }
	
	EnterpriseOpenAcntProgressQuery(id, actionType, data) {
		this.DvaActions.Dispatch("UserCenterService", "EnterpriseOpenAcntProgressQuery", { data: {}, Action: this.GetAction(id, actionType) });
	}
	
    ValidateName(value) {
        let msg = "";

        if (Common.IsNullOrEmpty(value)) msg = "请输入公司全称";

        return msg;
    }

    ValidateIdNumber(value) {
        let msg = "";

        if (Common.IsNullOrEmpty(value)) msg = "三证合一的统一企业信用代码";

        return msg;
    }
}