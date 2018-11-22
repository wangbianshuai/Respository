import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { DatePicker, InputItem, List } from "antd-mobile"

export default class DatePicker2 extends Index {
    constructor(props) {
        super(props)

        this.Name = "DatePicker2";
    }

    ValueChange(value) {
        if (this.Property.ValueChange) this.Property.ValueChange(value);
    }

    OnChange(value) {
        const { Property } = this.props
        this.setState({ Value: Common.GetDateString(value, !Property.IsShowTime) })
    }

    GetDefaultValue() {
        if (Common.IsNullOrEmpty(this.Property.DefaultValue) && this.Property.IsDefaultNow) {
            return this.GetMomentValue(Common.GetCurrentDate())
        }
        return null;
    }

    GetMomentValue(value) {
        if (!Common.IsNullOrEmpty(value)) {
            if (this.Property.IsShowTime) value = Common.ConvertToDate(value, "yyyy-MM-dd HH:mm:ss")
            else value = Common.ConvertToDate(value, "yyyy-MM-dd")
        }

        return Common.IsNullOrEmpty(value) ? null : value;
    }

    render() {
        const { Property } = this.props

        const width = Property.Width || "100%"

        let value = Common.IsNullOrEmpty(this.state.Value) ? "" : this.state.Value

        if (this.state.IsReadonly) {
            if (!Property.IsShowTime && !Common.IsNullOrEmpty(value)) value = value.substr(0, 10);

            return <InputItem editable={!this.state.IsReadonly}
                disabled={this.state.Disabled}
                type="text"
                value={value}>{Property.Label}</InputItem>
        }

        const mv = this.GetMomentValue(value);

        const extra = "请选择" + (Property.IsNullable === false ? "" : "(可选)");

        return (<DatePicker placeholder={Property.PlaceHolder}
            style={{ width: width }}
            onChange={this.OnChange.bind(this)}
            onOk={this.OnChange.bind(this)}
            maxLength={Property.MaxLength}
            disabled={this.state.Disabled}
            mode={Property.IsShowTime ? "datetime" : "date"}
            defaultValue={this.GetDefaultValue()}
            format={Property.IsShowTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"}
            title={Property.Label}
            extra={extra}
            value={mv}>
            <List.Item arrow="horizontal">{Property.Label}</List.Item>
        </DatePicker>
        )
    }
}