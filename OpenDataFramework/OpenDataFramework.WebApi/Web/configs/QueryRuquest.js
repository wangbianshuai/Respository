//请求
const request = {
    IsPage: true, //是否分页
    PageIndex: 1,//页索引
    PageSize: 10,//页大小
    TopCount: 2,//Top数
    SelectNames: ["UserName", "LoginName"],//查询属性名集合
    Conditions: [{
        Name: "UserName",//属性名
        Logic: "like", //逻辑符  "=", ">=", ">", "<=", "<", "in", "and", "or", "like", "notin", "isnull", "notnull", "<>" 
        Value: ""//值
    },
    {
        Logic: "or",
        Conditions: [{
            Name: "UserName",//属性名
            Logic: "like", //逻辑符
            Value: "admin"//值
        }, {
            Name: "LoginName",//属性名
            Logic: "like", //逻辑符
            Value: "123"//值
        }]
    }],//查询条件
    OrderBys: [{
        Name: "CreateDate",
        IsDesc: true
    }],//排序
    GroupBys: [{
        AsName: "UserCount",//映射名
        Name: "UserId", //属性名
        Logic: "count"  //表达式
    }]
}

//响应
const response = {
    PageRecord: 1234,//页记录数
    DataList: [{
        UserName: "admin",
        LoginName: "admin"
    }]//实体数据列表
}