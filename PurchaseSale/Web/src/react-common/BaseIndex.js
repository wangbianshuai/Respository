import { Component } from "react"
import { Common, Page, AjaxRequest, EnvConfig } from "UtilsCommon";
import $ from "jquery";
import EventActions from "EventActions"
import { Modal, message } from "antd";
import router from 'umi/router';

export default class BaseIndex extends Component {
    constructor(props) {
        super(props)

        this.Id = Common.CreateGuid();

        this.InitSet();
    }

    InitSet() {
        this.Token = Common.GetCookie("Token");
    }

    Invoke() {
        return (name) => this[name] ? this[name].bind(this) : function () { };
    }

    Dispatch(name, actionName, payload) {
        let isloading = true;
        payload = payload || {};

        const action = this.GetModelAction(name, actionName);
        if (action !== null) {
            if (action.IsOperation) this.SetActionState(name, actionName);
        }
        else return Promise.reject({ IsSuccess: false, Message: `${name}/${actionName}方法不存在！` });

        if (action.IsToken && !payload.Token) payload.Token = this.Token;
        if (action.IsLoading === false) isloading = false;
        return this.props.Dispatch(name + "/" + actionName, payload, isloading);
    }

    DispatchAction(name, actionName, payload) {
        return this.Dispatch(name, actionName, payload).then(res => Promise.resolve(res), res => Promise.resolve(res));
    }

    SetActionState(name, actionName, payload) {
        return this.props.Dispatch(name + "/Set_" + actionName, payload)
    }

    GetStateValue(stateName) {
        return this.props[stateName];
    }

    GetModelAction(name, actionName) {
        const _models = this.props.App ? this.props.App._models : window.g_app ? window.g_app._models : null;
        if (!_models) return null;
        const model = Common.ArrayFirst(_models, f => f.namespace === name);
        if (model && model.actions) return Common.ArrayFirst(model.actions, f => f.ActionName === actionName);
        return null;
    }

    JudgeChanged(nextProps, name) {
        return nextProps[name] !== undefined && !Common.IsEquals(nextProps[name], this.props[name])
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

    InitInvokeActionList(actions, payload) {
        for (let key in actions) this.InvokeActionList(key, actions[key], payload[key] || {}, payload.Token);
    }

    SetDisplay(name, isVisible, show) {
        show = show || "block";
        const hide = "none", _display = this.state[name];
        let display = _display;
        if (isVisible && display === hide) display = show;
        else if (!isVisible && display === show) display = hide;
        if (display !== _display) this.setState({ [name]: display });
    }

    InputChange(key) {
        return (e) => this.setState({ [key]: e.target.value });
    }

    CheckboxChange(key) {
        return (e) => this.setState({ [key]: e.target.checked });
    }

    GetHeight(name) {
        const ele = this.refs[name];
        if (!ele) return 0;

        return $(ele).height() || 0;
    }

    GetPropsValue(key, defaultValue) {
        const value = this.props[key]
        return value && value.IsSuccess !== false ? value : defaultValue;
    }

    IsSuccessProps(key) {
        const value = this.props[key]
        return value && value.IsSuccess !== false;
    }

    IsSuccessNextsProps(obj) {
        let isSuccess = obj && obj.IsSuccess !== false;
        if (isSuccess && obj.code !== undefined) isSuccess = Common.GetIntValue(obj.code) === 0;
        if (!isSuccess && obj.message) {
            if (this.Alert) this.Alert(obj.message);
            else alert(obj.message);
        }
        return isSuccess;
    }

    IsSuccessNextsProps2(obj) {
        return obj && obj.IsSuccess !== false;
    }

    shouldComponentUpdate(nextProps, nextState) {
        let blChanged = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined && !Common.IsFunction(nextProps[key]) && this.props[key] !== nextProps[key]) {
                blChanged = true;
                break;
            }
        }

        if (blChanged) {
            blChanged = this.ReceiveActionData(nextProps);
        }

        if (!blChanged) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key] && !Common.IsFunction(nextState[key])) {
                    blChanged = true; break;
                }
            }
        }
        blChanged = !!blChanged;
        return blChanged;
    }

    ReceiveActionData(nextProps) {
        let blChanged = true;
        if (this.ActionTypes) {
            let name = "", value = 0;
            for (let key in this.ActionTypes) {
                name = `Receive${key}`;
                value = this.ActionTypes[key];
                if (nextProps[value] !== this.props[value]) {
                    if (this[name]) blChanged = this[name](nextProps[value]);
                    else if (this.EventActions.Receives[value]) blChanged = this.EventActions.Receives[value](nextProps[value]);
                }

            }
        }
        return blChanged;
    }

    JudgeLogin() {
        if (!this.Token) this.ToLogin();
    }

    ToLogin() {
        router.push("/login")
    }

    ShowMessage(msg) {
        message.warning(msg, 3)
    }

    GetConfig() {
        window.PageConfigs = window.PageConfigs || {};
        if (!window.PageConfigs[this.Name]) {
            const name = this.Name.replace("_", "/");
            var url = `/configs/${name}.json`
            if (EnvConfig.Env === "local") url = "/configs/getconfig?name=" + this.Name;

            AjaxRequest.GetRequest(url, {}, (res) => {
                if (res.IsSuccess === false) this.Alert(res.Message)
                else window.PageConfigs[this.Name] = res;
            }, false);
        }
        if (window.PageConfigs[this.Name]) this.PageConfig = Common.Clone(window.PageConfigs[this.Name]);
    }

    InitEventAction() {
        this.PageConfig = {};
        this.GetConfig();
        if (!this.ActionTypes) {
            if (!this.PageConfig.ActionOptions) this.ActionTypes = this.props.GetActionTypes(this.Name);
            else this.ActionTypes = this.PageConfig.ActionOptions.ActionTypes;
        }
        this.PageData = Common.GetQueryString();
        this.PageData.Token = this.Token;
        this.AsyncRequest = {};
        this.AsyncRequestFunction = {};

        this.EventActions = {
            Page: Page.Current, GetActionTypes: this.props.GetActionTypes, GetRight: this.GetRight.bind(this),
            SetModalDialog: Page.Current.Invoke("RootPage", "SetModalDialog"), GetProperty: this.GetProperty.bind(this),
            Controls: [], InvokeAction: this.InvokeEventAction.bind(this), GetFunction: this.GetFunction.bind(this),
            GetAction: this.GetEventAction.bind(this), Components: [], GetViewProperty: this.GetViewProperty.bind(this),
            GetView: this.GetView.bind(this), OpenPage: this.OpenPage.bind(this), ShowMessage: this.ShowMessage.bind(this),
            Alert: this.Alert.bind(this), Confirm: this.Confirm.bind(this), AlertSuccess: this.AlertSuccess.bind(this),
            Receives: {}, ToPage: this.ToPage.bind(this), PageData: this.PageData, GetLoginUserId: this.GetLoginUserId.bind(this),
            GetControl: this.GetControl.bind(this), GetComponent: this.GetComponent.bind(this),
            Invoke: this.props.Invoke, PageConfig: this.PageConfig, ActionTypes: this.ActionTypes,
            GetAsyncRequest: this.GetAsyncRequest.bind(this), SetAsyncRequest: this.SetAsyncRequest.bind(this)
        };
        for (let key in EventActions) this.EventActions[key] = new EventActions[key]();
    }

    GetLoginUserId() {
        if (!this.UserId) this.UserId = Common.GetStorage("LoginUserId");
        return this.UserId;
    }

    GetAsyncRequest(name) {
        return this.AsyncRequest[name];
    }

    SetAsyncRequest(name, fn) {
        this.AsyncRequestFunction[name] = fn
    }

    GetProperty(name) {
        let p = this.GetControl(name);
        if (!p) p = this.GetComponent(name);
        if (!p) p = this.GetViewProperty(this.PageConfig, name);
        return p;
    }

    GetRight(name) {

        return true;
    }

    GetFunction(name) {
        if (!name || !this[name]) return null;
        return (params) => this[name](params);
    }

    GetView(name) {
        return this.GetViewProperty(this.PageConfig, name);
    }

    GetViewProperty(view, name) {
        if (view.Name === name) return view;

        if (view.Properties) {
            let v = null;
            for (let i = 0; i < view.Properties.length; i++) {
                v = this.GetViewProperty2(view.Properties[i], name);
                if (v !== null) break;
            }
            if (v != null) return v;
        }
        if (this.PageConfig.DialogViews) {
            let v = null;
            for (let i = 0; i < this.PageConfig.DialogViews.length; i++) {
                v = this.GetViewProperty2(this.PageConfig.DialogViews[i], name);
                if (v !== null) break;
            }
            if (v != null) return v;
        }
        return null;
    }

    GetViewProperty2(view, name) {
        if (view.Name === name) return view;

        if (view.Properties) {
            let v = null;
            for (let i = 0; i < view.Properties.length; i++) {
                v = this.GetViewProperty2(view.Properties[i], name);
                if (v !== null) break;
            }
            return v;
        }

        return null;
    }

    ToPage(url) {
        router.push(url);
    }

    OpenPage(url) {
        let index = url.indexOf("?");
        if (index > 0) {
            url = url.substring(0, index) + ".html" + url.substring(index)
        }
        else url = ".html";

        window.open(url);
    }

    Alert(msg, title) {
        if (window.IsModalInfo) return;
        window.IsModalInfo = true;
        Modal.info({
            title: title || "提示",
            content: msg,
            onOk: () => {
                window.IsModalInfo = false;
            }
        });
    }

    AlertSuccess(msg, onOk) {
        Modal.success({
            title: msg,
            onOk: onOk
        });
    }

    Confirm(msg, onOk) {
        Modal.confirm({
            title: msg,
            onOk: onOk
        });
    }

    GetControl(name) {
        return Common.ArrayFirst(this.EventActions.Controls, (f) => f.Name === name);
    }

    GetComponent(name) {
        return Common.ArrayFirst(this.EventActions.Components, (f) => f.Name === name);
    }

    InvokeEventAction(name, props) {
        const e = this.EventActions.GetAction(name);
        if (e != null) {
            if (e.IsAsync) {
                e.AsyncRequest = this.GetAsyncRequest(e.Name);
                if (e.AsyncRequest) e.Invoke(props, e);
                else this.SetAsyncRequest(e.Name, (request) => {
                    e.AsyncRequest = request;
                    e.Invoke(props, e);
                });
            }
            else e.Invoke(props, e);
        }
    }

    GetEventAction(name) {
        if (this[name]) return { Invoke: (a, b) => this[name](a, b) };

        const { EventActions } = this.PageConfig;
        if (EventActions) {
            const e = Common.ArrayFirst(EventActions, (f) => f.Name === name);
            if (e != null && e.Invoke === undefined) {
                e.Invoke = (() => {
                    const names = e.Type.split("/");
                    const n1 = names[0], n2 = names[1];
                    if (this.EventActions[n1] && this.EventActions[n1][n2]) return (a, b) => this.EventActions[n1][n2](a, b);
                    else return function () { }
                })();
            }
            return e;
        }
        return null;
    }
}