import BaseIndex from "../../BaseIndex";

export default class HouseInfo extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Loan_HouseInfo";
        this.MinActionType = 200;
        this.MaxActionType = 299;

        this.Init();
    }

    GetStateActionTypes() {
        const { GetEntityData, SaveEntityData } = this.ActionTypes;

        return {
            EntityData: [GetEntityData],
            SaveEntityData: [SaveEntityData]
        }
    }

    Invoke(id, actionType, data) {
        const { GetEntityData, SaveEntityData } = this.ActionTypes;

        switch (actionType) {
            case GetEntityData: this.GetEntityData(id, actionType, data); break;
            case SaveEntityData: this.SaveEntityData(id, actionType, data); break;
            default: this.Dispatch(id, actionType, data); break;
        }
    }

    SetResponseData(id, actionType, data) {
        const { GetEntityData } = this.ActionTypes;

        switch (actionType) {
            case GetEntityData: return this.SetGetEntityData(id, actionType, data);
            default: return this.SetApiResponse(data);
        }
    }

    //获取实体数据
    GetEntityData(id, actionType, data) {
        this.Dispatch(id, actionType, data);
    }

    //保存实体数据
    SaveEntityData(id, actionType, data) {

    }

    //设置获取实体数据,如果没有数据结构映射处理，不需此方法。
    SetGetEntityData(id, actionType, data) {
        data = this.SetApiResponse(data);
        return data;
    }

}