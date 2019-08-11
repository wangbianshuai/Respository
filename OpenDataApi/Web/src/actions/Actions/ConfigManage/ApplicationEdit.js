import BaseIndex from "../../BaseIndex";

export default class ApplicationEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "ConfigManage_ApplicationEdit";
        this.MinActionType = 3500;
        this.MaxActionType = 3599;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
         
    }

    SaveEntityData(id, actionType, data) {
        const primaryKey = data.OldEntityData && data.OldEntityData.Application_Id ? data.OldEntityData.Application_Id : null;

        const serviceName = primaryKey ? "Update" : "Insert";

        if (primaryKey) data.EntityData.Application_Id = primaryKey;

        this.DvaActions.Dispatch("ApplicationService", serviceName, { data: data.EntityData, Action: this.GetAction(id, actionType) });
    }
}