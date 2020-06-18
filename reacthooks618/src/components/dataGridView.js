import React from "react";
import { Common } from "UtilsCommon";
import DataGrid from "./DataGrid";
import BaseIndex from "./BaseIndex";
import { ConnectAction } from "UseHooks";
import { Card } from "antd";
import { Link } from "dva/router";
import styles from "../styles/view.css";

class DataGridView extends BaseIndex {
    constructor(props) {
        super(props);

        this.Init();

        this.property.Add = this.Add.bind(this);
        this.property.Update = this.Update.bind(this);
        this.property.remove = this.remove.bind(this);
        this.property.setValue = this.setValue.bind(this);
        this.property.getValue = () => this.state.DataList;
        const dataList = this.property.Value || this.property.DefaultValue || [];
        this.state = Object.assign({ isDataLoading: false, RefreshId: "", DataList: dataList }, this.state);
        this.property.setColumnsVisible = this.setColumnsVisible.bind(this);
        this.property.setColumnsVisible2 = this.setColumnsVisible2.bind(this);
        this.property.getPageRecord = () => this.PageInfo.PageRecord;
        this.property.getDataProperties2 = () => this.DataProperties2;
        this.property.getExcelExportProperties = this.getExcelExportProperties.bind(this);
    }

    Init() {
        //数据行为类型
        this.ActionTypes = this.props.getActionTypes("Components_DataGridView");
        this.property.Invoke = this.props.Invoke;
        this.property.ActionTypes = this.ActionTypes;
        this.pageAxis.Components.push(this.property);

        const { PrimaryKey, PropertyPrimaryKey } = this.property.Entity;
        this.PrimaryKey = PropertyPrimaryKey || PrimaryKey;

        this.DataList = []
        this.InitPageInfo = { PageSize: this.property.PageSize || 10, PageIndex: 1, PageCount: 0, PageRecord: 0 };
        this.PageInfo = this.InitPageInfo;

        this.property.setDataLoading = (isLoading) => this.setState({ isDataLoading: isLoading });
        this.property.Refresh = this.Refresh.bind(this);

        this.InitDataProperties();
    }

    Add(data) {
        const { DataList } = this.state;

        const id = data[this.PrimaryKey];
        let blExists = false;
        const list = [];

        for (let i = 0; i < DataList.length; i++) {
            if (DataList[i][this.PrimaryKey] === id) blExists = true;
            else list.push(DataList[i])
        }

        if (blExists) return;
        else list.push(data);

        this.setValue(list);
    }

    Update(data) {
        const id = data[this.PrimaryKey];
        const dataList = this.state.DataList
        const editData = Common.arrayFirst(dataList, (f) => Common.isEquals(f[this.PrimaryKey], id, true));
        if (editData !== null) {
            for (let key in data) editData[key] = data[key];
        }
        this.setValue(dataList.map(m => m));
    }

    remove(id) {
        this.setValue(this.state.DataList.filter(f => !Common.isEquals(f[this.PrimaryKey], id, true)));
    }

    setValue(dataList) {
        dataList = dataList || [];
        this.setState({ DataList: dataList });
    }

    setColumnsVisible(hideColNames) {
        this.DataProperties.forEach(p => p.isVisible = !(hideColNames.indexOf(p.name) >= 0));
        this.DataProperties2 = this.DataProperties.filter(f => f.isVisible !== false);

        this.setState({ RefreshId: Common.createGuid() })
    }

    getExcelExportProperties() {
        return this.DataProperties.filter(f => f.isVisible !== false || f.isExcelExport);
    }

    setColumnsVisible2(visibleColNames) {
        this.DataProperties.forEach(p => p.isVisible = (visibleColNames.indexOf(p.name) >= 0));
        this.DataProperties2 = this.DataProperties.filter(f => f.isVisible !== false);
        if (this.property.isGroupByQuery) {
            this.PageInfo.PageIndex = 1;
            this.Refresh();
        }
        else this.setState({ RefreshId: Common.createGuid() })
    }

    InitDataProperties() {
        const { Properties } = this.property;

        this.DataProperties = Properties.map(p => this.setDataProperty(p));

        this.DataProperties2 = this.DataProperties.filter(f => f.isVisible !== false);
    }

    EmptyRender() {
        return { children: null, props: { colSpan: 0 } }
    }

    setDataProperty(p) {
        if (!p.isData && p.Sorter === undefined) p.Sorter = false;

        if (p.isDate && p.Render === undefined) {
            p.Render = (text, record, index) => {
                if (p.isRender && !p.isRender(text, record, index)) return this.EmptyRender();
                if (!Common.isNullOrEmpty(text)) text = text.substr(0, 10);
                return text;
            };
        }
        else if (p.isRender && p.Render === undefined) {
            p.Render = (text, record, index) => {
                if (p.isRender && !p.isRender(text, record, index)) return this.EmptyRender();
                return text;
            };
        }
        else if (p.isCurrency && p.Render === undefined) {
            p.Render = (text, record, index) => {
                if (p.isRender && !p.isRender(text, record, index)) return this.EmptyRender();
                if (parseFloat(text) < 0) return <span style={{ color: "red" }}>{Common.toCurrency(text, p.isFixed2)}</span>

                if (p.FontColor) return <span style={{ color: p.FontColor }}>{Common.toCurrency(text, p.isFixed2)}</span>

                return Common.toCurrency(text, p.isFixed2)
            };
        }
        else if (p.isOpenPage && p.Render === undefined) {
            p.Render = (text, record, index) => {
                if (p.isRender && !p.isRender(text, record, index)) return this.EmptyRender();
                if (!Common.isNullOrEmpty(text)) {
                    let url = p.PageUrl;
                    if (p.isAddBasePath) url = window.routerBase + url;
                    url = Common.replaceDataContent(record, url, !p.isHttp)
                    if (Common.isNullOrEmpty(url)) return text;
                    else return <a href={url} target="_blank" rel="noopener noreferrer">{text}</a>
                }
                return text;
            };
        }
        else if (p.isToPage && p.Render === undefined) {
            p.Render = (text, record, index) => {
                if (p.isRender && !p.isRender(text, record, index)) return this.EmptyRender();
                if (!Common.isNullOrEmpty(text)) {
                    let url = p.PageUrl;
                    const blUrl = !(p.isUrl === false)
                    url = Common.replaceDataContent(record, url, blUrl)
                    if (Common.isNullOrEmpty(url)) return text;
                    else return <Link to={url}>{text}</Link>
                }
                return text;
            };
        }
        else if (p.isData === false && p.ActionList) {
            p.Render = (text, record, index) => {
                let list = Common.arrayClone(p.ActionList);
                list = this.setSelfOperationActionList(p, list, record, index);
                list = this.setDataValueOperationActionList(p, list, record, index);
                const fn = this.pageAxis.getFunction(p.expandsetOperation);
                if (fn) list = fn(list, record, index);
                return this.RenderActions(list, record, index);
            }
        }
        return p;
    }

    setDataValueOperationActionList(p, actionList, record, index) {
        const list = [];
        actionList.forEach(a => {
            if (a.ValueName) {
                if (Common.isEquals(a.DataValue, record[a.ValueName], true)) list.push(a);
            }
            else list.push(a);
        });

        return list;
    }

    setSelfOperationActionList(p, actionList, record, index) {
        const { SelfPropertyName } = p

        const userId = this.pageAxis.getLoginUserId();
        const blEdit = Common.isEquals(userId, record[SelfPropertyName], true);
        if (blEdit) return actionList;

        const list = [];
        actionList.forEach(a => {
            if (!(a.isSelfOperation && !blEdit)) list.push(a);
        });

        return list;
    }

    componentDidMount() {
        if (this.property.isSearchQuery !== false) this.pageAxis.InvokeAction(this.property.EventActionName, this.props);
    }

    ReceiveSearchQuery(data) {
        this.property.setDataLoading(false);
        this.pageAxis.DataGridView.ReceiveSearchQuery(data, this.props);

        return true;
    }

    ReceiveExcelExport(data) {
        this.pageAxis.DataGridView.ReceiveExcelExport(data, this.props);

        return true;
    }

    setDataList() {
        const { SearchQuery } = this.ActionTypes;
        let data = this.props[SearchQuery];

        if (data === undefined) return;

        if (this.property.isLocalPage) {
            this.LocalDataList = data.DataList;
            if (Common.isArray(this.LocalDataList)) {
                this.PageInfo = this.getPageInfo(data.PageRecord);
                const { PageIndex, PageSize } = this.PageInfo;
                this.DataList = this.LocalDataList.filter((d, i) => {
                    return i >= (PageIndex - 1) * PageSize && i < PageIndex * PageSize;
                });
            }
        }
        else if (Common.isArray(data.DataList)) {
            this.DataList = data.DataList;
            if (data.GroupByInfo) this.GroupByInfo = data.GroupByInfo;
            if (data.PageRecord !== undefined) this.PageInfo = this.getPageInfo(data.PageRecord);
            else if (data.PageInfo) this.PageInfo = data.PageInfo;
        }

        this.DataList.forEach(d => d.key = d[this.PrimaryKey] || Common.createGuid());
    }

    getPageInfo(PageRecord) {
        let PageIndex = this.PageInfo.PageIndex || 1;
        let PageSize = this.PageInfo.PageSize;
        let PageCount = 0;
        if (PageRecord === 0) { PageIndex = 1; PageCount = 0; }
        else if (PageRecord <= PageSize) { PageCount = 1; PageIndex = 1; }
        else {
            if (PageRecord % PageSize === 0) PageCount = PageRecord / PageSize;
            else PageCount = Common.getIntValue(PageRecord / PageSize) + 1;
        }

        if (PageIndex > PageCount) PageIndex = PageCount;

        return { PageIndex, PageSize, PageCount, PageRecord };
    }

    PageIndexChange(pageIndex, pageSize, isData) {
        isData = isData === undefined ? true : isData;
        this.PageInfo.PageIndex = pageIndex;
        this.PageInfo.PageSize = pageSize;
        if (this.property.isLocalPage) this.setState({ RefreshId: Common.createGuid() });
        else this.pageAxis.InvokeAction(this.property.EventActionName, { ...this.props, PageIndex: pageIndex, PageSize: pageSize, isData: isData });
    }

    Refresh() {
        this.PageIndexChange(this.PageInfo.PageIndex, this.PageInfo.PageSize, false);
    }

    RenderDataView() {
        if (this.property.isComplexEntity) {
            this.DataList = this.state.DataList;
            this.DataList.forEach(d => d.key = d[this.PrimaryKey] || Common.createGuid());
            if (this.property.setChangeDataList) setTimeout(() => this.property.setChangeDataList(this.DataList), 100);
        }
        else this.setDataList();

        let dataList = this.DataList;

        const isPartPaging = !!this.property.isPartPaging

        return (<DataGrid pageAxis={this.pageAxis} PrimaryKey={this.PrimaryKey} DataList={dataList} isPartPaging={isPartPaging} PageInfo={this.PageInfo} isPaging={this.property.isPaging}
            isRowSelection={this.property.isRowSelection} isSingleSelection={this.property.isSingleSelection} property={this.property}
            PageIndexChange={this.PageIndexChange.bind(this)} GroupByInfo={this.GroupByInfo} GroupByInfoHtml={this.property.GroupByInfoHtml}
            isLoading={this.state.isDataLoading} DataProperties={this.DataProperties2} />)
    }

    render() {
        if (!this.state.isVisible) return null;

        if (this.property.Title) {
            return (
                <Card title={Common.replaceDataContent(this.pageAxis.PageData, this.property.Title)} style={this.property.style} bordered={false} headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
                    {this.RenderDataView()}
                </Card>
            )
        }

        let className = this.property.ClassName;
        if (className && styles[className]) className = styles[className];

        if (this.property.isDiv) return <div className={className} style={this.property.style}>{this.RenderDataView()}</div>
        else return this.RenderDataView();
    }
}

export default ConnectAction("Components_DataGridView", DataGridView);