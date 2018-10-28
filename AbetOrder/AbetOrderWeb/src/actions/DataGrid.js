import * as Common from "../utils/Common"
import Index from "./Index"

export default class DataGrid extends Index {
    constructor(options) {
        super(options)

        this.Name = "DataGrid";
    }

    PropsChanged(props, nextProps) {
        //批量更新
        this.ReceiveBatchUpdateStatusInfo(props, nextProps);
    }

    ReceiveBatchUpdateStatusInfo(props, nextProps) {
        if (this.Page.JudgeChanged(nextProps, "BatchUpdateStatusInfo")) {
            if (nextProps.BatchUpdateStatusInfo && nextProps.BatchUpdateStatusInfo.Succeed) {
                //刷新查询
                this.Page.EventActions.Query.Refresh("Update");
            }

            this.SetPropertyDisabled(this.UpdateProperty, false);
        }
    }

    SetPropertyDisabled(property, disabled) {
        property.SetDisabled && property.SetDisabled(disabled);
    }

    BatchUpdateStatus(property, params) {
        this.UpdateProperty = property;

        const selectedRowKeys = this.GetSelectedRowKeys();
        const dataList = this.GetDataList();

        if (selectedRowKeys.length === 0) { this.Page.ShowMessage("请先选择数据行！"); return; }

        const { PageConfig } = this.Page.props;

        const selectDataList = [];

        let d = null;
        selectedRowKeys.forEach(m => {
            d = Common.ArrayFirst(dataList, (f) => f[PageConfig.PrimaryKey] === m && this.JudgeStatusValue(f[property.StatusName], property))
            if (d !== null) selectDataList.push(d);
        });

        if (selectDataList.length === 0) { this.Page.ShowMessage(property.UnSelectMessage); return; }

        this.Page.ShowConfirm(property.ConfirmMessage, () => {
            const list = selectDataList.map(m => {
                d = {}
                d[PageConfig.PrimaryKey] = m[PageConfig.PrimaryKey];
                d[property.StatusName] = property.StatusValue;
                d.RowVersion = m.RowVersion;
                return d;
            });

            const action = this.Page.GetAction(property.ActionName);
            if (!action) return;

            const data = {};
            data[PageConfig.EntityName] = list;

            property.SetDisabled(true);

            this.Page.SetActionState(action);
            this.Page.Dispatch(action, data);
        });
    }

    JudgeStatusValue(statusValue, property) {
        if (property.OldStatusValue !== undefined) return statusValue === property.OldStatusValue;

        if (property.OldStatusValues) return Common.ArrayFirst(property.OldStatusValues, (f) => f === statusValue) !== null;

        return false;
    }

}