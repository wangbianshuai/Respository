import DvaIndex from "DvaCommon";
import EntityModelConfig from './entityModelConfig';

const config = EntityModelConfig('Week');

config.actionList.push(get("getWeeks", "ViewWeek?$select=Id,WeekName&$orderby=CreateDate desc", "getWeeks", "ViewWeek"));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken };
}

export default DvaIndex(config);
