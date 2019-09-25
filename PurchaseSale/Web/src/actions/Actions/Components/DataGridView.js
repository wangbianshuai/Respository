import BaseIndex from "../../BaseIndex";

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

        const dataUrl = `${Entity.Name}?$query=true&$data=true&pagesize=${PageSize}&pageindex=${PageIndex}`;
        const pageUrl = `${Entity.Name}?$query=true&$page=true&pagesize=${PageSize}&pageindex=${PageIndex}`;

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