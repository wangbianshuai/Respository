import { Common } from "UtilsCommon";

var Menus = {}
export default () => {
    Menus = {};
    return {
        NavMenuList: [
            GetStoryTestCasesNavMenu(),
            GetProductManageNavMenu(),
            GetPersonBillNavMenu(),
            GetSystemManageNavNenu(),
            GetPersonCenterNavMenu()
        ],
        Menus
    }
};

function GetPersonCenterNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("ChangePassword", "修改密码", true, "idcard", "/PersonCenter/ChangePassword"));

    return AddNavMenu("PersonCenter", "个人中心", true, menuList, false);
}

function GetStoryTestCasesNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("SaleInput", "销售单录入", false, "form", "/StoryTestCasesManage/SaleInput"));
    menuList.push(AddMenu("SaleList", "销售单列表", false, "table", "/StoryTestCasesManage/SaleList"));
    menuList.push(AddMenu("SaleDetailList", "销售单明细", false, "table", "/StoryTestCasesManage/SaleDetailList"));

    menuList.push(AddMenu("PurchaseInput", "采购单录入", false, "form", "/StoryTestCasesManage/PurchaseInput"));
    menuList.push(AddMenu("PurchaseList", "采购单列表", false, "table", "/StoryTestCasesManage/PurchaseList"));
    menuList.push(AddMenu("PurchaseDetailList", "采购单明细", false, "table", "/StoryTestCasesManage/PurchaseDetailList"));

    menuList.push(AddMenu("BillList", "收支明细", false, "table", "/StoryTestCasesManage/BillList"));
    menuList.push(AddMenu("BillEdit", "新增", true, "form", "/StoryTestCasesManage/BillEdit", "", null, false, "收支明细", "/StoryTestCasesManage/BillList", null, true));

    menuList.push(AddMenu("StoryTestCasesCount", "进销统计", false, "table", "/StoryTestCasesManage/StoryTestCasesCount"));

    menuList.push(AddMenu("ProductStoryTestCasesCount", "商品进销统计", false, "table", "/StoryTestCasesManage/ProductStoryTestCasesCount"));

    menuList.push(AddMenu("ProductStoryTestCasesCount", "商品进销统计", false, "table", "/StoryTestCasesManage/ProductStoryTestCasesCount"));

    menuList.push(AddMenu("BillTypeList", "账目类型", false, "table", "/StoryTestCasesManage/BillTypeList"));
    menuList.push(AddMenu("BillTypeEdit", "新增", true, "form", "/StoryTestCasesManage/BillTypeEdit", "", null, false, "账目类型", "/StoryTestCasesManage/BillTypeList", null, true));

    menuList.push(AddMenu("SupplierList", "供应商", false, "table", "/StoryTestCasesManage/SupplierList"));
    menuList.push(AddMenu("SupplierEdit", "新增", true, "form", "/StoryTestCasesManage/SupplierEdit", "", null, false, "供应商", "/StoryTestCasesManage/SupplierList", null, true));

    return AddNavMenu("StoryTestCasesManage", "进销管理", false, menuList, true, ["SaleInput", "SaleList", "PurchaseInput", "PurchaseList", "BillList", "BillTypeList", "SupplierList", "StoryTestCasesCount", ""]);
}

function GetPersonBillNavMenu() {
    var menuList = [];

    menuList.push(AddMenu("PersonBillList", "个人收支", false, "table", "/PersonBillManage/PersonBillList"));
    menuList.push(AddMenu("PersonBillEdit", "新增", true, "form", "/PersonBillManage/PersonBillEdit", "", null, false, "个人收支", "/PersonBillManage/PersonBillList", null, true));

    menuList.push(AddMenu("PersonBillTypeList", "账目类型", false, "table", "/PersonBillManage/PersonBillTypeList"));
    menuList.push(AddMenu("PersonBillTypeEdit", "新增", true, "form", "/PersonBillManage/PersonBillTypeEdit", "", null, false, "账目类型", "/PersonBillManage/PersonBillTypeList", null, true));

    return AddNavMenu("PersonBillManage", "个人记账", false, menuList, true, ["PersonBillList", "PersonBillTypeList"]);
}

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
    menuList.push(AddMenu("StockCheckEdit", "新增", true, "form", "/ProductManage/StockCheckEdit", "", null, false, "库存盘点", "/ProductManage/StockCheckList", null, true));

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