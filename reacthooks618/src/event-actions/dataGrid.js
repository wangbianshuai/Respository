import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class DataGrid extends BaseIndex {

    //批量更新行数据列表
    BatchUpdateRowDataList(props, action) {
        if (!action.Parameters) this.InitBatchUpdateRowDataListAction(props, action);
        const { pageAxis, property } = props;

        const { DataGridView, AlertMessage, EntityProperties } = action.Parameters;
        const { DataActionType } = property;

        var selectDataList = null, selectRowKeys = null;
        if (property.Params) {
            selectDataList = [property.Params];
            selectRowKeys = [property.Params[DataGridView.Entity.PrimaryKey]];
        }
        else {
            selectRowKeys = DataGridView.getSelectedRowKeys();
            if (selectRowKeys.length === 0 && !property.isNoRowsSelected) {
                this.Alert("请选择记录再操作！", pageAxis.ShowMessage, AlertMessage)
                return;
            }

            selectDataList = DataGridView.getSelectDataList();

            if (selectRowKeys.length > 0 && AlertMessage) AlertMessage.setValue("")
        }

        //设置接收数据行数返回数据
        pageAxis.Receives[DataActionType] = (d) => this.ReceiveBatchUpdateRowDataList(d, props, action)

        let entityData = null;
        if (EntityProperties) {
            entityData = this.getPropertyValues(EntityProperties, pageAxis)
        }

        const onOk = () => {
            property.setDisabled && property.setDisabled(true);

            pageAxis.Invoke(DataActionType, { SelectRowKeys: selectRowKeys, Entity: DataGridView.Entity, EntityData: entityData, SelectDataList: selectDataList })
        };

        if (property.ConfirmTip) pageAxis.Confirm(property.ConfirmTip, onOk);
        else onOk();
    }

    ReceiveBatchUpdateRowDataList(data, props, action) {
        const { AlertMessage, DataGridView } = action.Parameters;
        const { pageAxis, property } = props;

        property.setDisabled && property.setDisabled(false);

        if (this.isSuccessNextsProps(data, pageAxis.Alert, AlertMessage)) {
            this.Alert(property.SuccessTip, pageAxis.ShowMessage, AlertMessage)
            //刷新查询
            DataGridView.Refresh();
        }
        return false;
    }

    InitBatchUpdateRowDataListAction(props, action) {
        const { pageAxis } = props;
        const DataGridView = pageAxis.getComponent(action.DataGridView);
        const AlertMessage = pageAxis.getControl(action.AlertMessage);

        let EntityProperties = null;
        if (action.EntityProperties) EntityProperties = action.EntityProperties.map(m => pageAxis.getProperty(m));

        action.Parameters = { DataGridView, AlertMessage, EntityProperties }
    }

    setDataGridShowColumns(props, action) {
        if (!action.Parameters) this.InitsetDataGridShowColumnsAction(props, action);
        const { pageAxis } = props;

        const { DataGridView } = action.Parameters;

        if (!action.Parameters.ColumnsView) action.Parameters.ColumnsView = this.InitColumnsView(DataGridView.name, DataGridView.Properties);

        const { ColumnsView } = action.Parameters;

        const value = props.DataProperties.map(m => m.name);
        const allSelect = ColumnsView.Properties[0];
        const colPropertery = ColumnsView.Properties[1];
        if (!colPropertery.setValue) colPropertery.Value = value;
        else colPropertery.setValue(value);

        const allSelected = value.length === DataGridView.Properties.length;
        if (!allSelect.setValue) allSelect.Value = allSelected;
        else allSelect.setValue(allSelected);

        var colSelected = false, allSelected2 = false;
        const nameList = DataGridView.Properties.map(m => m.name);
        allSelect.ValueChange = (v) => {
            if (colSelected) { colSelected = false; return; }

            allSelected2 = true;
            colPropertery.setValue(v ? nameList : []);
        };

        colPropertery.ValueChange = (v) => {
            if (allSelected2) { allSelected2 = false; return; }

            colSelected = true;
            allSelect.setValue(v.length === nameList.length);
        };

        const onOk = (e, p) => this.setSelectShowColumns(e, p, props, action);
        this.ShowDialog(action, pageAxis, ColumnsView, onOk);
    }

    setSelectShowColumns(e, p, props, action) {
        const { pageAxis } = props;
        const { ColumnsView, DataGridView } = action.Parameters;
        const colPropertery = ColumnsView.Properties[1];
        const value = colPropertery.getValue();

        if (value.length === 0) { this.Alert("最少需选择一列！", pageAxis.Alert); return; }
        DataGridView.setColumnsVisible2(value);

        action.ModalDialog.setVisible(false);
    }

    InitsetDataGridShowColumnsAction(props, action) {
        const { pageAxis } = props;
        const DataGridView = pageAxis.getComponent(action.DataGridView);

        action.Parameters = { DataGridView }
    }

    InitColumnsView(name, properties) {
        const dataDataSource = properties.map(m => { return { Value: m.name, text: m.label } })
        return {
            name: name + "ColumnsView",
            type: "view",
            isDiv: true,
            ClassName: "DivColumsView",
            id: Common.createGuid(),
            DialogId: Common.createGuid(),
            DialogWidth: 500,
            DialogTitle: "自定义显示列",
            DialogStyle: { maxHeight: 500, overflow: "auto" },
            BodyStyle: { padding: "16px 32px", margin: 0 },
            Properties: [{
                id: Common.createGuid(),
                name: name + "AllSelect",
                type: "CheckBox",
                CheckedValue: true,
                UnCheckedValue: false,
                text: "全选",
                style: { width: "100%", borderTop: "1px solid #e8e8e8", color: "#1890ff", paddingTop: 8, paddingBottom: 10, background: "#fafafa" }
            }, {
                id: Common.createGuid(),
                name: name + "Columns",
                type: "CheckBoxGroup",
                isFlexColumn: true,
                DataSource: dataDataSource
            }]
        }
    }
}