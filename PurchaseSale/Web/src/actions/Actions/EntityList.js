import BaseIndex from "../BaseIndex";
import DataGriViewActionType from "../ActionTypes/Components/DataGridView";
import Expand from "./Expand"

export default class EntityList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Init();

        this.InitExpand();
    }

    InitExpand() {
        if (Expand[this.Name]) {
            const expand = Expand[this.Name]
            for (var key in expand) this[key] = expand[key];
        }
    }

    SearchQuery(id, actionType, data) {
        const { RequestList } = data;

        const payload = { Action: this.GetAction(id, actionType, false) };
        payload.Action.DataName = data.EntityName;

        payload.RequestList = RequestList;

        this.DvaActions.Dispatch(this.ServiceName, "SearchQuery", payload);
    }

    SetSearchQuery(id, actionType, data) {
        const dataName = data.Action ? data.Action.DataName : "";
        data = this.SetSearchQueryResponse(data, dataName);
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id, actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        const { RowVersion } = data.SelectDataList[0];
        const pathQuery = `/Delete2(${primaryKey})?RowVersion=` + RowVersion;
        this.DvaActions.Dispatch(this.ServiceName, "Delete", { PathQuery: pathQuery, Action: this.GetAction(id, actionType) });
    }

    ExcelExport(id, actionType, data) {
        data.Action = this.GetAction(id, actionType, false);
        data.Action.DataGridViewExcelExport = data.DataGridViewExcelExport;

        delete data.DataGridViewExcelExport;

        this.DvaActions.Dispatch(this.ServiceName, "ExcelExport", data);
    }

    SetExcelExport(id, actionType, data) {
        actionType = data.Action.DataGridViewExcelExport;
        this.DispatchAction(id, actionType, data);
        return false;
    }
}