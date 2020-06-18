import React from "react";
import { Card, Button, Row, Col } from "antd";
import { Common } from "UtilsCommon";
import PropertyItem from "./PropertyItem";
import BaseIndex from "./BaseIndex";

export default class ComplexDataGrid extends BaseIndex {
    constructor(props) {
        super(props)

        this.property.Add = this.Add.bind(this);
        this.property.Update = this.Update.bind(this);
        this.property.remove = this.remove.bind(this);
        this.property.setValue = this.setValue.bind(this);
        this.property.getValue = this.getValue.bind(this);
        const dataList = this.property.Value || this.property.DefaultValue || [];
        this.state = Object.assign({ DataList: dataList }, this.state);
        this.pageAxis.Components.push(this.property);
        this.property.JudgeNullable = this.JudgeNullable.bind(this);

        this.ControlProperties = {}
    }

    setValue(dataList) {
        dataList = dataList || [];
        this.setState({ DataList: dataList });
    }

    getValue() {
        return this.state.DataList;
    }

    JudgeNullable(value) {
        const { NullTipMessage } = this.property;
        if (value.length === 0) return NullTipMessage;

        let msg = "", v = null, p = null;

        for (let i = 0; i < this.RowsColsProperties.length; i++) {
            p = this.RowsColsProperties[i];
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
        const { DataList } = this.state;

        data.id = data.id || Common.createGuid();

        let blExists = false;
        const list = [];

        for (let i = 0; i < DataList.length; i++) {
            if (DataList[i].id === data.id) blExists = true;
            else list.push(DataList[i])
        }

        if (blExists) return;
        else list.push(data);

        this.setValue(list);
    }

    Update(data) {
        const id = data.id;
        const dataList = this.state.DataList
        const editData = Common.arrayFirst(dataList, (f) => Common.isEquals(f.id, id, true));
        if (editData !== null) {
            for (let key in data) editData[key] = data[key];

            this.setValue(dataList.map(m => m));
        }
    }

    remove(id) {
        this.setValue(this.state.DataList.filter(f => !Common.isEquals(f.id, id, true)));
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
        data.id = data.id || Common.createGuid();
        return (
            <Row gutter={6} key={data.id} style={{ padding: "8px 8px", borderBottom: "1px solid #e8e8e8" }}>
                {this.RenderRowCols(data)}
            </Row>
        )
    }

    AssignProperty(p, data) {
        const id = data.id;
        const id2 = p.id + data.id;

        if (!this.ControlProperties[id]) this.ControlProperties[id] = {};
        const itemProperties = this.ControlProperties[id];

        const propertyName = p.propertyName || p.name;

        if (itemProperties[id2]) p = itemProperties[id2];
        else { p = Object.assign({}, p, { Value: data[propertyName] }); itemProperties[id2] = p; }
        p.id = id2;
        p.DataId = id;
        p.data = data;
        p.isBind = true;

        this.RowsColsProperties.push(p);

        return p;
    }

    RenderItemProperty(p, data) {
        p = this.AssignProperty(p, data);

        const { pageAxis, property } = this;

        return <PropertyItem property={p} key={p.id} view={property} pageAxis={pageAxis} />
    }

    RenderRowCols(data) {
        return this.property.Properties.map(m => <Col span={m.Span} key={m.id}>{this.RenderItemProperty(m, data)}</Col>)
    }

    RenderHeaderCols() {
        return this.property.Properties.map(m => <Col span={m.Span} key={m.name}>{m.Header || m.label}</Col>)
    }

    AddRow() {
        return () => this.Add({})
    }

    RenderAddButton() {
        if (this.property.isAdd === false) return null;
        return <Button onClick={this.AddRow()} icon="plus" type="primary">添加</Button>
    }

    render() {
        return (
            <Card title={this.property.Title} headStyle={{ fontWeight: 700 }} extra={this.RenderAddButton()}
                bordered={false} style={{ marginBottom: 16 }} bodyStyle={{ padding: 0, paddingTop: 4 }}>
                {this.RenderHeaderRowsCols()}
                {this.RendDataItemList()}
            </Card>
        );
    }
}