import { Common } from "UtilsCommon";
import { useSelector, useDispatch } from "dva";
import { useMemo } from "react";

export default (mapStateToProps, token) => {
    const props = useSelector((state) => MapStateToProps(state, mapStateToProps(state)));

    const dispatch = useDispatch();

    const obj = useMemo(() => { return {} }, []);

    Init(obj, dispatch, token);

    return [obj.Dispatch, obj.DispatchAction, obj.SetActionState, props];
}

function Init(obj, dispatch, token) {
    if (!obj.IsInit) obj.IsInit = true; else return;

    obj.Dispatch = Dispatch(dispatch, token);
    obj.DispatchAction = DispatchAction(dispatch, token);
    obj.SetActionState = SetActionState(dispatch);
}

function MapStateToProps(state, props) {
    let loading = false;
    for (let key in state) if (state[key].Loading) { loading = true; break; }
    props.Loading = loading

    return props;
}

function Dispatch(dispatch, token) {
    return (name, actionName, payload) => {
        let isloading = true;
        payload = payload || {};

        const action = GetModelAction(name, actionName);
        if (action !== null) {
            if (action.IsOperation) SetActionState(dispatch)(name, actionName);
        }
        else return Promise.reject({ IsSuccess: false, Message: `${name}/${actionName} the method doesn't exist!` });

        if (action.IsToken && !payload.Token) payload.Token = token;
        if (action.IsLoading === false) isloading = false;
        return dispatch({ type: name + "/" + actionName, payload, isloading });
    }
}

function DispatchAction(dispatch, token) {
    return (name, actionName, payload) => {
        return Dispatch(dispatch, token)(name, actionName, payload).then(res => Promise.resolve(res), res => Promise.resolve(res));
    }
}

function SetActionState(dispatch) {
    return (name, actionName, payload) => {
        return dispatch({ type: name + "/Set_" + actionName, payload })
    }
}

function GetModelAction(name, actionName) {
    const _models = window.g_app ? window.g_app._models : null;
    if (!_models) return null;
    const model = Common.ArrayFirst(_models, f => f.namespace === name);
    if (model && model.actions) return Common.ArrayFirst(model.actions, f => f.ActionName === actionName);
    return null;
}