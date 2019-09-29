import * as Common from "./Common";

export default {
    'POST /RiskControlApproval/user/getdatalist': GetDataList,
    'POST /RiskControlApproval/user/insert': Insert,
    'POST /RiskControlApproval/user/update': Update,
    'POST /RiskControlApproval/user/delete': Delete,
    'POST /RiskControlApproval/user/getdata': GetData,
    'POST /RiskControlApproval/getuserlist': GetUserList(),
    "POST /RiskControlApproval/api/login": Login(),
    "POST /RiskControlApproval/api/GetEmployeeInfo": GetEmployeeInfo(),
    "POST /RiskControlApproval/api/GetUserMenuRight": GetUserMenuRight(),
    "POST /RiskControlApproval/api/logout": Logout()
}

function Logout() {
    return {
        code: "200000",
        data: {}
    }
}

function GetUserMenuRight() {
    return {
        code: "200000",
        data: [{ Key: "Orders" },
        { Key: "OrderList", RightPropertyNames: ["DispatchOrder", "GrabOrder"] },
        { Key: "OrderWorkManage" },
        { Key: "ApprovalManage" },
        { Key: "OrderWork" },
        { Key: "MyOrders" },
        { Key: "OrderDetailList", RightPropertyNames: ["LookOrderDetail"] },
        { Key: "WaitingOrderList", RightPropertyNames: ["HandlerOrder", "HandUpOrder"] },
        { Key: "HandledOrderList", RightPropertyNames: ["LookStatusRecord"] },
        { Key: "SuspendedOrderList", RightPropertyNames: ["UnHandUpOrder"] },
        { Key: "QueryOrderList", RightPropertyNames: ["LookStatusRecord", "EditOrder", "ChangeUser", "CancelOrder", "LookApproveInfo"] },
        { Key: "QueryBidOrderList", RightPropertyNames: ["Bidding", "LookFailReason"] },
        { Key: "RightManage" },
        { Key: "UserManage", RightPropertyNames: ["ToEditPage", "ToRoleConfig"] },
        { Key: "RoleManage", RightPropertyNames: ["ToEditPage", "ToConfigPage", "EditRole", "DeleteRole"] },

        { Key: "ProductConfig", RightPropertyNames: ["ToEditPage", "EditProduct"] },
        { Key: "ProductRateConfig", RightPropertyNames: ["ToEditPage", "DeleteProductRate"] },
        { Key: "BackMethodConfig", RightPropertyNames: ["ToEditPage", "DeleteBackMethod"] },
        { Key: "PlatformRateConfig", RightPropertyNames: ["ToEditPage", "DeletePlatformRate"] },
        { Key: "CommonConfig" },

        { Key: "QueryCustomer", RightPropertyNames: ["LookApproveInfo"] },
        { Key: "WebQueryReview", RightPropertyNames: ["Review"] },
        { Key: "BlacklistManage", RightPropertyNames: ["ToEditPage", "EditBlacklist", "DeleteBlacklist"] },
        { Key: "CustomerManage" },

        { Key: "AntiFraudAuditing" },
        { Key: "FirstTrialAuditing" },
        { Key: "FirstTrialPhoneAuditing" },
        { Key: "FirstTrial" },
        { Key: "IndeedAuditing" },
        { Key: "Indeed" },
        { Key: "FinalAuditing" },
        { Key: "FinalReviewAuditing" },
        { Key: "LoanReviewCommittee" },

        { Key: "WaitConditionAuditing" },
        { Key: "FinalApproval" },

        { Key: "OrderDetail", RightPropertyNames: ["OrderInfoRightButtonView", "PersonBaseInfoRightButtonView", "PersonCardInfoRightButtonView", "PersonPropertyInfoRightButtonView", "CompanyBaseInfoRightButtonView", "ContactInfoRightButtonView", "SubmitRightButtonView"] },
        { Key: "OrderPatchEdit", RightPropertyNames: ["PatchInfoRightButtonView"] },
        { Key: "Patch" },
        { Key: "OrderPatchRecord" },
        { Key: "ApproveResultConfirm", RightPropertyNames: ["SaveApprovalOpinion"] }
        ]
    }
}

function GetEmployeeInfo() {
    return {
        code: "200000",
        data: {
            LoginName: "admin",
            UserName: "admin",
            Phone: "13512345678",
            Email: "1234355@qq.com",
            DepartName: "风险运营中心/贷前管理/产品组",
            JobName: "产品主管",
            UserCode: "140500012"
        }
    }
}

function Login() {
    return {
        code: "200000",
        data: "token"
    }
}

var _DataList = [];

function GetDataList(req, res) {
    res.send({
        code: "200000",
        data: _DataList
    })
}

function Insert(req, res) {
    const data = req.body;
    data.UserId = Common.CreateGuid();
    data.UpdateDate = Common.GetCurrentDate();
    _DataList.push(data)

    res.send({
        code: "200000",
        data: { UserId: data.UserId }
    })
}

function Delete(req, res) {
    _DataList = _DataList.filter(f => f.UserId !== req.body.UserId);

    res.send({
        code: "200000",
        data: {}
    })
}

function Update(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.UserId === req.body.UserId);
    if (data !== null) {
        for (var key in req.body) data[key] = req.body[key];
        data.UpdateDate = Common.GetCurrentDate();
    }

    res.send({
        code: "200000",
        data: { UserId: data.UserId }
    })
}

function GetData(req, res) {
    var data = Common.ArrayFirst(_DataList, (f) => f.UserId === req.body.UserId);

    res.send({
        code: "200000",
        data: data
    })
}

function GetUserList() {
    return {
        code: "200000",
        data: [{ UserId: 1, UserName: "张三", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" },
        { UserId: 2, UserName: "李四", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" },
        { UserId: 3, UserName: "王五", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" },
        { UserId: 4, UserName: "马六", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" },
        { UserId: 5, UserName: "赵七", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" }]
    }
}