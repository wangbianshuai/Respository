/* 
Through-page flow object.
Each component can call methods on the page through the page axis object.
*/

import { Common, Page, AjaxRequest, EnvConfig } from "UtilsCommon";
import EventActions from "EventActions"
import { Modal, message } from "antd";
import router from 'umi/router';

export default class PageAxis {
    constructor(name) {
        this.Id = Common.CreateGuid();
        this.Name = name;
    }

    Invoke() {
        return (name) => this[name] ? this[name].bind(this) : function () { };
    }

    ExpandMethod(methods) {
        for (let key in methods) this[key] = methods[key](this)
    }

    ReceiveActionData(nextProps) {
        if (this.ActionTypes) {
            let name = "", value = 0;
            for (let key in this.ActionTypes) {
                name = `Receive${key}`;
                value = this.ActionTypes[key];
                if (nextProps[value] !== this.props[value]) {
                    if (this[name]) this[name](nextProps[value]);
                    else if (this.Receives[value]) this.Receives[value](nextProps[value]);
                }
            }
        }
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

            url = Common.AddUrlRandom(url)
            AjaxRequest.GetRequest(url, {}, (res) => {
                if (res.IsSuccess === false) this.Alert(res.Message)
                else window.PageConfigs[this.Name] = res;
            }, false);
        }
        if (window.PageConfigs[this.Name]) this.PageConfig = Common.Clone(window.PageConfigs[this.Name]);
    }

    InitSet(props, invokeDataAction, actionTypes, expandInit) {
        if (!this.IsInit) this.IsInit = true; else return;

        this.props = props;
        this.InvokeDataAction = invokeDataAction;
        this.ActionTypes = actionTypes;

        this.Token = Common.GetCookie("Token");
        this.PageConfig = {};
        this.Receives = {};
        this.Controls = [];
        this.Components = [];
        this.GetConfig();

        if (this.PageConfig.ActionOptions) this.ActionTypes = this.PageConfig.ActionOptions.ActionTypes;

        this.PageData = Common.GetQueryString();
        this.PageData.Token = this.Token;
        this.AsyncRequest = {};
        this.AsyncRequestFunction = {};

        this.EventActions = {};
        for (let key in EventActions) this.EventActions[key] = new EventActions[key]();

        if (expandInit) expandInit(this);
    }

    SetModalDialog() {
        return Page.Current.Invoke("RootPage", "SetModalDialog");
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
        return Common.ArrayFirst(this.Controls, (f) => f.Name === name);
    }

    GetComponent(name) {
        return Common.ArrayFirst(this.Components, (f) => f.Name === name);
    }

    InvokeEventAction(name, props) {
        const e = this.GetEventAction(name);
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