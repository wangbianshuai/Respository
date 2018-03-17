import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { DatePicker } from "antd"
import moment from "moment"

export default class DatePicker2 extends Index {
    constructor(props) {
        super(props)
    }

    ValueChange(value) {
        if (this.Property.ValueChange) this.Property.ValueChange(value);
    }

    OnChange(value, valueString) {
        this.setState({ Value: valueString })
    }

    render() {
        const { Property } = this.props

        const width = Property.Width || "100%"

        let value = Common.IsNullOrEmpty(this.state.Value) ? "" : this.state.Value

        if (!Common.IsNullOrEmpty(value)) {
            if (Property.IsShowTime) value = moment(value, "YYYY-MM-DD HH:mm:ss")
            else value == moment(value, "YYYY-MM-DD")
        }

        return (<DatePicker placeholder={Property.PlaceHolder}
            style={{ width: width }}
            onChange={this.OnChange.bind(this)}
            maxLength={Property.MaxLength}
            readOnly={this.state.IsReadonly}
            disabled={this.state.Disabled}
            showTime={Property.IsShowTime}
            format={Property.IsShowTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"}
            value={value} />)
    }
}