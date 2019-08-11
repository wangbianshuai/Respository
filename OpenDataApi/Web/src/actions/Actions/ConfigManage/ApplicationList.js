import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";

export default class ApplicationList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "ConfigManage_ApplicationList";
        this.MinActionType = 100;
        this.MaxActionType = 199;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { Keyword } } = data;
        const payload = {
            Action: this.GetAction(id, actionType)
        };
        payload.Keyword = Keyword;
        payload.PathQuery = "?$query=true&$data=true"
        payload.QueryInfo = {
            FieldSql: "Application_Id,Name",
            WhereFields: [],
            OrderBySql: "Create_Date desc"
        }

        const RequestList = [];

        RequestList.push({ Url: "", Data: {} });
        RequestList.push({ Url: "", Data: {} });

        payload.RequestList = RequestList;

        this.DvaActions.Dispatch("ApplicationService", "SearchQuery", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "Application");
        actionType = DataGriViewActionType.SearchQuery;
        data = { DataList: data, PageRecord: 0 }
        this.DispatchAction(id, actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        this.DvaActions.Dispatch("ApplicationService", "Delete", { data: { primaryKey }, Action: this.GetAction(id, actionType) });
    }

}