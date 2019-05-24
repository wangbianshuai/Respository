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
        if (this.DvaActions.SetStateActionTypes) this.DvaActions.SetStateActionTypes(this.GetStateActionTypes());
    }

    Invoke(id, actionType, data) {
    }

    Dispatch(id, actionType, data) {
        data = this.SetResponseData(id, actionType, data);
        if (data === false) return;
        if (id && this.Receives[id]) this.Receives[id](actionType, data);
        else for (let key in this.Receives) this.Receives[key](actionType, data);
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
        return data;
    }

    Receive(id, fn) {
        this.Receives[id] = fn;
    }

    InitDvaActions(dvaActions) {
        this.DvaActions = dvaActions;
        return this.GetStateActionTypes();
    }

    GetStateActionTypes() {
        return {}
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