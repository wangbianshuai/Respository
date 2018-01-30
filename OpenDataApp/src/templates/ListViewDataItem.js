import * as Common from "../utils/Common"

//ListView数据项
/*
Config配置结构：
{

}
*/

export default function ListViewDataItem(config) {
    const _Config = { Config: config }

    //初始化配置
    InitConfig(_Config, config)

    return _Config
}

function InitConfig(a, b) {

    const copyNames = []

    Common.Copy(a, b, copyNames)
}