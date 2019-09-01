import {AssignProporties, GetButton} from "../Common";

const DataActionTypes = {
	//获取实体数据
	GetEntityData: 1500,
	//保存实体数据
	SaveEntityData: 1599
}

export default {
	Name: "UploadOpenAccountFile",
	Type: "View",
	SaveEntityDataActionType: DataActionTypes.SaveEntityData,
	GetEntityDataActionType: DataActionTypes.GetEntityData,
	Properties: AssignProporties({},GetProperties())
}

function GetProperties() {
	return[
		GetImageProperty("yyzz", "营业执照", 'xxd%2Fuserdetail', false),
		GetImageProperty("khxkz", "开户许可证 ", 'xxd%2Fuserdetail', false),
		GetImageProperty("frsfz", " 法人身份证", '2Fuserdetail', false),
		{ ...GetButton("SubmitButton", "提交", "primary"), EventActionName: "SubmitEntityData" },
	]
}

function GetImageProperty(Name, Label, dirName, IsNullable) {
	return { Name, Label, Type: "UploadImage", dirName, IsNullable ,
		ErrorMessage : `请上传${Label}`,
		BidCode : "COMPANY_AUTHENTICATION",
		ClassName : "step2-upload upload-back upload-file",
		IsRenderControl : true,
		IsImage2 : true,
		IsEdit:true,
		IsUploadOpenAccountFile:true
		
	}
}
