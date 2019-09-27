import { Common } from "UtilsCommon";

var Menus = {}
export default () => {
    Menus = {};
    return {
        NavMenuList: [
            GetProductManageNavMenu(),
            GetSystemManageNavNenu()
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

function GetProductManageNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("ProductList", "商品列表", false, "table", "/ProductManage/ProductList"));
    menuList.push(AddMenu("ProductEdit", "新增", true, "form", "/ProductManage/ProductEdit", "", null, false, "商品列表", "/ProductManage/ProductList", null, true));

    menuList.push(AddMenu("StockCheckList", "库存盘点", false, "table", "/ProductManage/StockCheckList"));
    menuList.push(AddMenu("StockCheckEdit", "新增", true, "form", "/ProductManage/StockCheckEdit", "", null, false, "商品列表", "/ProductManage/StockCheckList", null, true));

    menuList.push(AddMenu("ProductTypeList", "商品类型", false, "table", "/ProductManage/ProductTypeList"));
    menuList.push(AddMenu("ProductTypeEdit", "新增", true, "form", "/ProductManage/ProductTypeEdit", "", null, false, "商品类型", "/ProductManage/ProductTypeList", null, true));

    menuList.push(AddMenu("ProductBrandList", "商品品牌", false, "table", "/ProductManage/ProductBrandList"));
    menuList.push(AddMenu("ProductBrandEdit", "新增", true, "form", "/ProductManage/ProductBrandEdit", "", null, false, "商品品牌", "/ProductManage/ProductBrandList", null, true));

    return AddNavMenu("ProductManage", "商品管理", false, menuList, true, ["ProductList", "StockCheckList", "ProductTypeList", "ProductBrandList"]);
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