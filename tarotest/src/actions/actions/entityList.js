import BaseIndex from "../baseIndex";
import DataGriViewActionType from "../actionTypes/components/dataGridView";
import Expand from "./expand"

export default class EntityList extends BaseIndex {
    constructor(props) {
        super(props);

        this.init();

        this.initExpand();
    }

    initExpand() {
        if (Expand[this.name]) {
            const expand = Expand[this.name]
            for (var key in expand) this[key] = expand[key];
        }
    }

    searchQuery(id, actionType, data) {
        const { requestList } = data;

        const payload = { action: this.getAction(id, actionType, false) };
        payload.action.dataName = data.entityName;

        payload.requestList = requestList;

        this.dvaActions.dispatch(this.serviceName, "searchQuery", payload);
    }

    setsearchQuery(id, actionType, data) {
        const dataName = data.action ? data.action.dataName : "";
        data = this.setsearchQueryResponse(data, dataName);
        actionType = DataGriViewActionType.searchQuery;
        this.dispatchAction(id, actionType, data);
        return false;
    }

    deleteEntityData(id, actionType, data) {
        const { entityData, entity } = data;
        const primaryKey = entityData[entity.primaryKey];
        const { RowVersion } = entityData;
        const pathQuery = `/Delete2(${primaryKey})?RowVersion=` + RowVersion;
        this.dvaActions.dispatch(this.serviceName, "delete", { pathQuery, action: this.getAction(id, actionType) });
    }

    excelExport(id, actionType, data) {
        data.action = this.GetAction(id, actionType, false);
        data.action.dataGridViewExcelExport = data.dataGridViewExcelExport;

        delete data.dataGridViewExcelExport;

        this.dvaActions.dispatch(this.serviceName, "excelExport", data);
    }

    setexcelExport(id, actionType, data) {
        actionType = data.action.dataGridViewExcelExport;
        this.dispatchAction(id, actionType, data);
        return false;
    }
}
