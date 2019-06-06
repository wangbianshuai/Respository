import React from "react"
import { Common } from "UtilsCommon";
import PropertyItem from "./PropertyItem";
import BaseIndex from "./BaseIndex";
import { List } from "antd-mobile";

export default class DataListView extends BaseIndex {
    constructor(props) {
        super(props);

        this.Property.Add = this.Add.bind(this);
        this.Property.Remove = this.Remove.bind(this);
        this.Property.SetValue = this.SetValue.bind(this);
        this.Property.GetValue = () => this.state.DataList;
        const dataList = this.Property.Value || this.Property.DefaultValue || [];
        this.state = Object.assign({ DataList: dataList }, this.state);
        this.EventActions.Components.push(this.Property);
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

    Remove(id) {
        const primaryKey = this.Property.PrimaryKey;
        this.SetValue(this.state.DataList.filter(f => !Common.IsEquals(f[primaryKey], id, true)));
    }

    SetValue(dataList) {
        dataList = dataList || [];
        this.setState({ DataList: dataList });
    }

    RenderListItem(data, index) {
        const { PrimaryKey, Properties, ItemProps } = this.Property;
        const id = data[PrimaryKey];

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

        return <PropertyItem Property={p} key={p.Id} View={Property} EventActions={EventActions}/>
    }

    AssignProperty(p, id, data, index) {
        p = Object.assign({ Value: data[p.Name] }, p);
        p.Id = p.Id + id;
        p.DataId = id;
        p.Data = data;
        p.IsBind = true;

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

        const listProps = this.Property.ListProps || {}
        return (
            <List {...listProps}>
                {this.state.DataList.map((m, i) => this.RenderListItem(m, i))}
            </List>
        )
    }
}
