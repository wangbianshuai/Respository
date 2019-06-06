import { GetProperty } from "./Common";

export default {
    Name: "House",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("HouseUserName", "HouseUserName", "房产所有人"),
        GetProperty("HouserAddress", "HouserAddress", "房产地址"),
        GetProperty("HoustSpace", "HoustSpace", "面积")
    ]
}

