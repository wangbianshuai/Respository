import { useState, useMemo, useCallback, useEffect } from "react";
import Actions from "Actions";
import { Common } from "UtilsCommon";

function Init(obj, name, options, receive) {
    if (!obj.IsInit) {
        obj.IsInit = true;
        obj.Name = options ? options.Name : name
        Actions.InitAction(name, options);
        Actions.Receive(obj.Name, obj.Id, (actionType, data) => receive(actionType, data));
    }
}

function Receive(obj, actionData, setActionData) {
    return useCallback((actionType, data) => {
        if (obj.IsDestory) return;
        if (data && data.Action && data.Data) data = data.Data;
        const currentActionData = { ...actionData };
        currentActionData[actionType] = data;
        setActionData(currentActionData);
    }, [obj, actionData, setActionData]);
}

function Invoke(obj) {
    return useCallback((actionType, data) => {
        try {
            Actions.Invoke(obj.Id, actionType, data);
        }
        catch (err) {
            receive(actionType, { IsSuccess: false, Message: err.message })
        }
    }, [obj]);
}

function Destory(obj) {
    obj.IsDestory = true;
    Actions.RemoveReceive(obj.Name, obj.Id);
}

export default (name, WrapComponent, options) => props => {
    const [actionData, setActionData] = useState({});
    const obj = useMemo(() => { return { IsDestory: false, Id: Common.CreateGuid(), IsInit: false } }, []);

    const receive = Receive(obj, actionData, setActionData)

    Init(obj, name, options, receive);

    const invoke = Invoke(obj);

    useEffect(() => { return Destory }, [obj])

    return <WrapComponent {...props} Invoke={invoke} GetActionTypes={Actions.GetActionTypes} {...actionData} />
}