import BaseIndex from "../../BaseIndex";

export default class DataGridView extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Components_DataGridView";
        this.MinActionType = 200;
        this.MaxActionType = 299;

        this.Init();
    }

    Invoke(id, actionType, data) {
        const { SearchQuery } = this.ActionTypes

        switch (actionType) {
            case SearchQuery: this.SearchQuery(id, actionType, data); break;
            default: this.Dispatch(id, actionType, data); break;
        }
    }

    SearchQuery(id, actionType, data) {
        if (data.EntitySearchQuery) {
            data.DataGridViewSearchQuery = actionType;
            this.InvokeAction(id, data.EntitySearchQuery, data);
        }
    }

}