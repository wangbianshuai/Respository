import BaseIndex from './baseIndex';
import { Common } from "UtilsCommon";

export default class DataGrid extends BaseIndex {

    //批量更新行数据列表
    batchUpdateRowDataList(props, action) {
        if (!action.parameters) this.initBatchUpdateRowDataListAction(props, action);
        const { pageAxis, property } = props;

        const { dataGridView, alertMessage, entityProperties } = action.parameters;
        const { dataActionType } = property;

        var selectDataList = null, selectRowKeys = null;
        if (property.params) {
            selectDataList = [property.params];
            selectRowKeys = [property.params[dataGridView.entity.primaryKey]];
        }
        else {
            selectRowKeys = dataGridView.getSelectedRowKeys();
            if (selectRowKeys.length === 0 && !property.isNoRowsSelected) {
                this.alert("请选择记录再操作！", pageAxis.showMessage, alertMessage)
                return;
            }

            selectDataList = dataGridView.getSelectDataList();

            if (selectRowKeys.length > 0 && alertMessage) alertMessage.setValue("")
        }

        //设置接收数据行数返回数据
        pageAxis.receives[dataActionType] = (d) => this.receiveBatchUpdateRowDataList(d, props, action)

        let entityData = null;
        if (entityProperties) {
            entityData = this.getPropertyValues(entityProperties, pageAxis)
        }

        const onOk = () => {
            property.setDisabled && property.setDisabled(true);

            pageAxis.invokeDataAction(dataActionType, { selectRowKeys, entity: dataGridView.entity, entityData, selectDataList })
        };

        if (property.confirmTip) pageAxis.confirm(property.confirmTip, onOk);
        else onOk();
    }

    receiveBatchUpdateRowDataList(data, props, action) {
        const { alertMessage, dataGridView } = action.parameters;
        const { pageAxis, property } = props;

        property.setDisabled && property.setDisabled(false);

        if (this.isSuccessNextsProps(data, pageAxis.alert, alertMessage)) {
            this.alert(property.successTip, pageAxis.showMessage, alertMessage)
            //刷新查询
            dataGridView.refresh();
        }
        return false;
    }

    initBatchUpdateRowDataListAction(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getProperty(action.dataGridView);
        const alertMessage = pageAxis.getProperty(action.alertMessage);

        let entityProperties = null;
        if (action.entityProperties) entityProperties = action.entityProperties.map(m => pageAxis.getProperty(m));

        action.parameters = { dataGridView, alertMessage, entityProperties }
    }

    setDataGridShowColumns(props, action) {
        if (!action.parameters) this.initSetDataGridShowColumnsAction(props, action);
        const { pageAxis } = props;

        const { dataGridView } = action.parameters;

        if (!action.parameters.columnsView) action.parameters.columnsView = this.initColumnsView(dataGridView.name, dataGridView.properties);

        const { columnsView } = action.parameters;

        const value = props.dataProperties.map(m => m.name);
        const allSelect = columnsView.properties[0];
        const colPropertery = columnsView.properties[1];
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
        this.showdialog(action, pageAxis, columnsView, onOk);
    }

    setSelectShowColumns(e, p, props, action) {
        const { pageAxis } = props;
        const { columnsView, dataGridView } = action.parameters;
        const colPropertery = columnsView.properties[1];
        const value = colPropertery.getValue();

        if (value.length === 0) { this.alert("最少需选择一列！", pageAxis.alert); return; }
        dataGridView.setColumnsVisible2(value);

        action.modalDialog.setVisible(false);
    }

    initSetDataGridShowColumnsAction(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getProperty(action.dataGridView);

        action.parameters = { dataGridView }
    }

    initColumnsView(name, properties) {
        const dataSource = properties.map(m => { return { value: m.name, text: m.label } })
        return {
            name: name + "columnsView",
            type: "View",
            isDiv: true,
            className: "divColumsView",
            id: Common.createGuid(),
            dialogId: Common.createGuid(),
            dialogWidth: 500,
            dialogTitle: "自定义显示列",
            dialogStyle: { maxHeight: 500, overflow: "auto" },
            bodyStyle: { padding: "16px 32px", margin: 0 },
            properties: [{
                id: Common.createGuid(),
                name: name + "AllSelect",
                type: "CheckBox",
                checkedValue: true,
                unCheckedValue: false,
                text: "全选",
                style: { width: "100%", borderTop: "1px solid #e8e8e8", color: "#1890ff", paddingTop: 8, paddingBottom: 10, background: "#fafafa" }
            }, {
                id: Common.createGuid(),
                name: name + "Columns",
                type: "CheckBoxGroup",
                isFlexColumn: true,
                dataSource
            }]
        }
    }
}