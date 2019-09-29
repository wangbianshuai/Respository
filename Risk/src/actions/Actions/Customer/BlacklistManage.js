import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class BlacklistManage extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Customer_BlacklistManage";
        this.MinActionType = 2400;
        this.MaxActionType = 2499;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { QueryName, QueryName2, Keyword, UserType } } = data;
        const payload = {
            pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize },
            lenderType: UserType,
            Action: this.GetAction(id, actionType)
        };

        const queryName = UserType === "01" ? QueryName : QueryName2;
        payload[queryName] = Keyword;

        this.DvaActions.Dispatch("BlacklistService", "GetDataList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "customerBlackLists");
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id,actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        const blackId = data.SelectRowKeys[0];
        this.DvaActions.Dispatch("BlacklistService", "Delete", { data: { blackId }, Action: this.GetAction(id, actionType) });
    }

}