import { useMemo } from 'react';
import { useSelector, useDispatch, } from 'dva';
import { Common } from 'UtilsCommon';
import { EnvConfig } from 'Configs';

export default (app, mapStateToProps) => {
  const props = useSelector((state) => mapStateToProps(state));

  const dispatch = useDispatch();

  const obj = useMemo(() => { return {} }, []);

  init(obj, dispatch, app);

  return [obj.dispatch, obj.dispatchAction, obj.setActionState, props];
}

function init(obj, dispatch, app) {
  if (!obj.isInit) obj.isInit = true; else return;

  const token = Common.getStorage(EnvConfig.tokenKey);

  obj.dispatch = getDispatch(dispatch, token, app);
  obj.dispatchAction = dispatchAction(dispatch, token, app);
  obj.setActionState = setActionState(dispatch);
}

function getDispatch(dispatch, token, app) {
  return (name, actionName, payload) => {
    let isloading = true;
    payload = payload || {};

    const action = getModelAction(name, actionName, app);
    if (action !== null) {
      if (action.isOperation) setActionState(dispatch)(name, actionName);
    }
    else return Promise.reject({ isSuccess: false, message: `${name}/${actionName} the method doesn't exist!` });

    if ((action.isToken || action.hasToken || action.isTokenAccess) && !payload.token) {
      payload.token = token;
      payload.loginUserId = Common.getStorage('loginUserId');
    }
    if (action.isLoading === false) isloading = false;
    return dispatch({ type: name + '/' + actionName, payload, isloading });
  }
}

function dispatchAction(dispatch, token, app) {
  return (name, actionName, payload) => {
    return getDispatch(dispatch, token, app)(name, actionName, payload).then(res => Promise.resolve(res), res => Promise.resolve(res));
  }
}

function setActionState(dispatch) {
  return (name, actionName, payload) => {
    return dispatch({ type: name + '/set_' + actionName, payload })
  }
}

function getModelAction(name, actionName, app) {
  const _models = app._models;
  if (!_models) return null;
  const model = Common.arrayFirst(_models, f => f.namespace === name);
  if (model && model.actions) return Common.arrayFirst(model.actions, f => f.actionName === actionName);
  return null;
}
