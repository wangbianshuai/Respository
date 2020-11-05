import DvaIndex from "DvaCommon";

export default DvaIndex({
  name: "ResourcesService",
  serviceName: "ResourcesService",
  actionList: [
    post("uploadFile", "Upload", "uploadFile")
  ]
})

function post(actionName, url, stateName) {
  return { actionName, url, method: "POST", isFormData: true, stateName };
}