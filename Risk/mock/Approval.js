import * as Common from "./Common";

const _ApprovalOpinion = {};

export default {
    'POST /api/GetFinalApprovalResult': GetFinalApprovalResult(),
    'POST /api/SaveApprovalOpinion': SaveApprovalOpinion,
    "POST /api/GetApprovalOpinion": GetApprovalOpinion()
}

function GetApprovalOpinion() {
    return {
        code: "200000",
        data: _ApprovalOpinion
    }
}

function SaveApprovalOpinion(req, res) {
    for (var key in req.body) _ApprovalOpinion[key] = req.body[key];
    _ApprovalOpinion.updateTime = Common.GetCurrentDate();

    res.send({
        code: "200000",
        data: {}
    })
}

function GetFinalApprovalResult() {
    return {
        code: "200000",
        data: {
            ApprovedLoanAmount: 10000000,
            ApprovedLoanPeriod: "90天",
            ApprovedLoanRate: "8",
            BackMethod: "先息后本",
            StagingMode: "3",
            YearRateMode: "365天（闰年366天）",
            InfoManageRate: "0.50%",
            ManageCollectionType: "前置",
            ManageCollectionMethod: "一次性",
            InfoServiceRate: "0.50%",
            ServiceCollectionType: "后置",
            ServiceCollectionMethod: "分期"
        }
    }
}