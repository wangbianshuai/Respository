import React from "react"
import { Common } from "UtilsCommon"
import BaseIndex from "./BaseIndex"
import { MapToProps } from "ReactCommon";
import { Cascader, Input } from "antd"

class Cascader2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state);

        this.Property.DataType = "Array";
        this.Property.GetValue = this.GetSelectValue.bind(this);
    }

    componentDidMount() {
        this.GetDataSource();
    }

    GetOptions() {
        return this.GetChildOptions(this.Property.RootValue)
    }

    GetChildOptions(parentValue) {
        const dataList = this.Property.DataSource.filter(f => Common.IsEquals(f[this.ParentValueName], parentValue));

        let optionList = [], option = null, children = null;
        dataList.forEach(m => {
            option = { label: m[this.TextName], value: m[this.ValueName] };
            children = this.GetChildOptions(option.value);
            if (children.length > 0) option.children = children;
            optionList.push(option);
        });

        return optionList;
    }

    OnChange(value) {
        this.IsLoadValue = true;
        this.IsChange = true;
        this.setState({ Value: value }, () => { this.IsChange = false; this.BindDataValue(); });
    }

    GetSelectValue() {
        const { Value } = this.state;
        if (!Common.IsArray(Value)) return [];

        if (this.IsChange) return Value;

        const valueList = [];

        Value.forEach(v => {
            const data = Common.ArrayFirst(this.Property.DataSource, (f) => Common.IsEquals(f[this.ValueName], v));
            if (data !== null) valueList.push(data[this.ValueName]);
        });

        return valueList;
    }

    GetSelectText() {
        const { Value } = this.state;
        if (!Common.IsArray(Value)) return "";

        const textList = [];

        Value.forEach(v => {
            const data = Common.ArrayFirst(this.Property.DataSource, (f) => Common.IsEquals(f[this.ValueName], v));
            if (data !== null) textList.push(data[this.TextName]);
        });

        return textList.join("/");
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property } = this.props
        const width = Property.Width || "100%"

        if (this.state.IsReadOnly) {
            const text = this.GetSelectText();

            return <Input readOnly={this.state.IsReadOnly}
                type="text"
                addonAfter={Property.AddonAfter}
                placeholder={Property.PlaceHolder}
                style={{ width: width }}
                value={text} />
        }

        const value = this.GetSelectValue()

        return (<Cascader disabled={this.state.Disabled}
            style={{ width: width }}
            value={value}
            onChange={this.OnChange.bind(this)}
            allowClear={!!Property.AllowClear}
            options={this.state.Options}
            placeholder={Property.PlaceHolder}
            defaultValue={Property.DefaultValue} />)
    }
}

function setProps(owner, page) {
    return {
        DispatchAction: owner.DispatchAction,
        GetStateValue: owner.GetStateValue
    }
}

export default MapToProps(setProps)(Cascader2);