import { Common } from "UtilsCommon";

export default class Index {
    constructor(props) {
        for (let key in props) this[key] = props[key];
        this.Receives = {};
        this.MinActionType = 0;
        this.MaxActionType = 0;
    }

    Init() {
        this.ActionTypes = this.GetActionTypes(this.Name);
        this.ActionTypeKeys = this.GetActionTypeKeys();
        if (this.DvaActions.SetStateActionTypes) this.DvaActions.SetStateActionTypes(this.GetStateActionTypes());
    }

    GetActionTypeKeys() {
        const actionTypeKeys = {};
        for (let key in this.ActionTypes) actionTypeKeys[this.ActionTypes[key]] = key;
        return actionTypeKeys;
    }

    Invoke(id, actionType, data) {
        const key = this.ActionTypeKeys[actionType];
        if (this[key]) this[key](id, actionType, data);
        else this.Dispatch(id, actionType, data);
    }

    Dispatch(id, actionType, data) {
        data = this.SetResponseData(id, actionType, data);
        if (data === false) return;
        if (id && this.Receives[id]) this.Receives[id](actionType, data);
        else for (let key in this.Receives) this.Receives[key](actionType, data);
    }

    SetSearchQueryResponse(data) {
        data = this.SetApiResponse(data);
        if (data.IsSuccess !== false) {
            const PageRecord = 100;
            const DataList = data;
            return { PageRecord, DataList }
        }
        return data;
    }

    SetApiResponse(data) {
        if (data.Action && data.Data) {
            data = data.Data;
            if (data.code !== undefined) {
                if (Common.GetIntValue(data.code) === 0) return { IsSuccess: true, Data: data }
                else return { IsSuccess: false, Message: data.message }
            }
        }
        return data;
    }

    SetResponseData(id, actionType, data) {
        const key = "Set" + this.ActionTypeKeys[actionType];
        if (this[key]) return this[key](id, actionType, data);
        else return this.SetApiResponse(data);
    }

    Receive(id, fn) {
        this.Receives[id] = fn;
    }

    InitDvaActions(dvaActions) {
        this.DvaActions = dvaActions;
        return this.GetStateActionTypes();
    }

    GetStateActionTypes() {
        const stateActionTypes = {};
        for (let key in this.ActionTypes) stateActionTypes[key] = [this.ActionTypes[key]];

        return stateActionTypes;
    }

    GetAction(id, actionType) {
        return { Id: id, ActionType: actionType, Time: new Date().getTime() };
    }

    JudgeNullable(data, entity) {
        var msg = "";
        for (var key in entity) {
            if (Common.IsNullOrEmpty(data[key])) {
                msg = entity[key];
                break;
            }
        }
        return msg;
    }
}