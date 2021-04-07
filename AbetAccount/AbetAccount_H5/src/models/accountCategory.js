import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('AccountCategory');

config.actionList.push(get("getAccountCategorys", "ViewAccountCategory?$select=CategoryId,IncomeOutlay,Name&$orderby CreateDate", "getAccountCategorys", "ViewAccountCategory"));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

export default DvaIndex(config);
