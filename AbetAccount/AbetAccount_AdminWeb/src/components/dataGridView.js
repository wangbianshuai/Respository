import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Common } from "UtilsCommon";
import DataGrid from "./dataGrid";
import { useConnectDataAction } from "UseHooks";
import { Card } from "antd";
import { router } from "dva";
import styles from "../styles/view.css";
import Base from './base';

const { Link } = router;

const setValue = (dataList, setDataList) => {
    dataList = dataList || [];
    setDataList(dataList);
}

const add = (data, dataList, setDataList, primaryKey) => {
    const id = data[primaryKey];
    let blExists = false;
    const list = [];

    for (let i = 0; i < dataList.length; i++) {
        if (dataList[i][primaryKey] === id) blExists = true;
        else list.push(dataList[i])
    }

    if (blExists) return;
    else list.push(data);

    setValue(list, setDataList);
};

const update = (data, dataList, setDataList, primaryKey) => {
    const id = data[primaryKey];
    const editData = Common.arrayFirst(dataList, (f) => Common.isEquals(f[primaryKey], id, true));
    if (editData !== null) {
        for (let key in data) editData[key] = data[key];
    }
    setValue(dataList.map(m => m), setDataList);
};

const remove = (id, dataList, setDataList, primaryKey) => {
    setValue(dataList.filter(f => !Common.isEquals(f[primaryKey], id, true)), setDataList);
};

const setColumnsVisible = (hideColNames, dataProperties, dataProperties2, setRefreshId) => {
    dataProperties.forEach(p => p.isVisible = !(hideColNames.indexOf(p.name) >= 0));
    dataProperties2 = dataProperties.filter(f => f.isVisible !== false);

    setRefreshId(Common.createGuid());
};

const getExcelExportProperties = (dataProperties) => {
    return dataProperties.filter(f => f.isVisible !== false || f.isExcelExport);
};

const pageIndexChange = (pageIndex, pageSize, isData, pageInfo, property, pageAxis, setRefreshId) => {
    isData = isData === undefined ? true : isData;
    pageInfo.pageIndex = pageIndex;
    pageInfo.pageSize = pageSize;
    if (property.isLocalPage) setRefreshId(Common.createGuid());
    else pageAxis.invokeEventAction(property.eventActionName, { property, pageAxis, pageIndex, pageSize, isData });
}

const refresh = (pageInfo, property, pageAxis, setRefreshId) => {
    pageIndexChange(pageInfo.pageIndex, pageInfo.pageSize, false, pageInfo, property, pageAxis, setRefreshId);
}

const setColumnsVisible2 = (visibleColNames, dataProperties, dataProperties2, property, pageAxis, setRefreshId, pageInfo) => {
    dataProperties.forEach(p => p.isVisible = (visibleColNames.indexOf(p.name) >= 0));
    dataProperties2 = dataProperties.filter(f => f.isVisible !== false);
    if (property.isGroupByQuery) {
        pageInfo.pageIndex = 1;
        refresh(pageInfo, property, pageAxis, setRefreshId);
    }
    else setRefreshId(Common.createGuid());
};

const emptyRender = () => {
    return { children: null, props: { colSpan: 0 } };
};

const setSelfOperationActionList = (p, actionList, record, index, pageAxis) => {
    const { selfPropertyName } = p

    const userId = pageAxis.getLoginUserId();
    const blEdit = Common.isEquals(userId, record[selfPropertyName], true);
    if (blEdit) return actionList;

    const list = [];
    actionList.forEach(a => {
        if (!(a.isSelfOperation && !blEdit)) list.push(a);
    });

    return list;
};

const setDataValueOperationActionList = (p, actionList, record, index) => {
    const list = [];
    actionList.forEach(a => {
        if (a.valueName) {
            if (Common.isEquals(a.dataValue, record[a.valueName], true)) list.push(a);
        }
        else list.push(a);
    });

    return list;
};

const setDataProperty = (p, property, pageAxis) => {
    if (!p.isData && p.sorter === undefined) p.sorter = false;

    if (p.isDate && p.render === undefined) {
        p.render = (text, record, index) => {
            if (p.isRender && !p.isRender(text, record, index)) return emptyRender();
            if (!Common.isNullOrEmpty(text)) text = text.substr(0, 10);
            return text;
        };
    }
    else if (p.isRender && p.render === undefined) {
        p.render = (text, record, index) => {
            if (p.isRender && !p.isRender(text, record, index)) return emptyRender();
            return text;
        };
    }
    else if (p.isCurrency && p.render === undefined) {
        p.render = (text, record, index) => {
            if (p.isRender && !p.isRender(text, record, index)) return emptyRender();
            if (parseFloat(text) < 0) return <span style={{ color: "red" }}>{Common.toCurrency(text, p.isFixed2)}</span>

            if (p.FontColor) return <span style={{ color: p.FontColor }}>{Common.toCurrency(text, p.isFixed2)}</span>

            return Common.toCurrency(text, p.isFixed2)
        };
    }
    else if (p.isOpenPage && p.render === undefined) {
        p.render = (text, record, index) => {
            if (p.isRender && !p.isRender(text, record, index)) return emptyRender();
            if (!Common.isNullOrEmpty(text)) {
                let url = p.pageUrl;
                if (!url && text.toLowerCase().indexOf("http") === 0) url = text;
                else {
                    if (p.isAddPublicPath) url = window.publicPath + url;
                    else if (p.isAddRouterBase) url = window.routerBase + url;
                    url = Common.replaceDataContent(record, url, true)
                }
                if (Common.isNullOrEmpty(url)) return text;
                else if(record[p.imageTypeName]=== p.imageTypeValue){
                    return <a href={url} target='_blank' rel="noopener noreferrer"><img src={url} width={p.imageWidth} alt="" /></a>
                }
                else return <a href={url} target="_blank" rel="noopener noreferrer">{text}</a>
            }
            return text;
        };
    }
    else if (p.isToPage && p.render === undefined) {
        p.render = (text, record, index) => {
            if (p.isRender && !p.isRender(text, record, index)) return emptyRender();
            if (!Common.isNullOrEmpty(text)) {
                let url = p.pageUrl;
                url = Common.replaceDataContent(record, url, true)
                if (Common.isNullOrEmpty(url)) return text;
                else return <Link to={url}>{text}</Link>
            }
            return text;
        };
    }
    else if (p.isData === false && p.actionList) {
        p.render = (text, record, index) => {
            let list = Common.arrayClone(p.actionList);
            list = setSelfOperationActionList(p, list, record, index, pageAxis);
            list = setDataValueOperationActionList(p, list, record, index);
            const fn = pageAxis.getFunction(p.expandsetOperation);
            if (fn) list = fn(list, record, index);
            return Base.renderActions(list, record, property, pageAxis.id);
        }
    }
    else if (p.action) {
        p.render = (text, record, index) => {
            const list = [{ ...p.action, label: text }]
            return Base.renderActions(list, record, property, pageAxis.id);
        }
    }
    else if (p.isImage) {
        p.render = (text, record, index) => {
            if (!Common.isNullOrEmpty(text)) {
                return <a href={text} target='_blank' rel="noopener noreferrer"><img src={text} width={p.imageWidth} alt="" /></a>
            }
            return text;
        };
    }
    return p;
};

const receivesearchQuery = (property, pageAxis) => data => {
    property.setDataLoading(false);
    pageAxis.eventActions.dataGridView.receivesearchQuery(data, { property, pageAxis });
};

const receiveexcelExport = (property, pageAxis) => data => {
    pageAxis.eventActions.dataGridView.receiveexcelExport(data, { property, pageAxis });
};

const init = (property, pageAxis) => {
    const { properties } = property;

    const dataProperties = properties.map(p => setDataProperty(p, property, pageAxis));

    const dataProperties2 = dataProperties.filter(f => f.isVisible !== false);

    const pageInfo = { pageSize: property.pageSize || 10, pageIndex: 1, pageCount: 0, pageRecord: 0 };

    const receiveFunctions = {
        receivesearchQuery: receivesearchQuery(property, pageAxis),
        receiveexcelExport: receiveexcelExport(property, pageAxis)
    };

    return { dataProperties, dataProperties2, queryData: { dataList: [], pageInfo, groupByInfo: null }, receiveFunctions };
};

const setPageInfo = (pageRecord, queryData) => {
    const { pageInfo } = queryData;
    let pageIndex = pageInfo.pageIndex || 1;
    let pageSize = pageInfo.pageSize;
    let pageCount = 0;
    if (pageRecord === 0) { pageIndex = 1; pageCount = 0; }
    else if (pageRecord <= pageSize) { pageCount = 1; pageIndex = 1; }
    else {
        if (pageRecord % pageSize === 0) pageCount = pageRecord / pageSize;
        else pageCount = Common.getIntValue(pageRecord / pageSize) + 1;
    }

    if (pageIndex > pageCount) pageIndex = pageCount;

    queryData.pageInfo = { pageIndex, pageSize, pageCount, pageRecord };
};

const setBindDataList = (actionData, actionTypes, property, queryData, primaryKey) => {
    const { searchQuery } = actionTypes;
    let data = actionData[searchQuery];

    let localDataList = null;

    if (data === undefined || data.isReceive) return;

    data.isReceive = true;

    if (property.isLocalPage) {
        localDataList = data.dataList;
        if (Common.isArray(localDataList)) {
            setPageInfo(data.pageRecord, queryData);
            const { pageIndex, pageSize } = queryData.pageInfo;
            queryData.dataList = localDataList.filter((d, i) => {
                return i >= (pageIndex - 1) * pageSize && i < pageIndex * pageSize;
            });
        }
    }
    else if (Common.isArray(data.dataList)) {
        queryData.dataList = data.dataList;
        if (data.groupByInfo) queryData.groupByInfo = data.groupByInfo;
        if (data.pageRecord !== undefined) setPageInfo(data.pageRecord, queryData);
        else if (data.pageInfo) queryData.pageInfo = data.pageInfo;
    }

    queryData.dataList.forEach(d => d.key = d[primaryKey] || Common.createGuid());
}

//dataList：复杂对象实现数据列表
//queryData：查询数据:数据列表、分页信息、分组信息
const renderDataView = (property, queryData, dataList, dataProperties2, isDataLoading, primaryKey, actionData, actionTypes, pageAxis, onPageIndexChange) => {
    if (property.isComplexEntity) {
        dataList.forEach(d => d.key = d[primaryKey] || Common.createGuid());
        if (property.setChangeDataList) setTimeout(() => property.setChangeDataList(dataList), 100);
    }
    else {
        setBindDataList(actionData, actionTypes, property, queryData, primaryKey);
        dataList = queryData.dataList;
    }

    const isPartPaging = !!property.isPartPaging

    return (<DataGrid pageAxis={pageAxis} primaryKey={primaryKey} dataList={dataList} isPartPaging={isPartPaging}
        pageInfo={queryData.pageInfo} isPaging={property.isPaging} pageId={pageAxis.id}
        isRowSelection={property.isRowSelection} isSingleSelection={property.isSingleSelection} property={property}
        pageIndexChange={onPageIndexChange} groupByInfo={queryData.groupByInfo} groupByInfoHtml={property.groupByInfoHtml}
        isLoading={isDataLoading} dataProperties={dataProperties2} />)
}

export default React.memo((props) => {
    const { property, pageAxis } = Base.getProps(props);
    const { dispatch, dispatchAction, setActionState } = pageAxis;
    //使用链接数据行为
    const [invokeDataAction, actionTypes, actionData] = useConnectDataAction(dispatch, dispatchAction, setActionState, 'components_dataGridView');

    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [dataList, setDataList] = useState(property.value || property.defaultValue || []);
    const setRefreshId = useState(false)[1];
    const primaryKey = property.entity.primaryKey;

    const { dataProperties, dataProperties2, queryData, receiveFunctions } = useMemo(() => init(property, pageAxis), [property, pageAxis])

    useEffect(() => {
        if (property.isSearchQuery !== false) pageAxis.invokeEventAction(property.eventActionName, { property, pageAxis });
    }, [property, pageAxis]);

    useEffect(() => {
        pageAxis.receiveActionDataToObject(receiveFunctions, actionTypes, actionData)
    }, [receiveFunctions, pageAxis, actionTypes, actionData]);

    const onPageIndexChange = useCallback((index, size) => {
        pageIndexChange(index, size, true, queryData.pageInfo, property, pageAxis, setRefreshId);
    }, [queryData, property, pageAxis, setRefreshId]);

    property.setVisible = (v) => setIsVisible(v);
    property.invokeDataAction = invokeDataAction;
    property.actionTypes = actionTypes;
    property.setDataLoading = (v) => setIsDataLoading(v);
    property.add = (d) => add(d, dataList, setDataList, primaryKey);
    property.update = (d) => update(d, dataList, setDataList, primaryKey);
    property.remove = (id) => remove(id, dataList, setDataList, primaryKey);
    property.setValue = (v) => setValue(v, setDataList);
    property.getValue = () => dataList;
    property.setColumnsVisible = (hideColNames) => setColumnsVisible(hideColNames, dataProperties, dataProperties2, setRefreshId)
    property.setColumnsVisible2 = (visibleColNames) => setColumnsVisible2(visibleColNames, dataProperties, dataProperties2, property, pageAxis, setRefreshId, queryData.pageInfo);
    property.getPageRecord = () => queryData.pageInfo.pageRecord;
    property.getDataProperties2 = () => dataProperties2;
    property.getExcelExportProperties = () => getExcelExportProperties(dataProperties)
    property.refresh = () => refresh(queryData.pageInfo, property, pageAxis, setRefreshId)

    if (!isVisible) return null;

    if (property.title) {
        return (
            <Card title={Common.replaceDataContent(pageAxis.pageData, property.title)} style={property.style}
                bordered={false} headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
                {renderDataView(property, queryData, dataList, dataProperties2, isDataLoading, primaryKey, actionData, actionTypes, pageAxis, onPageIndexChange)}
            </Card>
        )
    }

    const className = Base.getClassName(property, styles);

    if (property.isDiv) return (<div className={className} style={property.style}>
        {renderDataView(property, queryData, dataList, dataProperties2, isDataLoading, primaryKey, actionData, actionTypes, pageAxis, onPageIndexChange)}</div>)
    else return renderDataView(property, queryData, dataList, dataProperties2, isDataLoading, primaryKey, actionData, actionTypes, pageAxis, onPageIndexChange);
});