import { GetProperty } from "./Common";

export default {
    Name: "Role",
    PrimaryKey: "RoleId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("RoleId", "RoleId", "RoleId"),
        GetProperty("RoleName", "RoleName", "角色名称"),
        GetProperty("Status", "Status", "状态"),
        GetProperty("Remark", "Remark", "描述"),
        GetProperty("CreateUser", "CreateUser", "创建人"),
        GetProperty("CreateDate", "CreateDate", "创建时间"),
        GetProperty("UpdateDate", "UpdateDate", "更新时间")
    ]
}

