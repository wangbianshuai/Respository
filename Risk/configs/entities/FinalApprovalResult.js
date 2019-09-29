const { GetProperty } =require( "./Common");

module.exports= {
    Name: "FinalApprovalResult",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties(),
    BackMethodDataSource: GetBackMethodDataSource(),
    BackMethodDataSource2: GetBackMethodDataSource2(),
    InfoManageDataSource: GetInfoManageDataSource(),
    InfoServiceDataSource: GetInfoServiceDataSource(),
    FineRateDataSource: GetFineRateDataSource(),
    PeriodUnitDataSource: GetPeriodUnitDataSource(),
    YearRateMethodDataSource: GetYearRateMethodDataSource(),
    CollectionMethodDataSource: GetCollectionMethodDataSource(),
    CollectionTypeDataSource: GetCollectionTypeDataSource()
}

/*approveLoanPeriod (number, optional): 批复的借款期限 ,
approveLoanPeriodUnit (string, optional): 批复的借款期限单位（取值范围:字典编码DC100004） ,
approveLoanAmount (number, optional): 批复的借款金额 ,
repaymentWay (string, optional): 还款方式 ,
repaymentPeriodWay (number, optional): 还款分期方式（多长时间表示一期） ,
repaymentPeriodWayUnit (string, optional): 还款分期方式单位（取值范围:字典编码DC100004） ,
annulCalcWay (string, optional): 还款年化计算方式（取值范围:字典编码DC100010）*/
function GetProperties() {
    return [
        GetProperty("ApprovedLoanAmount", "approveLoanAmount", "批复借款金额"),
        GetProperty("ApprovedLoanPeriod", "approveLoanPeriod", "批复借款期限"),
        GetProperty("ApprovedLoanPeriodName", "approveLoanPeriodName", "批复借款期限"),
        GetProperty("ApprovedLoanRate", "approveInterestRate", "批复借款年化利率"),
        GetProperty("BackMethodId", "repaymentWayId", "还款方式模版"),
        GetProperty("BackMethod", "repaymentWay", "还款方式"),
        GetProperty("BackMethodName", "repaymentWayName", "还款方式"),
        GetProperty("StagingModeName", "repaymentPeriodWayName", "分期方式"),
        GetProperty("StagingMode", "periodWay", "分期方式"),
        GetProperty("YearRateMode", "annualCalcWay", "年化计算方式"),
        GetProperty("YearRateModeName", "annulCalcWayName", "年化计算方式"),
        GetProperty("InfoManageId", "InfoManageId", "费率模版"),
        GetProperty("InfoManageRate", "InfoManageRate", "信息管理费率"),
        GetProperty("ManageCollectionType", "ManageCollectionType", "收取类型"),
        GetProperty("ManageCollectionTypeName", "ManageCollectionTypeName", "收取类型"),
        GetProperty("ManageCollectionMethod", "ManageCollectionMethod", "收取方式"),
        GetProperty("ManageCollectionMethodName", "ManageCollectionMethodName", "收取方式"),
        GetProperty("InfoServiceId", "InfoServiceId", "费率模版"),
        GetProperty("InfoServiceRate", "InfoServiceRate", "信息服务费率"),
        GetProperty("ServiceCollectionType", "ServiceCollectionType", "收取类型"),
        GetProperty("ServiceCollectionTypeName", "ServiceCollectionTypeName", "收取类型"),
        GetProperty("InfoServiceId2", "InfoServiceId2", "费率模版"),
        GetProperty("InfoServiceRate2", "InfoServiceRate2", "信息服务费率"),
        GetProperty("ServiceCollectionType2", "ServiceCollectionType2", "收取类型"),
        GetProperty("ServiceCollectionTypeName2", "ServiceCollectionTypeName2", "收取类型"),
        GetProperty("FineRateId", "FineRateId", "费率模版"),
        GetProperty("FineRate", "FineRate", "费率"),
        GetProperty("ServiceCollectionMethod", "ServiceCollectionMethod", "收取方式"),
        GetProperty("ServiceCollectionMethodName", "ServiceCollectionMethodName", "收取方式")
    ]
}

/*
时间单位	01	日
	02	周s
	03	月
	04	季
	05	年*/
function GetPeriodUnitDataSource() {
    return [{ Value: "01", Text: "日" },
    { Value: "03", Text: "个月" }]
}

function GetBackMethodDataSource() {
    return {
        ValueName: "repaymentConfigId",
        TextName: "name",
        StateName: "BackMethodList",
        ServiceName: "BackMethodService",
        ActionName: "GetDataList",
        IsRefresh: true,
        Payload: {
            pageRequest: {
                pageNum: 1,
                pageSize: 1000
            }
        }
    }
}

function GetInfoManageDataSource() {
    return {
        ValueName: "feeTemplateId",
        TextName: "feeName",
        StateName: "InfoManageRateList",
        ServiceName: "PlatformRateService",
        ActionName: "GetInfoManageRateList",
        IsRefresh: true,
        Payload: {
            feeType: "01",
            pageRequest: {
                pageNum: 1,
                pageSize: 1000
            }
        }
    }
}

function GetInfoServiceDataSource() {
    return {
        ValueName: "feeTemplateId",
        TextName: "feeName",
        StateName: "InfoServiceRateList",
        ServiceName: "PlatformRateService",
        ActionName: "GetInfoServiceRateList",
        IsRefresh: true,
        Payload: {
            feeType: "02",
            pageRequest: {
                pageNum: 1,
                pageSize: 1000
            }
        }
    }
}

function GetFineRateDataSource() {
    return {
        ValueName: "feeTemplateId",
        TextName: "feeName",
        StateName: "FineRateList",
        ServiceName: "PlatformRateService",
        ActionName: "GetFineRateList",
        IsRefresh: true,
        Payload: {
            feeType: "03",
            pageRequest: {
                pageNum: 1,
                pageSize: 1000
            }
        }
    }
}

/*还款方式	01	等额本息
	02	付息还本*/
function GetBackMethodDataSource2() {
    return [{ Value: "01", Text: "等额本息" }, { Value: "02", Text: "付息还本" }]
}


/*
年化计算方式	01	360
	02	365(闰年366)*/
function GetYearRateMethodDataSource() {
    return [{ Value: "01", Text: "360" }, { Value: "02", Text: "365(闰年366)" }]
}


/*费用收取方式	01	一次性收取
	02	分期收取*/
function GetCollectionMethodDataSource() {
    return [{ Value: "01", Text: "一次性收取" }, { Value: "02", Text: "分期收取" }]
}

/*费用收取阶段	01	前置
    02	后置*/
function GetCollectionTypeDataSource() {
    return [{ Value: "01", Text: "前置" }, { Value: "02", Text: "后置" }]
}

