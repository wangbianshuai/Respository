import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import EnumMap from "../EnumMap";

export default class PlatformRateConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_PlatformRateConfig";
        this.MinActionType = 2100;
        this.MaxActionType = 2199;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { RateType } } = data;
        const payload = {
            pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize },
            feeType: RateType,
            Action: this.GetAction(id, actionType)
        };

        this.DvaActions.Dispatch("PlatformRateService", "GetDataList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "loanProductFeeList");
        if (data.DataList) {
            data.DataList.forEach(d => {
                d.chargeStageName = EnumMap.GetCollectionTypeName(d.chargeStage);
                d.chargeWayName = EnumMap.GetCollectionMethodName(d.chargeStage);
                d.feeRateName = `${d.feeRate}%`
            });
        }
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id,actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("PlatformRateService", "Delete", { feeTemplateId: data.SelectRowKeys[0], Action: this.GetAction(id, actionType) });
    }
}