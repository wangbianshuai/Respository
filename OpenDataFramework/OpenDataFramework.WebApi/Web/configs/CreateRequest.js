//请求
const request = {
    Data: {
        EntityName: "键值配置",
        Remark: "通用键值对配置",
        Properties: [{
            PropertyName: "键名",
            DataType: "string",
            MaxLength: 50,
            IsNullable: 0
        },
        {
            PropertyName: "值",
            IsNullable: 0,
            DataType: "string",
            MaxLength: 500,
        },
        {
            PropertyName: "备注",
            DataType: "string",
            MaxLength: 500,
        }]
    }
}