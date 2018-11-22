module.exports = {
    Name: "User",
    Title: "用户",
    EntityName: "User",
    PrimaryKey: "UserId",
    TemplateName: "EntityListPage",
    InsertUrl: "User/Insert2",
    UpdateUrl: "User/Update2",
    SelectNames: ["UserId", "RowVersion", "UserName", "LogiNName", "UserEmail", "LastLoginDate", "CreateDate"],
    SearchNames: ["UserName,LoginName"],
    DataColumnNames: ["UserName", "LoginName", "UserEmail", "LastLoginDate", "CreateDate"],
    EditNames: ["UserName", "LoginName", "UserEmail", "LoginPassword", "AgainLoginPassword"],
    OrderByList: [{ Name: "CreateDate", IsDesc: true }],
    Properties: GetProperties()
};

function GetProperties() {
    return [{ Label: "名称", Name: "UserName,LoginName", DataType: "string", MaxLength: 50 },
    { Label: "用户名", Name: "UserName", DataType: "string", MaxLength: 50, IsNullable: false },
    { Label: "登录名", Name: "LoginName", DataType: "string", MaxLength: 50, IsNullable: false },
    { Label: "登录密码", Name: "LoginPassword", ControlType: "password", DataType: "string", MaxLength: 50 },
    { Label: "确认密码", Name: "AgainLoginPassword", ControlType: "password", DataType: "string", MaxLength: 50 },
    { Label: "最近登录时间", Name: "LastLoginDate", DataType: "DateTime" },
    { Label: "电子邮箱", Name: "UserEmail" },
    { Label: "创建时间", Name: "CreateDate", DataType: "DateTime" }]
}