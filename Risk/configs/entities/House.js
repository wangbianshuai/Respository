const { GetProperty } =require( "./Common");

module.exports= {
    Name: "House",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

/*ower (string, optional): 房产-所有人 ,
address (string, optional): 房产-地址 ,
area (number, optional): 房产-面积*/
function GetProperties() {
    return [
        GetProperty("HouseUserName", "ower", "房产所有人"),
        GetProperty("HouserAddress", "address", "房产地址"),
        GetProperty("HoustSpace", "area", "面积")
    ]
}

