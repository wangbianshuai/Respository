import BaseIndex from "../../BaseIndex";
import { Common, Validate } from "UtilsCommon";

export default class RealNameAuth extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Loan_RealNameAuth";
        this.MinActionType = 700;
        this.MaxActionType = 799;

        this.Init();
    }

    GetStateActionTypes() {
        const {DoLoanRealname,DoRealnameStatus} = this.ActionTypes;

        return {
            SaveEntityData: [DoLoanRealname],
            GetEntityData:[DoRealnameStatus]
        }
    }

    Invoke(id, actionType, data) {
        const {DoLoanRealname, DoRealnameStatus} = this.ActionTypes;

        switch (actionType) {
            case DoLoanRealname:
                this.DoLoanRealname(id, actionType, data);
                break;
			case DoRealnameStatus:
				this.DoRealnameStatus(id, actionType, data);
				break;
            default:
                this.Dispatch(id, actionType, data);
                break;
        }
    }

    SetResponseData(id,actionType, data) {
        const { DoLoanRealname } = this.ActionTypes;
        
        switch (actionType) {
            case DoLoanRealname: return this.SetDoLoanRealname(data);
            default: return this.SetApiResponse(data);
        }
    }
	
	DoRealnameStatus(id, actionType, data){
		this.DvaActions.Dispatch("UserCenterService", "RealNameStatus", { data: {}, Action: this.GetAction(id, actionType) });
	}
	

    SetDoLoanRealname(data) {
        if (data.IsSuccess === false) data.IsValidate = false;
        let isToArtificial = false;
        if (data.Action) isToArtificial = data.Action.isToArtificial;

        if (data.Data && Common.GetIntValue(data.Data.code) === "-4") return { IsSuccess: false, isToArtificial, Code: -4, Message: data.Data.message }

        data = this.SetApiResponse(data);
        data.isToArtificial = isToArtificial;
        return data;
    }

    DoLoanRealname(id, actionType, data) {
        let msg = this.ValidateName(data.realName);
        if (!msg) msg = this.ValidateIdNumber(data.idCardNumber);
        if (data.isToArtificial) {
            if (!msg && Common.IsNullOrEmpty(data.positivePicID)) msg = "请上传身份证正面照片";
            if (!msg && Common.IsNullOrEmpty(data.negativePicID)) msg = "请上传身份证反面照片";
        }

        if (msg) {this.Dispatch(id, actionType, { IsSuccess: false, Message: msg })}
        else {
            const methodName = data.isToArtificial ? "ManualRealname" : "Realname";
            data.cardType= '1';
            const action = this.GetAction(id, actionType);
            action.isToArtificial = data.isToArtificial;
            delete data.isToArtificial;
            // console.log(data)
            this.DvaActions.Dispatch("UserCenterService", methodName, { data: data, Action: action });
        }
    }

    ValidateName(value) {
        let msg = "";

        if (Common.IsNullOrEmpty(value)) msg = "请输入借款人真实姓名";

        return msg;
    }

    ValidateIdNumber(value) {
        let msg = "";

        if (Common.IsNullOrEmpty(value)) msg = "请输入借款人身份证号码";

        if (!msg) {
            let res = Validate.ValidateIdentityCard(value);
            if (res !== true) msg = res;
        }

        return msg;
    }

}
