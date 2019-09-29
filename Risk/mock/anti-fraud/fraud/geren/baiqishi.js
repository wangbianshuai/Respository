export default {
    'POST /anti-fraud/fraud/geren/baiqishi2': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "shixin": [{ // 失信名单
                "item": "检查项目",
                "results": [{
                    "result": "结果",
                    "riskLevel": "风险等级"
                },
                {
                    "result": "结果2",
                    "riskLevel": "风险等级2"
                },
                {
                    "result": "结果3",
                    "riskLevel": "风险等级3"
                }]
            },
            { // 失信名单
                "item": "检查项目2",
                "results": [{
                    "result": "结果2",
                    "riskLevel": "风险等级2"
                },
                {
                    "result": "结果23",
                    "riskLevel": "风险等级22"
                },
                {
                    "result": "结果33",
                    "riskLevel": "风险等级32"
                }]
            }],
            "duotou": [{ // 多头
                "item": "核查项目类别",
                "results": [{
                    "result": "核查结果",
                    "content": "结果明细",
                    "riskLevel": "风险等级"
                }]
            }]

        }
    }
}