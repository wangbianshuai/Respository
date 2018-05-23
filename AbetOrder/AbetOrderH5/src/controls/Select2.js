import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Picker, List, InputItem } from "antd-mobile";

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
                options.push({ value: value, label: d[this.TextName] })
                this.ValueList.push(value);
            }
        });

        return options;
    }

    OnChange(value) {
        this.setState({ Value: value[0] })
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

    Exists(value) {
        const option = Common.ArrayFirst(this.state.Options, (f) => Common.IsEquals(f.value, value, true));
        return !Common.IsEmptyObject(option)
    }

    render() {
        const { Property } = this.props

        if (this.state.IsReadonly) {
            const text = this.GetSelectText();

            return <InputItem editable={!this.state.IsReadonly}
                disabled={this.state.Disabled}
                type="text"
                value={text}>{Property.Label}</InputItem>
        }

        const value = this.GetSelectValue()

        let value2 = Common.IsNullOrEmpty(value) ? [] : [value];

        const extra = "请选择" + (Property.IsNullable === false ? "" : "(可选)");

        if (!this.Exists(value)) value2 = [];

        return (<Picker disabled={this.state.Disabled}
            value={value2}
            cascade={false}
            onChange={this.OnChange.bind(this)}
            onOk={this.OnChange.bind(this)}
            data={[this.state.Options]}
            title={Property.Label}
            extra={extra}
            defaultValue={Property.DefaultValue}>
            <List.Item arrow="horizontal">{Property.Label}</List.Item>
        </Picker>)
    }
}