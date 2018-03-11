import React, { Component } from "react"
import { Row, Col, Divider, Modal } from "antd"
import * as Common from "../utils/Common"
import PropertyItem from "../components/PropertyItem"
import DataGridView from "../components/DataGridView"
import AButton from "../controls/AButton"
import Popconfirm2 from "../controls/Popconfirm2"

export default class EntityListPage extends Component {
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

        this.DataProperties = DataView.Properties.map(p => p);

        let actionList = []

        if (this.props.Property.IsUpdate) {
            actionList.push({ Name: "Update", Text: "修改", ActionType: "EntityEdit", ActionName: "Edit" })
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

    RenderActions(actionList, record) {
        const list = []

        for (let i = 0; i < actionList.length; i++) {
            if (i > 0) list.push(<Divider type="vertical" key={i} />)
            if (actionList[i].IsConfrim) list.push(<Popconfirm2 Property={actionList[i]} Page={this.props.Page} Params={record} key={actionList[i].Name} />)
            else list.push(<AButton Property={actionList[i]} Page={this.props.Page} Params={record} key={actionList[i].Name} />)
        }

        return (<span>{list.map(m => m)}</span>)
    }

    InitSetView(view) {
        const properties = view.Properties || [];

        const rowDict = {};
        let xList = [];

        properties.forEach(p => {
            p.Id = p.Id || Common.CreateGuid()
            if (rowDict[p.X] === undefined) { rowDict[p.X] = []; xList.push(p.X); }
            rowDict[p.X].push(p)
        });

        xList = xList.sort((a, b) => a > b ? 1 : -1);

        for (let key in rowDict) rowDict[key] = rowDict[key].sort((a, b) => a.Y > b.Y ? 1 : -1);

        return { XList: xList, RowDictionary: rowDict, IsVisible: view.IsVisible };
    }

    RenderView(view) {
        return (
            <div style={{ display: view.IsVisible ? "" : "none" }}>
                {view.XList.map(m => this.RendRowCols(m, view.RowDictionary[m]))}
            </div>
        );
    }

    RendRowCols(rowId, colList) {
        return (<Row key={rowId} type="flex" justify="start" align="top" gutter={16}>{colList.map(c => this.RenderColumn(c))}</Row>);
    }

    RenderColumn(col) {
        return (<Col key={col.Y} span={col.ColSpan}>{this.GetPropertyItem(col)}</Col>);
    }

    GetPropertyItem(p) {
        return (<PropertyItem Property={p} Page={this.props.Page} />)
    }

    SetDataList() {
        let dataList = this.props[this.DataStateName];

        if (dataList === undefined) return;

        if (Common.IsArray(dataList)) this.DataList = dataList;

        this.DataList.forEach((d, i) => d.key = i + 1);
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
            PageIndexChange={this.PageIndexChange.bind(this)}
            IsLoading={this.state.IsDataLoading} DataProperties={this.DataProperties} />)
    }

    shouldComponentUpdate(nextProps, nextState) {
        let blChangedProps = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined) {
                if (this.props[key] !== nextProps[key]) { blChangedProps = true; break; }
            }
        }

        if (!blChangedProps) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key]) { blChangedProps = true; break; }
            }
        }

        return blChangedProps;
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