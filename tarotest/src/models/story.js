import DvaIndex from "DvaCommon";
import EntityModelConfig from './entityModelConfig';

const config = EntityModelConfig('Story');

config.actionList.push(get("getStorys", "ViewStory?$select=Id,StoryName&$orderby=CreateDate desc", "getStorys", "ViewStory"));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken };
}

export default DvaIndex(config);
