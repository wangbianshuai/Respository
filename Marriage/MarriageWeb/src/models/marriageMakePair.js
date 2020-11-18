import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('MarriageMakePair');

config.actionList.push(get("getMarriageMakePairsDetails", "MarriageMakePair/GetMarriageMakePairsDetails", "getMarriageMakePairsDetails", "MarriageMakePair", true));

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

export default DvaIndex(config);
