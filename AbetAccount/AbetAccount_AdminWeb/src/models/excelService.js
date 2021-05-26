import DvaIndex from "DvaCommon";

export default DvaIndex({
    name: "ExcelService",
    serviceName: "ApiService",
    actionList: [
        post("excelImport", "ExcelImportHandler", "excelImport")
    ]
})

function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", isFormData: true, stateName, dataKey }
}
