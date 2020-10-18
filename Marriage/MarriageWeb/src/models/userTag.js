import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('UserTag');

config.actionList.push(get("getUserTags", "ViewUserTag?$select=UserTagId,Name&$filter=AppAccountId eq @AppAccountId&$orderby CreateDate", "getUserTags", "ViewUserTag"));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

export default DvaIndex(config);
