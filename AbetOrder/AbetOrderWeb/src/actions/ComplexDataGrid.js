import * as Common from "../utils/Common"
import Index from "./Index"

export default class ComplexDataGrid extends Index {
    constructor(options) {
        super(options)

        this.Name = "ComplexDataGrid";
    }

    PropsChanged(props, nextProps) {

    }

    Add(property, params, view) {
        const data = {};
        data[view.PrimaryKey] = Common.CreateGuid();
        data.IsAdd = true;
        data.IsDelete = true;
        data.IsEdit = false;
        data.IsRowEdit = true;
        data.IsSave = false;
        data.IsCancel = false;
        data.IsNew = true;

        let dataList = view.GetDataList().map(m => m);
        dataList.push(data)
        view.SetDataList(dataList)
    }

    RowDelete(property, params, view) {
        const key = view.PrimaryKey;

        const dataList = view.GetDataList().filter(f => f[key] !== params[key])
        view.SetDataList(dataList)
    }

    RowSave(property, params, view) {
        this.RowUpdate(property, params, false, view)
    }

    RowAdd(property, params, view) {
        this.RowUpdate(property, params, true, view)
    }

    RowUpdate(property, params, blNew, view) {
        const key = view.PrimaryKey;
        const id = params[key]

        const rowProperty = view.GetRowProperty();
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

        const dataList = view.GetDataList().map(m => m);
        view.SetDataList(dataList)
    }

    RowEdit(property, params, view) {
        params.IsAdd = false;
        params.IsEdit = false;
        params.IsRowEdit = true;
        params.IsSave = true;
        params.IsCancel = true;
        params.IsDelete = false;

        const dataList = view.GetDataList().map(m => m);
        view.SetDataList(dataList)
    }

    RowCancel(property, params, view) {
        params.IsAdd = false;
        params.IsEdit = true;
        params.IsRowEdit = false;
        params.IsSave = false;
        params.IsCancel = false;
        params.IsDelete = true;

        const dataList = view.GetDataList().map(m => m);
        view.SetDataList(dataList)
    }
}