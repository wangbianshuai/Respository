((ns) => {
    const StatePool = [], ConnectPool = [], StateData = {}

    ns.data.Index = class Index {

        static AddStatePool(state) {
            Index.SetState(state)
            StatePool.push(state)
        }

        static SetState(state, action) {
            for (let key in state) {
                StateData[key] = state[key](StateData[key], action)
            }
        }

        static GetState() {
            return StateData
        }

        static Dispatch(action) {
            StatePool.forEach((s) => Index.SetState(s, action))
            ConnectPool.forEach((c) => c(StateData))
        }

        static Connect(c) {
            c(StateData)
            ConnectPool.push(c)
        }

        static GetStateValue(state, key, name, currentValue) {
            if (state[key]) {
                const value = state[key][name]
                if (currentValue !== value) { return Promise.resolve(value) }
            }
            return Promise.resolve(null)
        }
    }

})($ns);