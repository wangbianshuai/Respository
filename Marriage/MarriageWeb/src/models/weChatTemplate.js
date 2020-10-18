import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('WeChatTemplate');

config.actionList.push(post("syncWeChat", "WeChatTemplate/SyncWeChat", "syncWeChat", "WeChatTemplate", true));
config.actionList.push(get("getWeChatTemplates", "WeChatTemplate?$select=TemplateId,Title,Content&$filter=AppAccountId eq @AppAccountId&$orderby CreateDate", "getWeChatTemplates", "WeChatTemplate"));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

function post(actionName, url, stateName, dataKey, istoken) {
  return { actionName, url, method: "POST", stateName, dataKey, istoken }
}

export default DvaIndex(config);
