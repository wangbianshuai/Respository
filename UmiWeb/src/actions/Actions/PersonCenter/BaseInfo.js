import BaseIndex from "../../BaseIndex";

export default class BaseInfo extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "PersonCenter_BaseInfo";
        this.MinActionType = 2600;
        this.MaxActionType = 2699;

        this.Init();
    }

    GetEntityData(id, actionType, data) {
        this.Dispatch(id, actionType, data.EntityData);
    }
}