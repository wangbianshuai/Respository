import BaseIndex from "../../BaseIndex";

export default class EnittyEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        const { PrimaryKey } = data.Entity;
        const primaryKey = data.EntityData[PrimaryKey];
        const pathQuery = `(${primaryKey})`;
        this.DvaActions.Dispatch(this.ServiceName, "GetEntityData", { PathQuery: pathQuery, Action: this.GetAction(id, actionType) });
    }

    SaveEntityData(id, actionType, data) {
        const { EntityName, PrimaryKey } = data.Entity;
        const primaryKey = data.OldEntityData && data.OldEntityData[PrimaryKey] ? data.OldEntityData[PrimaryKey] : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        var pathQuery = "";
        if (primaryKey) {
            data.EntityData[PrimaryKey] = primaryKey;
            pathQuery = `(${primaryKey})`;
        }

        const payload = { Action: this.GetAction(id, actionType) };
        payload[EntityName] = data.EntityData;
        payload.PathQuery = pathQuery

        this.DvaActions.Dispatch("ApplicationService", serviceName, payload);
    }
}