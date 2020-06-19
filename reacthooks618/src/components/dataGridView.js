import React, { useState, useEffect, useMemo } from "react";
import { Common } from "UtilsCommon";
import DataGrid from "./DataGrid";
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

const setColumnsVisible = (hideColNames, dataProperties, setRefreshId) => {
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

const setColumnsVisible2 = (visibleColNames, dataProperties, property, setRefreshId, pageInfo) => {
    dataProperties.forEach(p => p.isVisible = (visibleColNames.indexOf(p.name) >= 0));
    dataProperties2 = dataProperties.filter(f => f.isVisible !== false);
    if (property.isGroupByQuery) {
        pageInfo.pageIndex = 1;
        refresh();
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
                if (p.isAddBasePath) url = window.routerBase + url;
                url = Common.replaceDataContent(record, url, !p.isHttp)
                if (Common.isNullOrEmpty(url)) return text;
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
                const blUrl = !(p.isUrl === false)
                url = Common.replaceDataContent(record, url, blUrl)
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
    return p;
};

const receiveSearchQuery = (property, pageAxis) => data => {
    property.setDataLoading(false);
    pageAxis.dataGridView.receiveSearchQuery(data, { property, pageAxis });
};

const receiveExcelExport = (property, pageAxis) => data => {
    pageAxis.dataGridView.receiveExcelExport(data, { property, pageAxis });
};

const init = (property, pageAxis) => {
    const { properties } = property;

    const dataProperties = properties.map(p => setDataProperty(p, property, pageAxis));

    const dataProperties2 = dataProperties.filter(f => f.isVisible !== false);

    const pageInfo = { pageSize: property.pageSize || 10, pageIndex: 1, pageCount: 0, pageRecord: 0 };

    const receiveFunctions = {
        receiveSearchQuery: receiveSearchQuery(property, pageAxis),
        receiveExcelExport: receiveExcelExport(property, pageAxis)
    };

    return { dataProperties, dataProperties2, pageInfo, receiveFunctions };
};

const getPageInfo = (pageRecord, pageInfo) => {
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

    return { pageIndex, pageSize, pageCount, pageRecord };
};

const setDataList = (actionData, actionTypes, property, dataList, pageInfo) => {
    const { searchQuery } = actionTypes;
    let data = actionData[searchQuery];

    if (data === undefined) return;

    let localDataList = null;

    if (property.isLocalPage) {
        localDataList = data.dataList;
        if (Common.isArray(localDataList)) {
            pageInfo = getPageInfo(data.pageRecord, pageInfo);
            const { pageIndex, pageSize } = pageInfo;
            dataList = localDataList.filter((d, i) => {
                return i >= (pageIndex - 1) * pageSize && i < pageIndex * pageSize;
            });
        }
    }
    else if (Common.isArray(data.dataList)) {
        dataList = data.dataList;
        if (data.groupByInfo) groupByInfo = data.groupByInfo;
        if (data.pageRecord !== undefined) pageInfo = getPageInfo(data.pageRecord, pageInfo);
        else if (data.pageInfo) pageInfo = data.pageInfo;
    }

    dataList.forEach(d => d.key = d[primaryKey] || Common.createGuid());

    return [dataList, pageInfo];
}

const renderDataView = (property, pageInfo, dataList, dataProperties2, isDataLoading) => {
    if (property.isComplexEntity) {
        dataList.forEach(d => d.key = d[primaryKey] || Common.createGuid());
        if (property.setChangeDataList) setTimeout(() => property.setChangeDataList(dataList), 100);
    }
    else {
        [dataList, pageInfo] = setDataList(actionData, actionTypes, property, dataList, pageInfo);
    }
    const isPartPaging = !!property.isPartPaging

    return (<DataGrid pageAxis={pageAxis} primaryKey={primaryKey} dataList={dataList} isPartPaging={isPartPaging}
        pageInfo={pageInfo} isPaging={property.isPaging}
        isRowSelection={property.isRowSelection} isSingleSelection={property.isSingleSelection} property={property}
        pageIndexChange={pageIndexChange} groupByInfo={groupByInfo} groupByInfoHtml={property.groupByInfoHtml}
        isLoading={isDataLoading} dataProperties={dataProperties2} />)
}

export default (props) => {
    const { property, pageAxis } = Base.getProps(props);
    const { dispatch, dispatchAction, setActionState } = pageAxis;
    //使用链接数据行为
    const [invoke, actionTypes, actionData] = useConnectDataAction(dispatch, dispatchAction, setActionState, 'Components_DataGridView');

    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [dataList, setDataList] = useState(false);
    const [refreshId, setRefreshId] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(property.value || property.defaultValue || []);

    const primaryKey = property.entity.primaryKey;

    const { dataProperties, dataProperties2, pageInfo, receiveFunctions } = useMemo(() => init(property, pageAxis), [property, pageAxis])

    useEffect(() => {
        if (property.isSearchQuery !== false) pageAxis.invokeEventAction(property.eventActionName, { property, pageAxis });
    }, [property, pageAxis]);

    useEffect(() => {
        pageAxis.receiveActionDataToObject(receiveFunctions, actionTypes, actionData)
    }, [receiveFunctions, pageAxis, actionTypes, actionData]);

    if (!property.setVisible) property.setVisible = (v) => setIsVisible(v);
    if (!property.invokeDataAction) property.invokeDataAction = invoke;
    if (!property.actionTypes) property.actionTypes = actionTypes;
    if (!property.setDataLoading) property.setDataLoading = (v) => setIsDataLoading(v);
    if (!property.add) property.add = (d) => add(d, dataList, setDataList, primaryKey);
    if (!property.update) property.update = (d) => update(d, dataList, setDataList, primaryKey);
    if (!property.add) property.remove = (id) => remove(id, dataList, setDataList, primaryKey);
    if (!property.add) property.setValue = (v) => setValue(v, setDataList);
    if (!property.add) property.getValue = () => dataList;
    if (!property.add) property.setColumnsVisible = (hideColNames) => setColumnsVisible(hideColNames, dataProperties, setRefreshId)
    if (!property.add) property.setColumnsVisible2 = (visibleColNames) => setColumnsVisible2(visibleColNames, dataProperties, property, setRefreshId, pageInfo);
    if (!property.add) property.getPageRecord = () => pageInfo.pageRecord;
    if (!property.add) property.getDataProperties2 = () => dataProperties2;
    if (!property.add) property.getExcelExportProperties = () => getExcelExportProperties(dataProperties)
    if (!property.add) property.refresh = () => refresh(pageInfo, property, pageAxis, setRefreshId)

    if (isVisible) return null;

    if (property.title) {
        return (
            <Card title={Common.replaceDataContent(pageAxis.pageData, property.title)} style={property.style}
                bordered={false} headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
                {renderDataView(property, pageInfo, dataList, dataProperties2, isDataLoading)}
            </Card>
        )
    }

    const className = Base.getClassName(property, styles);

    if (property.isDiv) return (<div className={className} style={property.style}>
        {renderDataView(property, pageInfo, dataList, dataProperties2, isDataLoading)}</div>)
    else return renderDataView(property, pageInfo, dataList, dataProperties2, isDataLoading);
};