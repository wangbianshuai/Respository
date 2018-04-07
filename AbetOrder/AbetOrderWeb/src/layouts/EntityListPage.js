import React from "react"
import { Modal } from "antd"
import * as Common from "../utils/Common"
import DataGridView from "../components/DataGridView"
import Index from "./Index"

export default class EntityListPage extends Index {
    constructor(props) {
        super(props)

        this.state = {
            EditModalVisible: false,
            EditModalTitle: "",
            IsDataLoading: false
        }
    }

    componentWillMount() {
        this.DataList = []
        this.InitPageInfo = { PageSize: this.props.Property.PageSize, PageIndex: 1, PageCount: 0, PageRecord: 0 };
        this.PageInfo = this.InitPageInfo;

        const searchView = this.props.Property.SearchView || [];
        const operationView = this.props.Property.OperationView || [];
        const eidtView = this.props.Property.EditView || [];

        searchView.SetDataLoading = (isLoading) => this.setState({ IsDataLoading: isLoading });

        this.OkProperty = { Name: "Ok", Text: "确认", ActionType: "EntityEdit", ActionName: "EditOk" }

        this.SearchView = this.InitSetView(searchView);
        this.OperationView = this.InitSetView(operationView);
        this.EditView = this.InitSetView(eidtView)

        this.InitDataProperties();

        this.props.Property.EditView.SetEdit = (data) => this.SetEdit(data);
    }

    SetEdit(data) {
        if (!data.IsVisible && this.OkProperty.SetDisabled !== undefined) this.OkProperty.SetDisabled(false);
        this.setState({ EditModalVisible: data.IsVisible, EditModalTitle: data.Title })
    }

    InitDataProperties() {
        const { DataView } = this.props.Property

        this.DataStateName = DataView.StateName;

        this.DataProperties = DataView.Properties.map(p => this.SetDataPropert(p));

        let actionList = []

        if (this.props.Property.IsUpdate) {
            actionList.push({ Name: "Update", Text: "修改", EditPageUrl: this.props.Property.EditPageUrl, ActionType: "EntityEdit", ActionName: "Edit" })
        }

        if (this.props.Property.IsDelete) {
            actionList.push({ Name: "Delete", Text: "删除", Title: "确定要删除吗？", IsConfrim: true, ActionType: "EntityEdit", ActionName: "Delete" })
        }

        if (actionList.length > 0) {
            this.DataProperties.push({
                Name: "Operation",
                Label: "操作",
                IsData: false,
                Render: (text, record) => this.RenderActions(actionList, record)
            })
        }
    }

    SetDataList() {
        let dataList = this.props[this.DataStateName];

        if (dataList === undefined) return;

        if (Common.IsArray(dataList)) this.DataList = dataList;
        else if (Common.IsArray(dataList.DataList)) {
            this.DataList = dataList.DataList;
            this.GroupByInfo = dataList.GroupByInfo;
        }
        else this.GroupByInfo = null;

        this.DataList.forEach((d, i) => d.key = d[this.props.Property.PrimaryKey]);
    }

    SetPageInfo() {
        let pageInfo = this.props.PageInfo

        if (pageInfo === undefined) { return; }

        if (pageInfo.PageRecord === undefined) pageInfo = this.InitPageInfo;

        this.PageInfo = pageInfo;
    }

    PageIndexChange(pageIndex, pageSize) {
        const { EventActions: { Query } } = this.props.Page
        Query.PageIndexChange(pageIndex, pageSize);
    }

    RenderDataView() {
        this.SetDataList();
        this.SetPageInfo();

        return (<DataGridView Page={this.props.Page} DataList={this.DataList} PageInfo={this.PageInfo}
            PageIndexChange={this.PageIndexChange.bind(this)} GroupByInfo={this.GroupByInfo} GroupByInfoHtml={this.props.Property.GroupByInfoHtml}
            IsLoading={this.state.IsDataLoading} DataProperties={this.DataProperties} />)
    }

    EditOk(e) {
        if (this.OkProperty.SetDisabled === undefined) {
            this.OkProperty.Element = e.target;
            this.OkProperty.SetDisabled = (disabled) => { this.OkProperty.Element.disabled = disabled }
        }

        this.props.Page.InvokeAction(this.OkProperty)
    }

    EditCancel() {
        if (this.OkProperty.SetDisabled !== undefined) this.OkProperty.SetDisabled(false);
        this.setState({ EditModalVisible: false })
    }

    RenderEditModal() {
        const { EditModalTitle, EditModalVisible } = this.state;
        const { EditView } = this.props.Property;

        return (
            <Modal title={EditModalTitle} visible={EditModalVisible}
                okText={this.OkProperty.Text} cancelText="取消" width={EditView.Width}
                onOk={this.EditOk.bind(this)} onCancel={this.EditCancel.bind(this)} >
                {this.RenderView(this.EditView)}
            </Modal>
        )
    }

    render() {
        return (
            <div>
                {this.RenderView(this.SearchView)}
                {this.RenderView(this.OperationView)}
                {this.RenderDataView()}
                {this.RenderEditModal()}
            </div>
        );
    }
}