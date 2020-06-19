import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class DataGrid extends BaseIndex {

    //批量更新行数据列表
    BatchUpdateRowDataList(props, action) {
        if (!action.Parameters) this.InitBatchUpdateRowDataListAction(props, action);
        const { pageAxis, property } = props;

        const { dataGridView, AlertMessage, EntityProperties } = action.Parameters;
        const { DataActionType } = property;

        var selectDataList = null, selectRowKeys = null;
        if (property.Params) {
            selectDataList = [property.Params];
            selectRowKeys = [property.Params[dataGridView.entity.primaryKey]];
        }
        else {
            selectRowKeys = dataGridView.getSelectedRowKeys();
            if (selectRowKeys.length === 0 && !property.isNoRowsSelected) {
                this.Alert("请选择记录再操作！", pageAxis.ShowMessage, AlertMessage)
                return;
            }

            selectDataList = dataGridView.getSelectDataList();

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

            pageAxis.Invoke(DataActionType, { SelectRowKeys: selectRowKeys, entity: dataGridView.entity, EntityData: entityData, SelectDataList: selectDataList })
        };

        if (property.ConfirmTip) pageAxis.Confirm(property.ConfirmTip, onOk);
        else onOk();
    }

    ReceiveBatchUpdateRowDataList(data, props, action) {
        const { AlertMessage, dataGridView } = action.Parameters;
        const { pageAxis, property } = props;

        property.setDisabled && property.setDisabled(false);

        if (this.isSuccessNextsProps(data, pageAxis.Alert, AlertMessage)) {
            this.Alert(property.SuccessTip, pageAxis.ShowMessage, AlertMessage)
            //刷新查询
            dataGridView.refresh();
        }
        return false;
    }

    InitBatchUpdateRowDataListAction(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getComponent(action.dataGridView);
        const AlertMessage = pageAxis.getControl(action.AlertMessage);

        let EntityProperties = null;
        if (action.EntityProperties) EntityProperties = action.EntityProperties.map(m => pageAxis.getProperty(m));

        action.Parameters = { dataGridView, AlertMessage, EntityProperties }
    }

    setDataGridShowColumns(props, action) {
        if (!action.Parameters) this.InitsetDataGridShowColumnsAction(props, action);
        const { pageAxis } = props;

        const { dataGridView } = action.Parameters;

        if (!action.Parameters.ColumnsView) action.Parameters.ColumnsView = this.InitColumnsView(dataGridView.name, dataGridView.properties);

        const { ColumnsView } = action.Parameters;

        const value = props.dataProperties.map(m => m.name);
        const allSelect = ColumnsView.properties[0];
        const colPropertery = ColumnsView.properties[1];
        if (!colPropertery.setValue) colPropertery.value = value;
        else colPropertery.setValue(value);

        const allSelected = value.length === dataGridView.properties.length;
        if (!allSelect.setValue) allSelect.value = allSelected;
        else allSelect.setValue(allSelected);

        var colSelected = false, allSelected2 = false;
        const nameList = dataGridView.properties.map(m => m.name);
        allSelect.valueChange = (v) => {
            if (colSelected) { colSelected = false; return; }

            allSelected2 = true;
            colPropertery.setValue(v ? nameList : []);
        };

        colPropertery.valueChange = (v) => {
            if (allSelected2) { allSelected2 = false; return; }

            colSelected = true;
            allSelect.setValue(v.length === nameList.length);
        };

        const onOk = (e, p) => this.setSelectShowColumns(e, p, props, action);
        this.ShowDialog(action, pageAxis, ColumnsView, onOk);
    }

    setSelectShowColumns(e, p, props, action) {
        const { pageAxis } = props;
        const { ColumnsView, dataGridView } = action.Parameters;
        const colPropertery = ColumnsView.properties[1];
        const value = colPropertery.getValue();

        if (value.length === 0) { this.Alert("最少需选择一列！", pageAxis.Alert); return; }
        dataGridView.setColumnsVisible2(value);

        action.ModalDialog.setVisible(false);
    }

    InitsetDataGridShowColumnsAction(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getComponent(action.dataGridView);

        action.Parameters = { dataGridView }
    }

    InitColumnsView(name, properties) {
        const dataDataSource = properties.map(m => { return { value: m.name, text: m.label } })
        return {
            name: name + "ColumnsView",
            type: "View",
            isDiv: true,
            className: "divColumsView",
            id: Common.createGuid(),
            DialogId: Common.createGuid(),
            DialogWidth: 500,
            DialogTitle: "自定义显示列",
            DialogStyle: { maxHeight: 500, overflow: "auto" },
            bodyStyle: { padding: "16px 32px", margin: 0 },
            properties: [{
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
                dataSource: dataDataSource
            }]
        }
    }
}