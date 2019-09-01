import BaseIndex from "../../BaseIndex";
import { Common, Validate} from "UtilsCommon";


export default class BasicInfo extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Loan_BasicInfo";
        this.MinActionType = 300;
        this.MaxActionType = 399;

        this.Init();
    }

    GetStateActionTypes() {
        const {GetUserInfo, SaveEntityData} = this.ActionTypes;

        return {
            GetUserInfo: [GetUserInfo],
            SaveEntityData: [SaveEntityData]
        }
    }

    Invoke(id, actionType, data) {
        const {GetUserInfo, SaveEntityData} = this.ActionTypes;

        switch (actionType) {
            case GetUserInfo:
                this.GetUserInfo(id, actionType, data);
                break;
            case SaveEntityData:
                this.SaveEntityData(id, actionType, data);
                break;
            default:
                this.Dispatch(id, actionType, data);
                break;
        }
    }

    GetUserInfo(id, actionType, data) {
        data = {};
        const token = Common.GetCookie("LoanToken");

        this.DvaActions.Dispatch("UserCenterService", "GetLoanBasicInfo", { data: data, Token: token, Action: this.GetAction(id, actionType) });
    }
	
	//保存数据
	SaveEntityData(id, actionType, data) {
    	console.log(data)
		let  { EntityData }= data;

		EntityData = this.ValidateUserData(EntityData);

		if (EntityData.IsSuccess === false) this.Dispatch(id, actionType, EntityData);
		else {
			const token = Common.GetCookie("LoanToken");

			this.DvaActions.Dispatch("UserCenterService", "SaveLoanBasicInfo", { data: EntityData, Token: token, Action: this.GetAction(id, actionType) });
		}
	}
	

    ValidateUserData(data) {
        if (data.IsSuccess === false) return data;

        let msg = ""

        //公司电话
        if (!msg && data.mobileDesc) {
            let res = Validate.ValidateMobile(data.mobileDesc);
            if (res !== true) msg = "请输入借款人常用手机号！"
        }

        //电子邮箱
        if (data.email) {
            let res = Validate.ValidateEmail(data.email);
            if (res !== true) msg = res;
        }

        if (!msg && data.homeAddrTimeLimitStart && data.homeAddrTimeLimitEnd && data.homeAddrTimeLimitStart >= data.homeAddrTimeLimitEnd) {
            msg = "居住地租赁有效期开始日期不能大于或等于结束日期";
        }

        if (msg) return { IsSuccess: false, Message: msg }

        return data;
    }

}
