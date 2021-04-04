import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('AdminUser');

config.actionList.push({ ...post("login", "AdminUser/Login", "login", "AdminUser"), isNoToken: true });
config.actionList.push(post("changePassword", "AdminUser/ChangePassword", "changePassword", "changePassword", true));
config.actionList.push(get("getUsers", "ViewAdminUser?$select=UserId,UserName&$orderby CreateDate", "getUsers", "ViewAdminUser"));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
  return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

function post(actionName, url, stateName, dataKey, istoken) {
  return { actionName, url, method: "POST", stateName, dataKey, istoken }
}

export default DvaIndex(config);
