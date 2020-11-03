/*
Through-page flow object.
Each component can call methods on the page through the page axis object.
*/
/*
page:{
    name, pageConfig, invokeDataAction, actionTypes, props,init,
    dispatch, dispatchAction, setActionState, getStateValue
}
props:父级页面props
*/

import { useEffect } from "react";
import { Common, PageCommon, Md5 } from 'UtilsCommon';
import { EnvConfig } from 'Configs';
import EventActions from 'EventActions';

class PageAxis {
    constructor(id, parames) {
        this.id = id;
        for (let key in parames) this[key] = parames[key];
        //接收行为数据state
        this.state = {};
        this.initSet();
        this.init && this.init();
    }

    invoke() {
        return (name) => this[name] ? this[name].bind(this) : function () { };
    }

    receiveActionData(nextState) {
        if (this.actionTypes) {
            let name = "", value = 0;
            for (let key in this.actionTypes) {
                name = `receive${key}`;
                value = this.actionTypes[key];
                if (nextState[value] !== undefined && nextState[value] !== this.state[value]) {
                    if (this[name]) this[name](nextState[value]);
                    else if (this.receives[value]) this.receives[value](nextState[value]);
                }
            }
        }
        this.state = nextState;
    }

    receiveActionDataToObject(obj, actionTypes, nextState) {
        obj.state = obj.state || {};
        let name = "", value = 0;
        for (let key in actionTypes) {
            name = `receive${key}`;
            value = actionTypes[key];
            if (nextState[value] !== undefined && nextState[value] !== obj.state[value]) {
                if (obj[name]) obj[name](nextState[value]);
                else if (this.receives[value]) this.receives[value](nextState[value]);
            }
        }
        obj.state = nextState;
    }

    judgeLogin(url) {
        if (!this.token) this.toLogin(url);
        return !!this.token
    }

    toLogin(url) {
        if (!url) url = this.props.location.pathname + this.props.location.search;
        url = `/user/login?url=${escape(url)}`;
        url = Common.addUrlRandom(url);
        this.toPage(url);
    }

    refreshPage() {
        const url = this.props.location.pathname + this.props.location.search;
        url = Common.addUrlRandom(url);
        this.toPage(url);
    }

    isLoginPage() {
        return this.props.location.pathname.toLowerCase() === '/user/login';
    }

    initSet() {
        this.pageConfig = Common.clone(this.pageConfig);

        this.modalDialog = {};

        this.loginUser = this.getLoginUser();
        this.token = Common.getStorage("token");

        this.receives = {};
        this.eventActionsConfig = Common.clone(this.pageConfig.eventActions);
        if (this.pageConfig.actionOptions) this.actionTypes = this.pageConfig.actionOptions.actionTypes;

        this.pageData = Common.getQueryString();
        this.pageData.token = this.token;
        //将pageAxis id赋值到location pageData上
        if (this.props.location && this.props.location.pageData) this.props.location.pageData.pageId = this.id;

        this.eventActions = {};
        for (let key in EventActions) this.eventActions[key] = new EventActions[key]();

        this.getOpenId();
    }

    getLoginUser = () => {
        var info = Common.getStorage("loginUserInfo");
        if (!info) return {};

        return JSON.parse(info);
    };

    setModalDialog(p) {
        this.modalDialog.add && this.modalDialog.add(p);
    }

    showMessage(msg) {
        PageCommon.showMessage(msg);
    }

    getProperty(name) {
        return this.getViewProperty(this.pageConfig, name);
    }

    getRight(name) {
        return !!name;
    }

    getFunction(name) {
        if (!name || !this[name]) return null;
        return (params) => this[name](params);
    }

    getViewProperty(view, name) {
        if (!name) return null;
        if (view.name === name) return view;

        if (view.properties) {
            let v = null;
            for (let i = 0; i < view.properties.length; i++) {
                v = this.getViewProperty2(view.properties[i], name);
                if (v !== null) break;
            }
            if (v != null) return v;
        }

        return this.getDialogViewPrpoerty(name);
    }

    getDialogViewPrpoerty(name) {
        if (this.pageConfig.dialogViews) {
            let v = null;
            for (let i = 0; i < this.pageConfig.dialogViews.length; i++) {
                v = this.getViewProperty2(this.pageConfig.dialogViews[i], name);
                if (v !== null) break;
            }
            if (v != null) return v;
        }
        return null;
    }

    getViewProperty2(view, name) {
        if (view.name === name) return view;

        if (view.properties) {
            let v = null;
            for (let i = 0; i < view.properties.length; i++) {
                v = this.getViewProperty2(view.properties[i], name);
                if (v !== null) break;
            }
            return v;
        }

        return null;
    }

    toPage(url) {
        this.props.history.push(url);
    }

    toBack() {
        this.props.history.goBack();
    }

    openPage(url) {
        window.open(url);
    }

    alert(msg, title) {
        PageCommon.alert(msg, title);
    }

    alertSuccess(msg, onOk) {
        PageCommon.alertSuccess(msg, onOk);
    }

    confirm(msg, onOk) {
        PageCommon.confirm(msg, onOk);
    }

    invokeEventAction(name, obj) {
        const e = this.getEventAction(name);
        if (e != null) e.invoke(obj, e);
    }

    getLoginUserId() {
        return this.loginUser.AdminUserId;
    }

    getEventAction(name) {
        if (this[name]) return { invoke: (a, b) => this[name](a, b) };

        if (this.eventActionsConfig) {
            const e = Common.arrayFirst(this.eventActionsConfig, (f) => f.name === name);
            if (e != null && e.invoke === undefined) {
                e.invoke = (() => {
                    const names = e.type.split("/");
                    const n1 = names[0], n2 = names[1];
                    if (this.eventActions[n1] && this.eventActions[n1][n2]) return (a, b) => this.eventActions[n1][n2](a, b);
                    else return function () { }
                })();
            }
            return e;
        }
        return null;
    }

    isSuccessProps(res) {
        return res && res.isSuccess !== false;
    }

    getOpenId() {
        this.isWeixin = Common.isWeiXin();
        if (!this.isWeixin) return;

        const wXAppID = 'wxaa64304b24432ce5';
        const companID = 9;
        this.openIdKey = Md5(wXAppID);

        this.pageData.openId = Common.getStorage(this.openIdKey);
        if (this.pageData.openId && !this.isLoginPage() && !this.token) {
            this.loginByOpenId();
            return;
        }

        let code = this.pageData.code;
        const code2 = Common.getStorage("code");
        if (code && code !== code2) {
            Common.setStorage("code", code);
            this.getOpenIdByCode(code, companID);
            return;
        }
        else if (code === code2) code = '';

        if (!this.pageData.openId && !code) {
            const wXUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
            const scope = 'snsapi_base';

            const redirect_uri = 'http://digital.a2china.cn/scrm/events/page/redirect.html?backurl=' + escape(window.location.href);

            window.location.href = `${wXUrl}?appid=${wXAppID}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${scope}&state=test#wechat_redirect`;
        }
    }

    loginByOpenId() {
        if (!this.pageData.openId) return false;
        
        const url = EnvConfig.getServiceUrl('ApiService')() + 'Handler.ashx';

        const formData = new FormData();
        formData.append('Param', JSON.stringify({ OpenID: this.pageData.openId }));
        formData.append('Act', 'User_LoginByOpenID');

        Common.postFormData(url, formData, (data) => {
            if (data.Result && data.Data) {
                data = data.Data;
                Common.setStorage("loginUserInfo", JSON.stringify(data));
                Common.setStorage("loginUserId", data.UID);
                Common.setStorage("token", data.Token, 120);
                this.token = data.Token;
                this.loginUser = data;
            }
        }, (msg) => this.alert(msg), false);

        return true;
    }

    getOpenIdByCode(code, companID) {
        const url = EnvConfig.getServiceUrl('A2ApiService')() + 'Handlers/CommonHandler.ashx';

        var formData = new FormData();
        formData.append('param', JSON.stringify({ code, WxIdentificationType: 2, companID }));
        formData.append('act', 'GetWxFanOpenId');

        Common.postFormData(url, formData, (data) => {
            if (!data.result) { this.alert(data.msg); return; }

            data = data.data;
            this.pageData.openId = data.openid;
            Common.setStorage(this.openIdKey, data.openid);
        }, (msg) => this.alert(msg), false);
    }
}

const _PageAxises = {};

const usePageAxis = (id, name, pageConfig, invokeDataAction, actionTypes, dispatch, props,
    dispatchAction, setActionState, getStateValue, init) => {
    useEffect(() => {
        return () => {
            if (_PageAxises[id]) delete _PageAxises[id];
        }
    }, [id]);

    if (!pageConfig) return null;

    if (!_PageAxises[id]) {
        _PageAxises[id] = new PageAxis(id, {
            name, pageConfig, invokeDataAction, actionTypes, dispatch, props,
            dispatchAction, setActionState, getStateValue, init
        });
    }

    return _PageAxises[id];
}

usePageAxis.getPageAxis = (id) => _PageAxises[id];

export default usePageAxis;