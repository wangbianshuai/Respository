import { useMemo, useEffect } from "react";
import { Common, PageCommon } from "UtilsCommon";
import { EnvConfig } from "Configs";

export default (state, dispatchActionData) => {
  const obj = useMemo(() => ({}), []);

  if (!obj.getStateValue) obj.getStateValue = (name) => state[name];

  useEffect(() => {
    let blChanged = false;
    if (obj.state === undefined) { initState(state, dispatchActionData); blChanged = true; }
    else blChanged = shouldComponentUpdate(state, obj.state, dispatchActionData);

    blChanged && !EnvConfig.isProd && console.log(state);

    obj.state = state;
  }, [state, obj, dispatchActionData])

  return [obj.getStateValue]
}

function shouldComponentUpdate(nextState, state, stateActionTypes) {
  //Show while loading
  if (nextState.loading !== state.loading) PageCommon.setLoading(nextState);

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
    PageCommon.toLogin();
    return true;
  }

  if (d && !d.action && d && d.isSuccess === false && d.message) {
    PageCommon.showMessage(d.message);
    return true;
  }

  return false
}

function receiveState(nextState, state, dispatchActionData) {
  for (let key in nextState) {
    if (nextState[key] !== state[key]) dispatchActionData(key, nextState[key]);
  }
}

function initState(state, dispatchActionData) {
  for (let key in state) {
    dispatchActionData(key, state[key]);
  }
}

