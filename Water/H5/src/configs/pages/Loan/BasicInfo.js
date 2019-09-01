import {AssignProporties, GetTextBox, ToRem} from "../Common";

//借款人基本信息 300-399
const DataActionTypes = {
    //获取实体数据
    GetUserInfo: 300,
    //保存实体数据
    SaveEntityData: 399
}

export default {
    Name: "BasicInfo",
    Type: "View",
    EventActionName: "GetUserInfo",
    SaveEntityDataActionType: DataActionTypes.SaveEntityData,
    GetEntityDataActionType: DataActionTypes.GetUserInfo,
    EventActions: GetEventActions(),
    Style: {marginTop: ToRem(40)},
    Properties: AssignProporties({}, GetHouseItemProperties()
	)
}


function GetHouseItemProperties() {
    return [
        GetTextBox2("name", "借款人姓名", "", "请输入借款人姓名", 50, true, false, '', "textBoxFirst", true),
        GetTextBox2("idNumber", "身份证号", " ", "请输入借款人身份证号", 18, true, false, '', 'TextBoxDisabled', true),
        GetSelect("nationality", "民族", GetNationalitySource(),true),
        GetTextBox2("idAddress", "身份证地址", "TextArea", "请输入身份证地址", '', true,true, '',"TextItem2"),
        GetTextBox2("idIssueOrg", "签发机关", "", "请输入身份证签发机关", '', true, true),
        GetDateText2("idEffectiveDate", "证件有效期开始日期", "", "请选择", 100, true, true),
        GetDateText2("idExpiredDate", "证件有效期结束日期", "", "请选择", 100, true, true),
        GetTextBox2("commonPhone", "常用手机号", "InputNumber", "请输入借款人常用手机号", 11, true, true,'', "textBoxFirst"),
        GetTextBox2("email", "邮箱地址", "", "请输入邮箱地址", 100, true,true),
        GetSelect("degree", "教育程度", GetEducationDataSource(),true),
        GetSelect("maritalstatus", "婚姻状况", GetMaritalStatusDataSource(), true),
        GetTextBox2("marriedYear", "已婚年限", "InputNumber", "请输入已婚年限", 100, true, true, '年','SelectItem1'),
        GetTextBox2("homeaddr", "现居住地址", "TextArea", "请输入现居住地址", '', true, true, '',"TextItem2"),
		GetSelect("hasHouse", "本地是否有房", GetBorrowerHouseDataSource(), true),
        GetSelect("hdOwnerShip", "居住地是否租赁", GetHouseTypeDataSource(), true),
        GetDateText2("hdEffectiveDate", "租赁有效期开始日期", "", "请选择", 100, true,true),
        GetDateText2("hdExpiredDate", "租赁有效期结束日期", "", "请选择", 100, true, true),
        GetTextBox2("hdElectricityBill", "居住地电费单号", "", "请输入居住地电费单号", 100, true, true),
		{ ...GetButton2("SaveBasic", "保存", "primary",'SaveEntityData',{marginTop: ToRem(40), marginBottom: ToRem(40)})}
    ]
}

function GetButton2(Name, Text, ButtonType, EventActionName, Style) {
    return { Name, Text, Type: "Button", ButtonType, EventActionName, Style }
}

function GetTextBox2(Name, Label, ContorlType, PlaceHolder, MaxLength, IsNullable, IsEdit, Extra, ClassName, Disabled) {
    return {
        ...GetTextBox(Name, Label, ContorlType, PlaceHolder, MaxLength),
        Extra,
        IsNullable: true,
        IsEdit,
        ClassName,
		Disabled
    }
}
function GetDateText2(name, label) {
    return {
        Label: label, Name: name, Type: "DatePicker", IsNullable: true, IsListItem: false, ClassName: "SelectItem1",IsEdit: true,
    }
}

function GetSelect(name, label, dataSource, IsNullable) {
    return {
        Label: label,
        Name: name,
        Type: "Select",
        IsNullable: IsNullable,
        IsListItem: false,
		IsEdit: true,
        ClassName: "SelectItem1",
        DataSource: dataSource
    }
}


function GetEducationDataSource() {
    return [
        { Value: 10, Text: "未知" },
        { Value: 11, Text: "小学" },
        { Value: 21, Text: "初中" },
        { Value: 12, Text: "高中" },
        { Value: 13, Text: "中专" },
        { Value: 14, Text: "专科" },
        { Value: 15, Text: "本科" },
        { Value: 16, Text: "硕士" },
        { Value: 18, Text: "博士" },
        { Value: 19, Text: "博士后" },
        { Value: 20, Text: "其他" }
    ]
}

function GetMaritalStatusDataSource() {
    return [
        { Value: 1, Text: "未婚" },
        { Value: 2, Text: "已婚" },
        { Value: 3, Text: "离异" },
        { Value: 4, Text: "丧偶" }
    ]
}

function GetHouseTypeDataSource() {
	return [{ Value: '01', Text: "是" },
		{ Value: '02', Text: "否" }]
}

function GetBorrowerHouseDataSource() {
	return [{ Value: '0', Text: "有" },
		{ Value: '1', Text: "无" }]
}

function GetNationalitySource() {
	return [
		{Value:'01',Text: '汉族'},
		{Value:'02',Text: '满族'},
		{Value:'03',Text: '蒙古族'},
		{Value:'04',Text: '回族'},
		{Value:'05',Text: '藏族'},
		{Value:'06',Text: '维吾尔族'},
		{Value:'07',Text: '苗族'},
		{Value:'08',Text: '彝族'},
		{Value:'09',Text: '壮族'},
		{Value:'10',Text: '布依族'},
		{Value:'11',Text: '侗族'},
		{Value:'12',Text: '瑶族'},
		{Value:'13',Text: '白族'},
		{Value:'14',Text: '土家族'},
		{Value:'15',Text: '哈尼族'},
		{Value:'16',Text: '哈萨克族'},
		{Value:'17',Text: '傣族'},
		{Value:'18',Text: '黎族'},
		{Value:'19',Text: '傈僳族'},
		{Value:'20',Text: '佤族'},
		{Value:'21',Text: '畲族'},
		{Value:'22',Text: '高山族'},
		{Value:'23',Text: '拉祜族'},
		{Value:'24',Text: '水族'},
		{Value:'25',Text: '东乡族'},
		{Value:'26',Text: '纳西族'},
		{Value:'27',Text: '景颇族'},
		{Value:'28',Text: '柯尔克孜族'},
		{Value:'29',Text: '土族'},
		{Value:'30',Text: '达斡尔族'},
		{Value:'31',Text: '仫佬族'},
		{Value:'32',Text: '羌族'},
		{Value:'33',Text: '布朗族'},
		{Value:'34',Text: '撒拉族'},
		{Value:'35',Text: '毛南族'},
		{Value:'36',Text: '仡佬族'},
		{Value:'37',Text: '锡伯族'},
		{Value:'38',Text: '阿昌族'},
		{Value:'39',Text: '普米族'},
		{Value:'40',Text: '朝鲜族'},
		{Value:'41',Text: '塔吉克族'},
		{Value:'42',Text: '怒族'},
		{Value:'43',Text: '乌孜别克族'},
		{Value:'44',Text: '俄罗斯族'},
		{Value:'45',Text: '鄂温克族'},
		{Value:'46',Text: '德昂族'},
		{Value:'47',Text: '保安族'},
		{Value:'48',Text: '裕固族'},
		{Value:'49',Text: '京族'},
		{Value:'50',Text: '塔塔尔族'},
		{Value:'51',Text: '独龙族'},
		{Value:'52',Text: '鄂伦春族'},
		{Value:'53',Text: '赫哲族'},
		{Value:'54',Text: '门巴族'},
		{Value:'55',Text: '珞巴族'},
		{Value:'56',Text: '基诺族'},
	]
}

function GetEventActions() {
    return [
        {
            Name: "GetUserInfo",
            Type: "EntityEdit/GetEntityData",
            EditView: "BasicInfo"
        },
		{
			Name: "SaveEntityData",
			Type: "EntityEdit/SaveEntityData",
			EditView: "BasicInfo"
		}
        ]
}
