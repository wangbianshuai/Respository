export default class Index {
    static MapDispatchToProps(dispatch) {
        return {
            Dispatch(type, payload, isloading) { return dispatch({ type, payload, isloading }) }
        }
    }

    static MapStateToProps(state, ownProps, props) {
        props.Loading = state.BizService.Loading || state.TradeCenterService.Loading
            || state.UserCenterService.Loading || state.InvestmentService.Loading
            || state.BizService2.Loading || state.XxdService.Loading;
        props.UserInfo = state.UserCenterService.UserInfo;
        props.InvestStatus = state.InvestmentService.InvestStatus;
        props.Link = state.BizService.Link;
        props.Opinion = state.BizService2.Opinion;
        props.Logout = state.XxdService.Logou;

        return props;
    }

    static MapStateToPropsForMenu(state, ownProps, props) {
        props = Index.MapStateToProps(state, ownProps, props);
        props.IsInvestBBGS = state.TradeCenterService.IsInvestBBGS;
        props.IsInvestQTDS = state.TradeCenterService.IsInvestQTDS;
        props.IsInvestRRY = state.TradeCenterService.IsInvestRRY;
        props.IsInvestXSB = state.TradeCenterService.IsInvestXSB;

        return props;
    }

    static MapActions(actions) {
        actions.BizService = actions.BizService || [];
        actions.UserCenterService = actions.UserCenterService || [];
        actions.InvestmentService = actions.InvestmentService || [];

        actions.BizService.push("GetLink");

        actions.UserCenterService.push("GetUserInfo");

        actions.InvestmentService.push("InvestStatus");

        return actions;
    }

    static MapActionsForMenu(actions) {
        actions = Index.MapActions(actions);

        actions.TradeCenterService = actions.TradeCenterService || [];
        actions.TradeCenterService = actions.TradeCenterService.concat(["IsInvestBBGS", "IsInvestQTDS", "IsInvestRRY", "IsInvestXSB"])

        return actions;
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

    static InvokeActionList(app, name, actionNameList, payload, token, ua) {
        const list = [];
        const validate = payload.ActionValidate || function () { return true };
        actionNameList.forEach(a => {
            const data = Cache.GetCache(`${name}_${a}`);
            let p = payload[a] || {};
            p.Token = token;
            p.UserAgent = ua;

            if (data !== null) Index.DispatchSetState(app, name, a, data);
            else if (validate(a, p)) list.push(Index.Dispatch(app, name, a, p));
        });

        return list;
    }

    static InitInvokeActionList(app, actions, payload) {
        let list = [];

        for (let key in actions) list = list.concat(Index.InvokeActionList(app, key, actions[key], payload[key] || {}, payload.Token, payload.UserAgent));

        return list;
    }
}