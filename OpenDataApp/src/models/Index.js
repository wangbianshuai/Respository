export default class Index {
    constructor() {
        this.Service = {}
        this.ActionList = []
        this.namespace = ""
        this.state = { Loading: false }
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
        return function* ({ payload }, { call, put }) {
            yield put({ type: "ChangeLoading", payload: true })

            const response = yield call(fn, payload)

            yield put({ type: "ChangeLoading", payload: false })

            yield put({ type: `Set_${type}`, payload: response })
        }
    }

    GetEffects() {
        const obj = {}

        this.ActionList.forEach(a => {
            obj[a.ActionName] = this.InvokeService(this.Service[a.ActionName], a.ActionName)
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

    AddAction(actonName, stateName, defaultValue) {
        this.state[stateName] = defaultValue
        this.ActionList.push({ ActionName: actonName, StateName: stateName })
    }
}

Index.ToModels = (obj) => {
    return {
        namespace: obj.namespace,
        state: obj.state,
        effects: obj.effects,
        reducers: obj.reducers,
        subscriptions: obj.subscriptions
    }
}