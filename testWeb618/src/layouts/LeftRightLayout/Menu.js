import { Common } from "UtilsCommon";

var Menus = {}
export default () => {
    Menus = {};
    return {
        NavMenuList: [
            GetWeChatManageNavMenu(),
            GetSystemManageNavNenu(),
            GetPersonCenterNavMenu()
        ],
        Menus
    }
};

function GetWeChatManageNavMenu() {
    var menuList = [];
    if (Common.IsAdmin()) {
        menuList.push(AddMenu("ActionTypeList", "行为类型", false, "table", "/WeChatManage/ActionTypeList"));
        menuList.push(AddMenu("ActionTypeEdit", "新增", true, "form", "/WeChatManage/ActionTypeEdit", "", null, false, "行为类型", "/WeChatManage/ActionTypeList", null, true));
    
        menuList.push(AddMenu("ServiceInterfaceList", "服务接口", false, "table", "/WeChatManage/ServiceInterfaceList"));
        menuList.push(AddMenu("ServiceInterfaceEdit", "新增", true, "form", "/WeChatManage/ServiceInterfaceEdit", "", null, false, "服务接口", "/WeChatManage/ServiceInterfaceList", null, true));
    }

    return AddNavMenu("WeChatManage", "微信管理", false, menuList, true, ["AppAccountList"]);
}

function GetPersonCenterNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("ChangePassword", "修改密码", true, "idcard", "/PersonCenter/ChangePassword"));

    return AddNavMenu("PersonCenter", "个人中心", true, menuList, false);
}

function GetSystemManageNavNenu() {
    var menuList = [];
    if (Common.IsAdmin()) {
        menuList.push(AddMenu("AppAccountList", "App账户", false, "table", "/SystemManage/AppAccountList"));
        menuList.push(AddMenu("AppAccountEdit", "新增", true, "form", "/SystemManage/AppAccountEdit", "", null, false, "App账户", "/SystemManage/AppAccountList", null, true));

        menuList.push(AddMenu("DictionaryConfigList", "键值配置", false, "table", "/SystemManage/DictionaryConfigList"));
        menuList.push(AddMenu("DictionaryConfigEdit", "新增", true, "form", "/SystemManage/DictionaryConfigEdit", "", null, false, "键值配置", "/SystemManage/DictionaryConfigEdit", null, true));
    }

    menuList.push(AddMenu("AdminUserList", "用户", false, "table", "/SystemManage/AdminUserList"));
    menuList.push(AddMenu("AdminUserEdit", "新增", true, "form", "/SystemManage/AdminUserEdit", "", null, false, "用户", "/SystemManage/AdminUserList", null, true));

    menuList.push(AddMenu("OperationLog", "操作日志", false, "table", "/SystemManage/OperationLog"));
    menuList.push(AddMenu("RequestServiceLogList", "请求服务日志", false, "table", "/SystemManage/RequestServiceLogList"));
    menuList.push(AddMenu("RequestServiceLogEdit", "新增", true, "form", "/SystemManage/RequestServiceLogEdit", "", null, false, "请求服务日志", "/SystemManage/RequestServiceLogList", null, true));

    return AddNavMenu("SystemManage", "系统管理", false, menuList, true, ["AppAccountList", "DictionaryConfigList", "AdminUserList", "OperationLog", "RequestServiceLogList"]);
}

function AddNavMenu(key, name, isRight, menuList, IsVisible, MenuKeys) {
    Menus[key] = {
        Key: key,
        MenuName: name,
        MenuList: menuList,
        IsRight: isRight,
        IsVisible,
        MenuKeys,
        Id: Common.CreateGuid()
    }

    return Menus[key];
}

function AddMenu(key, name, isRight, type, pageName, queryString, children, isVisible, parentMenuName, parentPageName, parentQueryString, isGetMenuName, openKey) {
    Menus[key] = {
        Key: key,
        MenuName: name,
        IconType: type,
        PageName: pageName,
        QueryString: queryString,
        Children: children,
        IsVisible: isVisible !== false,
        IsRight: isRight,
        ParentMenuName: parentMenuName,
        ParentPageName: parentPageName,
        ParentQueryString: parentQueryString,
        IsGetMenuName: isGetMenuName,
        OpenKey: openKey,
        Id: Common.CreateGuid()
    }

    return Menus[key];
}