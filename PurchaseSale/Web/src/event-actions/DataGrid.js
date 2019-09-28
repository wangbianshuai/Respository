import BaseIndex from "./BaseIndex";

export default class DataGrid extends BaseIndex {

    //批量更新行数据列表
    BatchUpdateRowDataList(props, action) {
        if (!action.Parameters) this.InitBatchUpdateRowDataListAction(props, action);
        const { EventActions, Property } = props;

        const { DataGridView, AlertMessage, EntityProperties } = action.Parameters;
        const { DataActionType } = Property;

        const selectRowKeys = DataGridView.GetSelectedRowKeys();
        if (selectRowKeys.length === 0 && !Property.IsNoRowsSelected) {
            this.Alert("请选择记录再操作！", EventActions.ShowMessage, AlertMessage)
            return;
        }

        const selectDataList = DataGridView.GetSelectDataList();

        if (selectRowKeys.length > 0 && AlertMessage) AlertMessage.SetValue("")

        //设置接收数据行数返回数据
        EventActions.Receives[DataActionType] = (d) => this.ReceiveBatchUpdateRowDataList(d, props, action)

        let entityData = null;
        if (EntityProperties) {
            entityData = this.GetPropertyValues(EntityProperties, EventActions)
        }

        const onOk = () => {
            Property.SetDisabled(true);

            EventActions.Invoke(DataActionType, { SelectRowKeys: selectRowKeys, Entity: DataGridView.Entity, EntityData: entityData, SelectDataList: selectDataList })
        };

        if (Property.ConfirmTip) EventActions.Confirm(Property.ConfirmTip, onOk);
        else onOk();
    }

    ReceiveBatchUpdateRowDataList(data, props, action) {
        const { AlertMessage, DataGridView } = action.Parameters;
        const { EventActions, Property } = props;

        Property.SetDisabled(false);

        if (this.IsSuccessNextsProps(data, EventActions.Alert, AlertMessage)) {
            this.Alert(Property.SuccessTip, EventActions.ShowMessage, AlertMessage)
            //刷新查询
            DataGridView.Refresh();
        }
        return false;
    }

    InitBatchUpdateRowDataListAction(props, action) {
        const { EventActions } = props;
        const DataGridView = EventActions.GetComponent(action.DataGridView);
        const AlertMessage = EventActions.GetControl(action.AlertMessage);

        let EntityProperties = null;
        if (action.EntityProperties) EntityProperties = action.EntityProperties.map(m => EventActions.GetProperty(m));

        action.Parameters = { DataGridView, AlertMessage, EntityProperties }
    }
}