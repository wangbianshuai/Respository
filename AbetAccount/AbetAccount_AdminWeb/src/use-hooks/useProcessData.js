import { useMemo, useEffect } from "react";
import DataActions from "DataActions";
import { Common, PageCommon } from "UtilsCommon";
import { EnvConfig } from "Configs";

export default (state) => {
  const obj = useMemo(() => ({}), []);

  if (!obj.getStateValue) obj.getStateValue = (name) => state[name];

  useEffect(() => {
    let blChanged = false;
    if (obj.state === undefined) { initState(state); blChanged = true; }
    else blChanged = shouldComponentUpdate(state, obj.state);

    blChanged && !EnvConfig.isProd && console.log(state);

    obj.state = state;
  }, [state, obj])

  return [obj.getStateValue]
}

function shouldComponentUpdate(nextState, state, stateActionTypes) {
  //Show while loading
  if (nextState.loading !== state.loading) PageCommon.setLoading(nextState.loading);

  let blChangedState = false;

  for (let key in nextState) {
    if (nextState[key] !== undefined && !Common.isFunction(nextState[key]) && state[key] !== nextState[key]) {
      blChangedState = true;

      if (setResponseMessage(nextState[key])) blChangedState = false;

      if (blChangedState) break;
    }
  }

  if (blChangedState) receiveState(nextState, state, stateActionTypes);

  return blChangedState;
}

function setResponseMessage(d) {
  var data = d.data ? d.data : d;
  if (Common.isArray(data) && data.length > 0) data = data[0];
  if (data && data.isReLogin && data.isSuccess === false && !PageCommon.isLoginPage()) {
    PageCommon.showMessage(data.message, () => PageCommon.toLogin());
    return true;
  }

  if (d && !d.action && d && d.isSuccess === false && d.message) {
    PageCommon.showMessage(d.message);
    return true;
  }

  return false
}

//分发行为数据
function dispatchActionData(data) {
  if (!data) return;
  if (data.action && data.action.actionType > 0) DataActions.dispatch(data.action.actionType, data);
}

function receiveState(nextState, state) {
  for (let key in nextState) {
    if (nextState[key] !== state[key]) dispatchActionData(nextState[key]);
  }
}

function initState(state) {
  for (let key in state) {
    dispatchActionData(state[key]);
  }
}

