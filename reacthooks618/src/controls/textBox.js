import React from "react"
import { Common } from "UtilsCommon"
import BaseIndex from "./BaseIndex"
import { Input, InputNumber, Select } from "antd";
const { TextArea, Search } = Input;
const Option = Select.Option;

export default class TextBox2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.name = "TextBox2";

        if (this.property.KeyPressRegExp) this.OnKeyPress = this.KeyPress.bind(this)

        if (this.property.AddonAfterDataSource) {
            this.state = Object.assign({ Value2: this.property.Value2 || this.property.DefaultValue2, isReadOnly2: this.property.isReadOnly }, this.state)
            this.setAddonAfterOptions();
            this.isValue2 = true;
            this.property.getValue2 = () => this.state.Value2;
            this.property.setValue2 = (v) => this.setState({ Value2: v });
            this.property.setReadOnly = (isReadOnly, isReadOnly2) => this.setState({ isReadOnly: isReadOnly, isReadOnly2: isReadOnly === undefined ? isReadOnly : isReadOnly2 });
        }

        this.InitRegExp();
    }

    setAddonAfterOptions() {
        this.AddonAfterOptions = this.property.AddonAfterDataSource.map(m => { return <Option value={m.Value} key={m.Value}>{m.text}</Option> })
    }

    KeyPress(e) {
        const keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
        const keyChar = String.fromCharCode(keyCode);

        var reg = new RegExp(this.property.KeyPressRegExp);
        return reg.test(keyChar);
    }

    OnChange(e) {
        let value = e.target.value;

        if (value && this.property.RegExp) value = value.replace(this.property.RegExp, "")
        if (value && this.property.DataType === "float" && !this.JudgeMinusDot(value)) value = Common.getNumber(value, this.property.Scale);
        if (value && this.property.DataType === "int") value = Common.getIntValue(value);

        if (value === 0 && e.target.value !== "0") value = "";

        value = this.setMinMaxValue(value);

        this.setState({ Value: value }, () => this.BindDataValue());
    }

    setMinMaxValue(value) {
        if (Common.isNullOrEmpty(value)) return value;

        const { MinValue, MaxValue, DataType } = this.property;
        if (DataType !== "int" && DataType !== "float") return value;

        if (Common.isNullOrEmpty(MinValue) && Common.isNullOrEmpty(MaxValue)) return value;

        const v = Common.getFloatValue(value);

        if (!Common.isNullOrEmpty(MinValue) && v < MinValue) value = MinValue;
        else if (!Common.isNullOrEmpty(MaxValue) && v > MaxValue) value = MaxValue;

        return value;
    }

    JudgeMinusDot(value) {
        if (value === "-") return true;
        if (value === ".") return false;

        if (value.substring(value.length - 1, value.length) === "0") return true;

        if (value.substring(0, value.length - 1).indexOf(".") > 0) return false;

        return value.substring(value.length - 1) === ".";
    }

    setFocus() {
        this.refs.Input.focus();
    }

    OnBlur(e) {
        if (this.property.OnBlur) this.property.OnBlur(e);
    }

    OnFocus(e) {
        if (this.property.OnFocus) this.property.OnFocus(e);
    }

    InputNumberChange(value) {
        if (!Common.isNullOrEmpty(value)) {
            if (this.property.Scale > 0) value = Common.getNumber(value, this.property.Scale);
            else if (this.property.DataType === "int") value = parseInt(value, 10);
        }

        this.setState({ Value: value })
    }

    ValueChange(value) {
        if (this.property.ValueChange) this.property.ValueChange(value);
    }

    ValueChange2(value) {
        if (this.property.ValueChange2) this.property.ValueChange2(value);
    }

    OnSearch(value) {
        const props = { ...this.props, SearchValue: value }
        this.pageAxis.invokeEventAction(this.property.EventActionName, props);
    }

    OnPressEnter() {
        const { PressEnterEventActionName, PressEnterEventPropertyName } = this.property;
        if (PressEnterEventActionName) {
            const props = { ...this.props };
            if (PressEnterEventPropertyName) props.property = this.pageAxis.getProperty(PressEnterEventPropertyName);

            this.pageAxis.invokeEventAction(PressEnterEventActionName, props);
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

    getSelectText() {
        const selectData = Common.arrayFirst(this.property.AddonAfterDataSource, (f) => Common.isEquals(f.Value, this.state.Value2));
        if (selectData === null) return "";

        return selectData.text === undefined ? "" : selectData.text;
    }

    RenderAddonAfter() {
        if (this.state.isReadOnly2) return this.getSelectText();
        else {
            return (<Select disabled={this.state.Disabled}
                value={this.state.Value2} style={this.property.SelectStyle}
                onChange={this.OnSelectChange.bind(this)}>{this.AddonAfterOptions}</Select>)
        }
    }

    getValueText() {
        if (Common.isNullOrEmpty(this.state.Value)) return this.state.Value;
        const data = Common.arrayFirst(this.property.DataSource, f => Common.isEquals(f.Value, this.state.Value));
        if (data !== null) return data.text;
        return this.state.Value;
    }

    RenderAddonAfterOpenUrl(text) {
        if (!this.state.Value) return text;
        return <a href={this.state.Value} target="_blank" rel="noopener noreferrer">{text}</a>
    }

    render() {
        if (!this.state.isVisible) return null;

        const { property } = this.props

        const rows = property.Rows || 4

        var value = this.state.Value;
        if (value === undefined || value === null) value = "";

        if (property.isDate && value && value.length > 10) value = value.substring(0, 10);

        if (this.state.isReadOnly && property.DataSource) value = this.getValueText();

        if (property.ControlType === "TextArea") {
            const maxLength = this.state.isReadOnly ? undefined : property.MaxLength || 500;
            return (<TextArea rows={rows}
                placeholder={property.placeHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={maxLength}
                readOnly={this.state.isReadOnly}
                disabled={this.state.Disabled}
                value={value} />)
        }

        if (property.ControlType === "Search") {
            return (<Search placeholder={property.placeHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={property.MaxLength}
                onSearch={this.OnSearch.bind(this)}
                readOnly={this.state.isReadOnly}
                enterButton={property.isEnterButton}
                disabled={this.state.Disabled}
                value={value} />)
        }

        if (property.ControlType === "InputNumber" && !this.state.isReadOnly) {
            const width = property.Width || "100%"

            return (<InputNumber placeholder={property.placeHolder}
                style={{ width: width }}
                onChange={this.InputNumberChange.bind(this)}
                maxLength={property.MaxLength}
                max={property.Max}
                min={property.Min}
                step={property.Step || 1}
                addonAfter={property.AddonAfter}
                readOnly={this.state.isReadOnly}
                disabled={this.state.Disabled}
                value={value} />)
        }

        const type = this.state.isReadOnly ? "text" : (property.ControlType || "text");

        let addonAfter = property.AddonAfter;
        if (property.AddonAfterDataSource) addonAfter = this.RenderAddonAfter();
        else if (property.isAddonAfterOpenUrl) addonAfter = this.RenderAddonAfterOpenUrl(addonAfter);

        return (
            <Input placeholder={property.placeHolder}
                onChange={this.OnChange.bind(this)}
                maxLength={property.MaxLength}
                readOnly={this.state.isReadOnly}
                disabled={this.state.Disabled && !this.state.isReadOnly}
                addonAfter={addonAfter}
                type={type}
                ref="Input"
                prefix={this.RenderPrefix()}
                size={property.size}
                onPressEnter={this.OnPressEnter.bind(this)}
                value={value} />
        );
    }
}