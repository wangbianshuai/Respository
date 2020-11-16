import { Common } from "UtilsCommon";
import BaseIndex from './baseIndex';

export default class Dialog extends BaseIndex {

    //弹出选择视图选择数据列表，可多选或单选，弹出层之前对DataGridView进行验证是否选择行。
    //行为参数，dataGridView，弹出层视图 dialogView，选择数据绑定组件DataComponent
    selectViewDataToList(props, action) {
        if (!action.parameters) this.initSelectViewDataToListAction(props, action);
        const { pageAxis } = props;

        const { dataGridView, dialogView, alertMessage } = action.parameters;
        const { setSelectValuesOkActionType } = dialogView;

        const selectRowKeys = dataGridView.getSelectedRowKeys();
        if (selectRowKeys.length === 0) {
            this.alert("请选择记录再操作！", pageAxis.showMessage, alertMessage)
            return;
        }

        if (selectRowKeys.length > 0) if (alertMessage) alertMessage.setValue("")

        dialogView.selectRowKeys = selectRowKeys;

        const selectDataList = dataGridView.getSelectDataList();

        //设置接收数据行数返回数据
        pageAxis.receives[setSelectValuesOkActionType] = (d) => this.receiveDialogOkActionType(d, props, action)

        //扩展数据加载
        if (dialogView.expandDataLoad) dialogView.expandDataLoad(props, action, selectDataList);

        const onOk = (e, p) => this.setSelectViewDataToList(e, p, props, action, selectRowKeys);
        this.showdialog(action, pageAxis, dialogView, onOk, action.setValue);
    }

    //弹出层确定事件行为
    setSelectViewDataToList(e, p, props, action, selectRowKeys) {
        const { dialogView, dataComponent, dataProperties, dataGridView } = action.parameters;
        const { pageAxis } = props;

        action.okProperty = p;

        //获取选择值
        let selectValues = null, selectData = null;
        if (dataComponent) {
            selectValues = dataComponent.getValue();
            if (!(selectValues && selectValues.length > 0)) {
                pageAxis.alert("请选择记录再操作！")
                return;
            }
        }
        else selectData = this.getPropertyValues(dataProperties, pageAxis);

        if (selectData === false) return;

        const selectDataList = dataGridView.getSelectDataList();

        const data = { selectRowKeys, selectValues, selectData, rowDataList: selectDataList, pageData: pageAxis.pageData }

        //禁用确定按钮
        p.setDisabled(true);

        //数据行为跟页面调用数据行为走
        //setSelectValuesOkActionType:设置选择值集合确认数据行为类型
        pageAxis.invokeDataAction(dialogView.setSelectValuesOkActionType, data);
    }

    initSelectViewDataToListAction(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getProperty(action.dataGridView);
        const dialogView = Common.arrayFirst(pageAxis.pageConfig.dialogViews, (f) => f.name === action.dialogView);

        //DataComponent存在，则取DataComponent，不存在取DataProperties属性名集合
        let dataComponent = null, dataProperties = null;
        action.currentValue = null;
        if (action.dataComponent) {
            dataComponent = Common.arrayFirst(dialogView.properties, (f) => f.name === action.dataComponent);
            action.setValue = () => dataComponent.setValue(action.currentValue);
        }
        else {
            dataProperties = this.getSelectToList(dialogView.properties, action.dataProperties);
            action.setValue = () => this.setPropertiesValue(dataProperties, action.currentValue);
        }

        const alertMessage = pageAxis.getProperty(action.alertMessage);

        action.parameters = { dataGridView, dialogView, dataComponent, dataProperties, alertMessage }
    }

    //弹出层搜索查询选择行数据
    searchQueryDataSelectRowData(props, action) {
        if (!action.parameters) this.initSearchQueryDataSelectRowDataAction(props, action);
        const { pageAxis } = props;
        const { dialogView } = action.parameters;

        const onOk = (e, p) => this.setSelectValueDialogOk(e, p, props, action);
        this.showdialog(action, pageAxis, dialogView, onOk);
    }

    setSelectValueDialogOk(e, p, props, action) {
        const { dataGridView, toSetView } = action.parameters;
        const { pageAxis } = props;

        const selectDataList = dataGridView.getSelectDataList();
        if (selectDataList.length === 0) {
            pageAxis.alert("请选择记录再操作！");
            return;
        }

        toSetView.SelectData = selectDataList[0];

        this.setViewPropertiesValue(toSetView.properties, toSetView.SelectData);

        action.modalDialog.setVisible(false);
    }

    initSearchQueryDataSelectRowDataAction(props, action) {
        const { pageAxis } = props;
        //设置数据视图
        const toSetView = pageAxis.getProperty(action.toSetView);
        const dialogView = Common.arrayFirst(pageAxis.pageConfig.dialogViews, (f) => f.name === action.dialogView);
        const dataGridView = pageAxis.getViewProperty(dialogView, action.dataGridView)

        action.parameters = { dataGridView, dialogView, toSetView }
    }

    //弹出层查看
    showDialogLookData(props, action) {
        if (!action.parameters) this.initShowDialogLookDataAction(props, action);
        const { pageAxis, property } = props;
        const { dialogView, lookView } = action.parameters;

        const data = property.params ? property.params : null;

        if (data) lookView.primaryKey = data[lookView.entity.primaryKey];

        const properties = lookView.properties.filter(f => f.isClear);
        this.setPropertiesValue(properties);

        if (lookView.reLoad) lookView.reLoad();

        this.showdialog(action, pageAxis, dialogView);
    }

    initShowDialogLookDataAction(props, action) {
        const { pageAxis } = props;
        //设置数据视图
        const dialogView = Common.arrayFirst(pageAxis.pageConfig.dialogViews, (f) => f.name === action.dialogView);
        const lookView = pageAxis.getViewProperty(dialogView, action.lookView);

        action.parameters = { dialogView, lookView }
    }

    //弹出层查看
    showDialogLookRowData(props, action) {
        if (!action.parameters) this.initShowDialogLookDataAction(props, action);
        const { pageAxis, property } = props;
        const { dialogView } = action.parameters;

        this.setPropertiesValue(dialogView.properties, property.params);

        this.showdialog(action, pageAxis, dialogView);
    }

    initShowDialogLookRowDataAction(props, action) {
        const { pageAxis } = props;
        //设置数据视图
        const dialogView = Common.arrayFirst(pageAxis.pageConfig.dialogViews, (f) => f.name === action.dialogView);

        action.parameters = { dialogView }
    }

    //弹出层编辑
    showDialogEditEntityData(props, action) {
        if (!action.parameters) this.initShowDialogEditEntityData(props, action);
        const { pageAxis } = props;
        const { dialogView, dataGridView, editView } = action.parameters;

        const selectRowKeys = dataGridView.getSelectedRowKeys();
        if (action.isUpdate && selectRowKeys.length === 0) {
            this.alert("请选择记录再操作！", pageAxis.showMessage)
            return;
        }

        if (action.isUpdate) editView.primaryKey = selectRowKeys[0];

        const properties = editView.properties.filter(f => f.isClear);
        this.setPropertiesValue(properties);

        if (editView.reLoad) editView.reLoad();

        const onOk = (e, p) => this.setEditEntityData(e, p, props, action);
        this.showdialog(action, pageAxis, dialogView, onOk);
    }

    setEditEntityData(e, p, props, action) {
        const { pageAxis, view } = props;
        const { dataGridView } = action.parameters;

        action.successCallback = () => {
            action.modalDialog.setVisible(false);
            dataGridView && dataGridView.refresh();
        };
        pageAxis.eventActions.entityEdit.saveEntityData({ pageAxis, view, property: p }, action);
    }

    initShowDialogEditEntityData(props, action) {
        const { pageAxis } = props;
        const dialogView = Common.arrayFirst(pageAxis.pageConfig.dialogViews, (f) => f.name === action.dialogView);

        const editView = pageAxis.getProperty(action.editView);
        const dataGridView = pageAxis.getProperty(action.dataGridView);
        const successCallback = pageAxis.getFunction(action.successCallback);
        const expandSetEntityData = pageAxis.getFunction(action.expandSetEntityData);

        action.parameters = { dialogView, dataGridView, editView, successCallback, expandSetEntityData };
    }
}