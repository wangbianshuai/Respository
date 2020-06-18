import { Common } from "UtilsCommon";

var Menus = {}
export default () => {
    Menus = {};
    return {
        NavMenuList: [
            getWeChatManageNavMenu(),
            getSystemManageNavNenu(),
            getPersonCenterNavMenu()
        ],
        Menus
    }
};

function getWeChatManageNavMenu() {
    var menuList = [];
    if (Common.isAdmin()) {
        menuList.push(AddMenu("ActionTypeList", "行为类型", false, "table", "/weChatManage/ActionTypeList"));
        menuList.push(AddMenu("ActionTypeEdit", "新增", true, "form", "/weChatManage/ActionTypeEdit", "", null, false, "行为类型", "/weChatManage/ActionTypeList", null, true));
    
        menuList.push(AddMenu("ServiceInterfaceList", "服务接口", false, "table", "/weChatManage/ServiceInterfaceList"));
        menuList.push(AddMenu("ServiceInterfaceEdit", "新增", true, "form", "/weChatManage/ServiceInterfaceEdit", "", null, false, "服务接口", "/weChatManage/ServiceInterfaceList", null, true));
    }

    return AddNavMenu("weChatManage", "微信管理", false, menuList, true, ["AppAccountList"]);
}

function getPersonCenterNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("ChangePassword", "修改密码", true, "idcard", "/personCenter/ChangePassword"));

    return AddNavMenu("personCenter", "个人中心", true, menuList, false);
}

function getSystemManageNavNenu() {
    var menuList = [];
    if (Common.isAdmin()) {
        menuList.push(AddMenu("AppAccountList", "App账户", false, "table", "/systemManage/AppAccountList"));
        menuList.push(AddMenu("AppAccountEdit", "新增", true, "form", "/systemManage/AppAccountEdit", "", null, false, "App账户", "/systemManage/AppAccountList", null, true));

        menuList.push(AddMenu("DictionaryConfigList", "键值配置", false, "table", "/systemManage/DictionaryConfigList"));
        menuList.push(AddMenu("DictionaryConfigEdit", "新增", true, "form", "/systemManage/DictionaryConfigEdit", "", null, false, "键值配置", "/systemManage/DictionaryConfigEdit", null, true));
    }

    menuList.push(AddMenu("AdminUserList", "用户", false, "table", "/systemManage/AdminUserList"));
    menuList.push(AddMenu("AdminUserEdit", "新增", true, "form", "/systemManage/AdminUserEdit", "", null, false, "用户", "/systemManage/AdminUserList", null, true));

    menuList.push(AddMenu("OperationLog", "操作日志", false, "table", "/systemManage/OperationLog"));
    menuList.push(AddMenu("RequestServiceLogList", "请求服务日志", false, "table", "/systemManage/RequestServiceLogList"));
    menuList.push(AddMenu("RequestServiceLogEdit", "新增", true, "form", "/systemManage/RequestServiceLogEdit", "", null, false, "请求服务日志", "/systemManage/RequestServiceLogList", null, true));

    return AddNavMenu("systemManage", "系统管理", false, menuList, true, ["AppAccountList", "DictionaryConfigList", "AdminUserList", "OperationLog", "RequestServiceLogList"]);
}

function AddNavMenu(key, name, isRight, menuList, isVisible, MenuKeys) {
    Menus[key] = {
        Key: key,
        MenuName: name,
        MenuList: menuList,
        isRight: isRight,
        isVisible,
        MenuKeys,
        id: Common.createGuid()
    }

    return Menus[key];
}

function AddMenu(key, name, isRight, type, pageName, queryString, children, isVisible, parentMenuName, parentPageName, parentQueryString, isgetMenuName, openKey) {
    Menus[key] = {
        Key: key,
        MenuName: name,
        IconType: type,
        PageName: pageName,
        QueryString: queryString,
        Children: children,
        isVisible: isVisible !== false,
        isRight: isRight,
        ParentMenuName: parentMenuName,
        ParentPageName: parentPageName,
        ParentQueryString: parentQueryString,
        isgetMenuName: isgetMenuName,
        OpenKey: openKey,
        id: Common.createGuid()
    }

    return Menus[key];
}