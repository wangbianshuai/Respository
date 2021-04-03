import { useState, useEffect } from "react";
import { EnvConfig } from 'Configs';

const _PageConfigs = {};

export default (name, dispatchAction) => {
  const [pageConfig, setPageConfig] = useState(_PageConfigs[name]);

  useEffect(() => {
    if (!pageConfig) {
      const pathQuery = EnvConfig.env === "local" ? `/getconfig?name=${name}` : `/${name.replace("_", "/")}.json`;
      dispatchAction("WebService", "getPageConfig", { pathQuery }).then(res => {
        _PageConfigs[name] = res;
        setPageConfig(res);
      });
    }
  }, [pageConfig, name, dispatchAction]);

  return pageConfig;
}
