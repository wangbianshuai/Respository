import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import { Common } from "UtilsCommon";

export default class UserManage extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_UserManage";
        this.MinActionType = 2800;
        this.MaxActionType = 2899;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { Keyword } } = data;
        const payload = {
            name: Common.IsNullOrEmpty(Keyword) ? null : Keyword,
            Action: this.GetAction(id, actionType)
        };

        this.DvaActions.Dispatch("UserService", "GetDataList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "userList");
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id, actionType, data);
        return false;
    }
}