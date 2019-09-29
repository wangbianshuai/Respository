import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import EnumMap from "../EnumMap";
import { Common } from "UtilsCommon";

export default class RoleManage extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_RoleManage";
        this.MinActionType = 2700;
        this.MaxActionType = 2799;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { Keyword, Status } } = data;
        const payload = {
            pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize },
            status: Status === "null" ? null : Status,
            roleName: Common.IsNullOrEmpty(Keyword) ? null : Keyword,
            Action: this.GetAction(id, actionType)
        };

        this.DvaActions.Dispatch("RoleService", "GetDataList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "roleList");
        if (data.DataList) {
            data.DataList.forEach(d => {
                d.deleteStateName = EnumMap.GetRoleStatusName(d.deleteState);
                d.IsCheckedDisabled = d.deleteState === "01";
            });
        }
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id,actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        this.DvaActions.Dispatch("RoleService", "Delete", { roleId: primaryKey, Action: this.GetAction(id, actionType) });
    }

}