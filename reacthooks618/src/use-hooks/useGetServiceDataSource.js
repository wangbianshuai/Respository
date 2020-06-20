import { useState, useEffect } from 'react';

const receiveDataSource = (res, property, pageAxis, setDataList) => {
  let list = []
  if (pageAxis.isSuccessProps(res)) {
    if (res.action && res.data) res = res.data;
    if (property.listName) list = res[property.listName];
    else list = res;
  }
  if (property.isOnlyInit) property.initDataList = list;
  else setDataList(list);
};

export default (property, view, pageAxis) => {
  const [dataList, setDataList] = useState([]);
  const { dataSource, serviceDataSource } = property;

  useEffect(() => {
    if (dataSource) {
      setDataList(dataSource);
      return;
    }

    if (serviceDataSource) {
      const state = pageAxis.getStateValue(serviceDataSource.stateName);
      if (pageAxis.isSuccessProps(state) && !serviceDataSource.isRefresh) receiveDataSource(state, property, pageAxis, setDataList);
      else {
        var payload = serviceDataSource.payload || {};
        if (serviceDataSource.getPayload) payload = pageAxis.getFunction(serviceDataSource.getPayload)({ property, view })
        pageAxis.dispatchAction(serviceDataSource.serviceName, serviceDataSource.actionName, payload).then(res => receiveDataSource(res, pageAxis, pageAxis, setDataList));
      }
    }
  }, [property, dataSource, serviceDataSource, pageAxis, view, setDataList]);

  return dataList;
};
