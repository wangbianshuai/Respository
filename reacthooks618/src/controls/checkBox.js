import React from "react";
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex";
import { Checkbox } from "antd";

export default class CheckBox2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.name = "CheckBox2";

        this.CheckedValue = this.property.CheckedValue || 1;
        this.UnCheckedValue = this.property.UnCheckedValue || 0;
    }


    getValue() {
        if (this.CheckedValue !== undefined) return this.state.Value === this.CheckedValue ? this.CheckedValue : this.UnCheckedValue;
        else return this.state.Value;
    }

    CheckBoxChange(e) {
        this.isLoadValue = true;
        const value = e.target.checked ? this.CheckedValue : this.UnCheckedValue
        this.setState({ Value: value }, () => this.BindDataValue());

        if (this.property.ValueChange) this.property.ValueChange(value)
    }

    render() {
        if (!this.state.isVisible) return null;

        const { property } = this.props

        let checked = Common.isNullOrEmpty(this.state.Value) ? false : this.state.Value.toString().toLowerCase() === "true" || Common.isEquals(this.state.Value, this.CheckedValue);

        if (this.state.isReadOnly) {
            return <Checkbox checked={checked} style={property.style}>{property.text}</Checkbox>
        }
        else {
            return <Checkbox checked={checked} style={property.style} disabled={this.state.Disabled}
                onChange={this.CheckBoxChange.bind(this)}>{property.text}</Checkbox>
        }
    }
}