import BaseIndex from "../../BaseIndex";

export default class DataGridView extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Components_DataGridView";
        this.MinActionType = 200;
        this.MaxActionType = 299;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
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