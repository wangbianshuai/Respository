/*
Through-page flow object.
Each component can call methods on the page through the page axis object.
*/
/*
props:{
    name, pageConfig, invokeDataAction, actionTypes,
    dispatch, dispatchAction, setActionState, getStateValue
}
*/

import { useMemo, useEffect } from "react";
import { Common } from 'UtilsCommon';
import EventActions from 'EventActions';

class PageAxis {
    constructor(id, props) {
        this.id = id;
        for (let key in props) this[key] = props[key];
        this.props = {};
        this.initSet();
        this.init && this.init();
    }

    invoke() {
        return (name) => this[name] ? this[name].bind(this) : function () { };
    }

    receiveActionData(nextProps) {
        if (this.actionTypes) {
            let name = "", value = 0;
            for (let key in this.actionTypes) {
                name = `receive${key}`;
                value = this.actionTypes[key];
                if (nextProps[value] !== this.props[value]) {
                    if (this[name]) this[name](nextProps[value]);
                    else if (this.receives[value]) this.receives[value](nextProps[value]);
                }
            }
        }
        this.props = nextProps;
    }

    receiveActionDataToObject(obj, actionTypes, nextProps) {
        obj.props = obj.props || {};
        let name = "", value = 0;
        for (let key in actionTypes) {
            name = `receive${key}`;
            value = actionTypes[key];
            if (nextProps[value] !== obj.props[value]) {
                if (obj[name]) obj[name](nextProps[value]);
                else if (this.receives[value]) this.receives[value](nextProps[value]);
            }
        }
        obj.prop = nextProps;
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

        this.token = Common.getStorage("Token");
        this.loginUserId = Common.getStorage("LoginUserId");

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

const usePageAxis = (props) => {
    const id = useMemo(() => Common.createGuid(), []);
    useEffect(() => {
        return () => {
            if (_PageAxises[id]) delete _PageAxises[id];
        }
    }, [id]);

    if (!props.pageConfig) return null;

    if (!_PageAxises[id]) _PageAxises[id] = new PageAxis(id, props);

    return _PageAxises[id];
}

usePageAxis.getPageAxis = (id) => _PageAxises[id];

export default usePageAxis;