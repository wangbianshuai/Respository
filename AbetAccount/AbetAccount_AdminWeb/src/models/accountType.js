import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('AccountType');

config.actionList.push(get("getAccountTypes", "ViewAccountType?$select=TypeId,Name&$orderby CreateDate", "getAccountTypes", "ViewAccountType"));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

export default DvaIndex(config);
