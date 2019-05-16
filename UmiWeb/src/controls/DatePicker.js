import React from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex"
import { DatePicker, Input } from "antd"
import moment from "moment";

const { RangePicker } = DatePicker;

export default class DatePicker2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.Name = "DatePicker2";
    }

    ValueChange(value) {
        if (this.Property.ValueChange) this.Property.ValueChange(value);
    }

    OnChange(value, valueString) {
        this.setState({ Value: valueString }, () => this.BindDataValue())
    }

    GetDefaultValue() {
        if (Common.IsNullOrEmpty(this.Property.DefaultValue) && this.Property.IsDefaultNow) {
            return this.GetMomentValue(Common.GetCurrentDate())
        }
        return null;
    }

    GetMomentValue(value) {
        if (!Common.IsNullOrEmpty(value)) {
            if (Common.IsArray(value)) value = value.map(m => this.GetDataTime(m))
            else value = this.GetDataTime(value)
        }

        return Common.IsNullOrEmpty(value) ? null : value;
    }

    GetDataTime(value) {
        if (Common.IsNullOrEmpty(value)) return value;
        if (this.Property.IsShowTime) value = moment(value, "YYYY-MM-DD HH:mm:ss")
        else value = moment(value, "YYYY-MM-DD")

        return value;
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

        if (Property.ControlType === "RangePicker") {
            return (<RangePicker style={{ width: width }}
                onChange={this.OnChange.bind(this)}
                readOnly={this.state.IsReadonly}
                disabled={this.state.Disabled}
                showTime={Property.IsShowTime}
                defaultValue={this.GetDefaultValue()}
                format={Property.IsShowTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"}
                value={mv} />)
        }

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