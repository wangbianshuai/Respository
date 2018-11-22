import { Component } from "react"
import { Common, Cache, EnvConfig } from "UtilsCommon";

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.state = {};

        this.Id = Common.CreateGuid();

        if (props.Page) props.Page.Model = this.GetModel();
    }

    GetModel() {
        return {
            title: this.GetTitle(),
            keywords: "新新贷，P2P网贷，P2P理财，投资理财，网上理财，新元宝，月月派，新手专享，投融资，贷款，企业贷款，无抵押小额贷款，借款",
            description: "新新贷是中国专业的互联网金融P2P网络借贷信息中介平台，为出借人和借款人提供省心的互联网金融信息服务。资金银行存管、严格的风控体系、信息披露透明等多重安全保障措施。"
        }
    }

    GetTitle() {
        return "【新新贷官网】专业透明的P2P网络借贷平台，P2P网贷，网上贷款借款、投融资信息中介平台"
    }

    GetPcBuildUrl() {
        return EnvConfig.GetClientBuildUrl();
    }

    static MapDispatchToProps(dispatch) {
        return {
            Dispatch(type, payload, isloading, callback) { dispatch({ type, payload, isloading, callback }) }
        }
    }

    static Dispatch(app, name, actionName, payload) {
        return new Promise((resolve, reject) => {
            try {
                const action = Index.GetModelAction(app, name, actionName);
                if (action === null) reject(`${name}/${actionName}方法不存在！`)

                app._store.dispatch({ type: name + "/" + actionName, payload, isloading: false, callback: (res) => resolve(res) });

                setTimeout(() => reject(`调用${name}/${actionName}请求数据超时！`), 3000);
            }
            catch (err) { reject(err); }
        });
    }

    static GetModelAction(app, name, actionName) {
        const model = Common.ArrayFirst(app._models, f => f.namespace === name);
        if (model && model.actions) return Common.ArrayFirst(model.actions, f => f.ActionName === actionName);
        return null;
    }

    SyncDispatch(name, actionName, payload) {
        return new Promise((resolve, reject) => {
            try {
                const action = this.GetModelAction(name, actionName);
                if (action === null) reject("行为方法不存在！")

                this.Dispatch(name, actionName, payload, (res) => resolve(res));
            }
            catch (err) { reject(err); }
        });
    }

    Dispatch(name, actionName, payload, callback) {
        let isloading = true;

        const action = this.GetModelAction(name, actionName);
        if (action !== null) {
            if (action.IsOperation) this.SetActionState(name, actionName);
            else isloading = !(this.props[action.StateName] !== undefined && this.props[action.StateName].IsSuccess !== false)
        }
        else return;

        this.props.Dispatch(name + "/" + actionName, payload, isloading, callback)
    }

    SetActionState(name, actionName, payload) {
        this.props.Dispatch(name + "/Set_" + actionName, payload)
    }

    componentWillReceiveProps(nextProps) {
        this.SetLoading(nextProps)
        this.PropsChanged(nextProps)
    }

    PropsChanged(nextProps) {
    }

    GetPropsValue(key, idName, defaultValue) {
        const value = this.props[key]
        return value && value[idName] ? value : defaultValue;
    }

    SetLoading(nextProps) {
        //if (nextProps.Loading) Toast.loading("加载中……", 0)
        //else if (nextProps.Loading === false) Toast.hide()
    }

    SetResponseMessage(d, stateName) {
        if (d && d.IsSuccess === false && d.Message) {
            this.ShowMessage(d.Message);
            return true;
        }

        return false
    }

    ShowConfirm(msg, onOk) {
        // Modal.alert({
        //     title: "确认信息",
        //     content: msg,
        //     onOk: onOk
        // });
    }

    ShowMessage(msg) {
        //Toast.fail(msg, 3)
    }

    ShowSuccess(msg) {
        // Modal.alert({
        //     title: "成功信息",
        //     content: msg,
        //     okText: "确定"
        // })
    }

    ShowModalMessage(msg) {
        // Modal.alert({
        //     title: "提示信息",
        //     content: msg,
        //     okText: "确定"
        // });
    }

    GetModelAction(name, actionName) {
        const model = Common.ArrayFirst(this.props.App._models, f => f.namespace === name);
        if (model && model.actions) return Common.ArrayFirst(model.actions, f => f.ActionName === actionName);
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        let blChangedProps = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined) {
                if (this.props[key] !== nextProps[key]) {
                    blChangedProps = true;

                    if (this.SetResponseMessage(nextProps[key], key)) blChangedProps = false;

                    if (blChangedProps) break;
                }
            }
        }

        if (!blChangedProps) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key]) { blChangedProps = true; break; }
            }
        }

        return blChangedProps;
    }

    JudgeChanged(nextProps, name) {
        return nextProps[name] !== undefined && !Common.IsEquals(nextProps[name], this.props[name])
    }

    static DispatchSetState(app, name, actionName, payload) {
        app._store.dispatch({ type: `${name}/Set_${actionName}`, payload })
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

    InvokeActionList(name, actionNameList, payload, token) {
        const validate = payload.ActionValidate || function () { return true };
        actionNameList.forEach(a => {
            let p = payload[a] || {};
            p.Token = token;
            const action = this.GetModelAction(name, a);
            if (action === null) return;
            const s = action.StateName;

            if ((!this.props[s] || this.props[s].IsSuccess === false) && validate(a, p)) this.Dispatch(name, a, p);
        });
    }

    static InitInvokeActionList(app, actions, payload) {
        let list = [];

        for (let key in actions) list = list.concat(Index.InvokeActionList(app, key, actions[key], payload[key] || {}, payload.Token, payload.UserAgent));

        return list;
    }

    InitInvokeActionList(actions, payload) {
        for (let key in actions) this.InvokeActionList(key, actions[key], payload[key] || {}, payload.Token);
    }

    JudgeLogin() {
        return this.props.UserInfo && this.props.UserInfo.userid;
    }
}