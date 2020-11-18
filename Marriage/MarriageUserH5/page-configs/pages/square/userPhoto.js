const getUserPhotoView = require('../../views/userPhoto');

//square/userPhoto 1500-1599
const dataActionTypes = {
  //get entity data
  getEntityData: 1500,
  //Save entity data
  saveEntityData: 1501
};

module.exports =getUserPhotoView(dataActionTypes);