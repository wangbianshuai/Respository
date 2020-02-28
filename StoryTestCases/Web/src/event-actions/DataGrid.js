import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class DataGrid extends BaseIndex {

    //批量更新行数据列表
    BatchUpdateRowDataList(props, action) {
        if (!action.Parameters) this.InitBatchUpdateRowDataListAction(props, action);
        const { EventActions, Property } = props;

        const { DataGridView, AlertMessage, EntityProperties } = action.Parameters;
        const { DataActionType } = Property;

        var selectDataList = null, selectRowKeys = null;
        if (Property.Params) {
            selectDataList = [Property.Params];
            selectRowKeys = [Property.Params[DataGridView.Entity.PrimaryKey]];
        }
        else {
            selectRowKeys = DataGridView.GetSelectedRowKeys();
            if (selectRowKeys.length === 0 && !Property.IsNoRowsSelected) {
                this.Alert("请选择记录再操作！", EventActions.ShowMessage, AlertMessage)
                return;
            }

            selectDataList = DataGridView.GetSelectDataList();

            if (selectRowKeys.length > 0 && AlertMessage) AlertMessage.SetValue("")
        }

        //设置接收数据行数返回数据
        EventActions.Receives[DataActionType] = (d) => this.ReceiveBatchUpdateRowDataList(d, props, action)

        let entityData = null;
        if (EntityProperties) {
            entityData = this.GetPropertyValues(EntityProperties, EventActions)
        }

        const onOk = () => {
            Property.SetDisabled && Property.SetDisabled(true);

            EventActions.Invoke(DataActionType, { SelectRowKeys: selectRowKeys, Entity: DataGridView.Entity, EntityData: entityData, SelectDataList: selectDataList })
        };

        if (Property.ConfirmTip) EventActions.Confirm(Property.ConfirmTip, onOk);
        else onOk();
    }

    ReceiveBatchUpdateRowDataList(data, props, action) {
        const { AlertMessage, DataGridView } = action.Parameters;
        const { EventActions, Property } = props;

        Property.SetDisabled && Property.SetDisabled(false);

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

    SetDataGridShowColumns(props, action) {
        if (!action.Parameters) this.InitSetDataGridShowColumnsAction(props, action);
        const { EventActions } = props;

        const { DataGridView } = action.Parameters;

        if (!action.Parameters.ColumnsView) action.Parameters.ColumnsView = this.InitColumnsView(DataGridView.Name, DataGridView.Properties);

        const { ColumnsView } = action.Parameters;

        const value = props.DataProperties.map(m => m.Name);
        const allSelect = ColumnsView.Properties[0];
        const colPropertery = ColumnsView.Properties[1];
        if (!colPropertery.SetValue) colPropertery.Value = value;
        else colPropertery.SetValue(value);

        const allSelected = value.length === DataGridView.Properties.length;
        if (!allSelect.SetValue) allSelect.Value = allSelected;
        else allSelect.SetValue(allSelected);

        var colSelected = false, allSelected2 = false;
        const nameList = DataGridView.Properties.map(m => m.Name);
        allSelect.ValueChange = (v) => {
            if (colSelected) { colSelected = false; return; }

            allSelected2 = true;
            colPropertery.SetValue(v ? nameList : []);
        };

        colPropertery.ValueChange = (v) => {
            if (allSelected2) { allSelected2 = false; return; }

            colSelected = true;
            allSelect.SetValue(v.length === nameList.length);
        };

        const onOk = (e, p) => this.SetSelectShowColumns(e, p, props, action);
        this.ShowDialog(action, EventActions, ColumnsView, onOk);
    }

    SetSelectShowColumns(e, p, props, action) {
        const { EventActions } = props;
        const { ColumnsView, DataGridView } = action.Parameters;
        const colPropertery = ColumnsView.Properties[1];
        const value = colPropertery.GetValue();

        if (value.length === 0) { this.Alert("最少需选择一列！", EventActions.Alert); return; }
        DataGridView.SetColumnsVisible2(value);

        action.ModalDialog.SetVisible(false);
    }

    InitSetDataGridShowColumnsAction(props, action) {
        const { EventActions } = props;
        const DataGridView = EventActions.GetComponent(action.DataGridView);

        action.Parameters = { DataGridView }
    }

    InitColumnsView(name, properties) {
        const dataDataSource = properties.map(m => { return { Value: m.Name, Text: m.Label } })
        return {
            Name: name + "ColumnsView",
            Type: "View",
            IsDiv: true,
            ClassName: "DivColumsView",
            Id: Common.CreateGuid(),
            DialogId: Common.CreateGuid(),
            DialogWidth: 500,
            DialogTitle: "自定义显示列",
            DialogStyle: { maxHeight: 500, overflow: "auto" },
            BodyStyle: { padding: "16px 32px", margin: 0 },
            Properties: [{
                Id: Common.CreateGuid(),
                Name: name + "AllSelect",
                Type: "CheckBox",
                CheckedValue: true,
                UnCheckedValue: false,
                Text: "全选",
                Style: { width: "100%", borderTop: "1px solid #e8e8e8", color: "#1890ff", paddingTop: 8, paddingBottom: 10, background: "#fafafa" }
            }, {
                Id: Common.CreateGuid(),
                Name: name + "Columns",
                Type: "CheckBoxGroup",
                IsFlexColumn: true,
                DataSource: dataDataSource
            }]
        }
    }
}