import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('AdminUser');

config.actionList.push(get("getUsers", "ViewUser?$select=UserId,UserName&$orderby CreateDate", "getUsers", "ViewUser"));
config.actionList.push(post("login", "User/login", "login", "login"));
config.actionList.push(post("changePassword", "User/changePassword", "changePassword", "changePassword", true));

function get(actionName, url, stateName, dataKey, istoken, hastoken) {
  return { actionName, url, method: "GET", stateName, dataKey, istoken, hastoken };
}

function post(actionName, url, stateName, dataKey, istoken) {
  return { actionName, url, method: "POST", stateName, dataKey, istoken }
}

export default DvaIndex(config);
