const { GetProperty } =require( "./Common");

module.exports= {
    Name: "Role",
    PrimaryKey: "RoleId",
    PropertyPrimaryKey: "roleId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("RoleId", "roleId", "RoleId"),
        GetProperty("RoleName", "roleName", "角色名称"),
        GetProperty("Status", "Status", "状态"),
        GetProperty("StatusName", "deleteStateName", "状态"),
        GetProperty("Remark", "description", "描述"),
        GetProperty("CreateUser", "createByName", "创建人"),
        GetProperty("UpdateDate", "updateTime", "更新时间")
    ]
}

