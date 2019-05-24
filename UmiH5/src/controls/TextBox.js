import React from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex"
import { InputItem, TextareaItem } from "antd-mobile";

export default class TextBox extends BaseIndex {
    constructor(props) {
        super(props)

        this.Name = "TextBox";
        this.state = Object.assign({ ControlType: this.Property.ControlType }, this.state)

        this.Property.SetControlType = this.SetControlType.bind(this);

        if (this.Property.KeyPressRegExp) this.OnKeyPress = this.KeyPress.bind(this)
    }

    KeyPress(e) {
        const keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
        const keyChar = String.fromCharCode(keyCode);

        var reg = new RegExp(this.Property.KeyPressRegExp);
        return reg.test(keyChar);
    }

    OnChange(value) {
        if (value && this.Property.RegExp && !Common.IsIOS()) value = value.replace(this.Property.RegExp, "")
        this.setState({ Value: value })
    }

    ValueChange(value) {
        if (this.Property.ValueChange) this.Property.ValueChange(value);
    }

    SetFocus() {
        this.refs.Input.focus();
    }

    InputNumberChange(value) {
        if (!Common.IsNullOrEmpty(value)) {
            if (this.Property.Scale > 0) value = Common.GetNumber(value, this.Property.Scale);
            else if (this.Property.DataType === "int") value = parseInt(value, 10);
        }

        this.setState({ Value: value })
    }

    SetControlType(type) {
        this.setState({ ControlType: type });
    }

    componentDidMount() {
        this.Input = this.refs.Input.inputRef.inputRef;
        if (this.OnKeyPress !== null && this.Input && !Common.IsIOS()) this.Input.onkeypress = this.OnKeyPress;
    }

    render() {
        const { Property } = this.props
        const { ControlType, IsVisible, Style, ClassName } = this.state;

        const rows = Property.Rows || 4

        const value = Common.IsNullOrEmpty(this.state.Value) ? "" : this.state.Value;

        let style = Property.Style || {};
        if (IsVisible === false) style.display = "none";
        if (Style) style = Style;

        let className = Property.ClassName;
        if (ClassName) className = ClassName

        className = this.EventActions.GetClassName(className);

        if (ControlType === "TextArea") {
            return (<TextareaItem rows={rows}
                placeholder={Property.PlaceHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={Property.MaxLength}
                editable={!this.state.IsReadonly}
                disabled={this.state.Disabled}
                clear={true}
                ref="Input"
                className={className}
                style={style}
                title={Property.Label}
                value={value} />)
        }

        if (ControlType === "InputNumber" && !this.state.IsReadonly) {

            return (<InputItem placeholder={Property.PlaceHolder}
                onChange={this.InputNumberChange.bind(this)}
                maxLength={Property.MaxLength}
                type="number"
                ref="Input"
                extra={Property.Extra}
                className={className}
                editable={!this.state.IsReadonly}
                disabled={this.state.Disabled}
                style={style}
                value={value} >{Property.Label}</InputItem>
            )
        }

        const type = this.state.IsReadonly ? "text" : (ControlType || "text");

        return (
            <InputItem placeholder={Property.PlaceHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={Property.MaxLength}
                editable={!this.state.IsReadonly}
                disabled={this.state.Disabled}
                type={type}
                style={style}
                clear={true}
                ref="Input"
                extra={Property.Extra}
                className={className}
                value={value}>{Property.Label}</InputItem>
        );
    }
}