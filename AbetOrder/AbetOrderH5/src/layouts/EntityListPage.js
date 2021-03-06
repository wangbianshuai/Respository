import React from "react"
import { Modal } from "antd-mobile"
import * as Common from "../utils/Common"
import DataGridView from "../components/DataGridView"
import Index from "./Index"
import PageComponent from "../pagecomponents/PageComponent";
import ModalDialog from "../components/ModalDialog";

export default class EntityListPage extends Index {
    constructor(props) {
        super(props)

        this.state = {
            EditModalVisible: false,
            EditModalTitle: "",
            IsDataLoading: false,
            EditModaIsEdit: true,
            ModalDialogProperty: null
        }
    }

    componentWillMount() {
        this.DataList = []
        this.InitPageInfo = { PageSize: this.props.Property.PageSize, PageIndex: 1, PageCount: 0, PageRecord: 0 };
        this.PageInfo = this.InitPageInfo;


        const searchView = this.props.Property.SearchView || [];
        const operationView = this.props.Property.OperationView || [];
        const eidtView = this.props.Property.EditView || [];

        this.InitSearchConditionDefalutValue(searchView);

        searchView.SetDataLoading = (isLoading) => this.setState({ IsDataLoading: isLoading });

        this.OkProperty = { Name: "Ok", Text: "确认", ActionType: "EntityEdit", ActionName: "EditOk" }

        this.SearchView = this.InitSetView(searchView);
        this.OperationView = this.InitSetView(operationView);
        this.EditView = this.InitSetView(eidtView)

        this.InitDataProperties();

        this.props.Property.EditView.SetEdit = (data) => this.SetEdit(data);

        this.props.Page.SetModalDialog = (p) => this.setState({ ModalDialogProperty: p });
    }

    InitSearchConditionDefalutValue(searchView) {
        if (!Common.IsArray(searchView.Properties)) return;
        const { QueryString } = this.props.Page;

        let v = ""
        searchView.Properties.forEach(p => {
            v = Common.GetObjValue(QueryString, p.Name);
            if (!Common.IsNullOrEmpty(v)) {
                p.DefaultValue = v;
                p.IsQueryDefault = true;
            }
        })
    }

    SetEdit(data) {
        if (!data.IsVisible && this.OkProperty.SetDisabled !== undefined) this.OkProperty.SetDisabled(false);
        this.setState({ EditModalVisible: data.IsVisible, EditModalTitle: data.Title, EditModaIsEdit: data.IsEdit })
    }

    InitDataProperties() {
        const { DataView } = this.props.Property

        this.DataStateName = DataView.StateName;

        this.DataProperties = DataView.Properties.map(p => this.SetDataProperty(p));

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
                ColumnWidth: this.props.Property.OperationColumnWidth,
                Fixed: this.props.Property.OperationColumnFixed,
                Render: (text, record) => {
                    let list = this.SetSelfOperationActionList(actionList, record);
                    if (DataView.ExpandSetOperation) list = DataView.ExpandSetOperation(list, record);
                    return this.RenderActions(list, record);
                }
            })
        }
    }

    SetSelfOperationActionList(actionList, record) {
        const { IsSelfOpeartion, SelfPropertyName } = this.props.Property

        if (IsSelfOpeartion) {
            const blEdit = Common.IsEquals(this.props.Page.LoginUser.UserId, record[SelfPropertyName], true);
            if (!blEdit) {
                actionList = []
                actionList.push({ Name: "Look", Text: "查看", EditPageUrl: this.props.Property.EditPageUrl, ActionType: "EntityEdit", ActionName: "Look" })
                return actionList;
            }
        }

        return actionList.map(m => m);
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

        let tableScroll = undefined;
        if (this.props.Property.TableWidth > 0) tableScroll = { x: this.props.Property.TableWidth };

        let expandedRowRender = undefined;
        if (this.props.Property.DataView.ExpandedRowRender) expandedRowRender = this.ExpandedRowRender.bind(this)

        if (this.props.Property.DataViewComponentName) return this.SetDataViewComponent(tableScroll, expandedRowRender)

        return (<DataGridView Page={this.props.Page} DataList={this.DataList} PageInfo={this.PageInfo}
            TableScroll={tableScroll} ExpandedRowRender={expandedRowRender}
            PageIndexChange={this.PageIndexChange.bind(this)} GroupByInfo={this.GroupByInfo} GroupByInfoHtml={this.props.Property.GroupByInfoHtml}
            IsLoading={this.state.IsDataLoading} DataProperties={this.DataProperties} />)
    }

    SetDataViewComponent(tableScroll, expandedRowRender) {
        const props = {
            DataProperties: this.DataProperties,
            IsDataLoading: this.state.IsDataLoading,
            PageIndexChange: this.PageIndexChange,
            Page: this.props.Page,
            Property: this.props.Property,
            DataList: this.DataList,
            PageInfo: this.PageInfo,
            GroupByInfo: this.GroupByInfo,
            TableScroll: tableScroll,
            ExpandedRowRender: expandedRowRender
        };

        return PageComponent(this.props.Property, props);
    }

    ExpandedRowRender(record) {
        const { DataView } = this.props.Property
        return DataView.ExpandedRowRender(record);
    }

    EditOk(e) {
        e = e || window.event;
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
        const { EditModalTitle, EditModalVisible, EditModaIsEdit } = this.state;

        if (EditModaIsEdit === false) {
            return (
                <Modal title={EditModalTitle} visible={EditModalVisible}
                    transparent={true} style={{ width: "98%" }}
                    footer={this.RenderLookFooter()}>
                    {this.RenderView(this.EditView)}
                </Modal>
            )
        }
        else {
            return (
                <Modal title={EditModalTitle} visible={EditModalVisible}
                    transparent={true} style={{ width: "98%" }}
                    footer={this.RenderFooter()} >
                    {this.RenderView(this.EditView)}
                </Modal>
            )
        }
    }

    RenderFooter() {
        return [{ text: '取消', onPress: this.EditCancel.bind(this) }, { text: '确定', onPress: this.EditOk.bind(this) }];
    }

    RenderLookFooter() {
        return [{ text: '取消', onPress: this.EditCancel.bind(this) }];
    }

    RenderModalDialog() {
        if (this.state.ModalDialogProperty === null) return null;

        return <ModalDialog Property={this.state.ModalDialogProperty} Page={this.props.Page} />
    }

    render() {
        return (
            <div>
                {this.RenderView(this.SearchView)}
                {this.RenderView(this.OperationView)}
                {this.RenderDataView()}
                {this.RenderEditModal()}
                {this.RenderModalDialog()}
            </div>
        );
    }
}