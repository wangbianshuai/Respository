import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Checkbox } from "antd-mobile"

export default class CheckBox2 extends Index {
    constructor(props) {
        super(props)

        this.Name = "CheckBox2";
    }

    CheckBoxChange(e) {
        this.setState({ Value: e.target.checked ? 1 : 0 });
    }

    render() {
        const { Property } = this.props

        let checked = Common.IsNullOrEmpty(this.state.Value) ? false : this.state.Value.toString().toLowerCase() === "true" || parseInt(this.state.Value, 10) === 1;

        if (this.state.IsReadonly) {
            return <Checkbox checked={checked}>{Property.Text}</Checkbox>
        }
        else {
            return <Checkbox checked={checked} disabled={this.state.Disabled}
                onChange={this.CheckBoxChange.bind(this)}>{Property.Text}</Checkbox>
        }
    }
}