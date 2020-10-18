module.exports = {
    name: "LiveVodPlaySyncRecord",
    viewName: 'ViewLiveVodPlaySyncRecord',
    primaryKey: "DayTime",
    properties: getProperties()
}

function getProperties() {
    return [
        getProperty("DayTime", "日期"),
        getProperty("RecordCount", "文件数"),
        getProperty("SucceedCount", "成功数"),
        getProperty("FailedCount", "失败数"),
        getProperty("CreateDate", "操作时间")
    ]
}

function getProperty(name, label) { return { name, label } }