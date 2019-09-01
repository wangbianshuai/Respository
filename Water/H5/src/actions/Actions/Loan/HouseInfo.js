import BaseIndex from "../../BaseIndex";
import { Common} from "UtilsCommon";

export default class HouseInfo extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Loan_HouseInfo";
        this.MinActionType = 200;
        this.MaxActionType = 299;

        this.Init();
    }

    GetStateActionTypes() {
        const { GetHouseInfo, SaveHouseInfo } = this.ActionTypes;

        return {
			GetHouseInfo: [GetHouseInfo],
            SaveHouseInfo: [SaveHouseInfo]
        }
    }

    Invoke(id, actionType, data) {
        const { GetHouseInfo,RemoveHouseInfo, SaveHouseInfo } = this.ActionTypes;

        switch (actionType) {
            case GetHouseInfo: this.GetHouseInfo(id, actionType, data); break;
			case RemoveHouseInfo: this.RemoveHouseInfo(id, actionType, data); break;
            case SaveHouseInfo: this.SaveHouseInfo(id, actionType, data); break;
            default: this.Dispatch(id, actionType, data); break;
        }
    }

    SetResponseData(id, actionType, data) {
		const { GetHouseInfo,SaveHouseInfo } = this.ActionTypes;
	
		switch (actionType) {
			case GetHouseInfo: return this.SetGetHouseInfo(id, actionType, data);
			case SaveHouseInfo: return this.SetSaveHouseInfo(id, actionType, data);
			default: return this.SetApiResponse(data);
		}
    }

    //获取
	GetHouseInfo(id, actionType, data) {
		data = {};
		this.DvaActions.Dispatch("UserCenterService", "GetLoanHouseInfo", { data: data, Action: this.GetAction(id, actionType) });
    }
	
	RemoveHouseInfo(id, actionType, data){
		this.DvaActions.Dispatch("UserCenterService", "RemoveLoanHouseInfo", {PathQuery: "?id="+data.id, data:{}, Action: this.GetAction(id, actionType) });
	}
	
	SetSaveHouseInfo(id, actionType, data){
		data = this.SetApiResponse(data);
		if (data.IsSuccess === true){
			window.setTimeout(() => {
				const { GetHouseInfo } = this.ActionTypes;
				this.GetHouseInfo(id, GetHouseInfo, {});
			}, 500);
		}
		return data;

	}
	
    //保存
    SaveHouseInfo(id, actionType, data) {
		let { EntityData } = data;
		let itemData = {houses:[]};
		
		EntityData.HouseList.forEach((a,i)=>{
			let obj = {};
			if (!Common.IsNullOrEmpty(a.ower)) obj.ower = a.ower;
			if (!Common.IsNullOrEmpty(a.address)) obj.address = a.address;
			if (!Common.IsNullOrEmpty(a.area)) obj.area = a.area;
			
			if (!Common.IsEmptyObject(obj)) itemData.houses.push(obj)
			
		});
		
		if (itemData.houses.length <= 1){
			const obj = itemData.houses[0];
			if (Common.IsEmptyObject(obj)) {
				this.Dispatch(id, actionType, { IsSuccess: false, Message: '请至少输入一项内容保存' })
				return
			}
		}
		this.DvaActions.Dispatch("UserCenterService", "SaveLoanHouseInfo", { data: itemData, Action: this.GetAction(id, actionType) });
    }
	
	SetGetHouseInfo(id, actionType, data){
		data = this.SetApiResponse(data);
		if (data.IsSuccess === false){
			return data;
		}else{
			let itemData = {HouseList:[]};
			if(data.length>0){
				itemData.HouseList = data;
				data.map((a,i)=>{
					itemData.HouseList[i]["Id"] = Common.CreateGuid();
					itemData.HouseList[i]["Title"]= '房产信息'+ this.GetLenName(i);
					return true
				});
				// return itemData
			}else{
				itemData.HouseList[0] = {};
				itemData.HouseList[0]["Id"] = Common.CreateGuid();
				itemData.HouseList[0]["Title"]= '房产信息'+ this.GetLenName(0);
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
	
    //设置获取实体数据,如果没有数据结构映射处理，不需此方法。
    // SetGetEntityData(id, actionType, data) {
    //     data = this.SetApiResponse(data);
    //     return data;
    // }

}