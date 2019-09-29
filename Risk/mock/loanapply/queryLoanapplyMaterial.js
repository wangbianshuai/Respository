export default {
    'POST /RiskControlApproval/loanapply/queryLoanapplyMaterial': GetResponse(),
}

function GetResponse() {
    return {
        "code": 0,
        "message": "成功",
        "data": {
            "loanApplyBaseInfo": {
                "lenderId": "2407012",
                "lenderName": "测试猿",
                "loanApplyAmount": 10000,
                "loanApplyPeriod": 12,
                "loanApplyPeriodUnit": "03",
                "repayWay": "01",
                "loanUsefor": "01",
                "productId": "PD151995455557861376",
                "productShortName": "新测试",
                "productCategory": "新商贷",
                "productName": "新商贷测试",
                "loanSellerId": "180700095",
                "loanSellerName": "张毅",
                "loanSellerDepartment": "测试部",
                "loanApplyChannel": "01",
                "loanApplyTime": "2019-06-27 11:20:30",
                lenderCitycode: "130200",
                lenderCityname: "唐山市",
                lenderProvincecode: "130000",
                lenderProvincename: "河北省",
                "lenderType": "01",
                "enterpriseName": "测试企业名称111",
                "loanapplyTitle": "新商贷接口测试流程",
                "interestRate": 0.5,
                "lenderUsername": "15501850006",
                "isauthorized": "02",
                "isspecial": "02"
            },
            "personalIdentity": {
                "name": "借款企业1",
                "idCard": "610101198201013134",
                "gender": "01",
                "nationality": "01",
                "birthday": "1982-01-01 12:00:00",
                "idCardAddress": "身份证地址",
                "issueAuthority": "签发机关",
                "validityStartDate": "2019-06-06 11:20:30",
                "validityEndDate": "2019-06-06 11:20:30"
            },
            "personalBase": {
                "commonUsePhone": "145245245425",
                "emailAddress": "15600000001@163.com",
                "educationLevel": "01",
                "maritalStatus": "01",
                "marriedYears": 0,
                "homeAddress": "现居住地址",
                "leaseStatus": "01",
                "leaseStartPeriod": "2019-06-06 11:20:30",
                "leaseEndPeriod": "2019-06-06 11:20:30",
                "electricityBillId": "电费账单好"
            },
            "enterprise": {
                "companyName": "借款企业1",
                "socialCreditId": "914403003594181F003",
                "legalPersonName": "测试猿",
                "legalPersonIdNum": "610101198201013134",
                "legalPersonPhone": "15501850006",
                "establishedDate": "2019-06-06 11:20:30",
                "registeredCapital": 0,
                "operateYears": 3,
                "companyAddress": "单位地址",
                "companyPhone": "单位电话",
                "companyEmail": "15501850006@163.com",
                "industryCategory": "01",
                "industryCategoryName": null,
                "industryCategoryBig": "01",
                "industryCategoryBigName": null,
                "industryCategoryMiddle": "01",
                "industryCategoryMiddleName": null,
                "industryCategorySmall": "01",
                "industryCategorySmallName": null,
                "leaseStatus": "01",
                "leaseStartPeriod": "2019-06-06 11:20:30",
                "leaseEndPeriod": "2019-06-06 11:20:30",
                "electricityBillId": "电费账单号"
            },
            "realEstateList": [
                {
                    "ower": "马大哈",
                    "address": "房产地址",
                    "area": 0
                }
            ],
            "carPropertyList": [
                {
                    "numberPlate": "NB00001",
                    "carType": "01",
                    "ower": "马大哈",
                    "owerHomeAddress": "车辆所有人住址",
                    "useType": "01",
                    "brandModel": "路虎",
                    "vehicleId": "0000",
                    "engineId": "0000",
                    "registrationDate": "2019-06-06 11:20:30",
                    "issueDate": "2019-06-06 11:20:30"
                }
            ],
            "contactList": [
                {
                    "contactName": "马大哈",
                    "contactPhone": "15600000001",
                    "relationship": "01",
                    "address": "居住地址",
                    "category": "01"
                }
            ]
        }
    }
}