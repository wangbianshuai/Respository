import { EnvConfig } from "Configs";
import Service from "./services/index";

export default (config) => {
  const actionList = config.actionList || [];
  const service = Service(config.serviceName, EnvConfig.getServiceUrl(config.serviceName));

  const state = {};
  const effects = {};
  const reducers = {};

  actionList.forEach(a => {
    //state
    state[a.stateName] = a.defaultValue;
    state[a.stateName + '_loading'] = false;
    //effects
    if (a.isRequest === false) effects[a.actionName] = invokeAction(a.actionName);
    else effects[a.actionName] = invokeService(service(a), a.actionName);
    //reducers
    setState(reducers, a.actionName, a.stateName)
  });

  return { namespace: config.name, state, effects, reducers, actions: actionList };
}

function invokeService(fn, type) {
  return function* ({ payload, isloading }, { call, put }) {
    if (isloading !== false) yield put({ type: type + "_changeLoading", payload: true });

    let action = null;
    if (payload.action) action = payload.action;

    let response = yield call(fn, payload);

    if (action && response !== undefined) {
      if (response && response.isSuccess === false) response.action = action;
      else response = { action, data: response };
    }

    if (isloading !== false) yield put({ type: type + "_changeLoading", payload: false });

    yield put({ type: `set_${type}`, payload: response });

    return response;
  }
}

function setState(reducers, actionName, stateName) {
  const key = `set_${actionName}`;

  reducers[key] = (state, action) => {
    state = { ...state };

    state[stateName] = action.payload;

    return state
  }

  reducers[actionName + '_changeLoading'] = (state, action) => {
    state = { ...state };

    state[stateName + '_loading'] = action.payload;

    return state
  }
}

function invokeAction(type) {
  return function* ({ payload }, { put }) {
    yield put({ type: `set_${type}`, payload: payload })
  }
}
