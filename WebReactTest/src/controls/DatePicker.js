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

        if (this.Property.ControlType === "RangePicker") {
            this.Property.SetValueByData = this.SetValueByData.bind(this);
            this.Property.GetValueToData = this.GetValueToData.bind(this);
        }
    }

    SetValueByData(data) {
        const { StartDateName, EndDateName } = this.Property;
        this.setState({ Value: [data[StartDateName], data[EndDateName]] });
    }

    GetValueToData(data) {
        const { StartDateName, EndDateName, IsNullable, NullTipMessage, Label } = this.Property;

        const { Value, Disabled } = this.state;

        if (Disabled) {
            data[StartDateName] = null;
            data[EndDateName] = null;
            return;
        }

        let startDate = null, endDate = null;
        if (Value && Value.length === 2) {
            startDate = Value[0];
            endDate = Value[1];
        }

        if (IsNullable === false && (Common.IsNullOrEmpty(startDate) || Common.IsNullOrEmpty(endDate))) {
            this.Property.TipMessage = NullTipMessage || "请选择" + Label + "！";
            return false;
        }

        if (startDate > endDate) {
            this.Property.TipMessage = "开始日期不能大于结束日期!"
            return false;
        }

        data[StartDateName] = Value[0];
        data[EndDateName] = Value[1];

        if (data[StartDateName] && data[StartDateName].length === 10) data[StartDateName] += " 00:00:00";
        if (data[EndDateName] && data[EndDateName].length === 10) data[EndDateName] += " 00:00:00";
    }

    GetValue() {
        if (this.state.Value === undefined) return null
        var value = ""
        if (typeof this.state.Value === "string") value = Common.Trim(this.state.Value);
        else value = Common.GetDateString(this.state.Value);
        if (value && value.length === 10) value += " 00:00:00";
        return value;
    }

    ValueChange(value) {
        if (this.Property.ValueChange) this.Property.ValueChange(value);
    }

    OnChange(value, valueString) {
        this.IsLoadValue = true;
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

    GetDateText(value) {
        value = value.filter(f => typeof f === "string")
        return value.map(m => m.substring(0, 10))
    }

    render() {
        const { Property } = this.props

        const width = Property.Width || "100%"

        let value = Common.IsNullOrEmpty(this.state.Value) ? "" : this.state.Value

        if (this.state.IsReadOnly) {
            if (!Property.IsShowTime && !Common.IsNullOrEmpty(value) && typeof value === "string") value = value.substr(0, 10);

            if (Common.IsArray(value)) value = this.GetDateText(value).join(" - ");

            return <Input readOnly={this.state.IsReadOnly}
                type="text"
                style={{ width: width }}
                value={value} />
        }

        const mv = this.GetMomentValue(value);

        if (Property.ControlType === "RangePicker") {
            return (<RangePicker style={{ width: width }}
                onChange={this.OnChange.bind(this)}
                readOnly={this.state.IsReadOnly}
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