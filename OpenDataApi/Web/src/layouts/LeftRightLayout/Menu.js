import { Common } from "UtilsCommon";

var Menus = {}
export default () => {
    Menus = {};
    return {
        NavMenuList: [
            GetOrderNavMenu(),
            GetCreditNavMenu(),
            GetAuditingNavMenu(),
            GetCustomerNavNenu(),
            GetCommonConfigNavMenu(),
            GetRightManageNavMenu(),
            GetPersonCenterNavMenu()
        ],
        Menus
    }
};

function GetPersonCenterNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("PersonBaseInfo", "基本信息", true, "idcard", "/PersonCenter/BaseInfo"));

    return AddNavMenu("PersonCenter", "个人中心", true, menuList, false);
}

function GetRightManageNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("UserManage", "用户管理", false, "team", "/RightManage/UserManage"));
    menuList.push(AddMenu("CreateUser", "开户", true, "team", "/RightManage/UserEdit", "", null, false, "用户管理", "/RightManage/UserManage", null, true));
    menuList.push(AddMenu("RoleConfig", "角色配置", true, "team", "/RightManage/RoleConfig", "", null, false, "用户管理", "/RightManage/UserManage", null, true));
    menuList.push(AddMenu("RoleManage", "角色管理", false, "safety", "/RightManage/RoleManage"));
    menuList.push(AddMenu("CreateRole", "新增", true, "safety", "/RightManage/RoleEdit", "", null, false, "角色管理", "/RightManage/RoleManage", null, true));
    menuList.push(AddMenu("RightConfig", "权限配置", true, "safety", "/RightManage/RightConfig", "", null, false, "角色管理", "/RightManage/RoleManage", null, true));

    return AddNavMenu("RightManage", "权限管理", false, menuList, true, ["UserManage", "RoleManage"]);
}

function GetCommonConfigNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("ProductConfig", "产品配置", false, "project", "/CommonConfig/ProductConfig"));
    menuList.push(AddMenu("CreateProduct", "新增", true, "project", "/CommonConfig/ProductEdit", "", null, false, "产品配置", "/CommonConfig/ProductConfig", null, true));
    menuList.push(AddMenu("ProductRateConfig", "产品利率配置", false, "credit-card", "/CommonConfig/ProductRateConfig"));
    menuList.push(AddMenu("CreateProductRate", "新增", true, "credit-card", "/CommonConfig/ProductRateEdit", "", null, false, "产品利率配置", "/CommonConfig/ProductRateConfig", null, true));
    menuList.push(AddMenu("BackMethodConfig", "还款方式配置", false, "credit-card", "/CommonConfig/BackMethodConfig"));
    menuList.push(AddMenu("CreateBackMethod", "新增", true, "credit-card", "/CommonConfig/BackMethodEdit", "", null, false, "还款方式配置", "/CommonConfig/BackMethodConfig", null, true));
    menuList.push(AddMenu("PlatformRateConfig", "平台费率配置", false, "file-done", "/CommonConfig/PlatformRateConfig"));
    menuList.push(AddMenu("CreatePlatformManageRate", "新增管理费率", true, "file-done", "/CommonConfig/PlatformManageRateEdit", "", null, false, "平台费率配置", "/CommonConfig/PlatformRateConfig", null, true));
    menuList.push(AddMenu("CreatePlatformServiceRate", "新增服务费率", true, "file-done", "/CommonConfig/PlatformServiceRateEdit", "", null, false, "平台费率配置", "/CommonConfig/PlatformRateConfig", null, true));
    menuList.push(AddMenu("CreatePlatformFineRate", "新增罚息费率", true, "file-done", "/CommonConfig/PlatformFineRateEdit", "", null, false, "平台费率配置", "/CommonConfig/PlatformRateConfig", null, true));

    return AddNavMenu("CommonConfig", "公共配置", false, menuList, true, ["ProductConfig", "ProductRateConfig", "BackMethodConfig", "PlatformRateConfig"]);
}

function GetCustomerNavNenu() {
    var menuList = [];
    menuList.push(AddMenu("QueryCustomer", "客户查询", false, "idcard", "/Customer/QueryCustomer"));
    menuList.push(AddMenu("WebQueryReview", "网查复核", false, "carry-out", "/Customer/WebQueryReview"));
    menuList.push(AddMenu("BlacklistManage", "黑名单管理", false, "contacts", "/Customer/BlacklistManage"));
    menuList.push(AddMenu("CreateBlacklist", "新增", true, "contacts", "/Customer/BlacklistEdit", "", null, false, "黑名单管理", "/Customer/BlacklistManage", null, true));

    return AddNavMenu("CustomerManage", "客户管理", false, menuList, true, ["QueryCustomer", "WebQueryReview", "BlacklistManage"]);
}

function GetAuditingNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("AntiFraudAuditing", "反欺诈审核", false, "monitor", "/Auditing/AntiFraudAuditing", "?OrderCode=#{OrderCode}"));

    var children = [AddMenu("FirstTrialAuditing", "初审审核", false, "audit", "/Auditing/FirstTrialAuditing", "?OrderCode=#{OrderCode}"),
    AddMenu("FirstTrialPhoneAuditing", "初审电核", false, "phone", "/Auditing/FirstTrialPhoneAuditing", "?OrderCode=#{OrderCode}")]
    menuList.push(AddMenu("FirstTrial", "初审", false, "menu", "", "", children));

    children = [AddMenu("IndeedAuditing", "实地审核", false, "file-done", "/Auditing/IndeedAuditing", "?OrderCode=#{OrderCode}")]
    menuList.push(AddMenu("Indeed", "实地", false, "menu", "", "", children));

    children = [AddMenu("FinalAuditing", "终审审核", false, "file-search", "/Auditing/FinalAuditing", "?OrderCode=#{OrderCode}"),
    AddMenu("FinalReviewAuditing", "终审复核", false, "file-search", "/Auditing/FinalReviewAuditing", "?OrderCode=#{OrderCode}"),
    AddMenu("LoanReviewCommittee", "贷审会", false, "solution", "/Auditing/LoanReviewCommittee", "?OrderCode=#{OrderCode}"),
    AddMenu("WaitConditionAuditing", "等待签约条件审核", false, "file-done", "/Auditing/WaitConditionAuditing", "?OrderCode=#{OrderCode}")]
    menuList.push(AddMenu("FinalApproval", "终审", false, "menu", "", "", children));

    return AddNavMenu("ApprovalManage", "审核管理", false, menuList, true, ["AntiFraudAuditing", "FirstTrialAuditing", "FirstTrialPhoneAuditing", "IndeedAuditing",
        "FinalAuditing", "FinalReviewAuditing", "LoanReviewCommittee", "WaitConditionAuditing"]);
}

function GetOrderNavMenu() {
    var children = [AddMenu("OrderDetailList", "待进件", false, "credit-card", "/Orders/OrderDetailList"),
    AddMenu("WaitingOrderList", "待处理", false, "mail", "/Orders/WaitingOrderList"),
    AddMenu("HandledOrderList", "已处理", false, "lock", "/Orders/HandledOrderList"),
    AddMenu("SuspendedOrderList", "已挂起", false, "experiment", "/Orders/SuspendedOrderList")]

    var menuList = [];
    menuList.push(AddMenu("OrderList", "工单池", false, "database", "/Orders/OrderList"));
    menuList.push(AddMenu("MyOrders", "我的工单", false, "menu", "", "", children));
    menuList.push(AddMenu("QueryOrderList", "工单查询", false, "search", "/Orders/QueryOrderList"));
    menuList.push(AddMenu("MyStatusNodeLogs", "流转日志", true, "lock", "/Orders/MyStatusNodeLogs", "", null, false, "已处理", "/Orders/HandledOrderList", "", false, "我的工单"));
    menuList.push(AddMenu("StatusNodeLogs", "流转日志", true, "search", "/Orders/StatusNodeLogs", "", null, false, "工单查询", "/Orders/QueryOrderList"));
    menuList.push(AddMenu("QueryBidOrderList", "发标查询", false, "security-scan", "/Orders/QueryBidOrderList"));

    return AddNavMenu("Orders", "工单", false, menuList, true, ["OrderList", "OrderDetailList", "WaitingOrderList", "HandledOrderList", "SuspendedOrderList",
        "QueryOrderList", "QueryBidOrderList"])
}

function GetCreditNavMenu() {
    var menuList = [];
    var children = [AddMenu("OrderDetail", "进件详情", false, "folder-open", "/CreditManage/OrderDetail", "?OrderCode=#{OrderCode}")]
    menuList.push(AddMenu("OrderWork", "进件", false, "menu", "", "", children));

    children = [AddMenu("OrderPatchEdit", "补件操作", false, "import", "/CreditManage/OrderPatchEdit", "?OrderCode=#{OrderCode}"),
    AddMenu("OrderPatchRecord", "补件记录", false, "file-done", "/CreditManage/OrderPatchRecord", "?OrderCode=#{OrderCode}")]
    menuList.push(AddMenu("Patch", "补件", false, "menu", "", "", children));

    menuList.push(AddMenu("ApproveResultConfirm", "审批结论确认", false, "file-protect", "/CreditManage/ApproveResultConfirm", "?OrderCode=#{OrderCode}"));

    return AddNavMenu("OrderWorkManage", "进件管理", false, menuList, true, ["OrderDetail", "OrderPatchEdit", "OrderPatchRecord", "ApproveResultConfirm"]);
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