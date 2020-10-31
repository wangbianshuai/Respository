import { Common } from "UtilsCommon";

var _Menus = {}
export default () => {
    _Menus = {};
    return {
        navMenuList: [
            getsystemManageNavNenu(),
            getPersonCenterNavMenu()
        ],
        menus: _Menus
    }
};

function getPersonCenterNavMenu() {
    var menuList = [];
    menuList.push(addMenu("appAccountInfo", "App账户信息", true, "idcard", "/personCenter/appAccountInfo"));
    menuList.push(addMenu("changePassword", "修改密码", true, "idcard", "/personCenter/changePassword"));

    return addNavMenu("personCenter", "账户中心", true, menuList, false, ["appAccountInfo", "changePassword"]);
}

function getsystemManageNavNenu() {
    var menuList = [];
 
        menuList.push(addMenu("dictionaryConfigList", "键值配置", false, "table", "/systemManage/dictionaryConfigList"));
        menuList.push(addMenu("dictionaryConfigEdit", "新增", true, "form", "/systemManage/dictionaryConfigEdit", "", null, false, "键值配置", "/systemManage/dictionaryConfigList", null, true));
     

    menuList.push(addMenu("appUserList", "用户", false, "table", "/systemManage/appUserList"));
    menuList.push(addMenu("appUserEdit", "新增", true, "form", "/systemManage/appUserEdit", "", null, false, "用户", "/systemManage/appUserList", null, true));

    menuList.push(addMenu("operationLog", "操作日志", false, "table", "/systemManage/operationLog"));
   
    return addNavMenu("systemManage", "系统管理", false, menuList, true, ["dictionaryConfigList", "appUserList", "operationLog"]);
}

function addNavMenu(key, menuName, isRight, menuList, isVisible, menuKeys) {
    _Menus[key] = {
        key: key,
        menuName,
        menuList,
        isRight,
        isVisible,
        menuKeys,
        id: Common.createGuid()
    }

    return _Menus[key];
}

function addMenu(key, menuName, isRight, iconType, pageName, queryString, children, isVisible, parentMenuName, parentPageName, parentQueryString, isGetMenuName, openKey) {
    _Menus[key] = {
        key,
        menuName,
        iconType,
        pageName,
        queryString,
        children,
        isVisible: isVisible !== false,
        isRight: isRight,
        parentMenuName,
        parentPageName,
        parentQueryString,
        isGetMenuName,
        openKey,
        id: Common.createGuid()
    }

    return _Menus[key];
}