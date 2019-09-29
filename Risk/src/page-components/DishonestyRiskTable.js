import RiskResultTable from "./RiskResultTable"

export default class DishonestyRiskTable extends RiskResultTable {
    constructor(props) {
        super(props)

        this.Name = "DishonestyRiskTable";

        this.Init();
    }

    Init() {
        const itemTitle = this.Property.ItemTitle || "核查项目";
        const itemResult = this.Property.ItemResult || "核查结果";
        if (this.Property.IsNoResult) {
            this.Columns = [this.GetColumn(itemTitle, "item"), this.GetColumn("风险等级", "riskLevel")]
        }
        else {
            this.Columns = [this.GetColumn(itemTitle, "item", (value, row, index) => {
                return { children: value, props: { rowSpan: row.rowSpan || 0 } };
            }),
            this.GetColumn(itemResult, "result", (value, row, index) => {
                if (value && value.indexOf("<br>\n") >= 0) return this.SetResult(value);
                return value;
            }),
            this.GetColumn("风险等级", "riskLevel")]
        }
    }
}