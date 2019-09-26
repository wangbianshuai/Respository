import { Common } from "UtilsCommon";

var Menus = {}
export default () => {
    Menus = {};
    return {
        NavMenuList: [
            GetSystemManageNavNenu(),
        ],
        Menus
    }
};

function GetSystemManageNavNenu() {
    var menuList = [];
    menuList.push(AddMenu("UserList", "用户", false, "table", "/SystemManage/UserList"));
    menuList.push(AddMenu("UserEdit", "新增", true, "form", "/SystemManage/UserEdit", "", null, false, "用户", "/SystemManage/UserList", null, true));

    menuList.push(AddMenu("Dictionary2List", "键值配置", false, "table", "/SystemManage/Dictionary2List"));
    menuList.push(AddMenu("Dictionary2Edit", "新增", true, "form", "/SystemManage/Dictionary2Edit", "", null, false, "键值配置", "/SystemManage/Dictionary2List", null, true));

    menuList.push(AddMenu("OperationLog", "操作日志", false, "table", "/SystemManage/OperationLog"));

    return AddNavMenu("SystemManage", "系统管理", false, menuList, true, ["UserList", "Dictionary2List", "OperationLog"]);
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