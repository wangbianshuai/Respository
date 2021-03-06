import BaseIndex from '../baseIndex';
import DataGriViewActionType from '../actionTypes/components/dataGridView';
import Expand from './expand'

export default class EntityList extends BaseIndex {
    constructor(props) {
        super(props);

        this.init();

        this.initexpand();
    }

    initexpand() {
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

        this.dvaActions.dispatch(this.serviceName, 'searchQuery', payload);
    }

    setsearchQuery(id, actionType, data) {
        const dataName = data.action ? data.action.dataName : '';
        data = this.setSearchQueryResponse(data, dataName);
        actionType = DataGriViewActionType.searchQuery;
        this.dispatchAction(id, actionType, data);
        return false;
    }

    deleteEntityData(id, actionType, data) {
        const primaryKey = data.selectRowKeys[0];
        const { RowVersion } = data.selectDataList[0];
        const pathQuery = `/Delete2(${primaryKey})?RowVersion=${RowVersion}`;
        this.dvaActions.dispatch(this.serviceName, 'delete', { pathQuery, action: this.getAction(id, actionType) });
    }

    excelExport(id, actionType, data) {
        data.action = this.getAction(id, actionType, false);
        data.action.dataGridViewExcelExport = data.dataGridViewExcelExport;

        delete data.dataGridViewExcelExport;

        this.dvaActions.dispatch(this.serviceName, 'excelExport', data);
    }

    setexcelExport(id, actionType, data) {
        actionType = data.action.dataGridViewExcelExport;
        this.dispatchAction(id, actionType, data);
        return false;
    }
}
