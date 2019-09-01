import BaseIndex from "../../BaseIndex";
import { Common, Validate} from "UtilsCommon";

export default class BasicInfo extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Company_BasicInfo";
        this.MinActionType = 700;
        this.MaxActionType = 799;

        this.Init();
    }

    GetStateActionTypes() {
        const {GetCompanyInfo,GetAllIndustry, SaveCompanyInfo} = this.ActionTypes;

        return {
            GetCompanyInfo: [GetCompanyInfo],
            GetAllIndustry: [GetAllIndustry],
            SaveCompanyInfo: [SaveCompanyInfo]
        }
    }

    Invoke(id, actionType, data) {
        const {GetCompanyInfo,GetAllIndustry, SaveCompanyInfo, GetIndustryLeveOne, GetIndustryLeveTwo, GetIndustryLeveThree, GetIndustryLeveFour} = this.ActionTypes;
        switch (actionType) {
            case GetCompanyInfo:
                this.GetCompanyInfo(id, actionType, data);
                break;
            case GetAllIndustry:
                this.GetAllIndustry(id, actionType, data);
                break;
            case SaveCompanyInfo:
                this.SaveCompanyInfo(id, actionType, data);
                break;
			case GetIndustryLeveOne:
				this.GetIndustryLeveOne(id, actionType, data);
				break;
			case GetIndustryLeveTwo:
				this.GetIndustryLeveTwo(id, actionType, data);
				break;
			case GetIndustryLeveThree:
				this.GetIndustryLeveThree(id, actionType, data);
				break;
			case GetIndustryLeveFour:
				this.GetIndustryLeveFour(id, actionType, data);
				break;
            default:
                this.Dispatch(id, actionType, data);
                break;
        }
    }

    SetResponseData(id, actionType, data) {
        const { GetAllIndustry, SaveCompanyInfo} = this.ActionTypes;
		
        switch (actionType) {
            case GetAllIndustry: return this.SetGetAllIndustry(data);
			
            case SaveCompanyInfo: return this.SetSaveCompanyInfo(data);
			// case GetCompanyInfo: return this.SetGetCompanyInfo(data);
            default: return this.SetApiResponse(data);
        }
    }

    GetCompanyInfo(id, actionType, data) {
        const token = Common.GetCookie("LoanToken");

        this.DvaActions.Dispatch("UserCenterService", "GetCompanyBasicInfo", { data: data, Token: token, Action: this.GetAction(id, actionType) });
    }

    SaveCompanyInfo(id, actionType, data) {
        let  EntityData  = data;
        EntityData = this.ValidateUserData(EntityData);

        if (EntityData.IsSuccess === false) this.Dispatch(id, actionType, EntityData);
        else {
            const token = Common.GetCookie("LoanToken");

            this.DvaActions.Dispatch("UserCenterService", "SaveCompanyBasicInfo", { data: EntityData, Token: token, Action: this.GetAction(id, actionType) });
        }
    }

    SetSaveCompanyInfo(data) {
    	
        if (data.IsSuccess === false) data.IsValidate = false;

        if (data.Data && Common.GetIntValue(data.Data.code) === "-4") return { IsSuccess: false, Code: -4, Message: data.Data.message }
        
        data = this.SetApiResponse(data);

        return data;
    }
	
	// SetGetCompanyInfo(data){
    	// data = this.SetApiResponse(data);
    	//
	// 	return data
	// }
	
    //处理行业类型数据
    SetIndustryActions(data) {
        const { SetIndustry } = this.ActionTypes;

        const id = data.Id;
        this.Dispatch(id, SetIndustry, data);
    }
	
	//公司信息门类
	GetIndustryLeveOne(id, actionType, data){
		const action = this.GetAction(id, actionType);
		
		this.DvaActions.Dispatch("UserCenterService", "GetIndustryLeveOne", { data: {}, Action: action }, false);
	}
	
	GetIndustryLeveTwo(id, actionType, data){
		const action = this.GetAction(id, actionType);
		if(Common.IsNullOrEmpty(data)) return;
		
		const url = `industry/leveTwo?parentCode=` + data;
		this.DvaActions.Dispatch("UserCenterService", "GetIndustryLeveTwo", {Url: url,  Action: action }, false);
	}
	
	GetIndustryLeveThree(id, actionType, data){
		const action = this.GetAction(id, actionType);
		if(Common.IsNullOrEmpty(data)) return;
		
		const url = `industry/leveThree?parentCode=` + data;
		this.DvaActions.Dispatch("UserCenterService", "GetIndustryLeveThree", {Url: url,  Action: action }, false);
	}
	
	GetIndustryLeveFour(id, actionType, data) {
		
		const action = this.GetAction(id, actionType);
		if(Common.IsNullOrEmpty(data)) return;
		
		const url = `industry/leveFour?parentCode=` + data;
		this.DvaActions.Dispatch("UserCenterService", "GetIndustryLeveFour", {Url: url, Action: action}, false);
	}
	

    ValidateUserData(data) {
        if (data.IsSuccess === false) return data;

        let msg = ""

        //公司电话
        if (!msg && data.companyPhoneNumber) {
            let res = Validate.ValidateHomePhone(data.companyPhoneNumber);
            if (res !== true) res = Validate.ValidateMobile(data.companyPhoneNumber);
            if (res !== true) msg = "公司电话需是固定电话或手机格式！"
        }
        
		// if (Common.IsNullOrEmpty(data.buslicenseUrlId)) msg = "请上传营业执照照片";
        
        //电子邮箱
        if (data.email) {
            let res = Validate.ValidateEmail(data.email);
            if (res !== true) msg = res;
        }

        if (!msg && data.companyAddrTimeLimitStart && data.companyAddrTimeLimitEnd && data.companyAddrTimeLimitStart >= data.companyAddrTimeLimitEnd) {
            msg = "单位租赁有效期开始日期不能大于或等于结束日期";
        }
	
		if (!msg && data.legalPersonPhone) {
			let res = Validate.ValidateMobile(data.legalPersonPhone);
			if (res !== true) msg = res;
		}

        if (msg) return { IsSuccess: false, Message: msg }

        return data;
    }
	
}

