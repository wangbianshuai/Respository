import { useMemo, useState, useEffect } from "react"
import { Common } from "UtilsCommon";
import DataGrid from "./DataGrid";
import BaseIndex from "./BaseIndex";
import { useConnectAction } from "ReactCommon";
import { Card } from "antd";
import { router } from "dva";
import styles from "../styles/View.css";
const Link = router.Link

const Name = "Components_DataGridView";

export default (props) => {
    const instance = useMemo(() => new DataGridView(), []);
    const [invoke, actionTypes, actionData] = useConnectAction(Name)

    instance.Init2(props, invoke, actionTypes);

    instance.InitState("IsVisible", useState(true));
    instance.InitState("IsDataLoading", useState(false));
    instance.InitState("RefreshId", useState(""));
    instance.InitState("DataList", useState(instance.DataList));

    useEffect(() => instance.ReceiveActionData(actionData), [instance, actionData]);

    useEffect(() => { instance.componentDidMount() }, [instance])

    return instance.render();
}

class DataGridView extends BaseIndex {

    Init2(props, invoke, actionTypes) {
        if (this.Init(props)) return;

        //数据行为类型
        this.Property.Invoke = invoke;
        this.Property.ActionTypes = actionTypes;
        this.PageAxis.Components.push(this.Property);

        const { PrimaryKey, PropertyPrimaryKey } = this.Property.Entity;
        this.PrimaryKey = PropertyPrimaryKey || PrimaryKey;

        this.DataList = []
        this.InitPageInfo = { PageSize: this.Property.PageSize || 10, PageIndex: 1, PageCount: 0, PageRecord: 0 };
        this.PageInfo = this.InitPageInfo;

        this.Property.SetDataLoading = (isLoading) => this.setState({ IsDataLoading: isLoading });
        this.Property.Refresh = this.Refresh.bind(this);

        this.InitDataProperties();

        this.Property.Add = this.Add.bind(this);
        this.Property.Update = this.Update.bind(this);
        this.Property.Remove = this.Remove.bind(this);
        this.Property.SetValue = this.SetValue.bind(this);
        this.Property.GetValue = () => this.state.DataList;
        this.DataList = this.Property.Value || this.Property.DefaultValue || [];
        this.Property.SetColumnsVisible = this.SetColumnsVisible.bind(this);
        this.Property.SetColumnsVisible2 = this.SetColumnsVisible2.bind(this);
        this.Property.GetPageRecord = () => this.PageInfo.PageRecord;
        this.Property.GetDataProperties2 = () => this.DataProperties2;
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

        this.SetValue(list);
    }

    Update(data) {
        const id = data[this.PrimaryKey];
        const dataList = this.state.DataList
        const editData = Common.ArrayFirst(dataList, (f) => Common.IsEquals(f[this.PrimaryKey], id, true));
        if (editData !== null) {
            for (let key in data) editData[key] = data[key];
        }
        this.SetValue(dataList.map(m => m));
    }

    Remove(id) {
        this.SetValue(this.state.DataList.filter(f => !Common.IsEquals(f[this.PrimaryKey], id, true)));
    }

    SetValue(dataList) {
        dataList = dataList || [];
        this.setState({ DataList: dataList });
    }

    SetColumnsVisible(hideColNames) {
        this.DataProperties.forEach(p => p.IsVisible = !(hideColNames.indexOf(p.Name) >= 0));
        this.DataProperties2 = this.DataProperties.filter(f => f.IsVisible !== false);

        this.setState({ RefreshId: Common.CreateGuid() })
    }

    SetColumnsVisible2(visibleColNames) {
        this.DataProperties.forEach(p => p.IsVisible = (visibleColNames.indexOf(p.Name) >= 0));
        this.DataProperties2 = this.DataProperties.filter(f => f.IsVisible !== false);
        if (this.Property.IsGroupByQuery) {
            this.PageInfo.PageIndex = 1;
            this.Refresh();
        }
        else this.setState({ RefreshId: Common.CreateGuid() })
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
                    const blUrl = !(p.IsUrl === false)
                    url = Common.ReplaceDataContent(record, url, blUrl)
                    if (Common.IsNullOrEmpty(url)) return text;
                    else return <Link to={url}>{text}</Link>
                }
                return text;
            };
        }
        else if (p.IsData === false && p.ActionList) {
            p.Render = (text, record, index) => {
                let list = Common.ArrayClone(p.ActionList);
                list = this.SetSelfOperationActionList(p, list, record, index);
                list = this.SetDataValueOperationActionList(p, list, record, index);
                const fn = this.PageAxis.GetFunction(p.ExpandSetOperation);
                if (fn) list = fn(list, record, index);
                return this.RenderActions(list, record, index);
            }
        }
        return p;
    }

    SetDataValueOperationActionList(p, actionList, record, index) {
        const list = [];
        actionList.forEach(a => {
            if (a.ValueName) {
                if (Common.IsEquals(a.DataValue, record[a.ValueName], true)) list.push(a);
            }
            else list.push(a);
        });

        return list;
    }

    SetSelfOperationActionList(p, actionList, record, index) {
        const { SelfPropertyName } = p

        const userId = this.PageAxis.GetLoginUserId();
        const blEdit = Common.IsEquals(userId, record[SelfPropertyName], true);
        if (blEdit) return actionList;

        const list = [];
        actionList.forEach(a => {
            if (!(a.IsSelfOperation && !blEdit)) list.push(a);
        });

        return list;
    }

    componentDidMount() {
        if (this.Property.IsSearchQuery !== false) this.PageAxis.InvokeEventAction(this.Property.EventActionName, this.props);
    }

    ReceiveSearchQuery(data) {
        this.Property.SetDataLoading(false);
        this.PageAxis.DataGridView.ReceiveSearchQuery(data, this.props);

        return true;
    }

    ReceiveExcelExport(data) {
        this.PageAxis.DataGridView.ReceiveExcelExport(data, this.props);

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

        this.DataList.forEach(d => d.key = d[this.PrimaryKey] || Common.CreateGuid());
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
        else this.PageAxis.InvokeEventAction(this.Property.EventActionName, { ...this.props, PageIndex: pageIndex, PageSize: pageSize, IsData: isData });
    }

    Refresh() {
        this.PageIndexChange(this.PageInfo.PageIndex, this.PageInfo.PageSize, false);
    }

    RenderDataView() {
        if (this.Property.IsComplexEntity) {
            this.DataList = this.state.DataList;
            this.DataList.forEach(d => d.key = d[this.PrimaryKey] || Common.CreateGuid());
            if (this.Property.SetChangeDataList) setTimeout(() => this.Property.SetChangeDataList(this.DataList), 100);
        }
        else this.SetDataList();

        let dataList = this.DataList;

        const isPartPaging = !!this.Property.IsPartPaging

        return (<DataGrid PageAxis={this.PageAxis} PrimaryKey={this.PrimaryKey} DataList={dataList} IsPartPaging={isPartPaging} PageInfo={this.PageInfo} IsPaging={this.Property.IsPaging}
            IsRowSelection={this.Property.IsRowSelection} IsSingleSelection={this.Property.IsSingleSelection} Property={this.Property}
            PageIndexChange={this.PageIndexChange.bind(this)} GroupByInfo={this.GroupByInfo} GroupByInfoHtml={this.Property.GroupByInfoHtml}
            IsLoading={this.state.IsDataLoading} DataProperties={this.DataProperties2} />)
    }

    render() {
        if (!this.state.IsVisible) return null;

        if (this.Property.Title) {
            return (
                <Card title={Common.ReplaceDataContent(this.PageAxis.PageData, this.Property.Title)} style={this.Property.Style} bordered={false} headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
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