import {AssignProporties, GetButton} from "../Common";

const DataActionTypes = {
	GetResult: 1600,
	ApplyEntityData: 1699
};

export default {
	Name: "ReviewResult",
	Type: "View",
	SaveEntityDataActionType: DataActionTypes.ApplyEntityData,
	GetEntityDataActionType: DataActionTypes.GetResult,
	Properties: AssignProporties({}, GetProperties())
}


function GetProperties() {
	return [
		GetProperty("name", "借款人姓名",''),
		GetProperty("moblie", "借款人常用手机号",''),
		GetProperty("idNumber", "借款人身份证号",''),
		GetProperty("statusStr", "前置网查结果",''),
		GetProperty("applyAuditStatusStr", "网查复核状态",''),
		textArea("reason", "请输入复核原因（必填），500字以内", 500, true, '',"TextItem2"),
		GetProperty("auditRemark", "网查审核备注",''),
		GetProperty("auditEffectiveTime", "复核申请有效期至",''),
		{...GetButton("ApplyEloanQuery", "申请网查复核", "primary"),EventActionName:'ApplyEntityData',Style:{width:'90%'}}
	]
}

function GetProperty(name, label,Value) {
	return { Name: name, Label: label ,Value, Type:'Description'};
}


function textArea(Name, PlaceHolder, MaxLength, IsNullable, Extra, ClassName) {
	return { Name, Type: "TextBox", ControlType:"TextArea", PlaceHolder, MaxLength, IsNullable, Extra, ClassName }
}


