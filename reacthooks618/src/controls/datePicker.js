import React from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex"
import { DatePicker, Input } from "antd"
import moment from "moment";

const { RangePicker } = DatePicker;

export default class DatePicker2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.name = "DatePicker2";

        if (this.property.ControlType === "RangePicker") {
            this.property.setValueByData = this.setValueByData.bind(this);
            this.property.getValueToData = this.getValueToData.bind(this);
        }
    }

    setValueByData(data) {
        const { StartDateName, EndDateName } = this.property;
        this.setState({ Value: [data[StartDateName], data[EndDateName]] });
    }

    getValueToData(data) {
        const { StartDateName, EndDateName, isNullable, NullTipMessage, label } = this.property;

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

        if (isNullable === false && (Common.isNullOrEmpty(startDate) || Common.isNullOrEmpty(endDate))) {
            this.property.TipMessage = NullTipMessage || "请选择" + label + "！";
            return false;
        }

        if (startDate > endDate) {
            this.property.TipMessage = "开始日期不能大于结束日期!"
            return false;
        }

        data[StartDateName] = Value[0];
        data[EndDateName] = Value[1];

        if (data[StartDateName] && data[StartDateName].length === 10) data[StartDateName] += " 00:00:00";
        if (data[EndDateName] && data[EndDateName].length === 10) data[EndDateName] += " 00:00:00";
    }

    getValue() {
        if (this.state.Value === undefined) return null
        var value = ""
        if (typeof this.state.Value === "string") value = Common.trim(this.state.Value);
        else value = Common.getDateString(this.state.Value);
        if (value && value.length === 10) value += " 00:00:00";
        return value;
    }

    ValueChange(value) {
        if (this.property.ValueChange) this.property.ValueChange(value);
    }

    OnChange(value, valueString) {
        this.isLoadValue = true;
        this.setState({ Value: valueString }, () => this.BindDataValue())
    }

    getDefaultValue() {
        if (Common.isNullOrEmpty(this.property.DefaultValue) && this.property.isDefaultNow) {
            return this.getMomentValue(Common.getCurrentDate())
        }
        return null;
    }

    getMomentValue(value) {
        if (!Common.isNullOrEmpty(value)) {
            if (Common.isArray(value)) value = value.map(m => this.getDataTime(m))
            else value = this.getDataTime(value)
        }

        return Common.isNullOrEmpty(value) ? null : value;
    }

    getDataTime(value) {
        if (Common.isNullOrEmpty(value)) return value;
        if (this.property.isShowTime) value = moment(value, "YYYY-MM-DD HH:mm:ss")
        else value = moment(value, "YYYY-MM-DD")

        return value;
    }

    getDateText(value) {
        value = value.filter(f => typeof f === "string")
        return value.map(m => m.substring(0, 10))
    }

    render() {
        const { property } = this.props

        const width = property.Width || "100%"

        let value = Common.isNullOrEmpty(this.state.Value) ? "" : this.state.Value

        if (this.state.isReadOnly) {
            if (!property.isShowTime && !Common.isNullOrEmpty(value) && typeof value === "string") value = value.substr(0, 10);

            if (Common.isArray(value)) value = this.getDateText(value).join(" - ");

            return <Input readOnly={this.state.isReadOnly}
                type="text"
                style={{ width: width }}
                value={value} />
        }

        const mv = this.getMomentValue(value);

        if (property.ControlType === "RangePicker") {
            return (<RangePicker style={{ width: width }}
                onChange={this.OnChange.bind(this)}
                readOnly={this.state.isReadOnly}
                disabled={this.state.Disabled}
                showTime={property.isShowTime}
                defaultValue={this.getDefaultValue()}
                format={property.isShowTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"}
                value={mv} />)
        }

        return (<DatePicker placeholder={property.placeHolder}
            style={{ width: width }}
            onChange={this.OnChange.bind(this)}
            maxLength={property.MaxLength}
            readOnly={this.state.isReadonly}
            disabled={this.state.Disabled}
            showTime={property.isShowTime}
            defaultValue={this.getDefaultValue()}
            format={property.isShowTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"}
            value={mv} />)
    }
}