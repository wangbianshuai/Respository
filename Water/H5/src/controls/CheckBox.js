import React from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex"
import { Checkbox, InputItem } from "antd-mobile";
const AgreeItem = Checkbox.AgreeItem;
const CheckboxItem = Checkbox.CheckboxItem

export default class CheckBox extends BaseIndex {
    constructor(props) {
        super(props)

        this.SetDefaultValue();
    }

    SetDefaultValue() {
        const obj = { SelectedText: "是", UnSelectedText: "否", SelectedValue: true, UnSelectedValue: false };
        for (let key in obj) Common.SetDefaultValue(this.Property, key, obj[key])
    }

    OnChange(e) {
        const v = e.target.checked ? this.Property.SelectedValue : this.Property.UnSelectedValue;
        this.setState({ Value: v })
    }

    GetSelectText(value) {
        const { SelectedValue, SelectedText, UnSelectedText } = this.Property;
        return Common.IsEquals(SelectedValue, value, true) ? SelectedText : UnSelectedText;
    }

    render() {
        const { Property } = this.props
        const { IsVisible } = this.state;

        const style = Property.Style = {};
        if (IsVisible === false) style.display = "none";

        const value = Common.IsNullOrEmpty(this.state.Value) ? undefined : this.state.Value.toString()
        const checked = Common.IsEquals(value, Property.SelectedValue);

        if (this.state.IsReadonly) {
            const text = this.GetSelectText(value);

            return <InputItem editable={!this.state.IsReadonly}
                type="text"
                style={style}
                value={text}>{Property.Label}</InputItem>
        }

        if (Property.IsAgree) {
            return <AgreeItem checked={checked} style={style} className={Property.ClassName} onChange={this.OnChange.bind(this)}>{Property.Label}</AgreeItem>
        }

        return (
            <CheckboxItem checked={checked} style={style} className={Property.ClassName} onChange={this.OnChange.bind(this)}>{Property.Label}</CheckboxItem>
        )
    }
}