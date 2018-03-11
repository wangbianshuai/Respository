import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Select } from "antd"
const Option = Select.Option;

export default class Button2 extends Index {
    constructor(props) {
        super(props)

        this.state = {
            Disabled: false,
            Value: props.Property.DefaultValue
        };

        props.Property.SetDisabled = (disabled) => this.setState({ Disabled: disabled })

        props.Property.GetValue = () => this.state.Value;

        props.Property.SetValue = (v) => this.setState({ Value: v });

        if (props.Property.SelectChanged) props.Property.SelectChanged(props.Property.DefaultValue, this.GetSelectData(props.Property.DefaultValue));
    }

    componentWillMount() {
        this.Options = [];

        const { Property } = this.props

        if (Common.IsArray(Property.DataSource)) {
            Property.DataSource.forEach(d => {
                this.Options.push(<Option value={d.Value} key={d.Value}>{d.Text}</Option>)
            });
        }
    }

    GetSelectData(value) {
        return Common.ArrayFirst(this.Property.DataSource, (f) => f.Value === value);
    }

    OnChange(value) {
        this.setState({ Value: value })

        const { Property } = this.props
        if (Property.SelectChanged) Property.SelectChanged(value, this.GetSelectData(value));
    }

    render() {
        const { Property } = this.props

        const width = Property.Width || "100%"

        return (<Select disabled={this.state.Disabled}
            style={{ width: width }} value={this.state.Value}
            onChange={this.OnChange.bind(this)}
            defaultValue={Property.DefaultValue} >{this.Options}</Select>)
    }
}