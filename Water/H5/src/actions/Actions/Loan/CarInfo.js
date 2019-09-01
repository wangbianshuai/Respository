import BaseIndex from "../../BaseIndex";
import { Common} from "UtilsCommon";

export default class CarInfo extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Loan_CarInfo";
        this.MinActionType = 600;
        this.MaxActionType = 699;

        this.Init();
    }

    GetStateActionTypes() {
        const { GetCarInfo, SaveCarInfo } = this.ActionTypes;

        return {
            CarInfo: [GetCarInfo],
            SaveCarInfo: [SaveCarInfo]
        }
    }

    Invoke(id, actionType, data) {
        const { GetCarInfo, SaveCarInfo, RemoveCarInfo } = this.ActionTypes;

        switch (actionType) {
            case GetCarInfo: this.GetCarInfo(id, actionType, data); break;
            case SaveCarInfo: this.SaveCarInfo(id, actionType, data); break;
			case RemoveCarInfo: this.RemoveCarInfo(id, actionType, data); break;
            default: this.Dispatch(id, actionType, data); break;
        }
    }

    SetResponseData(id, actionType, data) {
		// return this.SetApiResponse(data);
        const { GetCarInfo,SaveCarInfo } = this.ActionTypes;

        switch (actionType) {
            case GetCarInfo: return this.SetGetCarInfo(id, actionType, data);
			case SaveCarInfo: return this.SetSaveCarInfo(id, actionType, data);
            default: return this.SetApiResponse(data);
        }
    }

    //获取
	GetCarInfo(id, actionType, data) {
		data = {};
		this.DvaActions.Dispatch("UserCenterService", "GetLoanCarInfo", { data: data, Action: this.GetAction(id, actionType) });
    }
	
	
	RemoveCarInfo(id, actionType, data){
		this.DvaActions.Dispatch("UserCenterService", "RemoveLoanCarInfo", {PathQuery: "?id="+data.id, data:{}, Action: this.GetAction(id, actionType) });
	}
	
    //保存
	SaveCarInfo(id, actionType, data) {
		let  { EntityData } = data;
		let itemData = {cars:[]};
		EntityData.CarList.forEach((a)=>{
			let obj = {};
			if (!Common.IsNullOrEmpty(a.numberPlate)) obj.numberPlate = a.numberPlate;
			if (!Common.IsNullOrEmpty(a.carType)) obj.carType = a.carType;
			if (!Common.IsNullOrEmpty(a.ower)) obj.ower = a.ower;
			if (!Common.IsNullOrEmpty(a.owerHomeAddress)) obj.owerHomeAddress = a.owerHomeAddress;
			if (!Common.IsNullOrEmpty(a.useType)) obj.useType = a.useType;
			if (!Common.IsNullOrEmpty(a.brandModel)) obj.brandModel = a.brandModel;
			if (!Common.IsNullOrEmpty(a.vehicleId)) obj.vehicleId = a.vehicleId;
			if (!Common.IsNullOrEmpty(a.engineId)) obj.engineId = a.engineId;
			if (!Common.IsNullOrEmpty(a.registrationDate)) obj.registrationDate = a.registrationDate;
			if (!Common.IsNullOrEmpty(a.issueDate)) obj.issueDate = a.issueDate;
			if (!Common.IsEmptyObject(obj)) itemData.cars.push(obj)
		});
		
		if (itemData.cars.length <= 1){
			const obj = itemData.cars[0];
			if (Common.IsEmptyObject(obj)) {
				this.Dispatch(id, actionType, { IsSuccess: false, Message: '请至少输入一项内容保存' })
				return
			}
		}
		this.DvaActions.Dispatch("UserCenterService", "SaveLoanCarInfo", { data: itemData, Action: this.GetAction(id, actionType) });
    }
	
	SetSaveCarInfo(id, actionType, data){
		data = this.SetApiResponse(data);
		if (data.IsSuccess === true){
			window.setTimeout(() => {
				const { GetCarInfo } = this.ActionTypes;
				this.GetCarInfo(id, GetCarInfo, {});
			}, 500);
		}
		return data;
	}
	
	SetGetCarInfo(id, actionType, data){
		data = this.SetApiResponse(data);
		if (data.IsSuccess === false){
			return data
		}else {
			let itemData = {CarList: []};
			if (data.length > 0) {
				itemData.CarList = data;
				data.map((a, i) => {
					itemData.CarList[i]["Id"] = Common.CreateGuid();
					itemData.CarList[i]["Title"] = '车产信息' + this.GetLenName(i);
					return true
				});
				// return itemData
			} else{
				itemData.CarList[0] = {};
				itemData.CarList[0]["Id"] = Common.CreateGuid();
				itemData.CarList[0]["Title"]= '车产信息'+ this.GetLenName(0);
			}
			return itemData
		}
	}
	
	GetLenName(len) {
		if (len === 0) return "一";
		else if (len === 1) return "二";
		else if (len === 2) return "三";
		else if (len === 3) return "四";
		else if (len === 4) return "五";
		
		return len + 1;
	}
}