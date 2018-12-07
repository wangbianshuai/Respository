import { Component } from "react"
import { Common } from "UtilsCommon";
import $ from "jquery";

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.Id = Common.CreateGuid();
    }

    Invoke() {
        return (name) => this[name] ? this[name].bind(this) : Function();
    }

    Dispatch(name, actionName, payload) {
        let isloading = true;

        const action = this.GetModelAction(name, actionName);
        if (action !== null) {
            if (action.IsOperation) this.SetActionState(name, actionName);
            else isloading = !(this.props[action.StateName] !== undefined && this.props[action.StateName].IsSuccess !== false);
        }
        else return Promise.reject({ IsSuccess: false, Message: `${name}/${actionName}方法不存在！` });

        return this.props.Dispatch(name + "/" + actionName, payload, isloading);
    }

    DispatchAction(name, actionName, payload) {
        return this.Dispatch(name, actionName, payload).then(res => Promise.resolve(res), res => Promise.resolve(res));
    }

    SetActionState(name, actionName, payload) {
        return this.props.Dispatch(name + "/Set_" + actionName, payload)
    }

    GetModelAction(name, actionName) {
        const model = Common.ArrayFirst(this.props.App._models, f => f.namespace === name);
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

    GetMenuStatus() {
        const { IsInvestQTDS, IsInvestRRY, IsInvestBBGS, IsInvestXSB } = this.props;
        const isInvestQTDS = IsInvestQTDS && IsInvestQTDS.isInvestProduct === true;
        const isInvestRRY = IsInvestRRY && IsInvestRRY.isInvestProduct === true;
        const isInvestBBGS = IsInvestBBGS && IsInvestBBGS.isInvestProduct === true;
        const isInvestXSB = IsInvestXSB && IsInvestXSB.isInvestProduct === true;
        return { isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB };
    }

    GetHeight(name) {
        const ele = this.refs[name];
        if (!ele) return 0;

        return $(ele).height() || 0;
    }

    SetMenuMinHeight() {
        this.MenuElement && this.MenuElement.SetMinHeight(this.GetHeight("RightContent"));
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
        return obj && obj.IsSuccess !== false;
    }
}