import * as Common from "../utils/Common"
import Index from "./Index"

export default class Query extends Index {
    constructor(options) {
        super(options)
    }

    PropsChanged(props, nextProps) {

    }

    SearchData() {
        const { PageConfig } = this.Page.props
        const { IsPaging, PageSize, SelectNames } = PageConfig

        let request = {
            IsPage: IsPaging,
            IsRowVersion: true,
            IsDataRight: false,
            IsDataStatus: false,
            PageIndex: this.PageIndex,
            PageSize: PageSize,
            SelectNames: SelectNames,
            Conditions: this.GetConditionList(),
            OrderBys: this.GetOrderByList()
        }

    }

    GetConditionList() {
        return [];
    }

    GetOrderByList() {
        return [];
    }
}