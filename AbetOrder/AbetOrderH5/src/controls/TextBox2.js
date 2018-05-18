import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { InputItem, TextareaItem } from "antd-mobile";

export default class TextBox2 extends Index {
    constructor(props) {
        super(props)

        this.Name = "TextBox2";
    }

    OnChange(value) {
        this.setState({ Value: value })
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
            return (<TextareaItem rows={rows}
                placeholder={Property.PlaceHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={Property.MaxLength}
                editable={!this.state.IsReadonly}
                disabled={this.state.Disabled}
                clear={true}
                title={Property.Label}
                value={value} />)
        }

        if (Property.ControlType === "InputNumber" && !this.state.IsReadonly) {

            return (<InputItem placeholder={Property.PlaceHolder}
                onChange={this.InputNumberChange.bind(this)}
                maxLength={Property.MaxLength}
                type="number"
                editable={!this.state.IsReadonly}
                disabled={this.state.Disabled}
                value={value} >{Property.Label}</InputItem>
            )
        }

        const type = this.state.IsReadonly ? "text" : (Property.ControlType || "text");

        return (
            <InputItem placeholder={Property.PlaceHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={Property.MaxLength}
                editable={!this.state.IsReadonly}
                disabled={this.state.Disabled}
                type={type}
                clear={true}
                value={value}>{Property.Label}</InputItem>
        );
    }
}