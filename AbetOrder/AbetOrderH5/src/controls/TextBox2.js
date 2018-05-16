import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Input, InputNumber } from "antd";
const { TextArea } = Input;

export default class TextBox2 extends Index {
    constructor(props) {
        super(props)

        this.Name = "TextBox2";
    }

    OnChange(e) {
        this.setState({ Value: e.target.value })
    }

    InputNumberChange(value) {
        if (!Common.IsNullOrEmpty(value)) {
            if (this.Property.Scale > 0) value = Common.GetNumber(value, this.Property.Scale);
            else if (this.Property.DataType === "int") value = parseInt(value, 10);
        }

        this.setState({ Value: value })
    }

    ValueChange(value) {
        if (this.Property.ValueChange) this.Property.ValueChange(value);
    }

    render() {
        const { Property } = this.props

        const rows = Property.Rows || 4

        const value = Common.IsNullOrEmpty(this.state.Value) ? "" : this.state.Value

        if (Property.ControlType === "TextArea") {
            return (<TextArea rows={rows}
                placeholder={Property.PlaceHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={Property.MaxLength}
                readOnly={this.state.IsReadonly}
                disabled={this.state.Disabled}
                value={value} />)
        }

        if (Property.ControlType === "InputNumber" && !this.state.IsReadonly) {
            const width = Property.Width || "100%"

            return (<InputNumber placeholder={Property.PlaceHolder}
                style={{ width: width }}
                onChange={this.InputNumberChange.bind(this)}
                maxLength={Property.MaxLength}
                max={Property.Max}
                min={Property.Min}
                step={Property.Step || 1}
                readOnly={this.state.IsReadonly}
                disabled={this.state.Disabled}
                value={value} />)
        }

        const type = this.state.IsReadonly ? "text" : (Property.ControlType || "text");

        return (
            <Input placeholder={Property.PlaceHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={Property.MaxLength}
                readOnly={this.state.IsReadonly}
                disabled={this.state.Disabled}
                type={type}
                value={value} />
        );
    }
}