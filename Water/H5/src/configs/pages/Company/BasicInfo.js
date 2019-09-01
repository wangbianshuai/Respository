import {AssignProporties,CreateGuid, ToRem} from "../Common";

//企业基本信息 700-799
const DataActionTypes = {
    //获取实体数据
    GetCompanyInfo: 700,
    //获取全部行业信息
    GetAllIndustry: 702,
    //设置行业
    SetIndustry: 703,
    //保存实体数据
    SaveCompanyInfo: 799,
}


export default {
    Name: "BasicInfo",
    Type: "View",
    EventActionName: 'GetAllIndustry',
	EventActions: GetEventActions(),
    SaveEntityDataActionType: DataActionTypes.SaveCompanyInfo,
    GetEntityDataActionType: DataActionTypes.GetAllIndustry,
    Properties: AssignProporties({}, GetPropeties())

};

function GetPropeties() {
    return [
        GetTextBoxReadOnly("companyName", "企业名称",'TextBoxDisabled textBoxFirst'),
        GetTextBoxReadOnly("buslicenseNo", "统一社会信用代码",'TextBoxDisabled'),
        GetDateText2("registerTime", "注册时间"),
        GetTextBox2("registerCapital", "注册资金", "单位：万元", 10, "InputNumber", "万元",'SelectItem1'),
        GetTextBox2("operateTime", "经营年限", "单位：年", 3, "InputNumber", "年",'SelectItem1'),
        GetTextBox2("companyAddr", "单位地址", "请详细至门牌号",'','TextArea','',"TextItem2"),
        GetTextBox2("companyPhoneNumber", "单位电话", "请填写单位电话"),
        GetTextBox2("email", "单位邮箱", "请填写单位邮箱"),
		GetUploadImage("buslicenseUrlId", "营业执照照片"),
		
        GetSelect2("companyAddrOwnerShip", "办公地是否租赁", GetCompanyHouseDataSource()),
        GetDateText("companyAddrTimeLimitStart", "租赁有效期开始日期"),
        GetDateText("companyAddrTimeLimitEnd", "租赁有效期结束日期"),
		GetTextBox2("electricityBill", "办公地电费单号", "请填写办公地电费单号"),
	
		GetTitleView("法人信息"),
		GetTextBoxReadOnly("legalPersonName", "法人姓名",'TextBoxDisabled'),
		GetTextBoxReadOnly("legalPersonIdNumber", "法人身份证",'TextBoxDisabled'),
		GetTextBox2("legalPersonPhone", "法人手机号", "请填写法人手机号"),
		
        GetTitleView("所属行业","（选填）         ※ 请从上到下依次选择", ),
        GetSelect3("companyIndustry", "公司门类", null, null, ["industryBigType"]),
        GetSelect3("industryBigType", "行业大类", "companyIndustry", "parentId", ["industryMiddleType"]),
        GetSelect3("industryMiddleType", "行业中类", "industryBigType", "parentId", ["industryMinimumType"]),
        GetSelect3("industryMinimumType", "行业小类", "industryMiddleType", "parentId"),
        GetButton2("SaveBasic", "保存", "primary",'SaveCompanyInfo',{marginTop: ToRem(40), marginBottom: ToRem(40)})

    ]
}

function GetButton2(Name, Text, ButtonType, EventActionName, Style) {
    return { Name, Text, Type: "Button", ButtonType, EventActionName, Style }
}
function GetTitleView(Value,Label) {
    return {
        Name: "Title",
        Type: "View",
        IsFlex:true,
        ClassName: "ContactListViewTitle",
        FlexProps: { direction: "row", justify: "center", align: "between" },
        Properties: [{ Name: "Title", Type: "SpanText", ClassName: "SpanLabel",Value,Label,Id: CreateGuid(),}]
    }
}


function GetTextBoxReadOnly(name, label, ClassName) {
    return { Label: label, Name: name, Type: "TextBox", IsEdit: false, ClassName: ClassName, Flex: { direction: "row", align: "center" }, IsReadonly: true, Disabled: true }
}

function GetTextBox2(name, label, placeHolder, maxLength, controlType, extra, ClassName) {
    return { Label: label, Name: name, Type: "TextBox", IsNullable: true, Extra: extra, ControlType: controlType, MaxLength: maxLength, ClassName, PlaceHolder: placeHolder ,IsEdit: true}
}

function GetSelect2(name, label, dataSource) {
    return {
        Label: label, Name: name, Type: "Select", IsNullable: true, IsListItem: false, ClassName: "SelectItem1", DataSource: dataSource,IsEdit: true
    }
}

function GetSelect3(name, label, parentName, parentPropertyName, childNames) {
    const p = GetSelect2(name, label, null);
    p.ParentName = parentName;
    p.ParentPropertyName = parentPropertyName;
    p.ChildNames = childNames;
    p.IsEdit = true;
    p.ServiceDataSource = { ValueName: "id", TextName: "value", IsLocal: true }

    return p;
}

function GetDateText(name, label) {
    return {
        Label: label, Name: name, Type: "DatePicker", IsNullable: false, IsListItem: false, ClassName: "SelectItem1", IsVisible: true, IsEdit: true
    }
}

function GetDateText2(name, label) {
    return {
        Label: label, Name: name, Type: "DatePicker", IsNullable: false, IsListItem: false, ClassName: "SelectItem1",IsEdit: true
    }
}

function GetUploadImage(name, text) {
	const p = { Name: name, Label: text }
	p.DirName = "companySaveInfo"
	p.BidCode = "COMPANY_AUTHENTICATION";
	p.NullErrorMessage = `请上传${text}`;
	p.ItemClassName = "UploadImageItem CompanyInfoImageWrap";
	p.IsEdit = true;
	p.IsNullable = false;
	p.Type = "UploadImage";
	p.IsVisible = true;
	return p;
}

function GetCompanyHouseDataSource() {
    return [{ Value: '01', Text: "是" },
        { Value: '02', Text: "否" }]
}

function GetEventActions() {
    return [
        {
            Name: "GetAllIndustry",
            Type: "EntityEdit/GetEntityData",
            EditView: "BasicInfo"
        },
        ]
}
