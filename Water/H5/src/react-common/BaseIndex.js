import {Component} from "react"
import {Common, Page} from "UtilsCommon";
import $ from "jquery";
import EventActions from "EventActions"
import PageConfig from "Configs";
import {Toast, Modal} from "antd-mobile";
import router from 'umi/router';
import JsBridge from 'JsBridge'

export default class BaseIndex extends Component {
    constructor(props) {
        super(props)

        this.Id = Common.CreateGuid();

        this.InitSet();
    }

    InitSet() {
        this.QueryString = Common.GetQueryString();

        if (this.QueryString.token) {
            this.Token = this.QueryString.token;
            Common.SetCookie("Token", this.Token);
        } else {
        	this.Token = Common.GetCookie("Token");
		}
    }

    Invoke() {
        return (name) => this[name] ? this[name].bind(this) : function () {
            };
    }

    Dispatch(name, actionName, payload) {
        let isloading = true;
        payload = payload || {};

        const action = this.GetModelAction(name, actionName);
        if (action !== null) {
            if (action.IsOperation) this.SetActionState(name, actionName);
        }
        else return Promise.reject({IsSuccess: false, Message: `${name}/${actionName}方法不存在！`});

        if (action.IsToken && !payload.Token) payload.Token = this.Token;
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
        const validate = payload.ActionValidate || function () {
                return true
            };
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
        if (display !== _display) this.setState({[name]: display});
    }

    InputChange(key) {
        return (e) => this.setState({[key]: e.target.value});
    }

    CheckboxChange(key) {
        return (e) => this.setState({[key]: e.target.checked});
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
            if (this.props.OperateTip) this.props.OperateTip(obj.message);
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
                    blChanged = true;
                    break;
                }
            }
        }

        return blChanged
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
        blChanged = !!blChanged;
        return blChanged;
    }

    JudgeLogin() {
        if (!this.Token) this.ToLogin();
    }

    ToLogin() {

    }

    ShowMessage(msg) {
        Toast.fail(msg, 3)
    }

    ShowInfo(msg, s) {
        Toast.info(msg, s || 2)
    }

    ShowSuccess(msg) {
        Toast.success(msg)
    }

    ToastSuccess(msg, second, onClose) {
        Toast.success(msg, second || 2, onClose);
    }

    ToastFail(msg, second, onClose) {
        Toast.fail(msg, second || 2, onClose);
    }
    
    ToastLoaing(msg, duration, onClose){
		Toast.loading(msg||'',duration || 3, onClose)
	}
	
	ToastLoaingClose(){
		Toast.hide()
	}

    InitEventAction() {
        this.ActionTypes = this.props.GetActionTypes(this.Name);
        this.PageConfig = Common.Clone(PageConfig(this.Name));
        this.PageData = Common.GetQueryString();
		this.Bridge = JsBridge();
		
        this.EventActions = {
            Page: Page.Current,
            GetActionTypes: this.props.GetActionTypes,
            SetModalDialog: Page.Current.Invoke("RootPage", "SetModalDialog"),
            Controls: [],
            InvokeAction: this.InvokeEventAction.bind(this),
            GetAction: this.GetEventAciton.bind(this),
            Components: [],
            GetViewProperty: this.GetViewProperty.bind(this),
            GetView: this.GetView.bind(this),
            OpenPage: this.OpenPage.bind(this),
            Alert: this.Alert.bind(this),
            Confirm: this.Confirm.bind(this),
            AlertSuccess: this.AlertSuccess.bind(this),
            Receives: {},
            ToPage: this.ToPage.bind(this),
            PageData: this.PageData,
            GetClassName: this.GetClassName.bind(this),
            GetControl: this.GetControl.bind(this),
            GetComponent: this.GetComponent.bind(this),
            Invoke: this.props.Invoke,
            PageConfig: this.PageConfig,
            ActionTypes: this.ActionTypes
        };
        for (let key in EventActions) this.EventActions[key] = new EventActions[key]();
    }

    GetClassName(name) {
        if (!this.Styles) return name;
        const names = name.split(" ");
        if (names.length > 1) {
            return names.map(m => this.Styles[m] || m).join(" ");
        }
        return this.Styles[name] || name;
    }

    GetView(name) {
        return this.GetViewProperty(this.PageConfig, name);
    }

    GetViewProperty(view, name) {
        if (view.Name === name) return view;

        if (view.Properties) {
            let v = null;
            for (let i = 0; i < view.Properties.length; i++) {
                v = this.GetViewProperty(view.Properties[i], name);
                if (v !== null) {
                    break;
                }
            }
            return v;
        }
        return null;
    }

    ToPage(url) {
        router.push(url);
    }
    
    ToGoBack(){
		router.goBack();
	}

    OpenPage(url) {
        let index = url.indexOf("?");
        if (index > 0) {
            url = url.substring(0, index) + ".html" + url.substring(index)
        }
        else url = ".html";

        window.open(url);
    }

    ToRem(px) {
        return parseFloat((px * 1.0000) / 32).toFixed(4) + "rem";
    }

    Alert(msg) {
        Toast.info(msg, 2);
    }

    AlertSuccess(msg) {
        Toast.success(msg, 2);
    }

    Confirm(msg, onOk) {
        const alert2 = Modal.alert("确认信息",
            msg,
            [{text: '取消', onPress: () => alert2.close(), style: 'default'},
                {text: '确认', onPress: onOk}]
        );
    }

    GetControl(name) {
        return Common.ArrayFirst(this.EventActions.Controls, (f) => f.Name === name);
    }

    GetComponent(name) {
        return Common.ArrayFirst(this.EventActions.Components, (f) => f.Name === name);
    }

    InvokeEventAction(name, props) {
        const e = this.EventActions.GetAction(name);
        if (e != null) e.Invoke(props, e);
    }

    GetEventAciton(name) {
        if (this[name]) return {Invoke: (a, b) => this[name](a, b)};

        const {EventActions} = this.PageConfig;
        if (EventActions) {
            const e = Common.ArrayFirst(EventActions, (f) => f.Name === name);
            if (e != null && e.Invoke === undefined) {
                e.Invoke = (() => {
                    const names = e.Type.split("/");
                    const n1 = names[0], n2 = names[1];
                    if (this.EventActions[n1] && this.EventActions[n1][n2]) return (a, b) => this.EventActions[n1][n2](a, b);
                    else return function () {
                    }
                })();
            }
            return e;
        }
        return null;
    }
}