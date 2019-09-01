import BaseIndex from "../../BaseIndex";
import { Common, Validate } from "UtilsCommon";

export default class RealNameAuth extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Company_RealNameAuth";
        this.MinActionType = 500;
        this.MaxActionType = 599;

        this.Init();
    }

    GetStateActionTypes() {
        const {DoCompanyRealname,EnterpriseOpenAcntProgressQuery} = this.ActionTypes;

        return {
            SaveEntityData: [DoCompanyRealname],
            GetEntityData: [EnterpriseOpenAcntProgressQuery],
        }
    }

    Invoke(id, actionType, data) {
        const {DoCompanyRealname, EnterpriseOpenAcntProgressQuery, userInfoRate} = this.ActionTypes;

        switch (actionType) {
            case DoCompanyRealname:
                this.DoCompanyRealname(id, actionType, data);
                break;
            case EnterpriseOpenAcntProgressQuery:
                this.EnterpriseOpenAcntProgressQuery(id, actionType, data);
                break;
			case userInfoRate:
				this.userInfoRate(id, actionType, data);
				break;
            default:
                this.Dispatch(id, actionType, data);
                break;
        }
    }

    SetResponseData(id,actionType, data) {
        const { DoCompanyRealname } = this.ActionTypes;
        switch (actionType) {
            case DoCompanyRealname:
                return this.SetDoCompanyRealname(data);
            default:
                return this.SetApiResponse(data);

        }
    }

    EnterpriseOpenAcntProgressQuery(id, actionType, data) {
        this.DvaActions.Dispatch("UserCenterService", "EnterpriseOpenAcntProgressQuery", { data: {}, Action: this.GetAction(id, actionType) });
    }
	
	userInfoRate(id, actionType, data){
		this.DvaActions.Dispatch("UserCenterService", "userInfoRate", { data: {}, Action: this.GetAction(id, actionType) });
	}
	
    SetDoCompanyRealname(data) {
        if (data.IsSuccess === false) data.IsValidate = false;
        let isToArtificial = false;
        if (data.Action) isToArtificial = data.Action.isToArtificial;

        if (data.Data && Common.GetIntValue(data.Data.code) === "-4") return { IsSuccess: false, isToArtificial, Code: -4, Message: data.Data.message }
        
		data = this.SetApiResponse(data);
        data.isToArtificial = isToArtificial;
        return data;
    }

    DoCompanyRealname(id, actionType, data) {
    	console.log(data.isToArtificial)
        let msg = this.ValidateName(data.realName);
        if (!msg) msg = this.ValidateIdNumber(data.idCardNumber);
        if (data.isToArtificial) {
            if (!msg && Common.IsNullOrEmpty(data.positivePicID)) msg = "请上传身份证正面照片";
            if (!msg && Common.IsNullOrEmpty(data.negativePicID)) msg = "请上传身份证反面照片";
        }

        if (msg) {this.Dispatch(id, actionType, { IsSuccess: false, Message: msg })}
        else {
            const methodName = data.isToArtificial ? "DoManualCompanyRealname" : "DoCompanyRealname";
            const action = this.GetAction(id, actionType);
            action.isToArtificial = data.isToArtificial;
            delete data.isToArtificial;
            this.DvaActions.Dispatch("UserCenterService", methodName, { data: data, Action: action });
        }
    }

    ValidateName(value) {
        let msg = "";

        if (Common.IsNullOrEmpty(value)) msg = "请输入法人真实姓名";

        return msg;
    }

    ValidateIdNumber(value) {
        let msg = "";

        if (Common.IsNullOrEmpty(value)) msg = "请输入法人身份证号码";

        if (!msg) {
            let res = Validate.ValidateIdentityCard(value);
            if (res !== true) msg = res;
        }

        return msg;
    }

}
