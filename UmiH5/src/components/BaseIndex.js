import React, { Component } from "react";
import { Common } from "UtilsCommon";
import PropertyItem from "./PropertyItem";

export default class BaseIndex extends Component {
    constructor(props) {
        super(props);

        this.Id = props.Property.Id;
        this.Property = props.Property;
        this.View = props.View;
        this.EventActions = props.EventActions;
        this.state = { IsVisible: true }
        this.Property.SetVisible = this.SetVisible.bind(this);
    }

    SetVisible(v) {
        this.Property.IsVisible = v;
        if (this.Property.IsFormItem && this.Property.SetFormItemVisible) this.Property.SetFormItemVisible(v);
        else this.setState({ IsVisible: v })
    }

    JudgeChanged(nextProps, name) {
        return nextProps[name] !== undefined && !Common.IsEquals(nextProps[name], this.props[name])
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
                blChanged = true; break;
            }
        }

        if (blChanged) {
            blChanged = this.ReceiveActionData(nextProps)
        }

        if (!blChanged) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key] && !Common.IsFunction(nextState[key])) {
                    blChanged = true; break;
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
                if (nextProps[value] !== this.props[value] && this[name]) blChanged = this[name](nextProps[value]);
            }
        }
        return blChanged;
    }

    GetPropertyItem(p) {
        return (<PropertyItem Property={p} EventActions={this.EventActions} View={this.Property} />)
    }
}