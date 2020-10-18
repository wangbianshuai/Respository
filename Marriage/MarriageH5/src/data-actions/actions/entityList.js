import BaseIndex from '../baseIndex';
import DataGriViewActionType from '../actionTypes/components/dataGridView';
import Expand from './expand'
import { Common } from '../../utils-common';

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
        const payload = { action: this.getAction(id, actionType, false) };
        const { pageSize, pageIndex, actionName } = data;
        const formData = Common.clone(data.formData)
        const { WhereFields } = data.queryInfo
        if (formData) {
            formData.Param.PageSize = pageSize;
            formData.Param.PageNumber = pageIndex;
            const hasValues = WhereFields.filter(f => !Common.isNullOrEmpty(f.Value));
            hasValues.forEach(w => formData.Param[w.Name] = w.Value);

            payload.formData = {
                Param: JSON.stringify(formData.Param),
                Act: formData.Act
            };
        }

        this.dvaActions.dispatch(this.serviceName, actionName || 'searchQuery', payload);
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
}
