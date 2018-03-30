import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Select } from "antd"
const Option = Select.Option;

export default class Select2 extends Index {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state)

        this.Property.GetValue = () => this.GetSelectValue(true);
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
                options.push(<Option value={value} key={value}>{d[this.TextName]}</Option>)
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

    render() {
        const { Property } = this.props


        const width = Property.Width || "100%"

        const value = this.GetSelectValue()

        return (<Select disabled={this.state.Disabled}
            style={{ width: width }}
            value={value}
            onChange={this.OnChange.bind(this)}
            allowClear={Property.AllowClear}
            mode={Property.Mode}
            maxTagCount={Property.MaxTagCount}
            placeholder={Property.PlaceHolder}
            defaultValue={Property.DefaultValue} >{this.state.Options}</Select>)
    }
}