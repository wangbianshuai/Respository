const getUserInfoView = require('../../views/userInfo');

//square/userInfo 1400-1499
const dataActionTypes = {
    //get entity data
    getEntityData: 1400,
    //Save entity data
    saveEntityData: 1401
};

module.exports = getUserInfoView(dataActionTypes, 1);