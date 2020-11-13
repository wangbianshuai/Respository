//boygirl/userPhoto 800-899
const dataActionTypes = {
  //get entity data
  getEntityData: 800,
  //Save entity data
  saveEntityData: 801,
};

const entity = { name: 'MarriageUserPhoto', primaryKey: 'userId' };

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
    type: 'userPhotoList',
    isReadOnly: true,
  }]
}

function getEventActions() {
  return [{
    name: "getEntityData",
    type: "entityEdit/getEntityData",
    editView: "userPhotoEditEdit"
  }]
}