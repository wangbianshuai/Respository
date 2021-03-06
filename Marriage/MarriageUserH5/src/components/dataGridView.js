import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Common } from "UtilsCommon";
import { useConnectDataAction } from "UseHooks";
import DataItems from 'DataItems';
import ListView2 from "./listView2";
import styles from "../styles/view.scss";
import Base from './base';

const pageIndexChange = (pageIndex, isData, pageInfo, property, pageAxis) => {
  isData = isData === undefined ? true : isData;
  if (pageIndex > pageInfo.pageCount) {
    property.setIsLoadingMore(false);
    return;
  }

  pageInfo.pageIndex = pageIndex;
  const { pageSize } = pageInfo;

  pageAxis.invokeEventAction(property.eventActionName, { property, pageAxis, pageIndex, pageSize, isData });
}

const refresh = (pageInfo, property, pageAxis) => {
  pageIndexChange(pageInfo.pageIndex, pageInfo.pageSize, false, pageInfo, property, pageAxis);
}

const receivesearchQuery = (property, pageAxis) => data => {
  pageAxis.eventActions.dataGridView.receivesearchQuery(data, { property, pageAxis });
};

const init = (property, pageAxis) => {
  const pageInfo = { pageSize: property.pageSize || 10, pageIndex: 1, pageCount: 0, pageRecord: 0 };

  const receiveFunctions = {
    receivesearchQuery: receivesearchQuery(property, pageAxis),
  };

  return { queryData: { dataList: null, pageInfo, groupByInfo: null }, receiveFunctions };
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

const setBindDataList = (actionData, actionTypes, queryData, primaryKey) => {
  const { searchQuery } = actionTypes;
  let data = actionData[searchQuery];

  if (data === undefined || data.isReceive) return;

  data.isReceive = true;

  if (Common.isArray(data.dataList)) {
    if (data.groupByInfo) queryData.groupByInfo = data.groupByInfo;
    if (data.pageRecord !== undefined) setPageInfo(data.pageRecord, queryData);
    else if (data.pageInfo) queryData.pageInfo = data.pageInfo;

    if (queryData.pageInfo.pageIndex === 1) {
      queryData.dataList = data.dataList;
      queryData.id = Common.createGuid();
    }
    else queryData.dataList = queryData.dataList.concat(data.dataList);
  }

  queryData.dataList && queryData.dataList.forEach(d => d.key = d[primaryKey] || Common.createGuid());
}

const renderRow = (property, data, id) => {
  const props = { data, key: id, property }
  const { itemType } = property;
  if (DataItems[itemType]) return React.createElement(DataItems[itemType], props);
  return <div></div>;
};

const renderColumnHeader = (property) => {
  if (!property.headerItemType) return null;

  const { headerItemType } = property;

  if (DataItems[headerItemType]) return React.createElement(DataItems[headerItemType], { property });

  return null;
};

const renderHeader = (property, dataList, pageRecord) => {
  return () => {
    return (
      <React.Fragment>
        {pageRecord > 0 && <div className={styles.divPageInfo}><span>当前显示：{dataList.length}条</span><span>总记录：{pageRecord}条</span></div>}
        {renderColumnHeader(property)}
      </React.Fragment>
    )
  }
}

//dataList：复杂对象实现数据列表
//queryData：查询数据:数据列表、分页信息、分组信息
const renderDataView = (property, queryData, primaryKey, actionData, actionTypes, pageIndexChange) => {
  setBindDataList(actionData, actionTypes, queryData, primaryKey);
  const { dataList } = queryData;
  const { pageIndex, pageRecord } = queryData.pageInfo;

  return (<React.Fragment>
    <ListView2
      key={queryData.id || '1'}
      property={property}
      dataList={dataList}
      pageIndex={pageIndex}
      pageIndexChange={pageIndexChange}
      renderHeader={renderHeader(property, dataList, pageRecord)}
      renderRow={(rowData) => renderRow(property, rowData, rowData[primaryKey])} /></React.Fragment>)
}

export default (props) => {
  const { property, pageAxis } = Base.getProps(props);
  const { dispatch, dispatchAction, setActionState } = pageAxis;

  //使用链接数据行为
  const [invokeDataAction, actionTypes, actionData] = useConnectDataAction(dispatch, dispatchAction, setActionState, 'components_dataGridView');

  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const primaryKey = property.entity.primaryKey;

  const { queryData, receiveFunctions } = useMemo(() => init(property, pageAxis), [property, pageAxis])

  useEffect(() => {
    if (property.isSearchQuery !== false) pageAxis.invokeEventAction(property.eventActionName, { property, pageAxis });
  }, [property, pageAxis]);

  useEffect(() => {
    pageAxis.receiveActionDataToObject(receiveFunctions, actionTypes, actionData);
    property.setRefreshing(false);
    property.setIsLoadingMore(false);
  }, [receiveFunctions, pageAxis, actionTypes, actionData]);

  const onPageIndexChange = useCallback((index) => {
    pageIndexChange(index, true, queryData.pageInfo, property, pageAxis);
  }, [queryData, property, pageAxis]);

  property.setVisible = (v) => setIsVisible(v);
  property.invokeDataAction = invokeDataAction;
  property.actionTypes = actionTypes;
  property.getPageRecord = () => queryData.pageInfo.pageRecord;
  property.refresh = () => refresh(queryData.pageInfo, property, pageAxis)
  property.setDataLoading = (l) => { };

  if (!isVisible) return null;

  const className = Base.getClassName(property, styles);

  return (<div className={className} style={property.style}>
    {renderDataView(property, queryData, primaryKey, actionData, actionTypes, onPageIndexChange)}</div>)
};