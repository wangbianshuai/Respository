import { GetProperty } from "./Common";

export default {
    Name: "BankRecord",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("CompanyRecordFile", "CompanyRecordFile", "记录文件"),
        GetProperty("CompanyMonthAmount", "CompanyMonthAmount", "对公月均流水"),
        GetProperty("CompanyMonthInterest", "CompanyMonthInterest", "对公结息汇总"),
        GetProperty("PersonRecordFile", "PersonRecordFile", "记录文件"),
        GetProperty("PersonMonthAmount", "PersonMonthAmount", "对私月均流水"),
        GetProperty("PersonMonthInterest", "PersonMonthInterest", "对私结息汇总"),
        GetProperty("TotalCompanyMonthAmount", "TotalCompanyMonthAmount", "对公月均流水"),
        GetProperty("TotalPersonMonthAmount", "TotalPersonMonthAmount", "对私月均流水"),
        GetProperty("TotalMonthAmount", "TotalMonthAmount", "总月均流水"),
        GetProperty("TotalMonthInterest", "TotalMonthInterest", "累计结息")
    ]
}

