import Service from "../services/Index";
import { Common } from "UtilsCommon";

export default class Index {
    constructor(config) {
        this.namespace = config.Name
        this.state = { Loading: false }

        this.Service = new Service(config.ActionList)

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
            if (isloading !== false) yield put({ type: "ChangeLoading", payload: true })

            const response = yield call(fn, payload)

            if (isloading !== false) yield put({ type: "ChangeLoading", payload: false })

            yield put({ type: `Set_${type}`, payload: response })
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

                if (!Common.IsServer && window && window.localStorage) Common.SetStorage("DvaState", JSON.stringify(state));
                return state
            }
        });

        return obj
    }
}
