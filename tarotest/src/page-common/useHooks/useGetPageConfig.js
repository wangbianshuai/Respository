import Taro, { useState, useEffect } from "@tarojs/taro";
import { EnvConfig, Common } from 'UtilsCommon';

const _PageConfigs = {};

export default (name) => {
  const [pageConfig, setPageConfig] = useState(_PageConfigs[name]);

  useEffect(() => {
    if (!pageConfig) {
      Taro.request({
        url: Common.addUrlRandom(EnvConfig.getPageConfigUrl(name)),
        method: 'GET'
      }).then(res => {
        _PageConfigs[name] = res.data;
        setPageConfig(res.data);
      });
    }
  }, [pageConfig, name]);

  return pageConfig;
}
