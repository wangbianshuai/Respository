import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Radio } from "antd"
const RadioGroup = Radio.Group
const RadioButton = Radio.Button;

export default class Radio2 extends Index {
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
            if (this.Property.IsButton) {
                const style = {}
                if (this.Property.ButtonWidth > 0) {
                    style.width = this.Property.ButtonWidth;
                    style.textAlign = "center";
                }
                options.push(<RadioButton style={style} value={d[this.ValueName]} key={d[this.ValueName]}>{d[this.TextName]}</RadioButton>)
            }
            else options.push(<Radio value={d[this.ValueName]} key={d[this.ValueName]}>{d[this.TextName]}</Radio>)
        });

        return options;
    }

    GetSelectData(value) {
        return Common.ArrayFirst(this.Property.DataSource, (f) => f[this.ValueName] === value);
    }

    OnChange(e) {
        this.setState({ Value: e.target.value })
    }

    ValueChange(value) {
        const { Property } = this.props
        if (Property.ValueChange) Property.ValueChange(value, this.GetSelectData(value));
    }

    render() {
        const { Property } = this.props

        const value = Common.IsNullOrEmpty(this.state.Value) ? undefined : this.state.Value.toString()

        return (<RadioGroup disabled={this.state.Disabled}
            value={value}
            onChange={this.OnChange.bind(this)}
            defaultValue={Property.DefaultValue} >{this.state.Options}</RadioGroup>)
    }
}