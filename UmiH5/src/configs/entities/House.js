export default {
    Name: "House",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        get("HouseUserName", "HouseUserName", "房产所有人"),
        get("HouseAddress", "HouseAddress", "房产地址"),
        get("HouseSpace", "HouseSpace", "面积")
    ]
}
 
function get(Name, PropertyName, Label) {
    return { Name, PropertyName, Label}
}