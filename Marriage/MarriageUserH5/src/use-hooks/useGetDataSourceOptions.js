import { useState, useEffect } from 'react';

const receiveDataSource = (res, property, view, pageAxis, setOptions, getOptions) => {
  let list = []
  if (pageAxis.isSuccessProps(res)) {
    if (res.action && res.data) res = res.data;
    if (property.listName) list = res[property.listName];
    else list = res;
  }
  property.dataSource = list;
  if (!property.isOnlyInit) setOptions(getOptions(property, view, pageAxis));
};

export default (property, view, pageAxis, getOptions) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const { dataSource, serviceDataSource } = property;
    if (dataSource) {
      setOptions(getOptions(property, view, pageAxis));
      return;
    }

    if (serviceDataSource) {
      const state = pageAxis.getStateValue(serviceDataSource.stateName);
      if (pageAxis.isSuccessProps(state) && !serviceDataSource.isRefresh) receiveDataSource(state, property, view, pageAxis, setOptions, getOptions);
      else {
        var payload = serviceDataSource.payload || {};
        if (serviceDataSource.getPayload) payload = pageAxis.getFunction(serviceDataSource.getPayload)({ payload, property, view })
        pageAxis.dispatchAction(serviceDataSource.serviceName, serviceDataSource.actionName, payload).then(res => receiveDataSource(res, property, view, pageAxis, setOptions, getOptions));
      }
    }
  }, [property, pageAxis, view, setOptions, getOptions]);

  return [options, setOptions];
};
