import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('LiveVodPlayInfo');

config.actionList.push(post("syncPlayFlux", "LiveVodPlayInfo/SyncPlayFlux", "syncPlayFlux", "LiveVodPlayInfo", true));

function post(actionName, url, stateName, dataKey, istoken) {
    return { actionName, url, method: "POST", stateName, dataKey, istoken }
}

export default DvaIndex(config);
