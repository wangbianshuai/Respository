import Taro, { useMemo, useState, useEffect, useCallback } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import { Common } from 'UtilsCommon';
import { PageAxis, useConnectAction } from "PageCommon";
import DataRow from '../data-rows/index';

const DataGridView = (props) => {
  const { property, view, pageId } = props;
  const [visible, setVisible] = useState(property.visible !== false);
  const [invoke, actionTypes, actionData] = useConnectAction('components_dataGridView');

  const pageAxis = PageAxis.getPageAxis(pageId);

  property.invoke = invoke;
  property.actionTypes = actionTypes;

  const obj = useMemo(() => ({
    id: Common.createGuid(),
  }), []);

  init(obj, property, view, pageAxis, setVisible);

  useEffect(() => pageAxis.receiveActionDataToObject(obj, actionTypes, actionData), [obj, pageAxis, actionTypes, actionData]);

  useEffect(() => {
    if (property.isSearchQuery !== false && property.eventActionName) pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
  }, [property, view, pageAxis]);

  const onLongPressRow = useCallback((entityData) => {
    if (property.deleteEventActionName) pageAxis.invokeEventAction(property.deleteEventActionName, { property, entityData, pageAxis });
  }, [property, pageAxis]);

  const onClikRow = useCallback((entityData) => {
    if (property.editEventActionName) pageAxis.invokeEventAction(property.editEventActionName, { property, entityData, pageAxis });
  }, [property, pageAxis]);

  const pageIndexChange = useCallback((pageIndex, pageSize, isData) => {
    isData = isData === undefined ? true : isData;
    const { pageInfo } = obj.dataInfo;
    pageInfo.PageIndex = pageIndex;
    pageInfo.PageSize = pageSize;

    pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis, pageIndex, pageSize, isData });
  }, [obj, property, view, pageAxis]);


  if (!property.refresh) property.refresh = () => {
    const { pageInfo } = obj.dataInfo;
    const { PageIndex, PageSize } = pageInfo;
    pageIndexChange(PageIndex, PageSize, false)
  };

  if (!visible) return <View />;

  setDataInfo(obj, actionTypes, actionData);

  return <ScrollView>
    {obj.dataInfo && obj.dataInfo.dataList && obj.dataInfo.dataList.map(m =>
      <DataRow
        key={m.Id}
        data={m}
        entityName={property.entity.name}
        onLongPressRow={onLongPressRow}
        onClikRow={onClikRow}
      />)}
  </ScrollView>
};

function setDataInfo(obj, actionTypes, actionData) {
  if (actionData) {
    const { searchQuery } = actionTypes;
    let data = actionData[searchQuery];
    if (!data) return;

    if (obj.searchQueryData !== data && Common.isArray(data.dataList)) {
      if (data.pageRecord !== undefined) obj.dataInfo.pageInfo = getPageInfo(obj.dataInfo, data.pageRecord);
      else if (data.pageInfo) obj.dataInfo.pageInfo = data.pageInfo;

      if (obj.dataInfo.pageInfo.PageIndex <= 1) obj.dataInfo.dataList = [];

      obj.dataInfo.dataList = obj.dataInfo.dataList.concat(data.dataList);
      if (data.groupByInfo) obj.dataInfo.groupByInfo = data.GroupByInfo;

      obj.searchQueryData = data;
    }
  }
}

function getPageInfo(dataInfo, PageRecord) {
  let PageIndex = dataInfo.PageInfo.PageIndex || 1;
  let PageSize = dataInfo.PageInfo.PageSize;
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

function init(obj, property, view, pageAxis, setVisible) {
  if (property.id && !obj.isInit) obj.isInit = true; else return;

  property.setVisible = setVisible;

  obj.dataInfo = { dataList: [], pageInfo: { PageSize: property.pageSize || 10, PageIndex: 1, PageCount: 0, PageRecord: 0 } };

  obj.receivesearchQuery = (data) => {
    pageAxis.eventActions.DataGridView.receivesearchQuery(data, { property, view, pageAxis });

    return true;
  };
}

DataGridView.defaultProps = { property: { properties: [] }, view: {} };
DataGridView.options = { addGlobalClass: true };

export default DataGridView;
