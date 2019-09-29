import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";

export default class OrderDetail extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CreditManage_OrderDetail";
        this.MinActionType = 800;
        this.MaxActionType = 899;

        this.Init();
    }

    GetOrderDetailEntityData(id, actionType, data) {
        Common2.GetOrderDetailEntityData.call(this, id, actionType, data);
    }

    SetGetOrderDetailEntityData(id, actionType, data) {
        return Common2.SetGetOrderDetailEntityData.call(this, id, actionType, data);
    }

    SaveOrderDetailEntityData(id, actionType, data) {
        const { EntityData, PageData } = data;
        const payload = { Action: this.GetAction(id, actionType), loanApplyId: PageData.OrderCode };

        var type = "";
        //type (string, optional): 进件信息类型(01:借款基本信息,02:个人证件,03:个人基本信息,04:企业信息,05:个人资产,06:联系人) 
        if (EntityData.ViewName === "PersonPropertyInfo") {
            payload.data = {
                carPropertyList: EntityData.CarList,
                realEstateList: EntityData.HouseList
            }
            type = "05"
        }
        else if (EntityData.ViewName === "ContactInfo") {
            type = "06";
            payload.data = { contactList: this.GetContactList(EntityData) };
        }
        else {
            const editData = { ...data.OldEntityData };
            for (let key in EntityData) { if (key !== "ViewName") editData[key] = EntityData[key]; }

            switch (EntityData.ViewName) {
                case "loanApplyBaseInfo": { type = "01"; this.SetLoanApplyBaseInfo(editData); break; }
                case "personalIdentity": { type = "02"; break; }
                case "personalBase": { type = "03"; break; }
                case "enterprise": { type = "04"; break; }
                default: break;
            }

            const editData2 = {}
            editData2[EntityData.ViewName] = editData;
            payload.data = editData2;
        }

        payload.type = type;

        this.DvaActions.Dispatch("OrderService", "SaveOrderDetailEntityData", payload);
    }

    GetContactList(data) {
        const list = [];

        list.push({
            contactName: data.kinsfolkContactName,
            contactPhone: data.kinsfolkContactMobile,
            relationship: data.kinsfolkContactRelation,
            address: data.kinsfolkContactAddr,
            category: "01"
        });

        list.push({
            contactName: data.companyContactName,
            contactPhone: data.companyContactMobile,
            relationship: data.companyContactRelation,
            address: data.companyContactAddr,
            category: "02"
        });

        list.push({
            contactName: data.urgencyContactName,
            contactPhone: data.urgencyContactMobile,
            relationship: data.urgencyContactRelation,
            address: data.urgencyContactAddr,
            category: "03"
        });

        return list;
    }

    SetLoanApplyBaseInfo(editData) {
        const { lenderProvinceCity } = editData;
        if (lenderProvinceCity && lenderProvinceCity.length > 0) editData.lenderProvincecode = lenderProvinceCity[0];
        if (lenderProvinceCity && lenderProvinceCity.length > 2) editData.lenderCitycode = lenderProvinceCity[1];
        if (lenderProvinceCity && lenderProvinceCity.length > 2) editData.lenderProvincename = lenderProvinceCity[2];
        if (lenderProvinceCity && lenderProvinceCity.length > 3) editData.lenderCityname = lenderProvinceCity[3];
    }

    SubmitOrderInfo(id, actionType, data) {
        const { EntityData, PageData } = data;
        const payload = {
            Action: this.GetAction(id, actionType),
            ...EntityData,
            loanApplyId: PageData.OrderCode
        };

        this.DvaActions.Dispatch("OrderService", "SubmitOrderInfo", payload);
    }

    GetOrderStatus(id, actionType, data) {
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }

    SetGetOrderStatus(id, actionType, data) {
        return Common2.SetGetOrderStatus.call(this, id, actionType, data);
    }
}