import Service from "../services/Index";
import { EnvConfig } from "UtilsCommon";

export default class Index {
    constructor(config) {
        this.namespace = config.Name;
        this.GetServiceUrl = config.ServiceName ? EnvConfig.GetServiceUrl(config.ServiceName) : null;
        this.state = { Loading: false }

        this.Service = new Service(config.ActionList, this.GetServiceUrl, config.ServiceName);

        this.ActionList = []
        if (config.ActionList) {
            this.ActionList = config.ActionList
            config.ActionList.forEach(a => this.state[a.StateName] = a.DefaultValue)
        }

        this.Init()
    }

    Init() {
        this.effects = this.GetEffects()
        this.reducers = this.GetReducers()

        this.subscriptions = {
            setup({ dispatch, history }) {
            }
        }
    }

    InvokeService(fn, type) {
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

    InvokeAction(type) {
        return function* ({ payload }, { call, put }) {
            yield put({ type: `Set_${type}`, payload: payload })
        }
    }

    GetEffects() {
        const obj = {}

        this.ActionList.forEach(a => {
            if (a.IsRequest === false) obj[a.ActionName] = this.InvokeAction(a.ActionName)
            else obj[a.ActionName] = this.InvokeService(this.Service[a.ActionName], a.ActionName)
        })

        return obj
    }

    ChangeLoading(state, action) {
        return {
            ...state,
            Loading: action.payload
        }
    }

    GetReducers() {
        const obj = {}

        obj.ChangeLoading = this.ChangeLoading

        this.ActionList.forEach(a => {
            const key = `Set_${a.ActionName}`
            obj[key] = (state, action) => {
                state = { ...state }

                const fnName = `Set${a.ActionName}`

                if (this[fnName]) state[a.StateName] = this[fnName](state, action)
                else state[a.StateName] = action.payload

                return state
            }
        });

        return obj
    }
}