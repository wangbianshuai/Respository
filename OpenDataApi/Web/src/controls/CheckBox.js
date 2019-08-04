import React from "react";
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex";
import { Checkbox } from "antd";

export default class CheckBox2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.Name = "CheckBox2";

        this.CheckedValue = this.Property.CheckedValue || 1;
        this.UnCheckedValue = this.Property.UnCheckedValue || 0;
    }


    GetValue() {
        if (this.CheckedValue !== undefined) return this.state.Value === this.CheckedValue ? this.CheckedValue : this.UnCheckedValue;
        else return this.state.Value;
    }

    CheckBoxChange(e) {
        this.setState({ Value: e.target.checked ? this.CheckedValue : this.UnCheckedValue });
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property } = this.props

        let checked = Common.IsNullOrEmpty(this.state.Value) ? false : this.state.Value.toString().toLowerCase() === "true" || Common.IsEquals(this.state.Value, this.CheckedValue);

        if (this.state.IsReadOnly) {
            return <Checkbox checked={checked} style={Property.Style}>{Property.Text}</Checkbox>
        }
        else {
            return <Checkbox checked={checked} style={Property.Style} disabled={this.state.Disabled}
                onChange={this.CheckBoxChange.bind(this)}>{Property.Text}</Checkbox>
        }
    }
}