import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('DataSource');

config.actionList.push(get("getDataSources", "ViewDataSource?$select=DataSourceId,Name&$orderby CreateDate", "getDataSources", "ViewDataSource"));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}


export default DvaIndex(config);
