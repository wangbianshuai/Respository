import GetActionTypes from "./ActionTypes/Index";
import { Common } from "UtilsCommon";

const _ActionList = [];

function InitAction(name) {
    const action = GetActionByName(name)
    if (action) return;

    name = name.replace("_", "/");
    const Action = require(`./Actions/${name}`).default;
    _ActionList.push(new Action({ GetActionTypes, InvokeAction: Invoke, DispatchAction: Dispatch, DvaActions: _DvaActions }));
}

function Invoke(id, actionType, data) {
    const action = GetAction(actionType);
    if (action) action.Invoke(id, actionType, data);
}

function GetAction(actionType) {
    return Common.ArrayFirst(_ActionList, (f) => actionType >= f.MinActionType && actionType <= f.MaxActionType);
}

function GetActionByName(name) {
    return Common.ArrayFirst(_ActionList, (f) => Common.IsEquals(f.Name, name, true));
}

function Dispatch(actionType, data) {
    const action = GetAction(actionType);
    if (action) {
        const id = data.Action && data.Action.Id ? data.Action.Id : "";
        action.Dispatch(id, actionType, data);
    }
}

function Receive(name, id, fn) {
    const action = GetActionByName(name)
    if (action) action.Receive(id, fn);
}

var _DvaActions = {};

function InitDvaActions(dvaActions) {
    const stateActionTypes = {};
    _DvaActions = dvaActions;
    _ActionList.forEach(a => {
        const obj = a.InitDvaActions(dvaActions);
        for (let key in obj) {
            if (stateActionTypes[key]) stateActionTypes[key] = stateActionTypes[key].concat(obj[key]);
            else stateActionTypes[key] = obj[key];
        }
    });

    return stateActionTypes;
}

export default {
    GetActionTypes,
    InitAction,
    Invoke,
    Receive,
    InitDvaActions,
    Dispatch
};