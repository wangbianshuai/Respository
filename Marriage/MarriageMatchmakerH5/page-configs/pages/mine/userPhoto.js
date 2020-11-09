//index 500-599
const dataActionTypes = {
  //get entity data
  getEntityData: 500,
  //Save entity data
  saveEntityData: 501,
  //更新用户信息
  updateUserInfo: 502
};

const entity = { name: 'MarriageUserPhoto', primaryKey: 'PhotoId', isGet: true };

module.exports = {
  name: "userPhotoEdit",
  type: "View",
  entity,
  eventActions: getEventActions(),
  properties: [userPhotoEditView()]
}


function userPhotoEditView() {
  return {
      name: "editView",
      type: "View",
      properties: [userPhotoEditView2()]
  }
}

function userPhotoEditView2() {
  return {
      name: "userPhotoEditEdit",
      type: "View",
      entity,
      eventActionName: "getEntityData",
      getEntityDataActionType: dataActionTypes.getEntityData,
      properties: getProperties()
  }
}

function getProperties() {
  return [{
      name: 'DataList',
      type: 'userPhotoList'
  }]
}

function getEventActions() {
  return [{
      name: "getEntityData",
      type: "entityEdit/getEntityData",
      editView: "userPhotoEditEdit"
  }]
}