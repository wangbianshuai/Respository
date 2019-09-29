const { GetProperty } =require( "./Common");

module.exports= {
    Name: "Order",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties(),
    BackMethodDataSource: GetBackMethodDataSource(),
    BorrowerUseDataSource: GetBorrowerUseDataSource(),
    PeriodUnitDataSource: GetPeriodUnitDataSource(),
    OrderAreaDataSource: GetOrderAreaDataSource()
}

/*
时间单位	01	日
	02	周
	03	月
	04	季
	05	年*/
function GetPeriodUnitDataSource() {
    return [{ Value: "01", Text: "日" },
    { Value: "03", Text: "个月" }]
}

/*还款方式	01	等额本息
	02	付息还本*/
function GetBackMethodDataSource() {
    return [{ Value: "01", Text: "等额本息" }, { Value: "02", Text: "付息还本" }]
}

/*借款用途	01	短期周转
	02	生意周转
	03	生活周转
	04	购物消费
	05	创业借款
	06	其他借款*/
function GetBorrowerUseDataSource() {
    return [{ Value: "01", Text: "短期周转" }, { Value: "02", Text: "生意周转" },
    { Value: "03", Text: "生活周转" }, { Value: "04", Text: "购物消费" },
    { Value: "05", Text: "创业借款" }, { Value: "06", Text: "其他借款" }]
}

/*enterpriseName (string, optional): 基本信息-企业名称 ,
lenderCitycode (string, optional): 基本信息-借款人所在城市code ,
lenderCityname (string, optional): 基本信息-借款人所在城市name ,
lenderId (string, optional): 基本信息-借款人id ,
lenderName (string, optional): 基本信息-借款人名字 ,
lenderProvincecode (string, optional): 基本信息-借款人所在省code ,
lenderProvincename (string, optional): 基本信息-借款人所在省name ,
lenderType (string, optional): 基本信息-借款人用户类型 ,
loanApplyAmount (number, optional): 基本信息-借款申请金额 ,
loanApplyChannel (string, optional): 基本信息-借款申请渠道 ,
loanApplyPeriod (number, optional): 基本信息-借款申请期限 ,
loanApplyPeriodUnit (string, optional): 基本信息-借款申请期限单位 ,
loanApplyTime (string, optional): 基本信息-借款申请时间 ,
loanSellerDepartment (string, optional): 基本信息-信贷员所在部门 ,
loanSellerId (string, optional): 基本信息-信贷员工号 ,
loanSellerName (string, optional): 基本信息-信贷员姓名 ,
loanUsefor (string, optional): 基本信息-借款用途 ,
productCategory (string, optional): 基本信息-产品大类 ,
productId (string, optional): 基本信息-产品ID ,
productShortName (string, optional): 基本信息-产品简称 ,
repayWay (string, optional): 基本信息-还款方式*/
function GetProperties() {
    return [
        GetProperty("OrderCode", "loanApplyId", "工单编号"),
        GetProperty("Borrowers", "enterpriseName", "企业名称"),
        GetProperty("BorrowerUser", "lenderName", "借款人"),
        GetProperty("ProductType", "productType", "产品"),
        GetProperty("LoanUser", "loanUser", "信贷员"),
        GetProperty("BorrowerDate", "loanApplyTime", "借款申请时间"),
        GetProperty("UserType", "lenderTypeName", "用户类型"),
        GetProperty("BorrowerAmount", "loanApplyAmount", "借款申请金额"),
        GetProperty("BorrowerPeriod", "loanApplyPeriod", "借款申请期限"),
        GetProperty("BorrowerPeriodName", "loanApplyPeriodName", "借款申请期限"),
        GetProperty("BackMethod", "repayWay", "还款方式"),
        GetProperty("BackMethodName", "repayWayName", "还款方式"),
        GetProperty("BorrowerUse", "loanUsefor", "借款用途"),
        GetProperty("BorrowerUseName", "loanUseforName", "借款用途"),
        GetProperty("BorrowChannel", "loanApplyChannelName", "借款申请渠道"),
        GetProperty("OrderArea", "lenderProvinceCity", "进件地区"),
        GetProperty("OrderAreaName", "lenderProvinceCityName", "进件地区")
    ]
}

function GetOrderAreaDataSource() {
    return {
        ValueName: "Code",
        TextName: "Name",
        StateName: "GetProvincesAndCitys",
        ServiceName: "LoanApplyPlatformService",
        ActionName: "GetProvincesAndCitys",
        ParentValueName: "ParentCode",
        Payload: {}
    }
}