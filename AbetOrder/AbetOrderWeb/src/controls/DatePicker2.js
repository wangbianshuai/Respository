import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { DatePicker, Input } from "antd"
import moment from "moment"

export default class DatePicker2 extends Index {
    constructor(props) {
        super(props)

        this.Name = "DatePicker2";
    }

    ValueChange(value) {
        if (this.Property.ValueChange) this.Property.ValueChange(value);
    }

    OnChange(value, valueString) {
        this.setState({ Value: valueString })
    }

    GetDefaultValue() {
        if (Common.IsNullOrEmpty(this.Property.DefaultValue) && this.Property.IsDefaultNow) {
            return this.GetMomentValue(Common.GetCurrentDate())
        }
        return null;
    }

    GetMomentValue(value) {
        if (!Common.IsNullOrEmpty(value)) {
            if (this.Property.IsShowTime) value = moment(value, "YYYY-MM-DD HH:mm:ss")
            else value = moment(value, "YYYY-MM-DD")
        }

        return Common.IsNullOrEmpty(value) ? null : value;
    }

    render() {
        const { Property } = this.props

        const width = Property.Width || "100%"

        let value = Common.IsNullOrEmpty(this.state.Value) ? "" : this.state.Value

        if (this.state.IsReadonly) {
            if (!Property.IsShowTime && !Common.IsNullOrEmpty(value)) value = value.substr(0, 10);

            return <Input readOnly={this.state.IsReadonly}
                type="text"
                style={{ width: width }}
                value={value} />
        }

        const mv = this.GetMomentValue(value);

        return (<DatePicker placeholder={Property.PlaceHolder}
            style={{ width: width }}
            onChange={this.OnChange.bind(this)}
            maxLength={Property.MaxLength}
            readOnly={this.state.IsReadonly}
            disabled={this.state.Disabled}
            showTime={Property.IsShowTime}
            defaultValue={this.GetDefaultValue()}
            format={Property.IsShowTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"}
            value={mv} />)
    }
}