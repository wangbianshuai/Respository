export default {
    Name: "Basic",
    PrimaryKey: "Id",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        get("borrowName", "borrowName", "借款人姓名"),
        get("borrowIDCard", "borrowIDCard", "身份证号"),
        get("nationality", "nationality", "民族"),
        get("borrowCardAdress", "borrowCardAdress", "身份证地址"),
        get("borrowCardAuthority", "borrowCardAuthority", "签发机关"),
        get("identityValidity", "identityValidity", "证件有效期")
    ]
}

function get(Name, PropertyName, Label) {
    return { Name, PropertyName, Label}
}