import BaseIndex from "../baseIndex";
import Expand from "./expand";

export default class EntityEdit extends BaseIndex {
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

    getEntityData(id, actionType, data) {
        const { primaryKey, params } = data.entity;
        const primaryKeyValue = data.entityData[primaryKey];
        const payload = { action: this.getAction(id, actionType) };
        payload[primaryKey] = primaryKeyValue;

        if (params) for (var key in params) payload[key] = params[key];

        this.dvaActions.dispatch(this.serviceName, "getEntityData", payload);
    }

    saveEntityData(id, actionType, data) {
        const { primaryKey, dataPrimaryKey } = data.entity;
        const { entityData } = data;

        let primaryKeyValue = data.oldEntityData && data.oldEntityData[primaryKey] ? data.oldEntityData[primaryKey] : null;
        if (primaryKeyValue) entityData[primaryKey] = primaryKeyValue;

        if (!primaryKeyValue) {
            primaryKeyValue = data.oldEntityData && data.oldEntityData[dataPrimaryKey] ? data.oldEntityData[dataPrimaryKey] : null;
            if (primaryKeyValue) entityData[dataPrimaryKey] = primaryKeyValue;
        }

        const payload = { action: this.getAction(id, actionType), ...entityData };

        this.dvaActions.dispatch(this.serviceName, "saveEntityData", payload);
    }

    deleteEntityData(id, actionType, data) {
        const { primaryKey } = data.entity;

        const entityData = {};
        entityData[primaryKey] = data.entityData[primaryKey]

        const payload = { action: this.getAction(id, actionType), ...entityData };

        this.dvaActions.dispatch(this.serviceName, "deleteEntityData", payload);
    }
}
