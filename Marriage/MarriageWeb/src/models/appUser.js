import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('AdminUser');

config.actionList.push(get("getAdminUsers", "ViewAdminUser?$select=AdminUserId,UserName&$orderby CreateDate", "getAdminUsers", "ViewAdminUser"));
config.actionList.push(post("login", "AdminUser/Login", "login", "AdminUser"));
config.actionList.push(post("changePassword", "AdminUser/ChangePassword", "changePassword", "changePassword", true));

function get(actionName, url, stateName, dataKey, istoken, hastoken) {
  return { actionName, url, method: "GET", stateName, dataKey, istoken, hastoken };
}

function post(actionName, url, stateName, dataKey, istoken) {
  return { actionName, url, method: "POST", stateName, dataKey, istoken }
}

export default DvaIndex(config);
