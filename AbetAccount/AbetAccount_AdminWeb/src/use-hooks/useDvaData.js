import { useMemo } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Common } from 'UtilsCommon';

export default (mapStateToProps) => {
  const props = useSelector((state) => mapStateToProps(state));

  const dispatch = useDispatch();

  const obj = useMemo(() => { return {} }, []);

  init(obj, dispatch);

  return [obj.dispatch, obj.dispatchAction, obj.setActionState, props];
}

function init(obj, dispatch) {
  if (!obj.isInit) obj.isInit = true; else return;

  obj.dispatch = getDispatch(dispatch);
  obj.dispatchAction = dispatchAction(dispatch);
  obj.setActionState = setActionState(dispatch);
}

function getDispatch(dispatch) {
  return (name, actionName, payload) => {
    let isloading = true;
    payload = payload || {};

    const action = getModelAction(name, actionName);
    if (action !== null) {
      if (action.isOperation) setActionState(dispatch)(name, actionName);
    }
    else return Promise.reject({ isSuccess: false, message: `${name}/${actionName} the method doesn't exist!` });

    const token = Common.getStorage('token');

    if (action.isToken && !payload.token) payload.token = token;
    if (action.isLoading === false) isloading = false;
    return dispatch({ type: name + '/' + actionName, payload, isloading });
  }
}

function dispatchAction(dispatch) {
  return (name, actionName, payload) => {
    return getDispatch(dispatch)(name, actionName, payload).then(res => Promise.resolve(res), res => Promise.resolve(res));
  }
}

function setActionState(dispatch) {
  return (name, actionName, payload) => {
    return dispatch({ type: name + '/set_' + actionName, payload })
  }
}

function getModelAction(name, actionName) {
  const _models = window.g_app ? window.g_app._models : null;
  if (!_models) return null;
  const model = Common.arrayFirst(_models, f => f.namespace === name);
  if (model && model.actions) return Common.arrayFirst(model.actions, f => f.actionName === actionName);
  return null;
}
