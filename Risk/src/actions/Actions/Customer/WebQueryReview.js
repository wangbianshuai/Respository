import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import { Common } from "UtilsCommon";

export default class WebQueryReview extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Customer_WebQueryReview";
        this.MinActionType = 4200;
        this.MaxActionType = 4299;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { QueryName, Keyword } } = data;
        const request = { pageNum: data.PageIndex, pageSize: data.PageSize }
        request[QueryName] = Keyword;
        const payload = {
            data: request,
            Action: this.GetAction(id, actionType)
        };

        this.DvaActions.Dispatch("CreditService", "GetNetCheckList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetApiResponse(data);
        if (data.items) {
            const PageRecord = Common.GetIntValue(data.totalCount);
            const DataList = data.items;
            data = { PageRecord, DataList }
        }
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id, actionType, data);
    }

    Review(id, actionType, data) {
        const { OldEntityData, EntityData } = data;
        const payload = {
            Action: this.GetAction(id, actionType),
            data: {
                id: OldEntityData.id,
                result: EntityData.result,
                remark: EntityData.remark
            }
        };

        if (Common.IsEquals(EntityData.result, "2") && Common.IsNullOrEmpty(EntityData.remark)) {
            this.Dispatch(id, actionType, { IsSuccess: false, Message: "当意见为拒绝时，备注不为空！" })
            return;
        }

        this.DvaActions.Dispatch("CreditService", "NetCheckReview", payload);
    }
}