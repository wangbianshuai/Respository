const getUserPhotoView = require('../../views/userPhoto');

//square/userPhoto 1900-1999
const dataActionTypes = {
  //get entity data
  getEntityData: 1900,
  //Save entity data
  saveEntityData: 1901
};

module.exports = getUserPhotoView(dataActionTypes, 2);