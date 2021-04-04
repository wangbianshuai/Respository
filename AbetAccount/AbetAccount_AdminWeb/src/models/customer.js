import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('Customer');

config.actionList.push(get("getCustomers", "ViewCustomer?$select=CustomerId,Name&$orderby CreateDate", "getCustomers", "ViewCustomer"));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

export default DvaIndex(config);
