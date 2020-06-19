import { Common } from "UtilsCommon";

var _Menus = {}
export default () => {
    _Menus = {};
    return {
        navMenuList: [
            getWeChatManageNavMenu(),
            getSystemManageNavNenu(),
            getPersonCenterNavMenu()
        ],
        _Menus
    }
};

function getWeChatManageNavMenu() {
    var menuList = [];
    if (Common.isAdmin()) {
        menuList.push(addMenu("ActionTypeList", "行为类型", false, "table", "/weChatManage/ActionTypeList"));
        menuList.push(addMenu("ActionTypeEdit", "新增", true, "form", "/weChatManage/ActionTypeEdit", "", null, false, "行为类型", "/weChatManage/ActionTypeList", null, true));
    
        menuList.push(addMenu("ServiceInterfaceList", "服务接口", false, "table", "/weChatManage/ServiceInterfaceList"));
        menuList.push(addMenu("ServiceInterfaceEdit", "新增", true, "form", "/weChatManage/ServiceInterfaceEdit", "", null, false, "服务接口", "/weChatManage/ServiceInterfaceList", null, true));
    }

    return addNavMenu("weChatManage", "微信管理", false, menuList, true, ["AppAccountList"]);
}

function getPersonCenterNavMenu() {
    var menuList = [];
    menuList.push(addMenu("ChangePassword", "修改密码", true, "idcard", "/personCenter/ChangePassword"));

    return addNavMenu("personCenter", "个人中心", true, menuList, false);
}

function getSystemManageNavNenu() {
    var menuList = [];
    if (Common.isAdmin()) {
        menuList.push(addMenu("AppAccountList", "App账户", false, "table", "/systemManage/AppAccountList"));
        menuList.push(addMenu("AppAccountEdit", "新增", true, "form", "/systemManage/AppAccountEdit", "", null, false, "App账户", "/systemManage/AppAccountList", null, true));

        menuList.push(addMenu("DictionaryConfigList", "键值配置", false, "table", "/systemManage/DictionaryConfigList"));
        menuList.push(addMenu("DictionaryConfigEdit", "新增", true, "form", "/systemManage/DictionaryConfigEdit", "", null, false, "键值配置", "/systemManage/DictionaryConfigEdit", null, true));
    }

    menuList.push(addMenu("AdminUserList", "用户", false, "table", "/systemManage/AdminUserList"));
    menuList.push(addMenu("AdminUserEdit", "新增", true, "form", "/systemManage/AdminUserEdit", "", null, false, "用户", "/systemManage/AdminUserList", null, true));

    menuList.push(addMenu("OperationLog", "操作日志", false, "table", "/systemManage/OperationLog"));
    menuList.push(addMenu("RequestServiceLogList", "请求服务日志", false, "table", "/systemManage/RequestServiceLogList"));
    menuList.push(addMenu("RequestServiceLogEdit", "新增", true, "form", "/systemManage/RequestServiceLogEdit", "", null, false, "请求服务日志", "/systemManage/RequestServiceLogList", null, true));

    return addNavMenu("systemManage", "系统管理", false, menuList, true, ["AppAccountList", "DictionaryConfigList", "AdminUserList", "OperationLog", "RequestServiceLogList"]);
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