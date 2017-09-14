((ns) => {

    ns.data.Index.InitListPageEntityState = (key) => {
        const sp = {}

        const initialState = {
            QueryResponse: null,
            DeleteResponse: null,
            ListEditResponse: null
        }

        sp[key] = (state, action) => {
            if (!action) return initialState
            switch (action.type) {
                case `${key}_Search_Data`:
                    state.QueryResponse = action.data
                    return state
                case `${key}_Delete`:
                    state.DeleteResponse = action.data
                    return state
                case `${key}_Update`:
                    state.ListEditResponse = action.data
                    return state
                default:
                    return state
            }
        }

        ns.data.Index.AddStatePool(sp)
    }

})($ns);