import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import EnumMap from "../EnumMap";

export default class ProductRateConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_ProductRateConfig";
        this.MinActionType = 2300;
        this.MaxActionType = 2399;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { Keyword } } = data;
        const payload = {
            productName: Keyword,
            pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize },
            Action: this.GetAction(id, actionType)
        };

        this.DvaActions.Dispatch("ProductRateService", "GetDataList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "loanProductInterestRateList");
        if (data.DataList) {
            data.DataList.forEach(d => {
                const unit = EnumMap.GetTimeUnit(d.loanPeriodUnit);
                d.loanPeriodName = `${d.loanPeriod}${unit}`;
                d.interestRateName = `${d.interestRate}%`
            });
        }
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id,actionType, data);
        return false;
    }

    DeleteEntityData(id, actionType, data) {
        this.DvaActions.Dispatch("ProductRateService", "Delete", { interestRateId: data.SelectRowKeys[0], Action: this.GetAction(id, actionType) });
    }

}