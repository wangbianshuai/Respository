import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('MarriageUserPhoto');

config.actionList.push(get("getMarriageUserPhotos", "ViewMarriageUserPhoto", "getMarriageUserPhotos", true));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

export default DvaIndex(config);
