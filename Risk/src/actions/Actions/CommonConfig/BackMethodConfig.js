import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import EnumMap from "../EnumMap";

export default class BackMethodConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_BackMethodConfig";
        this.MinActionType = 2000;
        this.MaxActionType = 2099;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const payload = {
            pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize },
            Action: this.GetAction(id, actionType)
        };

        this.DvaActions.Dispatch("BackMethodService", "GetDataList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "repayWayList");
        if (data.DataList) {
            data.DataList.forEach(d => {
                const unit = EnumMap.GetTimeUnit(d.periodWayUnit);
                d.periodWayName = `${d.periodWay}${unit}`;
                d.repaymentWayName = EnumMap.GetReplaymentWayName(d.repaymentWay);
                d.annualCalcWayName = EnumMap.GetAnnualCalcWayName(d.annualCalcWay);
            });
        }
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id,actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("BackMethodService", "Delete", { repaymentConfigId: data.SelectRowKeys[0], Action: this.GetAction(id, actionType) });
    }
}