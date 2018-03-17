import React, { Component } from "react"
import * as Common from "../utils/Common"

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.Id = props.Property.Id || Common.CreateGuid()

        this.Property = props.Property;

        this.InitState = {
            Disabled: this.Property.Disabled,
            Value: this.Property.Value || (this.Property.DefaultValue || null),
            IsReadonly: this.Property.IsReadonly
        }

        this.state = this.InitState;

        this.Property.SetDisabled = (disabled) => this.setState({ Disabled: disabled });

        this.Property.GetValue = () => this.state.Value;

        this.Property.SetValue = (v) => this.setState({ Value: v });

        this.Property.SetReadonly = (isReadonly) => this.setState({ IsReadonly: isReadonly });

        this.Property.InitState = () => this.setState(this.InitState)
    }

    GetPropsValue(name) {
        return this.props[name] || this[name]
    }

    GetPropertyValue(name) {
        return this.props.Property[name] || this[name]
    }

    ValueChange(v) { }

    shouldComponentUpdate(nextProps, nextState) {
        let blChangedProps = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined) {
                if (this.props[key] !== nextProps[key]) { blChangedProps = true; break; }
            }
        }

        if (!blChangedProps) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key]) {
                    blChangedProps = true;
                    if (key === "Value") this.ValueChange(nextState.Value)
                    break;
                }
            }
        }

        return blChangedProps;
    }

    GetOptions() {
        return []
    }

    GetDataSource() {
        const { Page, Property } = this.props

        if (Property.ServiceDataSource) {
            this.ValueName = Property.ServiceDataSource.ValueName
            this.TextName = Property.ServiceDataSource.TextName
        }
        else {
            this.ValueName = "Value";
            this.TextName = "Text";
        }

        if (Common.IsArray(Property.DataSource)) {
            this.setState({ Options: this.GetOptions() })
        }
        else if (Property.ServiceDataSource) {
            this.Property.DataSource = []

            Property.ActionType = "Page";
            Property.ActionName = "GetServiceDataSource"

            Property.SetDataSource = (dataList) => {
                this.Property.DataSource = dataList;
                this.setState({ Options: this.GetOptions() })
            };

            const action = Page.GetAction(Property.ServiceDataSource.ActionName);
            Page.InvokeAction(Property, action);
        }
    }
}