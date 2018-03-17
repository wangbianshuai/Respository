import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Select } from "antd"
const Option = Select.Option;

export default class Button2 extends Index {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state)
    }

    componentWillMount() {
        this.GetDataSource();
    }

    GetOptions() {
        const options = [];

        this.Property.DataSource.forEach(d => {
            options.push(<Option value={d[this.ValueName]} key={d[this.ValueName]}>{d[this.TextName]}</Option>)
        });

        return options;
    }

    GetSelectData(value) {
        return Common.ArrayFirst(this.Property.DataSource, (f) => f[this.ValueName] === value);
    }

    OnChange(value) {
        this.setState({ Value: value })
    }

    ValueChange(value) {
        const { Property } = this.props
        if (Property.ValueChange) Property.ValueChange(value, this.GetSelectData(value));
    }

    render() {
        const { Property } = this.props

        const value = Common.IsNullOrEmpty(this.state.Value) ? "" : this.state.Value
        const width = Property.Width || "100%"

        return (<Select disabled={this.state.Disabled}
            style={{ width: width }}
            value={value}
            onChange={this.OnChange.bind(this)}
            allowClear={Property.AllowClear}
            mode={Property.Mode}
            maxTagCount={Property.MaxTagCount}
            defaultValue={Property.DefaultValue} >{this.state.Options}</Select>)
    }
}