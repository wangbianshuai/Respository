import BaseIndex from "../../BaseIndex";
// import { Common} from "UtilsCommon";

export default class ContactInfo extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Loan_ContactInfo";
        this.MinActionType = 400;
        this.MaxActionType = 499;

        this.Init();
    }

    GetStateActionTypes() {
        const {GetContactInfo, SaveContactInfo} = this.ActionTypes;

        return {
			GetContactInfo: [GetContactInfo],
            SaveContactInfo: [SaveContactInfo]
        }
    }

    Invoke(id, actionType, data) {
        const {GetContactInfo, SaveContactInfo} = this.ActionTypes;

        switch (actionType) {
            case GetContactInfo:
                this.GetContactInfo(id, actionType, data);
                break;
            case SaveContactInfo:
                this.SaveContactInfo(id, actionType, data);
                break;
            default:
                this.Dispatch(id, actionType, data);
                break;
        }
    }

    SetResponseData(id, actionType, data) {
        const {GetContactInfo} = this.ActionTypes;

        switch (actionType) {
            case GetContactInfo:
                return this.SetGetEntityData(id, actionType, data);
            default:
                return this.SetApiResponse(data);
        }
    }

    //获取实体数据
    GetContactInfo(id, actionType, data) {
		data = {};
		this.DvaActions.Dispatch("UserCenterService", "GetLoanContactInfo", { data: data, Action: this.GetAction(id, actionType) });
    }

    //保存实体数据
    SaveContactInfo(id, actionType, data) {
        // console.log(data);
		let  { EntityData } = data;
		// console.log(EntityData)
		this.DvaActions.Dispatch("UserCenterService", "SaveLoanContactInfo", { data: EntityData, Action: this.GetAction(id, actionType) });
    }

    //设置获取实体数据,如果没有数据结构映射处理，不需此方法。
    SetGetEntityData(id, actionType, data) {
        data = this.SetApiResponse(data);
        return data;
    }

}

