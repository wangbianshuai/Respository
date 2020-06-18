import { useMemo, useEffect, useCallback } from "react";
import { Common } from "UtilsCommon";
import { EnvConfig } from "Configs";
import Actions from "Actions";
import useDvaData from "./useDvaData";

export default (mapStateToProps, props) => {
  const [dispatch, dispatchAction, setActionState, state] = useDvaData(mapStateToProps);

  const obj = useMemo(() => ({}), []);

  init(obj, dispatch, dispatchAction, setActionState);

  const getStateValue = useCallback((name) => state[name], [state]);

  useEffect(() => {
    let blChanged = false;
    if (obj.state === undefined) { initProps(state, obj.stateActionTypes); blChanged = true; }
    else blChanged = shouldComponentUpdate(state, obj.state, obj.stateActionTypes);

    blChanged && !EnvConfig.isProd && console.log(state);

    obj.state = state;
  }, [state, obj])

  return [dispatch, dispatchAction, setActionState, getStateValue]
}

function init(obj, dispatch, dispatchAction, setActionState) {
  if (!obj.isInit) obj.isInit = true; else return;

  obj.stateActionTypes = {};
  Actions.initDvaActions(initDvaActions(obj, dispatch, dispatchAction, setActionState));

  return obj;
}

function initDvaActions(obj, dispatch, dispatchAction, setActionState) {
  return {
    dispatch,
    dispatchAction,
    setActionState,
    setStateActionTypes: setStateActionTypes(obj)
  }
}

function setStateActionTypes(obj) {
  return (stateActionTypes) => {
    for (var key in stateActionTypes) {
      if (!obj.stateActionTypes[key]) obj.stateActionTypes[key] = stateActionTypes[key];
      else obj.stateActionTypes[key] = obj.stateActionTypes[key].concat(stateActionTypes[key])
    }
  }
}

let loading = false;
let isShowLoading = false;

function setLoading(nextState) {
  loading = nextState.loading;
  if (nextState.loading) setTimeout(() => {
    if (loading) {
      //React.showLoading({ title: 'loading' });
      isShowLoading = true;
    }
  }, 2000);
  else if (nextState.loading === false && isShowLoading) {
    //React.hideLoading();
    isShowLoading = false;
  }
}

function isLoginPage() {
  return false;
}

function shouldComponentUpdate(nextState, state, stateActionTypes) {
  //Show while loading
  if (nextState.loading !== state.loading) setLoading(nextState);

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
  if (data && data.isReLogin && data.isSuccess === false && !isLoginPage()) {
    toLogin();
    return true;
  }

  if (d && !d.action && d && d.isSuccess === false && d.message) {
    showMessage(d.message);
    return true;
  }

  return false
}

function toLogin() {
  // React.redirectTo({
  //   url: '/pages/login'
  // });
}

function showMessage(msg) {

}

function receiveState(nextState, state, stateActionTypes) {
  for (let key in nextState) {
    if (nextState[key] !== state[key]) receiveActionData(key, nextState[key], stateActionTypes);
  }
}

function initProps(state, stateActionTypes) {
  for (let key in state) {
    receiveActionData(key, state[key], stateActionTypes);
  }
}

function receiveActionData(key, data, stateActionTypes) {
  if (!data) return;
  try {
    if (data.action && data.action.actionType > 0) Actions.dispatch(data.action.actionType, data);
    else if (stateActionTypes[key]) stateActionTypes[key].forEach(a => Actions.dispatch(a, data));
  }
  catch (err) {
    setResponseMessage({ isSuccess: false, message: err.message });
  }
}
