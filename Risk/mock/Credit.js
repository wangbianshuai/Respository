import * as Common from "./Common";

var _CreditInfo = {};

export default {
    'POST /api/GetCreditInfo': GetCreditInfo(),
    'POST /api/SaveCreditInfo': SaveCreditInfo,
    "POST /api/GetNetCheckList":GetNetCheckList()
}

function GetNetCheckList() {
    return {
        code: "200000",
        data: [{ NetCheckId: 1, UserName: "00001", BorrowerUser: "测试公司1", Phone: "156575757575", IdNumber: "24352452454545", LoanUser: "张三" },
        { NetCheckId: 2, UserName: "00002", BorrowerUser: "测试公司1", Phone: "156575757575", IdNumber: "24352452454545", LoanUser: "张三" },
        { NetCheckId: 3, UserName: "00003", BorrowerUser: "测试公司1", Phone: "156575757575", IdNumber: "24352452454545", LoanUser: "张三" }]
    }
}

function GetCreditInfo() {
    return {
        code: "200000",
        data: _CreditInfo
    }
}

function SaveCreditInfo(req, res) {
    for (var key in req.body) _CreditInfo[key] = req.body[key];
    _CreditInfo.updateTime = Common.GetCurrentDate();

    res.send({
        code: "200000",
        data: {}
    })
}