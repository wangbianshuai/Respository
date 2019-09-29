import BaseIndex from "../../BaseIndex";
import DataGriViewActionType from "../../ActionTypes/Components/DataGridView";
import EnumMap from "../EnumMap";

export default class ProductConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_ProductConfig";
        this.MinActionType = 2200;
        this.MaxActionType = 2299;

        this.Init();
    }

    SearchQuery(id, actionType, data) {
        const { ConditionList: { Keyword } } = data;
        const payload = {
            productName: Keyword,
            pageRequest: { pageNum: data.PageIndex, pageSize: data.PageSize },
            Action: this.GetAction(id, actionType)
        };

        this.DvaActions.Dispatch("ProductService", "GetDataList", payload);
    }

    SetSearchQuery(id, actionType, data) {
        data = this.SetSearchQueryResponse(data, "loanProductList");
        if (data.DataList) {
            data.DataList.forEach(d => {
                d.minMaxLoanAmount = `${d.minLoanAmount}~${d.maxLoanAmount}`;
                d.productCategoryName = EnumMap.GetProductCategoryName(d.productCategory)
                if (d.repaymentWay) d.repaymentWayName = d.repaymentWay.map(m => EnumMap.GetReplaymentWayName(m)).join("、");
            });
        }
        actionType = DataGriViewActionType.SearchQuery;
        this.DispatchAction(id,actionType, data);
        return false;
    }
}