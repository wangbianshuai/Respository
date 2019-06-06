import { Common } from "UtilsCommon";

export default class Index {
    static MapDispatchToProps(dispatch) {
        return {
            Dispatch(type, payload, isloading) { return dispatch({ type, payload, isloading }) }
        }
    }

    static MapStateToProps(state, ownProps, props) {
        let loading = false;
        for (let key in state) {
            if (state[key].Loading) { loading = true; break; }
        }
        props.Loading = loading
        
        return props;
    }

    static Dispatch(app, name, actionName, payload) {
        const action = Index.GetModelAction(app, name, actionName);
        if (action === null) Promise.reject({ IsSuccess: false, Message: `${name}/${actionName}方法不存在！` });

        return app._store.dispatch({ type: name + "/" + actionName, payload, isloading: false });
    }

    static GetModelAction(app, name, actionName) {
        const model = Common.ArrayFirst(app._models, f => f.namespace === name);
        if (model && model.actions) return Common.ArrayFirst(model.actions, f => f.ActionName === actionName);
        return null;
    }

    static DispatchSetState(app, name, actionName, payload) {
        return app._store.dispatch({ type: `${name}/Set_${actionName}`, payload })
    }

}