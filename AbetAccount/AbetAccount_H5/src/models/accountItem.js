import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('AccountItem');

config.actionList.push(get("getAccountItems", "ViewAccountItem?$select=ItemId,Name&$orderby CreateDate", "getAccountItems", "ViewAccountItem"));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

export default DvaIndex(config);
