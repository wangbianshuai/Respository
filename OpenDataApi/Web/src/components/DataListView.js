import React from "react"
import { Common } from "UtilsCommon";
import PropertyItem from "./PropertyItem";
import BaseIndex from "./BaseIndex";
import { List } from "antd";

export default class DataListView extends BaseIndex {
    constructor(props) {
        super(props);

        this.Property.Add = this.Add.bind(this);
        this.Property.Update = this.Update.bind(this);
        this.Property.Remove = this.Remove.bind(this);
        this.Property.SetValue = this.SetValue.bind(this);
        this.Property.GetValue = () => this.state.DataList;
        const dataList = this.Property.Value || this.Property.DefaultValue || [];
        this.state = Object.assign({ DataList: dataList }, this.state);
        this.EventActions.Components.push(this.Property);
        this.Property.SetDisabled = this.SetDisabled.bind(this);
        this.Property.JudgeNullable = this.JudgeNullable.bind(this);
        this.ControlProperties = {}
    }

    JudgeNullable(value) {
        const { NullTipMessage } = this.Property;
        if (value.length === 0) return NullTipMessage;

        const list = this.ItemSetDisabledProperties.filter(f => f.IsEdit);

        let msg = "", v = null, p = null;

        for (let i = 0; i < list.length; i++) {
            p = list[i];
            v = p.GetValue();
            if (!p.IsNullable && p.Type === "Select" && Common.IsNullOrEmpty(v)) {
                msg = p.NullTipMessage || "请选择" + p.Label + "！"
                break;
            }
            else if (!p.IsNullable && Common.IsNullOrEmpty(v)) {
                msg = p.NullTipMessage || p.Label + "不能为空！"
                break;
            }
        }

        return msg;
    }

    Add(data) {
        const { PrimaryKey } = this.Property;
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

        this.SetValue(list);
    }

    Update(data) {
        const primaryKey = this.Property.PrimaryKey;
        const id = data[primaryKey];
        const dataList = this.state.DataList
        const editData = Common.ArrayFirst(dataList, (f) => Common.IsEquals(f[primaryKey], id, true));
        if (editData !== null) {
            for (let key in data) editData[key] = data[key];

            const itemProperties = this.ControlProperties[id];
            if (itemProperties) {
                let p = null, name = null;
                for (var key2 in itemProperties) {
                    p = itemProperties[key2];
                    name = p.PropertyName || p.Name;

                    if (data[name] !== undefined) {
                        p.Value = data[name];
                        p.SetValue && p.SetValue(p.Value);
                    }
                }
            }
        }
    }

    Remove(id) {
        const primaryKey = this.Property.PrimaryKey;
        this.SetValue(this.state.DataList.filter(f => !Common.IsEquals(f[primaryKey], id, true)));
    }

    SetValue(dataList) {
        dataList = dataList || [];
        this.setState({ DataList: dataList });
    }

    SetDisabled(disabled) {
        this.ItemSetDisabledProperties.forEach(p => p.SetDisabled && p.SetDisabled(disabled));
    }

    RenderListItem(data, index) {
        const { PrimaryKey, Properties, ItemProps } = this.Property;
        const id = data[PrimaryKey];

        if (this.Property.IsComplexEdit) return Properties.map(p => this.RenderItemProperty(p, id, data, index));

        const itemProps = ItemProps || {}
        return (
            <List.Item key={id} {...itemProps}>
                {Properties.map(p => this.RenderItemProperty(p, id, data, index))}
            </List.Item>
        )
    }

    RenderItemProperty(p, id, data, index) {
        p = this.AssignProperty(p, id, data, index);

        const { EventActions, Property } = this;

        return <PropertyItem Property={p} key={p.Id} View={Property} EventActions={EventActions} />
    }

    AssignProperty(p, id, data, index) {
        const id2 = p.Id + id;

        if (!this.ControlProperties[id]) this.ControlProperties[id] = {};
        const itemProperties = this.ControlProperties[id];

        const propertyName = p.PropertyName || p.Name;

        if (itemProperties[id2]) p = itemProperties[id2];
        else { p = Object.assign({}, p, { Value: data[propertyName] }); itemProperties[id2] = p; }
        p.Id = p.Id + id;
        p.DataId = id;
        p.Data = data;
        p.IsBind = true;

        if (p.IsEdit || p.IsDisabled) this.ItemSetDisabledProperties.push(p);

        const visibleName = `${p.Name}Visible`
        if (data[visibleName] === false) p.IsVisible = false;

        const { DeletePropertyName, IsFirstDelete } = this.Property;
        if (IsFirstDelete === false && p.Name === DeletePropertyName && index === 0) p.IsVisible = false;

        if (p.IsLastNoVisible && index === this.state.DataList.length - 1) p.IsVisible = false;

        if (p.Properties) p.Properties = this.AssingProperties(p.Properties, id, data, index);

        return p;
    }

    AssingProperties(properties, id, data, index) {
        return properties.map(p => this.AssignProperty(p, id, data, index));
    }

    render() {
        if (!this.state.IsVisible) return null;

        if (this.state.DataList.length === 0) return null;

        this.ItemSetDisabledProperties = [];

        if (this.Property.IsComplexEdit) return this.state.DataList.map((m, i) => this.RenderListItem(m, i))

        const listProps = this.Property.ListProps || {}
        return (
            <List {...listProps}>
                {this.state.DataList.map((m, i) => this.RenderListItem(m, i))}
            </List>
        )
    }
}