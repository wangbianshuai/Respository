import BaseIndex from "./BaseIndex";

export default class DataGrid extends BaseIndex {

    //批量更新行数据列表
    BatchUpdateRowDataList(props, action) {
        if (!action.Parameters) this.InitBatchUpdateRowDataListAction(props, action);
        const { EventActions, Property } = props;

        const { DataGridView, AlertMessage } = action.Parameters;
        const { DataActionType } = Property;

        const selectRowKeys = DataGridView.GetSelectedRowKeys();
        if (selectRowKeys.length === 0 && !Property.IsNoRowsSelected) {
            if (AlertMessage) AlertMessage.SetValue("请先选择数据行！")
            return;
        }

        //设置接收数据行数返回数据
        if (!EventActions.Receives[DataActionType]) {
            EventActions.Receives[DataActionType] = (d) => this.ReceiveBatchUpdateRowDataList(d, props, action)
        }

        const onOk = () => {
            Property.SetDisabled(true);

            EventActions.Invoke(DataActionType, { SelectRowKeys: selectRowKeys })
        };

        if (Property.ConfirmTip) EventActions.Confirm(Property.ConfirmTip, onOk);
        else onOk();
    }

    ReceiveBatchUpdateRowDataList(data, props, action) {
        const { AlertMessage, DataGridView } = action.Parameters;
        const { EventActions, Property } = props;

        Property.SetDisabled(false);

        if (this.IsSuccessNextsProps(data, EventActions.Alert, AlertMessage)) {
            AlertMessage.SetValue(Property.SuccessTip);
            //刷新查询
            DataGridView.Refresh();
        }
        return false;
    }

    InitBatchUpdateRowDataListAction(props, action) {
        const { EventActions } = props;
        const DataGridView = EventActions.GetComponent(action.DataGridView);
        const AlertMessage = EventActions.GetControl(action.AlertMessage);

        action.Parameters = { DataGridView, AlertMessage }
    }
}