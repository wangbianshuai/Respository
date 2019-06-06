import * as Common from "./Common";

var _CreditInfo = {};

export default {
    'POST /RiskControlApproval/GetCreditInfo': GetCreditInfo(),
    'POST /RiskControlApproval/SaveCreditInfo': SaveCreditInfo
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