import RiskResultTable from "./RiskResultTable"

export default class MultiRiskTable extends RiskResultTable {
    constructor(props) {
        super(props)

        this.Name = "MultiRiskTable";

        this.Init();
    }

    Init() {
        this.Columns = [this.GetColumn("核查项目", "item", (value, row, index) => {
            return { children: value, props: { rowSpan: row.rowSpan || 0 } };
        })];
        if (this.Property.IsContentBefore) {
            this.Columns.push(this.GetContentColumn());
            this.Columns.push(this.GetResultColumn());
        }
        else {
            this.Columns.push(this.GetResultColumn());
            this.Columns.push(this.GetContentColumn());
        }

        this.Columns.push(this.GetColumn("风险等级", "riskLevel"));
    }

    GetResultColumn() {
        return this.GetColumn("核查结果", "result", (value, row, index) => {
            return this.SetResult(value);
        });
    }

    GetContentColumn() {
        return this.GetColumn("结果明细", "content", (value, row, index) => {
            return this.SetResult(value);
        });
    }
}