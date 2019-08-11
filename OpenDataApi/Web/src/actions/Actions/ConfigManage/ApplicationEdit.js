import BaseIndex from "../../BaseIndex";

export default class ApplicationEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "ConfigManage_ApplicationEdit";
        this.MinActionType = 200;
        this.MaxActionType = 299;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
         
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.Application_Id ? data.OldEntityData.Application_Id : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.Application_Id = primaryKey;

        this.DvaActions.Dispatch("ApplicationService", serviceName, { Application: data.EntityData, Action: this.GetAction(id, actionType) });
    }
}