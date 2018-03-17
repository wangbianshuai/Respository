import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { AutoComplete } from "antd"

export default class AutoComplete2 extends Index {
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
            options.push(d[this.TextName])
        });

        return options;
    }

    ValueChange(value) {
        if (this.Property.ValueChange) this.Property.ValueChange(value);
    }

    OnChange(value, valueString) {
        this.setState({ Value: value })
    }

    render() {
        const { Property } = this.props

        const width = Property.Width || "100%"

        const value = Common.IsNullOrEmpty(this.state.Value) ? "" : this.state.Value

        return (<AutoComplete placeholder={Property.PlaceHolder}
            style={{ width: width }}
            onChange={this.OnChange.bind(this)}
            maxLength={Property.MaxLength}
            readOnly={this.state.IsReadonly}
            dataSource={this.state.Options}
            disabled={this.state.Disabled}
            filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            value={value} />)
    }
}