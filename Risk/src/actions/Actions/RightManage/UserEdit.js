import BaseIndex from "../../BaseIndex";

export default class UserEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_UserEdit";
        this.MinActionType = 3900;
        this.MaxActionType = 3999;

        this.Init();
    }

    SaveEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("UserService", "Insert", { data: data.EntityData, Action: this.GetAction(id, actionType) });
    }
}