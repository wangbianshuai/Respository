import React from "react"
import { Common } from "UtilsCommon"
import BaseIndex from "./BaseIndex"
import { Input, InputNumber } from "antd";
const { TextArea, Search } = Input;

export default class TextBox2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.Name = "TextBox2";

        if (this.Property.KeyPressRegExp) this.OnKeyPress = this.KeyPress.bind(this)
    }

    KeyPress(e) {
        const keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
        const keyChar = String.fromCharCode(keyCode);

        var reg = new RegExp(this.Property.KeyPressRegExp);
        return reg.test(keyChar);
    }

    OnChange(e) {
        let value = e.target.value;

        if (value && this.Property.RegExp) value = value.replace(this.Property.RegExp, "")
        if (value && this.Property.DataType === "float" && !this.JudgeMinusDot(value)) value = Common.GetNumber(value, this.Property.Scale);
        if (value && this.Property.DataType === "int") value = Common.GetIntValue(value);

        if (value === 0 && e.target.value !== "0") value = "";

        this.setState({ Value: value }, () => this.BindDataValue());
    }

    JudgeMinusDot(value) {
        if (value === "-") return true;
        if (value === ".") return false;

        if (value.substring(0, value.length - 1).indexOf(".") > 0) return false;

        return value.substring(value.length - 1) === ".";
    }

    SetFocus() {
        this.refs.Input.focus();
    }

    OnBlur(e) {
        if (this.Property.OnBlur) this.Property.OnBlur(e);
    }

    OnFocus(e) {
        if (this.Property.OnFocus) this.Property.OnFocus(e);
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

    OnSearch(value) {
        this.EventActions.InvokeAction(this.Property.EventActionName, this.props);
    }

    OnPressEnter() {
        const { PressEnterEventActionName } = this.Property;
        if (PressEnterEventActionName) this.EventActions.InvokeAction(PressEnterEventActionName, this.props);
    }

    componentDidMount() {
        if (this.refs.Input && this.refs.Input.input) {
            this.Input = this.refs.Input.input;
            if (this.OnKeyPress !== null && this.Input) this.Input.onkeypress = this.OnKeyPress;
        }
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property } = this.props

        const rows = Property.Rows || 4

        const value = Common.IsNullOrEmpty(this.state.Value) ? "" : this.state.Value

        if (Property.ControlType === "TextArea") {
            return (<TextArea rows={rows}
                placeholder={Property.PlaceHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={Property.MaxLength}
                readOnly={this.state.IsReadOnly}
                disabled={this.state.Disabled}
                value={value} />)
        }

        if (Property.ControlType === "Search") {
            return (<Search placeholder={Property.PlaceHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={Property.MaxLength}
                onSearch={this.OnSearch.bind(this)}
                disabled={this.state.Disabled}
                value={value} />)
        }

        if (Property.ControlType === "InputNumber" && !this.state.IsReadOnly) {
            const width = Property.Width || "100%"

            return (<InputNumber placeholder={Property.PlaceHolder}
                style={{ width: width }}
                onChange={this.InputNumberChange.bind(this)}
                maxLength={Property.MaxLength}
                max={Property.Max}
                min={Property.Min}
                step={Property.Step || 1}
                addonAfter={Property.AddonAfter}
                readOnly={this.state.IsReadOnly}
                disabled={this.state.Disabled}
                value={value} />)
        }

        const type = this.state.IsReadOnly ? "text" : (Property.ControlType || "text");

        return (
            <Input placeholder={Property.PlaceHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={Property.MaxLength}
                readOnly={this.state.IsReadOnly}
                disabled={this.state.Disabled}
                addonAfter={Property.AddonAfter}
                type={type}
                ref="Input"
                prefix={this.RenderPrefix()}
                size={Property.Size}
                onPressEnter={this.OnPressEnter.bind(this)}
                value={value} />
        );
    }
}