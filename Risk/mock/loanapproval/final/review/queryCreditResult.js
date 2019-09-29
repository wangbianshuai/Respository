export default {
    'POST /RiskControlApproval/loanapproval/final/review/queryCreditResult': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "approveLoanPeriod": 12,
            "approveLoanPeriodUnit": "03",
            "approveInterestRate": 5,
            "approveLoanAmount": 10000,
            "repaymentWay": "02",
            "repaymentPeriodWay": 3,
            "repaymentPeriodWayUnit": "03",
            "annulCalcWay": "01",
            "finalApprovalFeeInfoResult": {
                "feeResultList": [
                    {
                        "feeTemplateId": "FT151923098243825664",
                        "feeType": "01",
                        "feeName": "string",
                        "feeRate": 0.05,
                        "chargeStage": "02",
                        "chargeWay": "01"
                    },
                    {
                        "feeTemplateId": "FT15192309824382563364",
                        "feeType": "02",
                        "feeName": "string",
                        "feeRate": 0.15,
                        "chargeStage": "02",
                        "chargeWay": "01"
                    },
                    {
                        "feeTemplateId": "FT15192309824334382563364",
                        "feeType": "03",
                        "feeName": "string",
                        "feeRate": 0.10,
                        "chargeStage": "02",
                        "chargeWay": "01"
                    }
                ]
            }
        }
    }
}