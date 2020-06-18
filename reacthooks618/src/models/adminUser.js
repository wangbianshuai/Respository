import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('AdminUser');

config.actionList.push(get("getUsers", "ViewUser?$select=UserId,UserName&$orderby CreateDate", "getUsers", "ViewUser"));
config.actionList.push(post("login", "User/Login", "login", "login"));
config.actionList.push(post("changePassword", "User/changePassword", "changePassword", "changePassword", true));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken };
}

function post(actionName, url, stateName, dataKey, isToken) {
  return { actionName, url, method: "POST", stateName, dataKey, isToken }
}

export default DvaIndex(config);
