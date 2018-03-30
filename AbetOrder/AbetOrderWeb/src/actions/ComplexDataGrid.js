import * as Common from "../utils/Common"
import Index from "./Index"

export default class ComplexDataGrid extends Index {
    constructor(options) {
        super(options)

        this.Name = "ComplexDataGrid";
    }

    PropsChanged(props, nextProps) {

    }

    Add(property) {
        const { PageConfig } = this.Page.props;
        const { ComplexView } = PageConfig

        const data = {};
        data[ComplexView.PrimaryKey] = Common.CreateGuid();
        data.IsAdd = true;
        data.IsDelete = true;
        data.IsEdit = false;
        data.IsRowEdit = true;
        data.IsSave = false;
        data.IsCancel = false;
        data.IsNew = true;

        let dataList = ComplexView.GetDataList().map(m => m);
        dataList.push(data)
        ComplexView.SetDataList(dataList)
    }

    RowDelete(property, params) {
        const { PageConfig } = this.Page.props;
        const { ComplexView } = PageConfig
        const key = ComplexView.PrimaryKey;

        const dataList = ComplexView.GetDataList().filter(f => f[key] !== params[key])
        ComplexView.SetDataList(dataList)
    }

    RowSave(property, params) {
        this.RowUpdate(property, params, false)
    }

    RowAdd(property, params) {
        this.RowUpdate(property, params, true)
    }

    RowUpdate(property, params, blNew) {
        const { PageConfig } = this.Page.props;
        const { ComplexView } = PageConfig
        const key = ComplexView.PrimaryKey;
        const id = params[key]

        const rowProperty = ComplexView.GetRowProperty();
        const row = rowProperty[id]
        const data = {};
        let p = null, v = null, msg = "";
        for (let col in row) {
            p = row[col];
            v = p.GetValue ? p.GetValue() : ""
            if (!p.IsNullable && Common.IsNullOrEmpty(v)) {
                msg = p.Label + "不能为空！"
                break;
            }

            data[p.Name] = v;
        }

        if (!Common.IsNullOrEmpty(msg)) {
            this.Page.ShowMessage(msg);
            return;
        }

        for (let k in data) params[k] = data[k];

        params.IsEdit = true;
        params.IsRowEdit = false;
        if (blNew) {
            params.IsNew = false;
            params.IsAdd = false;
        }
        else {
            params.IsSave = false;
            params.IsCancel = false;
            params.IsDelete = true;
        }

        const dataList = ComplexView.GetDataList().map(m => m);
        ComplexView.SetDataList(dataList)
    }

    RowEdit(property, params) {
        const { PageConfig } = this.Page.props;
        const { ComplexView } = PageConfig

        params.IsAdd = false;
        params.IsEdit = false;
        params.IsRowEdit = true;
        params.IsSave = true;
        params.IsCancel = true;
        params.IsDelete = false;

        const dataList = ComplexView.GetDataList().map(m => m);
        ComplexView.SetDataList(dataList)
    }

    RowCancel(property, params) {
        const { PageConfig } = this.Page.props;
        const { ComplexView } = PageConfig

        params.IsAdd = false;
        params.IsEdit = true;
        params.IsRowEdit = false;
        params.IsSave = false;
        params.IsCancel = false;
        params.IsDelete = true;

        const dataList = ComplexView.GetDataList().map(m => m);
        ComplexView.SetDataList(dataList)
    }
}