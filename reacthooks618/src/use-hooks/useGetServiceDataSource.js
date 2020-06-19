import { useState, useEffect, useCallback } from 'react';
import usePageAxis from './usePageAxis';

export default (props) => {
  const { property, pageId, view } = props;
  const pageAxis = usePageAxis.getPageAxis(pageId);
  const [dataList, setDataList] = useState([]);

  const receiveDataSource = useCallback((res, pageAxis) => {
    let list = []
    if (pageAxis.isSuccessProps(res)) {
      if (res.action && res.data) res = res.data;
      if (property.listName) list = res[property.listName];
      else list = res;
    }
    if (property.isOnlyInit) property.initDataList = list;
    else setDataList(list);
  }, [property]);

  useEffect(() => {
    if (property.dataSource) {
      setDataList(property.dataSource);
      return;
    }

    const { serviceDataSource } = property;
    if (pageAxis && serviceDataSource) {
      const state = pageAxis.getStateValue(serviceDataSource.stateName);
      if (pageAxis.isSuccessProps(state) && !serviceDataSource.isRefresh) receiveDataSource(state, pageAxis);
      else {
        var payload = serviceDataSource.Payload || {};
        if (serviceDataSource.getPayload) payload = pageAxis.getFunction(serviceDataSource.getPayload)({ property, view })
        pageAxis.dispatchAction(serviceDataSource.serviceName, serviceDataSource.actionName, payload).then(res => receiveDataSource(res, pageAxis));
      }
    }
  }, [property, pageAxis, view, receiveDataSource]);

  return dataList;
};
