import BaseIndex from "../BaseIndex";
import Expand from "./Expand";

export default class EntityEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Init();

        this.InitExpand();
    }

    InitExpand() {
        if (Expand[this.Name]) {
            const expand = Expand[this.Name]
            for (var key in expand) this[key] = expand[key];
        }
    }

    GetEntityData(id, actionType, data) {
        const { PrimaryKey, ExpandMethods } = data.Entity;
        const method = ExpandMethods && ExpandMethods.GetEntityData ? "/" + ExpandMethods.GetEntityData : "";
        const primaryKey = data.EntityData[PrimaryKey];
        const pathQuery = `${method}(${primaryKey})`;
        this.DvaActions.Dispatch(this.ServiceName, "GetEntityData", { PathQuery: pathQuery, Action: this.GetAction(id, actionType) });
    }

    SaveEntityData(id, actionType, data) {
        const { Name, PrimaryKey, ExpandMethods } = data.Entity;
        const primaryKey = data.OldEntityData && data.OldEntityData[PrimaryKey] ? data.OldEntityData[PrimaryKey] : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        var method = ExpandMethods && ExpandMethods.Insert ? "/" + ExpandMethods.Insert : "";
        if (primaryKey) method = ExpandMethods && ExpandMethods.Update ? "/" + ExpandMethods.Update : "";

        var pathQuery = "";
        if (primaryKey) {
            data.EntityData[PrimaryKey] = primaryKey;
            pathQuery = `${method}(${primaryKey})`;
        }

        const payload = { Action: this.GetAction(id, actionType) };
        payload[Name] = data.EntityData;
        payload.PathQuery = pathQuery

        this.DvaActions.Dispatch(this.ServiceName, serviceName, payload);
    }
}