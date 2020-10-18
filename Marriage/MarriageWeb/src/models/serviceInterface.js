import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('ServiceInterface');

config.actionList.push(get("getServiceInterfaces", "ViewServiceInterface?$select=ServiceInterfaceId,Name&$orderby CreateDate", "getServiceInterfaces", "ViewServiceInterface"));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

export default DvaIndex(config);
