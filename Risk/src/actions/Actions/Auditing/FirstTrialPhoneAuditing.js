import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";
import EnumMap from "../EnumMap";

export default class FirstTrialPhoneAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_FirstTrialPhoneAuditing";
        this.MinActionType = 1600;
        this.MaxActionType = 1699;

        this.Init();
    }

    //获取实体数据
    GetOrderInfoEntityData(id, actionType, data) {
        Common2.GetOrderInfoEntityData.call(this, id, actionType, data);
    }

    SetGetOrderInfoEntityData(id, actionType, data) {
        return Common2.SetGetOrderInfoEntityData.call(this, id, actionType, data);
    }

    //获取公司联系人核实
    //电核联系人类型	01	单位02	亲属03	同事04	本人
    GetCompanyContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "GetCompanyContactCheck", { checkContactType: "01", ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SetGetCompanyContactCheck(id, actionType, data) {
        return this.SetContactCheckResponse(id, actionType, data);
    }

    //保存公司联系人核实
    SaveCompanyContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "SaveCompanyContactCheck", this.SetSaveContactCheckRequest(id, actionType, data, "01"));
    }

    //获取亲属联系人核实
    GetKinsfolkContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "GetKinsfolkContactCheck", { checkContactType: "02", ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SetGetKinsfolkContactCheck(id, actionType, data) {
        return this.SetContactCheckResponse(id, actionType, data, "02");
    }

    //保存亲属联系人核实
    SaveKinsfolkContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "SaveKinsfolkContactCheck", this.SetSaveContactCheckRequest(id, actionType, data, "02"));
    }

    //获取本人核实
    GetOwnerContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "GetOwnerContactCheck", { checkContactType: "04", ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SetGetOwnerContactCheck(id, actionType, data) {
        return this.SetContactCheckResponse(id, actionType, data);
    }

    //保存本人核实
    SaveOwnerContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "SaveOwnerContactCheck", this.SetSaveContactCheckRequest(id, actionType, data, "04"));
    }

    //获取同事联系核实
    GetWorkmateContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "GetWorkmateContactCheck", { checkContactType: "03", ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SetGetWorkmateContactCheck(id, actionType, data) {
        return this.SetContactCheckResponse(id, actionType, data, "03");
    }

    //保存同事联系核实
    SaveWorkmateContactCheck(id, actionType, data) {
        this.DvaActions.Dispatch("ContactService", "SaveWorkmateContactCheck", this.SetSaveContactCheckRequest(id, actionType, data, "03"));
    }

    SetSaveContactCheckRequest(id, actionType, data, type) {
        const { EntityData, PageData, OldEntityData } = data;

        const names = ["phoneNumber", "thirdCallTime", "secondCallTime", "firstCallTime"]
        const editData = { checkContactType: type, relationship: OldEntityData.relationship, contactName: OldEntityData.contactName };

        names.forEach(n => editData[n] = EntityData[n]);

        editData.questionlist = []
        for (var key in EntityData) {
            if (names.indexOf(key) < 0) {
                editData.questionlist.push({
                    checkContactType: type,
                    questionDesc: key,
                    questionAnswer: EntityData[key]
                })
            }
        }

        const payload = {
            contactType: type,
            data: editData,
            loanApplyId: PageData.OrderCode,
            Action: this.GetAction(id, actionType)
        };

        return payload;
    }

    SetContactCheckResponse(id, actionType, data, type) {
        data = this.SetApiResponse(data);
        if (type === "03") data.relationshipName = EnumMap.GetCompanyRelationName(data.relationship);
        else if (type === "02") data.relationshipName = EnumMap.GetKinsfolkRelationName(data.relationship);
        if (data.questionlist && data.questionlist.length > 0) {
            data.questionlist.forEach(d => {
                data[d.questionDesc] = d.questionAnswer;
            });
        }

        return data;
    }

    //获取审核意见
    GetApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetFirstTrialPhoneApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    //获取补件退单信息
    SaveApprovalOpinion(id, actionType, data) {
        const { EntityData, PageData } = data;
        const payload = {
            ...EntityData,
            loanApplyId: PageData.OrderCode,
            taskId: PageData.TaskId,
            Action: this.GetAction(id, actionType)
        };
        this.DvaActions.Dispatch("ApprovalService", "SaveFirstTrialPhoneApprovalOpinion", payload);
    }

    //获取补件退单信息
    GetPatchExitOrderInfo(id, actionType, data) {
        Common2.GetPatchExitOrderInfo.call(this, id, actionType, data, "02");
    }

    //获取补件退单信息
    SetGetPatchExitOrderInfo(id, actionType, data) {
        return Common2.SetGetPatchExitOrderInfo.call(this, id, actionType, data)
    }

    GetOrderStatus(id, actionType, data) {
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }

    SetGetOrderStatus(id, actionType, data) {
        return Common2.SetGetOrderStatus.call(this, id, actionType, data);
    }
}