import BaseIndex from "../baseIndex";
import Expand from "./expand";

export default class EntityEdit extends BaseIndex {
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

    getEntityData(id, actionType, data) {
        const { primaryKey, expandMethods } = data.entity;
        const method = expandMethods && expandMethods.getEntityData ? "/" + expandMethods.getEntityData : "";
        const primaryKeyValue = data.entityData[primaryKey];
        const pathQuery = `${method}(${primaryKeyValue})`;
        this.dvaActions.dispatch(this.serviceName, "getEntityData", { pathQuery, action: this.getAction(id, actionType) });
    }

    saveEntityData(id, actionType, data) {
        const { name, primaryKey, expandMethods } = data.entity;
        const primaryKeyValue = data.oldEntityData && data.oldEntityData[primaryKey] ? data.oldEntityData[primaryKey] : null;

        const serviceName = primaryKeyValue ? "update" : "insert";

        var method = expandMethods && expandMethods.insert ? "/" + expandMethods.insert : "";
        if (primaryKeyValue) method = expandMethods && expandMethods.update ? "/" + expandMethods.update : "";

        var pathQuery = method;
        if (primaryKeyValue) {
            data.entityData[primaryKey] = primaryKeyValue;
            pathQuery = `${method}(${primaryKeyValue})`;
        }

        const payload = { action: this.getAction(id, actionType) };
        payload[name] = data.entityData;
        payload.pathQuery = pathQuery

        this.dvaActions.dispatch(this.serviceName, serviceName, payload);
    }

    deleteEntityData(id, actionType, data) {
        const { entityData, entity } = data;
        const primaryKey = entityData[entity.primaryKey];
        const { RowVersion } = entityData;
        const pathQuery = `/Delete2(${primaryKey})?RowVersion=` + RowVersion;
        this.dvaActions.dispatch(this.serviceName, "delete", { pathQuery, action: this.getAction(id, actionType) });
    }
}
