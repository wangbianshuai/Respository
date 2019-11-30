import { useMemo, useState, useEffect } from "react"
import { Common } from "UtilsCommon"
import BaseIndex from "./BaseIndex"
import { useMapToProps } from "ReactCommon";
import { Cascader, Input } from "antd"

export default (props) => {
    const instance = useMemo(() => new Cascader2(), []);
    const [dispatchAction, getStateValue] = useMapToProps(["DispatchAction", "GetStateValue"])

    instance.Init2(props, dispatchAction, getStateValue);

    const { Value, IsReadOnly, ClassName, Style, IsVisible } = instance.InitialState;

    instance.InitState("Value", useState(Value))
    instance.InitState("IsReadOnly", useState(IsReadOnly))
    instance.InitState("ClassName", useState(ClassName))
    instance.InitState("Style", useState(Style))
    instance.InitState("IsVisible", useState(IsVisible))

    instance.InitState("Options", useState([]))

    useEffect(() => instance.componentDidMount(), [instance])

    useEffect(() => instance.ValueChangeEffect(), [instance, instance.state.Value]);

    return instance.render();
}

class Cascader2 extends BaseIndex {
    Init2(props, dispatchAction, getStateValue) {
        if (this.Init(props)) return;

        this.DispatchAction = dispatchAction;
        this.GetStateValue = getStateValue;

        this.Property.DataType = "Array";
        this.Property.GetValue = this.GetSelectValue.bind(this);
    }

    componentDidMount() {
        this.GetDataSource();
    }

    GetOptions() {
        this.ParentValueList = [];
        this.DataNodeList = [];
        if (this.Property.IsTreeNode) return this.Property.DataSource.map(m => this.GetTreeNodes(m));
        else return this.GetChildOptions(this.Property.RootValue)
    }

    GetTreeNodes(node) {
        const option = { label: node[this.TextName], value: node[this.ValueName] };

        const dataNode = {};
        dataNode[this.TextName] = node[this.TextName];
        dataNode[this.ValueName] = node[this.ValueName];
        this.DataNodeList.push(dataNode);

        if (node.Children && node.Children.length > 0) {
            option.children = node.Children.map(m => this.GetTreeNodes(m));
        }

        return option;
    }

    GetChildOptions(parentValue) {
        const dataList = this.Property.DataSource.filter(f => Common.IsEquals(f[this.ParentValueName], parentValue));

        let blExists = false;
        for (var i = 0; i < this.ParentValueList.length; i++) {
            if (this.ParentValueList[i] === parentValue) {
                blExists = true;
                break;
            }
        }

        if (blExists) return [];
        else this.ParentValueList.push(parentValue);

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

        let valueList = [];

        const DataSourceList = this.Property.IsTreeNode ? this.DataNodeList : this.Property.DataSource;
        Value.forEach(v => {
            const data = Common.ArrayFirst(DataSourceList, (f) => Common.IsEquals(f[this.ValueName], v));
            if (data !== null) valueList.push(data[this.ValueName]);
        });

        if (this.Property.IsGetTextValue) valueList = valueList.concat(this.GetSelectTextValue());

        return valueList;
    }

    GetSelectTextValue() {
        const { Value } = this.state;
        if (!Common.IsArray(Value)) return [];

        const textList = [];

        const DataSourceList = this.Property.IsTreeNode ? this.DataNodeList : this.Property.DataSource;
        Value.forEach(v => {
            const data = Common.ArrayFirst(DataSourceList, (f) => Common.IsEquals(f[this.ValueName], v));
            if (data !== null) textList.push(data[this.TextName]);
        });

        return textList;
    }

    GetSelectText() {
        return this.GetSelectTextValue().join("/");
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