import { useState, useEffect, useMemo } from "react";
import DataActions from "DataActions";
import { Common } from "UtilsCommon";

//初始化
function init(obj, name, options, dispatch, dispatchAction, setActionState) {
  if (!name) return;
  if (!obj.isInit) obj.isInit = true; else return;

  obj.name = options ? options.name : name;
  if (options) obj.actionTypes = options.actionTypes;
  else obj.actionTypes = DataActions.getActionTypes(obj.name);

  obj.receive = receive(obj);
  obj.invoke = invoke(obj);

  DataActions.initAction(name, { dispatch, dispatchAction, setActionState }, options);
  DataActions.receive(obj.name, obj.id, obj.receive);

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
      DataActions.invoke(obj.id, actionType, data);
    }
    catch (err) {
      console.warn('page-common/useHooks/useConnectDataAction/invoke', err)
      obj.receive(actionType, { isSuccess: false, message: err.message })
    }
  }
}

//销毁，断开与Actions连接
function destory(obj) {
  obj.isDestory = true;
  DataActions.removeReceive(obj.name, obj.id);
}

export default (dispatch, dispatchAction, setActionState, name, options) => {
  const [actionData, setActionData] = useState({});
  const obj = useMemo(() => { return { isDestory: false, id: Common.createGuid() } }, []);

  init(obj, name, options, dispatch, dispatchAction, setActionState);

  obj.actionData = actionData;
  obj.setActionData = setActionData;

  useEffect(() => { return () => destory(obj) }, [obj]);

  return [obj.invoke, obj.actionTypes, actionData];
}
