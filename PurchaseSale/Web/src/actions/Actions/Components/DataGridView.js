import BaseIndex from "../../BaseIndex";
import { Common } from "UtilsCommon";

export default class DataGridView extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Components_DataGridView";
        this.MinActionType = 300;
        this.MaxActionType = 399;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { QueryInfo, PageSize, PageIndex, Entity, IsData } = data;

        const entityName = Entity.ViewName || Entity.Name;

        const methodName = Entity.IsGroupByInfo ? Entity.QueryPageUrl || "/Select2" : "";

        var dataUrl = `${entityName}?$query=true&$data=true&pagesize=${PageSize}&pageindex=${PageIndex}`;
        var pageUrl = `${entityName}${methodName}?$query=true&$page=true&pagesize=${PageSize}&pageindex=${PageIndex}`;

        if (Entity.IsGroupByInfo) pageUrl = Common.AddUrlParams(pageUrl, "$groupbyinfo", "true");

        const RequestList = [];

        RequestList.push({ Url: dataUrl, Data: { QueryInfo } });
        if (!IsData) RequestList.push({ Url: pageUrl, Data: { QueryInfo } });

        data.RequestList = RequestList;

        if (data.EntitySearchQuery) {
            data.DataGridViewSearchQuery = actionType;
            this.InvokeAction(id, data.EntitySearchQuery, data);
        }
    }

    SetSearchQuery(id, action, data) {
        if (!this.Receives[id]) return false;
        return data;
    }
}