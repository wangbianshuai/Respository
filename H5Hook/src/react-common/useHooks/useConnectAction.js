import { useState, useEffect, useMemo } from "react";
import Actions from "Actions";
import { Common } from "UtilsCommon";

function Init(obj, name, options) {
    if (!obj.IsInit) obj.IsInit = true; else return;
    
    obj.Name = options ? options.Name : name
    obj.ActionTypes = Actions.GetActionTypes(obj.Name);

    obj.Receive = Receive(obj);
    obj.Invoke = Invoke(obj);

    Actions.InitAction(name, options);
    Actions.Receive(obj.Name, obj.Id, obj.Receive);

    return obj;
}

function Receive(obj) {
    return (actionType, data) => {
        if (obj.IsDestory) return;
        if (data && data.Action && data.Data) data = data.Data;
        obj.actionData = { ...obj.actionData };
        obj.actionData[actionType] = data;
        obj.setActionData(obj.actionData);
    }
}

function Invoke(obj) {
    return (actionType, data) => {
        try {
            Actions.Invoke(obj.Id, actionType, data);
        }
        catch (err) {
            obj.Receive(actionType, { IsSuccess: false, Message: err.message })
        }
    }
}

function Destory(obj) {
    obj.IsDestory = true;
    Actions.RemoveReceive(obj.Name, obj.Id);
}

export default (name, options) => {
    const [actionData, setActionData] = useState({});
    const obj = useMemo(() => { return { IsDestory: false, Id: Common.CreateGuid() } }, []);

    Init(obj, name, options);

    obj.actionData = actionData;
    obj.setActionData = setActionData;

    useEffect(() => { return () => Destory(obj) }, [obj])

    return [obj.Invoke, obj.ActionTypes, actionData]
}