import BaseIndex from "../../BaseIndex";
import Common2 from "../Common2";
import { Common } from "UtilsCommon";
import EnumMap from "../EnumMap";

export default class LoanReviewCommittee extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_LoanReviewCommittee";
        this.MinActionType = 1800;
        this.MaxActionType = 1899;

        this.Init();
    }

    //获取实体数据
    GetOrderInfoEntityData(id, actionType, data) {
        Common2.GetOrderInfoEntityData.call(this, id, actionType, data);
    }

    SetGetOrderInfoEntityData(id, actionType, data) {
        return Common2.SetGetOrderInfoEntityData.call(this, id, actionType, data);
    }

    //获取审核意见明细
    GetApprovalOpinionDetails(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetApprovalOpinionDetails", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SetGetApprovalOpinionDetails(id, actionType, data) {
        data = this.SetApiResponse(data);

        data.OpinionText = "贷审会结论：" + EnumMap.GetApprovalReusltName(data.result)

        if (Common.IsArray(data.approvalResultList)) {
            data.approvalResultList.forEach((d, i) => {
                d.Id = Common.CreateGuid();
                d.Title = "参会人员" + Common2.GetLenName(i);

                if (d.approvalResult) {
                    for (var key in d.approvalResult) d[key] = d.approvalResult[key];
                    delete d.approvalResult;
                }

                d.resultName = EnumMap.GetApprovalReusltName(d.result)
            });

            return { RecordList: data.approvalResultList, OpinionText: data.OpinionText }
        }

        return data;
    }

    //获取审核意见
    GetApprovalOpinion(id, actionType, data) {
        this.DvaActions.Dispatch("ApprovalService", "GetCommitteeApprovalOpinion", { ...data.EntityData, Action: this.GetAction(id, actionType) });
    }

    SetGetApprovalOpinion(id, actionType, data) {
        const userId = Common.GetStorage("LoginUserId");
        data = this.SetApiResponse(data);

        if (Common.IsArray(data.approvalResultList)) {
            const result = Common.ArrayFirst(data.approvalResultList, f => Common.IsEquals(f.approvalUserId, userId));

            if (result != null) {
                if (result.approvalResult) {
                    for (var key in result.approvalResult) result[key] = result.approvalResult[key];
                    delete result.approvalResult;
                }
                result.result2 = result.result;
                return result;
            }
        }

        return data;
    }


    //保存审核意见
    SaveApprovalOpinion(id, actionType, data) {
        const { EntityData, PageData } = data;
        if (EntityData.result2) {
            EntityData.result = EntityData.result2;
            delete EntityData.result2;
        }
        const payload = {
            approvalResult: EntityData,
            loanApplyId: PageData.OrderCode,
            taskId: PageData.TaskId,
            Action: this.GetAction(id, actionType)
        };
        this.DvaActions.Dispatch("ApprovalService", "SaveCommitteeApprovalOpinion", payload);
    }

    GetOrderStatus(id, actionType, data) {
        Common2.GetOrderStatus.call(this, id, actionType, data);
    }

    SetGetOrderStatus(id, actionType, data) {
        return Common2.SetGetOrderStatus.call(this, id, actionType, data);
    }
}