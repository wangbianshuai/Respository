import { useState, useEffect, useMemo } from "react";
import Actions from "Actions";
import { Common } from "UtilsCommon";

//初始化
function init(obj, name, options, dispatch, dispatchAction, setActionState) {
  if (!name) return;
  if (!obj.isInit) obj.isInit = true; else return;

  obj.name = options ? options.name : name;
  if (options) obj.actionTypes = options.actionTypes;
  else obj.actionTypes = Actions.getActionTypes(obj.name);

  obj.receive = receive(obj);
  obj.invoke = invoke(obj);

  Actions.initAction(name, options);
  Actions.receive(obj.name, obj.id, obj.receive);
  obj.dispatchActionData = dispatchActionData(Actions.initDvaActions({ dispatch, dispatchAction, setActionState }));

  return obj;
}

//接收行为数据
function receive(obj) {
  return (actionType, data) => {
    if (obj.isDestory) return;
    if (data && data.action && data.data) data = data.data;
    obj.actionData = { ...obj.actionData };
    obj.actionData[actionType] = data;
    obj.setActionData(obj.actionData);
  }
}

//调用行为
function invoke(obj) {
  return (actionType, data) => {
    try {
      Actions.invoke(obj.id, actionType, data);
    }
    catch (err) {
      console.warn('page-common/useHooks/useConnectAction/invoke', err)
      obj.receive(actionType, { isSuccess: false, message: err.message })
    }
  }
}

//销毁，断开与Actions连接
function destory(obj) {
  obj.isDestory = true;
  Actions.removeReceive(obj.name, obj.id);
}

//分发行为数据
function dispatchActionData(stateActionTypes) {
  return (key, data) => {
    if (!data) return;
    if (data.action && data.action.actionType > 0) Actions.dispatch(data.action.actionType, data);
    else if (stateActionTypes && stateActionTypes[key]) stateActionTypes[key].forEach(a => Actions.dispatch(a, data));
  }
}

export default (name, options) => {
  const [actionData, setActionData] = useState({});
  const obj = useMemo(() => { return { isDestory: false, id: Common.createGuid() } }, []);

  init(obj, name, options);

  obj.actionData = actionData;
  obj.setActionData = setActionData;

  useEffect(() => { return () => destory(obj) }, [obj]);

  return [obj.invoke, obj.actionTypes, actionData, obj.dispatchActionData];
}
