import React from "react"
import { Common } from "UtilsCommon"
import BaseIndex from "./BaseIndex"
import { MapToProps } from "UseHooks";
import { Cascader, Input } from "antd"

class Cascader2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state);

        this.property.DataType = "Array";
        this.property.getValue = this.getSelectValue.bind(this);
    }

    componentDidMount() {
        this.getDataSource();
    }

    getOptions() {
        this.ParentValueList = [];
        this.DataNodeList = [];
        if (this.property.isTreeNode) return this.property.DataSource.map(m => this.getTreeNodes(m));
        else return this.getChildOptions(this.property.RootValue)
    }

    getTreeNodes(node) {
        const option = { label: node[this.TextName], value: node[this.ValueName] };

        const dataNode = {};
        dataNode[this.TextName] = node[this.TextName];
        dataNode[this.ValueName] = node[this.ValueName];
        this.DataNodeList.push(dataNode);

        if (node.Children && node.Children.length > 0) {
            option.children = node.Children.map(m => this.getTreeNodes(m));
        }

        return option;
    }

    getChildOptions(parentValue) {
        const dataList = this.property.DataSource.filter(f => Common.isEquals(f[this.ParentValueName], parentValue));

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
            children = this.getChildOptions(option.value);
            if (children.length > 0) option.children = children;
            optionList.push(option);
        });

        return optionList;
    }

    OnChange(value) {
        this.isLoadValue = true;
        this.isChange = true;
        this.setState({ Value: value }, () => { this.isChange = false; this.BindDataValue(); });
    }

    getSelectValue() {
        const { Value } = this.state;
        if (!Common.isArray(Value)) return [];

        if (this.isChange) return Value;

        let valueList = [];

        const DataSourceList = this.property.isTreeNode ? this.DataNodeList : this.property.DataSource;
        Value.forEach(v => {
            const data = Common.arrayFirst(DataSourceList, (f) => Common.isEquals(f[this.ValueName], v));
            if (data !== null) valueList.push(data[this.ValueName]);
        });

        if (this.property.isgetTextValue) valueList = valueList.concat(this.getSelectTextValue());

        return valueList;
    }

    getSelectTextValue() {
        const { Value } = this.state;
        if (!Common.isArray(Value)) return [];

        const textList = [];

        const DataSourceList = this.property.isTreeNode ? this.DataNodeList : this.property.DataSource;
        Value.forEach(v => {
            const data = Common.arrayFirst(DataSourceList, (f) => Common.isEquals(f[this.ValueName], v));
            if (data !== null) textList.push(data[this.TextName]);
        });

        return textList;
    }

    getSelectText() {
        return this.getSelectTextValue().join("/");
    }

    render() {
        if (!this.state.isVisible) return null;

        const { property } = this.props
        const width = property.Width || "100%"

        if (this.state.isReadOnly) {
            const text = this.getSelectText();

            return <Input readOnly={this.state.isReadOnly}
                type="text"
                addonAfter={property.AddonAfter}
                placeholder={property.placeHolder}
                style={{ width: width }}
                value={text} />
        }

        const value = this.getSelectValue()

        return (<Cascader disabled={this.state.Disabled}
            style={{ width: width }}
            value={value}
            onChange={this.OnChange.bind(this)}
            allowClear={!!property.AllowClear}
            options={this.state.Options}
            placeholder={property.placeHolder}
            defaultValue={property.DefaultValue} />)
    }
}

function setProps(owner, page) {
    return {
        DispatchAction: owner.DispatchAction,
        getStateValue: owner.getStateValue
    }
}

//export default MapToProps(setProps)(Cascader2);

export default (props) => {

    return <Cascader />
};