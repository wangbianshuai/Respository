
import * as Common from "./Common";

const _CompanyFinanceInfo = {};

export default {
    'POST /api/GetCompanyFinanceInfo': GetCompanyFinanceInfo(),
    'POST /api/SaveCompanyFinanceInfo': SaveCompanyFinanceInfo,
    'POST /api/ComputeCollectBankInfo': ComputeCollectBankInfo(),
    'POST /api/GetFinalBaseInfo': GetFinalBaseInfo(),
}

function GetFinalBaseInfo() {
    return {
        code: "200000",
        data: {}
    }
}

function ComputeCollectBankInfo() {
    return {
        code: "200000",
        data: {}
    }
}

function SaveCompanyFinanceInfo(req, res) {
    for (var key in req.body) _CompanyFinanceInfo[key] = req.body[key];
    _CompanyFinanceInfo.updateTime = Common.GetCurrentDate();

    res.send({
        code: "200000",
        data: {}
    })
}

function GetCompanyFinanceInfo() {
    return {
        code: "200000",
        data: _CompanyFinanceInfo
    }
}
