import React from "react";
import { Card, Button, Row, Col } from "antd";
import { Common } from "UtilsCommon";
import PropertyItem from "./PropertyItem";
import BaseIndex from "./BaseIndex";

export default class ComplexDataGrid extends BaseIndex {
    constructor(props) {
        super(props)

        this.Property.Add = this.Add.bind(this);
        this.Property.Update = this.Update.bind(this);
        this.Property.Remove = this.Remove.bind(this);
        this.Property.SetValue = this.SetValue.bind(this);
        this.Property.GetValue = this.GetValue.bind(this);
        const dataList = this.Property.Value || this.Property.DefaultValue || [];
        this.state = Object.assign({ DataList: dataList }, this.state);
        this.EventActions.Components.push(this.Property);
        this.Property.JudgeNullable = this.JudgeNullable.bind(this);

        this.ControlProperties = {}
    }

    SetValue(dataList) {
        dataList = dataList || [];
        this.setState({ DataList: dataList });
    }

    GetValue() {
        return this.state.DataList;
    }

    JudgeNullable(value) {
        const { NullTipMessage } = this.Property;
        if (value.length === 0) return NullTipMessage;

        let msg = "", v = null, p = null;

        for (let i = 0; i < this.RowsColsProperties.length; i++) {
            p = this.RowsColsProperties[i];
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
        const { DataList } = this.state;

        data.Id = data.Id || Common.CreateGuid();

        let blExists = false;
        const list = [];

        for (let i = 0; i < DataList.length; i++) {
            if (DataList[i].Id === data.Id) blExists = true;
            else list.push(DataList[i])
        }

        if (blExists) return;
        else list.push(data);

        this.SetValue(list);
    }

    Update(data) {
        const id = data.Id;
        const dataList = this.state.DataList
        const editData = Common.ArrayFirst(dataList, (f) => Common.IsEquals(f.Id, id, true));
        if (editData !== null) {
            for (let key in data) editData[key] = data[key];

            this.SetValue(dataList.map(m => m));
        }
    }

    Remove(id) {
        this.SetValue(this.state.DataList.filter(f => !Common.IsEquals(f.Id, id, true)));
    }

    RenderHeaderRowsCols() {
        return (
            <Row gutter={6} className={"RowHeader"}>
                {this.RenderHeaderCols()}
            </Row>
        )
    }

    RendDataItemList() {
        this.RowsColsProperties = [];
        return this.state.DataList.map((m) => this.RendDataItem(m));
    }

    RendDataItem(data) {
        data.Id = data.Id || Common.CreateGuid();
        return (
            <Row gutter={6} key={data.Id} style={{ padding: "8px 8px", borderBottom: "1px solid #e8e8e8" }}>
                {this.RenderRowCols(data)}
            </Row>
        )
    }

    AssignProperty(p, data) {
        const id = data.Id;
        const id2 = p.Id + data.Id;

        if (!this.ControlProperties[id]) this.ControlProperties[id] = {};
        const itemProperties = this.ControlProperties[id];

        const propertyName = p.PropertyName || p.Name;

        if (itemProperties[id2]) p = itemProperties[id2];
        else { p = Object.assign({}, p, { Value: data[propertyName] }); itemProperties[id2] = p; }
        p.Id = id2;
        p.DataId = id;
        p.Data = data;
        p.IsBind = true;

        this.RowsColsProperties.push(p);

        return p;
    }

    RenderItemProperty(p, data) {
        p = this.AssignProperty(p, data);

        const { EventActions, Property } = this;

        return <PropertyItem Property={p} key={p.Id} View={Property} EventActions={EventActions} />
    }

    RenderRowCols(data) {
        return this.Property.Properties.map(m => <Col span={m.Span} key={m.Id}>{this.RenderItemProperty(m, data)}</Col>)
    }

    RenderHeaderCols() {
        return this.Property.Properties.map(m => <Col span={m.Span} key={m.Name}>{m.Header || m.Label}</Col>)
    }

    AddRow() {
        return () => this.Add({})
    }

    RenderAddButton() {
        if (this.Property.IsAdd === false) return null;
        return <Button onClick={this.AddRow()} icon="plus" type="primary">添加</Button>
    }

    render() {
        return (
            <Card title={this.Property.Title} headStyle={{ fontWeight: 700 }} extra={this.RenderAddButton()}
                bordered={false} style={{ marginBottom: 16 }} bodyStyle={{ padding: 0, paddingTop: 4 }}>
                {this.RenderHeaderRowsCols()}
                {this.RendDataItemList()}
            </Card>
        );
    }
}