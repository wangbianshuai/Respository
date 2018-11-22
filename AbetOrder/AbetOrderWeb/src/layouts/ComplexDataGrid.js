import React from "react"
import { Card } from "antd"
import DataGridView from "../components/DataGridView"
import Button2 from "../controls/Button2"
import Index from "./Index"
import TextBox2 from "../controls/TextBox2"
import Select2 from "../controls/Select2";
import * as Common from "../utils/Common";

export default class ComplexDataGrid extends Index {
    constructor(props) {
        super(props)

        this.state = {
            DataList: []
        }
    }

    componentWillMount() {
        this.RowProperty = {}
        this.InitDataProperties();

        this.props.Property.GetRowProperty = () => this.RowProperty;

        this.props.Property.GetDataList = () => this.state.DataList;
        this.props.Property.SetDataList = (dataList) => this.setState({ DataList: dataList });

        const { Properties } = this.props.Property.DataView;
        const { PrimaryKey } = this.props.Property;

        this.props.Property.GetValue = () => {
            const dataList = [];
            let data = null;
            this.state.DataList.forEach(d => {
                if (!d.IsNew) {
                    data = {};
                    data[PrimaryKey] = d[PrimaryKey]
                    Properties.forEach(p => data[p.Name] = d[p.Name]);
                    dataList.push(data);
                }
            })
            return dataList;
        };

        const { EntityData } = this.props.View
        if (EntityData) {
            let dataList = EntityData[this.props.Property.PropertyName];
            if (Common.IsArray(dataList)) {
                dataList = dataList.map(m => { return { ...m, IsEdit: true, IsDelete: true } })
                this.props.Property.SetDataList(dataList);
            }
        }
    }

    InitDataProperties() {
        const { DataView } = this.props.Property

        this.DataProperties = DataView.Properties.map(p => Object.assign({
            Render: this.GetColumnRender(p)
        }, p));

        this.DataProperties.push({
            Name: "Operation",
            Label: "操作",
            IsData: false,
            Render: (text, record) => {
                return this.RenderActions(this.GetOperationActionList(record), record);
            }
        })
    }

    GetColumnRender(p) {
        return (text, record) => {
            if (record.IsRowEdit) return this.GetRowControl(p, record);
            return text;
        }
    }

    GetRowControl(property, record) {
        const id = record[this.props.Property.PrimaryKey];
        const key = property.Id + "_" + id;
        this.RowProperty[id] = this.RowProperty[id] || {};
        const row = this.RowProperty[id];
        row[property.Id] = row[property.Id] || Object.assign({ Key: key }, property);
        const col = row[property.Id];
        col.Value = record[property.Name]

        const props = { Page: this.props.Page, Property: col, View: this.props.Property.DataView }

        switch (property.Type) {
            case "TextBox": return <TextBox2 {...props} key={key} />
            case "Select": return <Select2 {...props} key={key} />
            default: return <TextBox2 {...props} key={key} />
        }
    }

    GetOperationActionList(record) {
        let actionList = []

        if (record.IsEdit) {
            actionList.push({ Name: "Edit", Text: "编辑", ActionType: "ComplexDataGrid", ActionName: "RowEdit" })
        }

        if (record.IsAdd) {
            actionList.push({ Name: "Add", Text: "添加", ActionType: "ComplexDataGrid", ActionName: "RowAdd" })
        }

        if (record.IsSave) {
            actionList.push({ Name: "Save", Text: "保存", ActionType: "ComplexDataGrid", ActionName: "RowSave" })
        }

        if (record.IsDelete) {
            actionList.push({ Name: "Delete", Text: "删除", ActionType: "ComplexDataGrid", ActionName: "RowDelete" })
        }

        if (record.IsCancel) {
            actionList.push({ Name: "Cancel", Text: "取消", ActionType: "ComplexDataGrid", ActionName: "RowCancel" })
        }

        return actionList;
    }


    RenderDataView() {
        let dataList = this.state.DataList || [];
        dataList.forEach((d, i) => d.key = d[this.props.Property.PrimaryKey]);

        return (<DataGridView IsPaging={false} DataList={dataList}
            IsLoading={false} DataProperties={this.DataProperties} />)
    }

    RenderAddPanel() {
        if (this.props.Property.IsNewAdd) {
            const p = {
                Name: "ComplexAdd", Text: "新增" + this.props.Property.Title, Icon: "plus",
                ButtonType: "dashed",
                Style: { width: '100%', marginTop: 16, marginBottom: 8 },
                Type: "Button", ActionType: "ComplexDataGrid", ActionName: "Add"
            };

            return (<Button2 Property={p} Page={this.props.Page} View={this.props.Property} />)
        }

        return null;
    }

    render() {
        if (this.props.Property.IsCard === false) {
            return (
                <div>
                    {this.RenderDataView()}
                    {this.RenderAddPanel()}
                </div>
            );
        }
        else {
            return (
                <Card title={this.props.Property.Title} bordered={false}>
                    {this.RenderDataView()}
                    {this.RenderAddPanel()}
                </Card>
            );
        }
    }
}