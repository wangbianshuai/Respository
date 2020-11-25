module.exports = {
    name: "FileRecord",
    viewName: 'FileRecord',
    primaryKey: "FileId",
    properties: getProperties()
}

function getProperties() {
    return [
        getProperty("FileId", "FileId"),
        getProperty("AppId", "AppId"),
        getProperty("FileName", "文件名"),
        getProperty("FilePath", "文件路径"),
        getProperty("FileType", "文件类型"),
        getProperty("FileSize", "文件大小"),
        getProperty("IpAddress", "IP地址"),
        getProperty("CreateDate", "创建时间")
    ]
}

function getProperty(name, label) { return { name, label } }