import React from "react"
import { Common } from "UtilsCommon"
import BaseIndex from "./BaseIndex"
import { Input, InputNumber, Select } from "antd";
const { TextArea, Search } = Input;
const Option = Select.Option;

export default class TextBox2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.Name = "TextBox2";

        if (this.Property.KeyPressRegExp) this.OnKeyPress = this.KeyPress.bind(this)

        if (this.Property.AddonAfterDataSource) {
            this.state = Object.assign({ Value2: this.Property.Value2 || this.Property.DefaultValue2, IsReadOnly2: this.Property.IsReadOnly }, this.state)
            this.SetAddonAfterOptions();
            this.IsValue2 = true;
            this.Property.GetValue2 = () => this.state.Value2;
            this.Property.SetValue2 = (v) => this.setState({ Value2: v });
            this.Property.SetReadOnly = (isReadOnly, isReadOnly2) => this.setState({ IsReadOnly: isReadOnly, IsReadOnly2: isReadOnly === undefined ? isReadOnly : isReadOnly2 });
        }

        this.InitRegExp();
    }

    SetAddonAfterOptions() {
        this.AddonAfterOptions = this.Property.AddonAfterDataSource.map(m => { return <Option value={m.Value} key={m.Value}>{m.Text}</Option> })
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

        value = this.SetMinMaxValue(value);

        this.setState({ Value: value }, () => this.BindDataValue());
    }

    SetMinMaxValue(value) {
        if (Common.IsNullOrEmpty(value)) return value;

        const { MinValue, MaxValue, DataType } = this.Property;
        if (DataType !== "int" && DataType !== "float") return value;

        if (Common.IsNullOrEmpty(MinValue) && Common.IsNullOrEmpty(MaxValue)) return value;

        const v = Common.GetFloatValue(value);

        if (!Common.IsNullOrEmpty(MinValue) && v < MinValue) value = MinValue;
        else if (!Common.IsNullOrEmpty(MaxValue) && v > MaxValue) value = MaxValue;

        return value;
    }

    JudgeMinusDot(value) {
        if (value === "-") return true;
        if (value === ".") return false;

        if (value.substring(value.length - 1, value.length) === "0") return true;

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

    ValueChange2(value) {
        if (this.Property.ValueChange2) this.Property.ValueChange2(value);
    }

    OnSearch(value) {
        const props = { ...this.props, SearchValue: value }
        this.PageAxis.InvokeEventAction(this.Property.EventActionName, props);
    }

    OnPressEnter() {
        const { PressEnterEventActionName, PressEnterEventPropertyName } = this.Property;
        if (PressEnterEventActionName) {
            const props = { ...this.props };
            if (PressEnterEventPropertyName) props.Property = this.PageAxis.GetProperty(PressEnterEventPropertyName);

            this.PageAxis.InvokeEventAction(PressEnterEventActionName, props);
        }
    }

    componentDidMount() {
        if (this.refs.Input && this.refs.Input.input) {
            this.Input = this.refs.Input.input;
            if (this.OnKeyPress !== null && this.Input) this.Input.onkeypress = this.OnKeyPress;
        }
    }

    OnSelectChange(value) {
        this.setState({ Value2: value });
    }

    GetSelectText() {
        const selectData = Common.ArrayFirst(this.Property.AddonAfterDataSource, (f) => Common.IsEquals(f.Value, this.state.Value2));
        if (selectData === null) return "";

        return selectData.Text === undefined ? "" : selectData.Text;
    }

    RenderAddonAfter() {
        if (this.state.IsReadOnly2) return this.GetSelectText();
        else {
            return (<Select disabled={this.state.Disabled}
                value={this.state.Value2} style={this.Property.SelectStyle}
                onChange={this.OnSelectChange.bind(this)}>{this.AddonAfterOptions}</Select>)
        }
    }

    GetValueText() {
        if (Common.IsNullOrEmpty(this.state.Value)) return this.state.Value;
        const data = Common.ArrayFirst(this.Property.DataSource, f => Common.IsEquals(f.Value, this.state.Value));
        if (data !== null) return data.Text;
        return this.state.Value;
    }

    RenderAddonAfterOpenUrl(text) {
        if (!this.state.Value) return text;
        return <a href={this.state.Value} target="_blank" rel="noopener noreferrer">{text}</a>
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property } = this.props

        const rows = Property.Rows || 4

        var value = Common.IsNullOrEmpty(this.state.Value) ? "" : this.state.Value

        if (Property.IsDate && value && value.length > 10) value = value.substring(0, 10);

        if (this.state.IsReadOnly && Property.DataSource) value = this.GetValueText();

        if (Property.ControlType === "TextArea") {
            const maxLength = this.state.IsReadOnly ? undefined : Property.MaxLength || 500;
            return (<TextArea rows={rows}
                placeholder={Property.PlaceHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={maxLength}
                readOnly={this.state.IsReadOnly}
                disabled={this.state.Disabled}
                value={value} />)
        }

        if (Property.ControlType === "Search") {
            return (<Search placeholder={Property.PlaceHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={Property.MaxLength}
                onSearch={this.OnSearch.bind(this)}
                readOnly={this.state.IsReadOnly}
                enterButton={Property.IsEnterButton}
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

        let addonAfter = Property.AddonAfter;
        if (Property.AddonAfterDataSource) addonAfter = this.RenderAddonAfter();
        else if (Property.IsAddonAfterOpenUrl) addonAfter = this.RenderAddonAfterOpenUrl(addonAfter);

        return (
            <Input placeholder={Property.PlaceHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={Property.MaxLength}
                readOnly={this.state.IsReadOnly}
                disabled={this.state.Disabled && !this.state.IsReadOnly}
                addonAfter={addonAfter}
                type={type}
                ref="Input"
                prefix={this.RenderPrefix()}
                size={Property.Size}
                onPressEnter={this.OnPressEnter.bind(this)}
                value={value} />
        );
    }
}