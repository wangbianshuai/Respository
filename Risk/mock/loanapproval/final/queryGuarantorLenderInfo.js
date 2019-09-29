export default {
    'POST /RiskControlApproval/loanapproval/final/queryGuarantorLenderInfo': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "guarantorLenderList": [
                {
                  "type": "01",
                  "personType": "01",
                  "name": "个人担保人",
                  "personId": "string",
                  "contactPhone": "string",
                  "email": "string",
                  "guarantorMainPart": "01",
                  "coLenderMainPart": "01",
                  "relationship": "01",
                  "bankcardId": "string",
                  "accountOpenBank": "string",
                  "branchBank": "string"
                },
                {
                  "type": "02",
                  "personType": "02",
                  "name": "企业共借人",
                  "personId": "string",
                  "contactPhone": "string",
                  "email": "string",
                  "guarantorMainPart": "01",
                  "coLenderMainPart": "03",
                  "relationship": "02",
                  "bankcardId": "string",
                  "accountOpenBank": "string",
                  "branchBank": "string"
                }
              ]
        }
    }
}