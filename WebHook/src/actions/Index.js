import GetActionTypes from "./ActionTypes/Index";
import { Common } from "UtilsCommon";

const _ActionList = [];

/*
options:{Name:"action name",ServiceName:"service name",MaxActionType:" max action type value",
MinActionType:"min action type value",ActionTypes:"action type value collection object"}
*/
function InitAction(name, options) {
    const actionName = options ? options.Name : name;
    const action = GetActionByName(actionName)
    if (action) return;

    name = name.replace("_", "/");
    const Action = require(`./Actions/${name}`).default;
    options = options || {};
    _ActionList.push(new Action({ GetActionTypes, InvokeAction: Invoke, DispatchAction: DispatchAction, DvaActions: _DvaActions, ...options }));
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

function DispatchAction(id, actionType, data) {
    const action = GetAction(actionType);
    if (action) {
        id = data.Action && data.Action.Id ? data.Action.Id : id;
        action.Dispatch(id, actionType, data);
    }
}

function Dispatch(actionType, data) {
    DispatchAction("", actionType, data);
}

function Receive(name, id, fn) {
    const action = GetActionByName(name)
    if (action) action.Receive(id, fn);
}

function RemoveReceive(name, id) {
    const action = GetActionByName(name)
    if (action) action.RemoveReceive(id);
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
    RemoveReceive,
    InitDvaActions,
    Dispatch
};