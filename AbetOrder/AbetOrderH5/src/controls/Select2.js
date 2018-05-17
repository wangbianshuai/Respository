import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import {  InputItem } from "antd-mobile";

export default class Select2 extends Index {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state)

        this.Property.GetValue = () => this.GetSelectValue(true);

        this.Property.GetText = () => this.GetSelectText();
    }

    componentWillMount() {
        this.GetDataSource();
    }

    GetOptions(parentValue) {
        const options = [];
        this.ValueList = [];

        let value = null;
        Common.IsArray(this.Property.DataSource) && this.Property.DataSource.forEach(d => {
            value = d[this.ValueName]

            if (this.JudgePush(d, parentValue)) {
                options.push(<option value={value} key={value}>{d[this.TextName]}</option>)
                this.ValueList.push(value);
            }
        });

        return options;
    }

    OnChange(value) {
        this.setState({ Value: value })
    }

    ValueChange(value) {
        const { Property } = this.props
        if (Property.ValueChange) Property.ValueChange(value, this.GetSelectData(value));

        this.ChildPropertiesChanged();
    }

    GetSelectValue(blGet) {
        let value = Common.IsNullOrEmpty(this.state.Value) ? undefined : this.state.Value.toString()
        if (!Common.IsNullOrEmpty(value) && Common.IsArray(this.ValueList)) value = Common.ArrayFirst(this.ValueList, (f) => Common.IsEquals(f, value, true));
        if (blGet) return value === undefined ? null : value;
        return value;
    }

    GetSelectText() {
        const selectData = this.GetSelectData(this.state.Value);
        if (selectData === null) return "";

        return selectData[this.TextName] === undefined ? "" : selectData[this.TextName];
    }

    render() {
        const { Property } = this.props

        const width = Property.Width || "100%"

        if (this.state.IsReadonly) {
            const text = this.GetSelectText();

            return <InputItem readOnly={this.state.IsReadonly}
                type="text"
                placeholder={Property.PlaceHolder}
                style={{ width: width }}
                value={text} />
        }

        const value = this.GetSelectValue()

        return (<select disabled={this.state.Disabled}
            style={{ width: width }}
            value={value}
            onChange={this.OnChange.bind(this)}
            defaultValue={Property.DefaultValue} >{this.state.Options}</select>)
    }
}