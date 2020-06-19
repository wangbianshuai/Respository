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

import { useMemo, useEffect } from "react";
import { Common } from 'UtilsCommon';
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
                if (nextState[value] !== this.state[value]) {
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
            if (nextState[value] !== obj.state[value]) {
                if (obj[name]) obj[name](nextState[value]);
                else if (this.receives[value]) this.receives[value](nextState[value]);
            }
        }
        obj.state = nextState;
    }

    judgeLogin() {
        if (!this.token) this.toLogin();
    }

    toLogin() {

    }

    showMessage(msg) {

    }

    initSet() {
        this.pageConfig = Common.clone(this.pageConfig);

        this.token = Common.getStorage("token");
        this.loginUserId = Common.getStorage("loginUserId");

        this.receives = {};
        this.controls = [];
        this.components = [];
        this.eventActionsConfig = Common.clone(this.pageConfig.eventActions);
        if (this.pageConfig.actionOptions) this.actionTypes = this.pageConfig.actionOptions.actionTypes;

        this.pageData = {};
        this.pageData.token = this.token;

        this.eventActions = {};
        for (let key in EventActions) this.eventActions[key] = new EventActions[key]();
    }

    setModalDialog() {
    }

    getProperty(name) {
        return this.getPropertyProperty(this.pageConfig, name);
    }

    getRight(name) {
        return !!name;
    }

    getFunction(name) {
        if (!name || !this[name]) return null;
        return (params) => this[name](params);
    }

    getPropertyProperty(view, name) {
        if (!name) return null;
        if (view.name === name) return view;

        if (view.properties) {
            let v = null;
            for (let i = 0; i < view.properties.length; i++) {
                v = this.getPropertyProperty2(view.properties[i], name);
                if (v !== null) break;
            }
            if (v != null) return v;
        }
        if (this.pageConfig.dialogViews) {
            let v = null;
            for (let i = 0; i < this.pageConfig.dialogViews.length; i++) {
                v = this.getPropertyProperty2(this.pageConfig.dialogViews[i], name);
                if (v !== null) break;
            }
            if (v != null) return v;
        }
        return null;
    }

    getPropertyProperty2(view, name) {
        if (view.name === name) return view;

        if (view.properties) {
            let v = null;
            for (let i = 0; i < view.properties.length; i++) {
                v = this.getPropertyProperty2(view.properties[i], name);
                if (v !== null) break;
            }
            return v;
        }

        return null;
    }

    toPage(url) {
    }

    toBack() {

    }

    openPage(url) {
    }

    alert(msg, title) {

    }

    alertSuccess(msg, onOk) {

    }

    confirm(msg, onOk, title) {

    }

    invokeEventAction(name, props) {
        const e = this.getEventAction(name);
        if (e != null) e.invoke(props, e);
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
}

const _PageAxises = {};

const usePageAxis = (name, pageConfig, invoke, actionTypes, dispatch, props,
    dispatchAction, setActionState, getStateValue, init) => {
    const id = useMemo(() => Common.createGuid(), []);
    useEffect(() => {
        return () => {
            if (_PageAxises[id]) delete _PageAxises[id];
        }
    }, [id]);

    if (!pageConfig) return null;

    if (!_PageAxises[id]) _PageAxises[id] = new PageAxis(id, {
        name, pageConfig, invoke, actionTypes, dispatch, props,
        dispatchAction, setActionState, getStateValue, init
    });

    return _PageAxises[id];
}

usePageAxis.getPageAxis = (id) => _PageAxises[id];

export default usePageAxis;