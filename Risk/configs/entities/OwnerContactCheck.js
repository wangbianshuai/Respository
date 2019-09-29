const { GetProperty } =require( "./Common");

module.exports= {
    Name: "OwnerContactCheck",
    PrimaryKey: "OrderCode",
    PropertyPrimaryKey: "loanApplyId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("OwnerPhone", "phoneNumber", "联系人电话"),
        GetProperty("FirstCallDate", "firstCallTime", "选择第一次拨打时间"),
        GetProperty("SecondCallDate", "secondCallTime", "选择第二次拨打时间"),
        GetProperty("ThirdCallDate", "thirdCallTime", "选择第三次拨打时间"),
        GetProperty("Question1", "贷款基本要素核实", "贷款基本要素核实（获取借贷信息的来源、申请金额、期限、用途（需重视，并尽量交叉检验））"),
        GetProperty("Question2", "基本经营情况核实", "基本经营情况核实（单名单址、从业经历、主营品牌、淡季旺季、员工情况、上下游、生产周期）"),
        GetProperty("Question3", "利润情况", "利润情况（营业额、毛利率、净利率、净利润、工资支出、生活账单、资产折旧、采购成本、税务支出、隐形资产）"),
        GetProperty("Question4", "资产负债情况", "资产负债情况（自有资金、存货价值、固定资产、个人资产、隐形资产、信用卡使用情况、其他小贷公司贷款、还款压力、其他公司贷款申请）"),
        GetProperty("Question5", "家庭基本信息", "家庭基本信息（宅址宅电、婚姻状况、子女情况、配偶工作情况、兴趣爱好、其他联系方式）"),
        GetProperty("Question6", "其他情况", "其他情况")
    ]
}