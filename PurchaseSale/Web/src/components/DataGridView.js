import React from "react";
import { Common } from "UtilsCommon";
import DataGrid from "./DataGrid";
import BaseIndex from "./BaseIndex";
import { ConnectAction } from "ReactCommon";
import { Card } from "antd";
import styles from "../styles/View.css";

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

        const { PrimaryKey, PropertyPrimaryKey } = this.Property.Entity;
        this.PrimaryKey = PropertyPrimaryKey || PrimaryKey;

        this.DataList = []
        this.InitPageInfo = { PageSize: this.Property.PageSize || 10, PageIndex: 1, PageCount: 0, PageRecord: 0 };
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
        else if (p.IsCurrency && p.Render === undefined) {
            p.Render = (text, record, index) => {
                if (p.IsRender && !p.IsRender(text, record, index)) return this.EmptyRender();
                if (parseFloat(text) < 0) return <span style={{ color: "red" }}>{Common.ToCurrency(text, p.IsFixed2)}</span>

                if (p.FontColor) return <span style={{ color: p.FontColor }}>{Common.ToCurrency(text, p.IsFixed2)}</span>

                return Common.ToCurrency(text, p.IsFixed2)
            };
        }
        else if (p.IsOpenPage && p.Render === undefined) {
            p.Render = (text, record, index) => {
                if (p.IsRender && !p.IsRender(text, record, index)) return this.EmptyRender();
                if (!Common.IsNullOrEmpty(text)) {
                    let url = p.PageUrl;
                    url = Common.ReplaceDataContent(record, url, true)
                    if (Common.IsNullOrEmpty(url)) return text;
                    else return <a href={url} target="_blank" rel="noopener noreferrer">{text}</a>
                }
                return text;
            };
        }
        else if (p.IsToPage && p.Render === undefined) {
            p.Render = (text, record, index) => {
                if (p.IsRender && !p.IsRender(text, record, index)) return this.EmptyRender();
                if (!Common.IsNullOrEmpty(text)) {
                    let url = p.PageUrl;
                    url = Common.ReplaceDataContent(record, url, true)
                    if (Common.IsNullOrEmpty(url)) return text;
                    else return <a href={url}>{text}</a>
                }
                return text;
            };
        }
        return p;
    }

    componentDidMount() {
        if (this.Property.IsSearchQuery !== false) this.EventActions.InvokeAction(this.Property.EventActionName, this.props);
    }

    ReceiveSearchQuery(data) {
        this.Property.SetDataLoading(false);
        this.EventActions.DataGridView.ReceiveSearchQuery(data, this.props);

        return true;
    }

    SetDataList() {
        const { SearchQuery } = this.ActionTypes;
        let data = this.props[SearchQuery];

        if (data === undefined) return;

        if (this.Property.IsLocalPage) {
            this.LocalDataList = data.DataList;
            if (Common.IsArray(this.LocalDataList)) {
                this.PageInfo = this.GetPageInfo(data.PageRecord);
                const { PageIndex, PageSize } = this.PageInfo;
                this.DataList = this.LocalDataList.filter((d, i) => {
                    return i >= (PageIndex - 1) * PageSize && i < PageIndex * PageSize;
                });
            }
        }
        else if (Common.IsArray(data.DataList)) {
            this.DataList = data.DataList;
            if (data.GroupByInfo) this.GroupByInfo = data.GroupByInfo;
            if (data.PageRecord !== undefined) this.PageInfo = this.GetPageInfo(data.PageRecord);
            else if (data.PageInfo) this.PageInfo = data.PageInfo;
        }

        this.DataList.forEach((d, i) => d.key = d[this.PrimaryKey]);
    }

    GetPageInfo(PageRecord) {
        let PageIndex = this.PageInfo.PageIndex || 1;
        let PageSize = this.PageInfo.PageSize;
        let PageCount = 0;
        if (PageRecord === 0) { PageIndex = 1; PageCount = 0; }
        else if (PageRecord <= PageSize) { PageCount = 1; PageIndex = 1; }
        else {
            if (PageRecord % PageSize === 0) PageCount = PageRecord / PageSize;
            else PageCount = Common.GetIntValue(PageRecord / PageSize) + 1;
        }

        if (PageIndex > PageCount) PageIndex = PageCount;

        return { PageIndex, PageSize, PageCount, PageRecord };
    }

    PageIndexChange(pageIndex, pageSize, isData) {
        isData = isData === undefined ? true : isData;
        this.PageInfo.PageIndex = pageIndex;
        this.PageInfo.PageSize = pageSize;
        if (this.Property.IsLocalPage) this.setState({ RefreshId: Common.CreateGuid() });
        else this.EventActions.InvokeAction(this.Property.EventActionName, { ...this.props, PageIndex: pageIndex, PageSize: pageSize, IsData: isData });
    }

    Refresh() {
        this.PageIndexChange(this.PageInfo.PageIndex, this.PageInfo.PageSize, false);
    }

    RenderDataView() {
        this.SetDataList();

        let dataList = this.DataList;

        const isPartPaging = !!this.Property.IsPartPaging

        return (<DataGrid EventActions={this.EventActions} PrimaryKey={this.PrimaryKey} DataList={dataList} IsPartPaging={isPartPaging} PageInfo={this.PageInfo} IsPaging={this.Property.IsPaging}
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

        let className = this.Property.ClassName;
        if (className && styles[className]) className = styles[className];

        if (this.Property.IsDiv) return <div className={className} style={this.Property.Style}>{this.RenderDataView()}</div>
        else return this.RenderDataView();
    }
}

export default ConnectAction("Components_DataGridView", DataGridView);