import * as Common from "./Common";

const _OrderInfo = {};
const _OrderDetail = {};

export default {
    'POST /api/workOrder/pool/queryWorkOrder': QueryWorkOrder(),
    "POST /api/workOrder/myWorkOrder/queryWaitProcessWorkOrder": queryWaitProcessWorkOrder(),
    'POST /api/getorderlist': GetOrderList(),
    'POST /api/getorderstatuslogs': GetOrderStatusLogs(),
    "POST /api/workOrder/pool/GetRoleUser": GeRoleUser(),
    "POST /api/getorderinfo": GetOrderInfo(),
    'POST /api/saveorderinfo': SaveOrderInfo,
    'POST /api/getorderdetail': GetOrderDetail(),
    'POST /api/saveorderdetail': SaveOrderDetail,
    "POST /api/SubmitOrderInfo": SubmitOrderInfo(),
    "POST /api/SaveApprovalOrderDetail": SaveApprovalOrderDetail(),
    "POST /RiskControlApproval/GetCityList": GetCityList(),
    "POST /api/GetOrderStatus": GetOrderStatus(),
    "POST /api/GetPatchExitOrderInfo": GetPatchExitOrderInfo(),
    "POST /api/GetExitOrderInfo": GetExitOrderInfo(),
    "POST /api/GetCautionerInfo": GetCautionerInfo(),
    "POST /api/GetCoBorrowerInfo": GetCoBorrowerInfo()
}

function queryWaitProcessWorkOrder() {
    return {
        "respCode": 0,
        "respMsg": "string",
        "data": {
            "pageResponse": {
                "total": 1,
                "curPageNum": 0,
                "curPageSize": 0
            },
            "workOrderList": [{
                "loanApplyId": "100001",
                "taskList": [
                    {
                        "taskId": "10000001",
                        "taskDefKey": "string",
                        "taskDefName": "string",
                        "taskAssigneeId": "string",
                        "taskAssigneeName": "string"
                    }
                ],
                "lenderName": "string",
                "companyName": "string",
                "loanSellerDepartment": "string",
                "loanSellerId": "string",
                "loanSellerName": "string",
                "productCategory": "string",
                "productShortName": "string",
                "loanApplyTime": "2019-06-12T01:02:56.528Z",
                "updateTime": "2019-06-12T01:02:56.528Z",
                "workOrderState": "string"
            }]
        }
    }
}

function QueryWorkOrder() {
    return {
        "respCode": 0,
        "respMsg": "string",
        "data": {
            "pageResponse": {
                "total": 0,
                "curPageNum": 0,
                "curPageSize": 0
            },
            "workOrderList": [
                {
                    "loanApplyId": "100001",
                    "taskList": [
                        {
                            "taskId": "10000001",
                            "taskDefKey": "string",
                            "taskDefName": "string",
                            "taskAssigneeId": "string",
                            "taskAssigneeName": "string"
                        }
                    ],
                    "lenderName": "string",
                    "companyName": "string",
                    "loanSellerDepartment": "string",
                    "loanSellerId": "string",
                    "loanSellerName": "string",
                    "productCategory": "string",
                    "productShortName": "string",
                    "loanApplyTime": "2019-06-12T01:02:56.528Z",
                    "updateTime": "2019-06-12T01:02:56.528Z",
                    "workOrderState": "string"
                }
            ]
        }
    }
}

function GetCautionerInfo() {
    return {
        code: "200000",
        data: {

        }
    }
}

function GetCoBorrowerInfo() {
    return {
        code: "200000",
        data: {

        }
    }
}

function GetExitOrderInfo() {
    return {
        code: "200000",
        data: {
            RefundOrder: GetRefundOrderList()
        }
    }
}


function GetPatchExitOrderInfo() {
    return {
        code: "200000",
        data: {
            PatchRecord: GetPatchRecordList(),
            RefundOrder: GetRefundOrderList()
        }
    }
}

function GetRefundOrderList() {
    return [{
        CreateDate: "2019-03-09 11:20",
        CreateUser: "张三",
        ApprovalOpinion: "退单",
        RefundOrderCode: "343435-002",
        ApprovalRemark: "当前工单初审存在遗漏，如企业财务信息、征信信息未审核，请重新审核！",
    }]
}

function GetPatchRecordList() {
    return [{
        CreateDate: "2019-03-09 11:20",
        CreateUser: "张三",
        ApprovalOpinion: "返回补件",
        PatchCode: "1020320101-002",
        ApprovalRemark: "当前工单缺少借款人房屋租赁合同、借款人银行流水、个人征信信息。请补件！",
        PatchRemark: "重要提醒：剩余可操作时间还有12天3小时28分，到期后补件超时则视为补件失败而被拒单",
        ReceiveUser: "李四",
        SubmitDate: "2019-03-09 11:21"
    },
    {
        CreateDate: "2019-03-09 11:20",
        CreateUser: "王五",
        ApprovalOpinion: "返回补件",
        PatchCode: "1020320101-002",
        ApprovalRemark: "当前工单缺少借款人房屋租赁合同、借款人银行流水、个人征信信息。请补件！",
        PatchRemark: "重要提醒：剩余可操作时间还有12天3小时28分，到期后补件超时则视为补件失败而被拒单",
        ReceiveUser: "马六",
        SubmitDate: "2019-03-09 11:21"
    }]

}

function GetOrderStatus() {
    return {
        code: "200000",
        data: { OrderStatus: "信贷员确认中" }
    }
}


function SaveApprovalOrderDetail() {
    return {
        code: "200000",
        data: {}
    }
}

function SubmitOrderInfo() {
    return {
        code: "200000",
        data: {}
    }
}

function SaveOrderDetail(req, res) {
    for (var key in req.body) _OrderDetail[key] = req.body[key];
    _OrderDetail.updateTime = Common.GetCurrentDate();

    res.send({
        code: "200000",
        data: {}
    })
}


function SaveOrderInfo(req, res) {
    for (var key in req.body) _OrderInfo[key] = req.body[key];
    _OrderInfo.updateTime = Common.GetCurrentDate();

    res.send({
        code: "200000",
        data: {}
    })
}


function GeRoleUser() {
    return {
        code: "200000",
        data: [{ UserId: 1, UserName: "张三", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" },
        { UserId: 2, UserName: "李四", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" },
        { UserId: 3, UserName: "王五", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" },
        { UserId: 4, UserName: "马六", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" },
        { UserId: 5, UserName: "赵七", Email: "233434@xxd.com", Phone: "15656565343", DepartName: "风险经营中心/贷前管理/产品组", JobName: "产品主管" }]
    }
}

function GetOrderList() {
    return {
        respCode: 0,
        respMsg: "",
        data: [{ loanApplyId: "00001", FailReason: "失败原因1", mainLender: "测试公司1", lenderName: "张三", productType: "新商贷", loanSellerId: "李四", loanApplyTime: "2019-05-10", updateTime: "2019-05-10", workOrderState: "待初审" },
        { loanApplyId: "00002", FailReason: "失败原因2", mainLender: "测试公司2", lenderName: "张三", productType: "新商贷", loanSellerId: "李四", loanApplyTime: "2019-05-10", updateTime: "2019-05-10", workOrderState: "待初审" },
        { loanApplyId: "00003", FailReason: "失败原因3", mainLender: "测试公司3", lenderName: "张三", productType: "新商贷", loanSellerId: "李四", loanApplyTime: "2019-05-10", updateTime: "2019-05-10", workOrderState: "待初审" }]
    }
}

function GetOrderStatusLogs() {
    return {
        code: "200000",
        data: [{ LogId: 1, StepNo: 5, NodeName: "待初审3", LastNodeName: "待初审1" },
        { LogId: 2, StepNo: 4, NodeName: "待初审2", LastNodeName: "待初审2" },
        { LogId: 3, StepNo: 3, NodeName: "待初审1", LastNodeName: "待初审3" }]
    }
}

function GetOrderInfo() {
    _OrderInfo.loanApplyId = "100001";
    _OrderInfo.mainLender = "宿迁XX机械制造工程有限公司";
    _OrderInfo.lenderName = "张三";
    _OrderInfo.productType = "新商贷 / ME";
    _OrderInfo.loanSellerId = "李四";
    _OrderInfo.loanApplyTime = "2019-05-27";
    _OrderInfo.updateTime = "2019-05-27 14:30:23";
    _OrderInfo.workOrderState = "待初审";
    _OrderInfo.UserType = "个人";
    _OrderInfo.BorrowerAmount = "10000.00";
    _OrderInfo.BorrowerPeriod = "12";
    _OrderInfo.BackMethod = "1";
    _OrderInfo.BorrowerUse = "1";
    _OrderInfo.BorrowChannel = "自然流量";
    _OrderInfo.OrderArea = "江苏省 / 苏州市";

    return {
        respCode: 0,
        respMsg: "",
        data: _OrderInfo
    }
}

function GetBaseInfo() {
    _OrderInfo.loanApplyId = "100001";
    _OrderInfo.mainLender = "宿迁XX机械制造工程有限公司";
    _OrderInfo.lenderName = "张三";
    _OrderInfo.productType = "新商贷 / ME";
    _OrderInfo.loanSellerId = "李四";
    _OrderInfo.loanApplyTime = "2019-05-27";
    _OrderInfo.updateTime = "2019-05-27 14:30:23";
    _OrderInfo.workOrderState = "待初审";
    _OrderInfo.UserType = "个人";
    _OrderInfo.BorrowerAmount = "10000.00";
    _OrderInfo.BorrowerPeriod = "12";
    _OrderInfo.BackMethod = "1";
    _OrderInfo.BorrowerUse = "1";
    _OrderInfo.BorrowChannel = "自然流量";
    _OrderInfo.OrderArea = "江苏省 / 苏州市";

    return _OrderInfo;
}

function GetOrderDetail() {
    _OrderDetail.PersonCardInfo = GetPersonCardInfo();
    _OrderDetail.PersonBaseInfo = GetPersonBaseInfo();
    _OrderDetail.CompanyBaseInfo = GetCompanyBaseInfo();
    _OrderDetail.CarList = [];
    _OrderDetail.HouseList = [];
    _OrderDetail.OrderInfo = GetBaseInfo()

    return {
        respCode: 0,
        respMsg: "",
        data: _OrderDetail
    }
}

function GetPersonBaseInfo() {
    return {
        Phone: "156676786543",
        Email: "23244242@qq.com",
        Educational: "1",
        MaritalStatus: "1",
        MaritalYears: "2",
        NowAddress: "上海市静安区永和路318弄",
        HouseStatus: "1",
        HousePeriodStart: "2010-10-10",
        HousePeriodEnd: "2020-10-10",
        ElectricityCode: "2324313434343434"
    }
}

function GetPersonCardInfo() {
    return {
        UserName: "张三",
        IdNumber: "234343199110101010",
        Sex: "男",
        Nation: "汉",
        Birthday: "1991-10-10",
        Address: "上海市静安区永和路318弄",
        SignUnit: "上海静安区公安局",
        PeriodStart: "2010-10-10",
        PeriodEnd: "2020-10-10"
    }
}

function GetCompanyBaseInfo() {
    return {
        CompanyName: "上海测试有限公司",
        CompanyIdNumber: "42524524524525254",
        LegalPersonName: "张三",
        LegalPersonIdNumber: "234343199110101010",
        RegisterDate: "1991-10-10",
        RegisterAmount: "2343",
        ManageYears: "8",
        CompanyAddress: "上海市静安区永和路318弄",
        CompanyEmail: "ewgq@qq.com",
        CompanyTelephone: "2343553355",
        Industry1: "",
        Industry2: "",
        Industry3: "",
        Industry4: "",
        CompanyHouseStatus: "1",
        CompanyElectricityCode: "3435353643",
        CompanyHousePeriodStart: "2010-10-10",
        CompanyHousePeriodEnd: "2020-10-10"
    }
}

function GetCityList() {
    return {
        code: "200000",
        data: [{
            Code: "10001",
            Name: "北京市",
            ParentCode: "0"
        },
        {
            Code: "1000101",
            Name: "北京市",
            ParentCode: "10001"
        },
        {
            Code: "10002",
            Name: "上海市",
            ParentCode: "0"
        },
        {
            Code: "1000201",
            Name: "上海市",
            ParentCode: "10002"
        },
        {
            Code: "10003",
            Name: "湖北省",
            ParentCode: "0"
        },
        {
            Code: "1000301",
            Name: "武汉市",
            ParentCode: "10003"
        },
        {
            Code: "1000302",
            Name: "咸宁市",
            ParentCode: "10003"
        }]
    }
}