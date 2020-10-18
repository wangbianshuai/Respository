module.exports = {
    name: "LiveVodPlayInfo",
    viewName: 'ViewLiveVodPlayInfo',
    primaryKey: "InfoId",
    properties: getProperties(),
    responseStatusDataSource: getResponseStatusDataSource()
}

function getProperties() {
    return [
        getProperty("InfoId", "InfoId"),
        getProperty("DayTime", "日期"),
        getProperty("Name", "直播名称"),
        getProperty("LiveCode", "直播编号"),
        getProperty("FileId", "视频文件ID"),
        getProperty("TotalFlux", "播放流量(MB)"),
        getProperty("ResponseStatusName", "响应状态"),
        getProperty("ResponseContent", "响应报文"),
        getProperty("CreateDate", "操作时间")
    ]
}

function getProperty(name, label) { return { name, label } }


function getResponseStatusDataSource() {
    return [{ value: 1, text: "成功" }, { value: 0, text: "失败" }]
}
