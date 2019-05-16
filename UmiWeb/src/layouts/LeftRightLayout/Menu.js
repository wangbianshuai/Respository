import { Common } from "UtilsCommon";

export default [
    GetOrderNavMenu(),
    GetCreditNavMenu(),
    GetAuditingNavMenu(),
    GetCustomerNavNenu(),
    GetCommonConfigNavMenu(),
    GetRightManageNavMenu(),
    GetPersonCenterNavMenu()
];

function GetPersonCenterNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("基本信息", "table", "/PersonCenter/BaseInfo"));

    return AddNavMenu("个人中心", menuList);
}

function GetRightManageNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("用户管理", "table", "/RightManage/UserManage"));
    menuList.push(AddMenu("角色管理", "table", "/RightManage/RoleManage"));

    return AddNavMenu("权限管理", menuList);
}

function GetCommonConfigNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("产品配置", "table", "/CommonConfig/ProductConfig"));
    menuList.push(AddMenu("新增", "table", "/CommonConfig/ProductEdit", "", null, false, "产品配置", "/CommonConfig/ProductConfig", null, true));
    menuList.push(AddMenu("产品利率配置", "table", "/CommonConfig/ProductRateConfig"));
    menuList.push(AddMenu("新增", "table", "/CommonConfig/ProductRateEdit", "", null, false, "产品利率配置", "/CommonConfig/ProductRateConfig", null, true));
      menuList.push(AddMenu("还款方式配置", "table", "/CommonConfig/BackMethodConfig"));
    menuList.push(AddMenu("平台费率配置", "table", "/CommonConfig/PlatformRateConfig"));

    return AddNavMenu("公共配置", menuList);
}

function GetCustomerNavNenu() {
    var menuList = [];
    menuList.push(AddMenu("客户查询", "table", "/Customer/QueryCustomer"));
    menuList.push(AddMenu("黑名单管理", "table", "/Customer/BlacklistManage"));
    menuList.push(AddMenu("新增", "table", "/Customer/BlacklistEdit", "", null, false, "黑名单管理", "/Customer/BlacklistManage", null, true));

    return AddNavMenu("客户管理", menuList);
}

function GetAuditingNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("反欺诈审核", "table", "/Auditing/AntiFraudAuditing", "?OrderCode=#{OrderCode}"));

    var children = [AddMenu("初审审核", "form", "/Auditing/FirstTrialAuditing", "?OrderCode=#{OrderCode}"),
    AddMenu("初审电核", "form", "/Auditing/FirstTrialPhoneAuditing", "?OrderCode=#{OrderCode}")]
    menuList.push(AddMenu("初审", "appstore", "", "", children));

    children = [AddMenu("实地审核", "form", "/Auditing/IndeedAuditing", "?OrderCode=#{OrderCode}")]
    menuList.push(AddMenu("实地", "appstore", "", "", children));

    children = [AddMenu("终审审核", "form", "/Auditing/FinalAuditing", "?OrderCode=#{OrderCode}"),
    AddMenu("终审复核", "form", "/Auditing/FinalReviewAuditing", "?OrderCode=#{OrderCode}"),
    AddMenu("贷审会", "form", "/Auditing/LoanReviewCommittee", "?OrderCode=#{OrderCode}"),
    AddMenu("等待签约条件审核", "form", "/Auditing/WaitConditionAuditing", "?OrderCode=#{OrderCode}")]
    menuList.push(AddMenu("终审", "appstore", "", "", children));

    return AddNavMenu("审核管理", menuList);
}

function GetOrderNavMenu() {
    var children = [AddMenu("待处理", "table", "/Orders/WaitingOrderList"),
    AddMenu("已处理", "table", "/Orders/HandledOrderList"),
    AddMenu("已挂起", "table", "/Orders/SuspendedOrderList")]

    var menuList = [];
    menuList.push(AddMenu("工单池", "table", "/Orders/OrderList"));
    menuList.push(AddMenu("我的工单", "appstore", "", "", children));
    menuList.push(AddMenu("工单查询", "table", "/Orders/QueryOrderList"));
    menuList.push(AddMenu("流转日志", "table", "/Orders/StatusNodeLogs", "", null, false, "工单查询", "/Orders/QueryOrderList"));

    return AddNavMenu("工单", menuList)
}

function GetCreditNavMenu() {
    var menuList = [];
    var children = [AddMenu("进件详情", "form", "/CreditManage/OrderDetail", "?OrderCode=#{OrderCode}")]
    menuList.push(AddMenu("进件", "appstore", "", "", children));

    children = [AddMenu("补件操作", "form", "/CreditManage/OrderPatchEdit", "?OrderCode=#{OrderCode}"),
    AddMenu("补件记录", "form", "/CreditManage/OrderPatchRecord", "?OrderCode=#{OrderCode}")]
    menuList.push(AddMenu("补件", "appstore", "", "", children));

    menuList.push(AddMenu("审批结论确认", "form", "/CreditManage/ApproveResultConfirm", "?OrderCode=#{OrderCode}"));

    return AddNavMenu("信贷管理", menuList);
}

function AddNavMenu(name, menuList) {
    return {
        MenuName: name,
        MenuList: menuList,
        Id: Common.CreateGuid()
    }
}

function AddMenu(name, type, pageName, queryString, children, isVisible, parentMenuName, parentPageName, parentQueryString, isGetMenuName) {
    return {
        MenuName: name,
        IconType: type,
        PageName: pageName,
        QueryString: queryString,
        Children: children,
        IsVisible: isVisible !== false,
        ParentMenuName: parentMenuName,
        ParentPageName: parentPageName,
        ParentQueryString: parentQueryString,
        IsGetMenuName: isGetMenuName,
        Id: Common.CreateGuid()
    }
}

