import React from "react"
import { Common } from "UtilsCommon";
import PropertyItem from "./PropertyItem";
import BaseIndex from "./BaseIndex";
import { List } from "antd";

export default class DataListView extends BaseIndex {
    constructor(props) {
        super(props);

        this.property.Add = this.Add.bind(this);
        this.property.Update = this.Update.bind(this);
        this.property.remove = this.remove.bind(this);
        this.property.setValue = this.setValue.bind(this);
        this.property.getValue = () => this.state.DataList;
        const dataList = this.property.Value || this.property.DefaultValue || [];
        this.state = Object.assign({ DataList: dataList }, this.state);
        this.pageAxis.Components.push(this.property);
        this.property.setDisabled = this.setDisabled.bind(this);
        this.property.JudgeNullable = this.JudgeNullable.bind(this);
        this.ControlProperties = {}
    }

    JudgeNullable(value) {
        const { NullTipMessage } = this.property;
        if (value.length === 0) return NullTipMessage;

        const list = this.ItemsetDisabledProperties.filter(f => f.isEdit && f.isVisible !== false);

        let msg = "", v = null, p = null;

        for (let i = 0; i < list.length; i++) {
            p = list[i];
            v = p.getValue();
            if (!p.isNullable && p.type === "Select" && Common.isNullOrEmpty(v)) {
                msg = p.NullTipMessage || "请选择" + p.label + "！"
                break;
            }
            else if (!p.isNullable && Common.isNullOrEmpty(v)) {
                msg = p.NullTipMessage || p.label + "不能为空！"
                break;
            }
        }

        return msg;
    }

    Add(data) {
        const { PrimaryKey } = this.property;
        const { DataList } = this.state;

        const id = data[PrimaryKey];
        let blExists = false;
        const list = [];

        for (let i = 0; i < DataList.length; i++) {
            if (DataList[i][PrimaryKey] === id) blExists = true;
            else list.push(DataList[i])
        }

        if (blExists) return;
        else list.push(data);

        this.setValue(list);
    }

    Update(data) {
        const primaryKey = this.property.PrimaryKey;
        const id = data[primaryKey];
        const dataList = this.state.DataList
        const editData = Common.arrayFirst(dataList, (f) => Common.isEquals(f[primaryKey], id, true));
        if (editData !== null) {
            for (let key in data) editData[key] = data[key];

            const itemProperties = this.ControlProperties[id];
            if (itemProperties) {
                let p = null, name = null;
                for (var key2 in itemProperties) {
                    p = itemProperties[key2];
                    name = p.propertyName || p.name;

                    if (data[name] !== undefined) {
                        p.Value = data[name];
                        p.setValue && p.setValue(p.Value);
                    }
                }
            }
        }
    }

    remove(id) {
        const primaryKey = this.property.PrimaryKey;
        this.setValue(this.state.DataList.filter(f => !Common.isEquals(f[primaryKey], id, true)));
    }

    setValue(dataList) {
        dataList = dataList || [];
        this.setState({ DataList: dataList });
    }

    setDisabled(disabled) {
        this.ItemsetDisabledProperties.forEach(p => p.setDisabled && p.setDisabled(disabled));
    }

    RenderListItem(data, index) {
        const { PrimaryKey, properties, ItemProps } = this.property;
        const id = data[PrimaryKey];

        if (this.property.isComplexEdit) return properties.map(p => this.RenderItemProperty(p, id, data, index));

        const itemProps = ItemProps || {}
        return (
            <List.Item key={id} {...itemProps}>
                {properties.map(p => this.RenderItemProperty(p, id, data, index))}
            </List.Item>
        )
    }

    RenderItemProperty(p, id, data, index) {
        p = this.AssignProperty(p, id, data, index);

        const { pageAxis, property } = this;

        return <PropertyItem property={p} key={p.id} view={property} pageAxis={pageAxis} />
    }

    AssignProperty(p, id, data, index) {
        const id2 = p.id + id;

        if (!this.ControlProperties[id]) this.ControlProperties[id] = {};
        const itemProperties = this.ControlProperties[id];

        const propertyName = p.propertyName || p.name;

        if (itemProperties[id2]) p = itemProperties[id2];
        else { p = Object.assign({}, p, { Value: data[propertyName] }); itemProperties[id2] = p; }
        p.id = p.id + id;
        p.DataId = id;
        p.data = data;
        p.isBind = true;

        if (p.isEdit || p.isDisabled) this.ItemsetDisabledProperties.push(p);

        const visibleName = `${p.name}Visible`
        if (data[visibleName] !== undefined) p.isVisible = data[visibleName];

        const { DeletePropertyName, isFirstDelete } = this.property;
        if (isFirstDelete === false && p.name === DeletePropertyName && index === 0) p.isVisible = false;

        if (p.isLastNoVisible && index === this.state.DataList.length - 1) p.isVisible = false;

        if (p.properties) p.properties = this.AssingProperties(p.properties, id, data, index);

        return p;
    }

    AssingProperties(properties, id, data, index) {
        return properties.map(p => this.AssignProperty(p, id, data, index));
    }

    render() {
        if (!this.state.isVisible) return null;

        if (this.state.DataList.length === 0) return null;

        this.ItemsetDisabledProperties = [];

        if (this.property.isComplexEdit) return this.state.DataList.map((m, i) => this.RenderListItem(m, i))

        const listProps = this.property.ListProps || {}
        return (
            <List {...listProps}>
                {this.state.DataList.map((m, i) => this.RenderListItem(m, i))}
            </List>
        )
    }
}