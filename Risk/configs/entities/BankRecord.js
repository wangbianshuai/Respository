const { GetProperty } =require( "./Common");

module.exports= {
    Name: "BankRecord",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties()
}

/*publicMonAvgAmount (number, optional): 对公月均流水 ,
privateMonAvgAmount (number, optional): 对私月均流水 ,
totalMonAvgAmount (number, optional): 总月均流水 ,
totalInterestAmount (number, optional): 累计结息*/

function GetProperties() {
    return [
        GetProperty("CompanyRecordFile", "CompanyRecordFile", "记录文件"),
        GetProperty("CompanyMonthAmount", "monthAverageAmount", "对公月均流水"),
        GetProperty("CompanyMonthInterest", "interestSumAmount", "对公结息汇总"),
        GetProperty("PersonRecordFile", "PersonRecordFile", "记录文件"),
        GetProperty("PersonMonthAmount", "monthAverageAmount", "对私月均流水"),
        GetProperty("PersonMonthInterest", "interestSumAmount", "对私结息汇总"),
        GetProperty("TotalCompanyMonthAmount", "publicMonAvgAmount", "对公月均流水"),
        GetProperty("TotalPersonMonthAmount", "privateMonAvgAmount", "对私月均流水"),
        GetProperty("TotalMonthAmount", "totalMonAvgAmount", "总月均流水"),
        GetProperty("TotalMonthInterest", "totalInterestAmount", "累计结息")
    ]
}

