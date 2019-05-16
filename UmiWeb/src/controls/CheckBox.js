import React from "react";
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex";
import { Checkbox } from "antd";

export default class CheckBox2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.Name = "CheckBox2";
    }

    CheckBoxChange(e) {
        this.setState({ Value: e.target.checked ? 1 : 0 });
    }

    render() {
        if (!this.state.IsVisible) return null;
        
        const { Property } = this.props

        let checked = Common.IsNullOrEmpty(this.state.Value) ? false : this.state.Value.toString().toLowerCase() === "true" || parseInt(this.state.Value, 10) === 1;

        if (this.state.IsReadOnly) {
            return <Checkbox checked={checked}>{Property.Text}</Checkbox>
        }
        else {
            return <Checkbox checked={checked} disabled={this.state.Disabled}
                onChange={this.CheckBoxChange.bind(this)}>{Property.Text}</Checkbox>
        }
    }
}