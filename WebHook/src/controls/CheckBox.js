import { useMemo, useState, useEffect } from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex";
import { Checkbox } from "antd";

export default (props) => {
    const instance = useMemo(() => new CheckBox2(), []);

    instance.Init2(props);

    const { Value, IsReadOnly, ClassName, Style, IsVisible } = instance.InitialState;

    instance.InitState("Value", useState(Value))
    instance.InitState("IsReadOnly", useState(IsReadOnly))
    instance.InitState("ClassName", useState(ClassName))
    instance.InitState("Style", useState(Style))
    instance.InitState("IsVisible", useState(IsVisible))

    useEffect(() => instance.ValueChangeEffect(), [instance, instance.state.Value]);

    return instance.render();
}

class CheckBox2 extends BaseIndex {
    Init2(props) {
        if (this.Init(props)) return;

        this.CheckedValue = this.Property.CheckedValue || 1;
        this.UnCheckedValue = this.Property.UnCheckedValue || 0;
    }

    GetValue() {
        if (this.CheckedValue !== undefined) return this.state.Value === this.CheckedValue ? this.CheckedValue : this.UnCheckedValue;
        else return this.state.Value;
    }

    CheckBoxChange(e) {
        this.IsLoadValue = true;
        const value = e.target.checked ? this.CheckedValue : this.UnCheckedValue
        this.setState({ Value: value });

        if (this.Property.ValueChange) this.Property.ValueChange(value)
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