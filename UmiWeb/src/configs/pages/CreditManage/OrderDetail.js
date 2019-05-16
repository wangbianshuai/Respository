import { AssignProporties, GetButton } from "../Common";
import OrderBaseInfo from "../../views/Order/BaseInfo";
import PersonCardInfo from "../../views/Order/PersonCardInfo";
import PersonBaseInfo from "../../views/Order/PersonBaseInfo";
import CompanyBaseInfo from "../../views/Order/CompanyBaseInfo";
import PersonPropertyInfo from "../../views/Order/PersonPropertyInfo";
import ContactInfo from "../../views/Order/ContactInfo";

const DataActionTypes = {
    //获取实体数据
    GetEntityData: 800
};

export default {
    Name: "OrderDetail",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [OrderBaseInfo, PersonCardInfo, PersonBaseInfo, CompanyBaseInfo, PersonPropertyInfo, ContactInfo, GetAttachmentView(), GetSubmitButtonView()])
}

function GetSubmitButtonView() {
    return {
        Name: "RightButtonView",
        Type: "View",
        ClassName: "DivRightButton2",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SubmitOrderInfo", "提交进件", "primary"), EventActionName: "SubmitOrderInfo", Style: { marginRight: 36, width: 110 } }]
}

function GetAttachmentView() {
    return {
        Name: "AttachmentView",
        Type: "View",
        IsDiv: true,
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({}, [
            { Name: "LeftRemark", Type: "SpanText", ClassName: "SpanLabel", Text: "附件", Label: "(备注：文件查看、上传、下载跳转至影像文件)" },
            { ...GetButton("ToAttachPage", "附件操作", ""), EventActionName: "ToAttachPage", Style: { marginRight: 20 } }
        ])
    }
}

function GetEventActions() {
    return [{
        Name: "AddHouse",
        Type: "DataListView/Add",
        DataListView: "HouseList"
    },
    {
        Name: "DeleteHouse",
        Type: "DataListView/Remove",
        DataListView: "HouseList"
    },
    {
        Name: "AddCar",
        Type: "DataListView/Add",
        DataListView: "CarList"
    },
    {
        Name: "DeleteCar",
        Type: "DataListView/Remove",
        DataListView: "CarList"
    }]
}