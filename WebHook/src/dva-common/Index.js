import Service from "./services/Index";
import { EnvConfig } from "UtilsCommon";

export default (config) => {
    const actionList = config.ActionList || [];
    const service = Service(config.ServiceName, EnvConfig.GetServiceUrl(config.ServiceName));

    const state = { Loading: false };
    const effects = {};
    const reducers = { ChangeLoading };

    actionList.forEach(a => {
        //state
        state[a.StateName] = a.DefaultValue;
        //effects
        if (a.IsRequest === false) effects[a.ActionName] = InvokeAction(a.ActionName);
        else effects[a.ActionName] = InvokeService(service(a), a.ActionName);
        //reducers
        SetState(reducers, a.ActionName, a.StateName)
    });

    return { namespace: config.Name, state, effects, reducers, actions: actionList };
}

function InvokeService(fn, type) {
    return function* ({ payload, isloading }, { call, put }) {
        if (isloading !== false) yield put({ type: "ChangeLoading", payload: true });

        let action = null;
        if (payload.Action) action = payload.Action;

        let response = yield call(fn, payload);

        if (action && response !== undefined) {
            if (response && response.IsSuccess === false) response.Action = action;
            else response = { Action: action, Data: response };
        }

        if (isloading !== false) yield put({ type: "ChangeLoading", payload: false });

        yield put({ type: `Set_${type}`, payload: response });

        return response;
    }
}

function SetState(reducers, actionName, stateName) {
    const key = `Set_${actionName}`;

    reducers[key] = (state, action) => {
        state = { ...state };

        state[stateName] = action.payload;

        return state
    }
}

function ChangeLoading(state, action) {
    return {
        ...state,
        Loading: action.payload
    }
}

function InvokeAction(type) {
    return function* ({ payload }, { call, put }) {
        yield put({ type: `Set_${type}`, payload: payload })
    }
}