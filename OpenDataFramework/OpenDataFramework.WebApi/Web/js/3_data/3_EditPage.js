((ns) => {

    ns.data.Index.InitEditPageEntityState = (key) => {
        const sp = {}

        const initialState = {
            EditResponse: null
        }

        sp[key] = (state, action) => {
            if (!action) return initialState
            switch (action.type) {
                case `${key}_Create`:
                case `${key}_Update`:
                    state.EditResponse = action.data
                    return state
                default:
                    return state
            }
        }

        ns.data.Index.AddStatePool(sp)
    }

})($ns);