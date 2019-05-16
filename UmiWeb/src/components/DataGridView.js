import React from "react";
import { Common } from "UtilsCommon";
import DataGrid from "./DataGrid";
import BaseIndex from "./BaseIndex";
import { ConnectAction } from "ReactCommon";
import { Card } from "antd";

class DataGridView extends BaseIndex {
    constructor(props) {
        super(props);

        this.Init();

        this.state = Object.assign({ IsDataLoading: false, RefreshId: "" }, this.state);

        this.Property.SetColumnsVisible = this.SetColumnsVisible.bind(this);
    }

    Init() {
        //数据行为类型
        this.ActionTypes = this.props.GetActionTypes("Components_DataGridView");
        this.Property.Invoke = this.props.Invoke;
        this.Property.ActionTypes = this.ActionTypes;
        this.EventActions.Components.push(this.Property);

        this.DataList = []
        this.InitPageInfo = { PageSize: this.Property.PageSize, PageIndex: 1, PageCount: 0, PageRecord: 0 };
        this.PageInfo = this.InitPageInfo;

        this.Property.SetDataLoading = (isLoading) => this.setState({ IsDataLoading: isLoading });
        this.Property.Refresh = this.Refresh.bind(this);

        this.InitDataProperties();
    }

    SetColumnsVisible(hideColNames) {
        this.DataProperties.forEach(p => p.IsVisible = !(hideColNames.indexOf(p.Name) >= 0));
        this.DataProperties2 = this.DataProperties.filter(f => f.IsVisible !== false);

        this.setState({ RefreshId: Common.CreateGuid() })
    }

    InitDataProperties() {
        const { Properties } = this.Property;

        this.DataProperties = Properties.map(p => this.SetDataProperty(p));

        this.DataProperties2 = this.DataProperties.filter(f => f.IsVisible !== false);
    }

    EmptyRender() {
        return { children: null, props: { colSpan: 0 } }
    }

    SetDataProperty(p) {
        if (!p.IsData && p.Sorter === undefined) p.Sorter = false;

        if (p.IsDate && p.Render === undefined) {
            p.Render = (text, record, index) => {
                if (p.IsRender && !p.IsRender(text, record, index)) return this.EmptyRender();
                if (!Common.IsNullOrEmpty(text)) text = text.substr(0, 10);
                return text;
            };
        }
        else if (p.IsRender && p.Render === undefined) {
            p.Render = (text, record, index) => {
                if (p.IsRender && !p.IsRender(text, record, index)) return this.EmptyRender();
                return text;
            };
        }
        return p;
    }

    componentDidMount() {
        this.EventActions.InvokeAction(this.Property.EventActionName, this.props);
    }

    ReceiveSearchQuery(data) {
        this.Property.SetDataLoading(false);
        this.EventActions.DataGridView.ReceiveSearchQuery(data, this.props);
        return true;
    }

    SetDataList() {
        const { SearchQuery } = this.ActionTypes;
        let dataList = this.props[SearchQuery];

        if (dataList === undefined) return;

        if (Common.IsArray(dataList)) this.DataList = dataList;
        else if (Common.IsArray(dataList.DataList)) {
            this.DataList = dataList.DataList;
            this.GroupByInfo = dataList.GroupByInfo;
        }
        else this.GroupByInfo = null;

        this.DataList.forEach((d, i) => d.key = d[this.Property.Entity.PrimaryKey]);
    }

    SetPageInfo() {
        let pageInfo = this.props.PageInfo

        if (pageInfo === undefined) return;

        if (pageInfo.PageRecord === undefined) pageInfo = this.InitPageInfo;

        this.PageInfo = pageInfo;
    }

    PageIndexChange(pageIndex, pageSize) {
        this.EventActions.InvokeAction(this.Property.EventActionName, { ...this.props, PageIndex: pageIndex, PageSize: pageSize });
    }

    Refresh() {
        this.PageIndexChange(this.PageInfo.PageIndex, this.PageInfo.PageSize);
    }

    RenderDataView() {
        this.SetDataList();
        this.SetPageInfo();

        let dataList = this.DataList;

        const isPartPaging = !!this.Property.IsPartPaging

        return (<DataGrid EventActions={this.EventActions} PrimaryKey={this.Property.Entity.PrimaryKey} DataList={dataList} IsPartPaging={isPartPaging} PageInfo={this.PageInfo} IsPaging={this.Property.IsPaging}
            IsRowSelection={this.Property.IsRowSelection} IsSingleSelection={this.Property.IsSingleSelection} Property={this.Property}
            PageIndexChange={this.PageIndexChange.bind(this)} GroupByInfo={this.GroupByInfo} GroupByInfoHtml={this.Property.GroupByInfoHtml}
            IsLoading={this.state.IsDataLoading} DataProperties={this.DataProperties2} />)
    }

    render() {
        if (!this.state.IsVisible) return null;

        if (this.Property.Title) {
            return (
                <Card title={Common.ReplaceDataContent(this.EventActions.PageData, this.Property.Title)} style={this.Property.Style} bordered={false} headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
                    {this.RenderDataView()}
                </Card>
            )
        }
        else return this.RenderDataView();
    }
}

export default ConnectAction("Components_DataGridView", DataGridView);