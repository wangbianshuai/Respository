import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex";

export default class dialog extends BaseIndex {

    //弹出选择视图选择数据列表，可多选或单选，弹出层之前对DataGridView进行验证是否选择行。
    //行为参数，DataGridView，弹出层视图 dialogView，选择数据绑定组件DataComponent
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

        //设置接收数据行数返回数据
        pageAxis.receives[setSelectValuesOkActionType] = (d) => this.receiveDialogOkActionType(d, props, action)

        //扩展数据加载
        if (dialogView.expandDataLoad) dialogView.expandDataLoad(props, action);

        const onOk = (e, p) => this.setSelectViewDataToList(e, p, props, action, selectRowKeys);
        this.showdialog(action, pageAxis, dialogView, onOk, action.setValue);
    }

    //弹出层确定事件行为
    setSelectViewDataToList(e, p, props, action, selectRowKeys) {
        const { dialogView, dataComponent, dataProperties, dataGridView } = action.parameters;
        const { pageAxis } = props;

        action.OkProperty = p;

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

        const data = { selectRowKeys: selectRowKeys, SelectValues: selectValues, SelectData: selectData, RowDataList: selectDataList, pageData: pageAxis.pageData }

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
        if (action.dataComponent) {
            dataComponent = Common.arrayFirst(dialogView.properties, (f) => f.name === action.dataComponent);
            action.setValue = () => dataComponent.setValue(null)
        }
        else {
            dataProperties = this.getSelectToList(dialogView.properties, action.dataProperties);
            action.setValue = () => this.setPropertiesValue(dataProperties, null)
        }

        const alertMessage = pageAxis.getProperty(action.alertMessage);

        action.parameters = { dataGridView, dialogView, dataComponent, dataProperties, alertMessage }
    }

    //弹出层搜索查询选择行数据
    searchQueryDataSelectRowData(props, action) {
        if (!action.parameters) this.initSearchQueryDataSelectRowDataAction(props, action);
        const { pageAxis } = props;
        const { dialogView } = action.parameters;

        const onOk = (e, p) => this.setSelectValuedialogOk(e, p, props, action);
        this.showdialog(action, pageAxis, dialogView, onOk);
    }

    setSelectValuedialogOk(e, p, props, action) {
        const { dataGridView, TosetView } = action.parameters;
        const { pageAxis } = props;

        const selectDataList = dataGridView.getSelectDataList();
        if (selectDataList.length === 0) {
            pageAxis.alert("请选择记录再操作！");
            return;
        }

        TosetView.SelectData = selectDataList[0];

        this.setViewPropertiesValue(TosetView.properties, TosetView.SelectData);

        action.modalDialog.setVisible(false);
    }

    initSearchQueryDataSelectRowDataAction(props, action) {
        const { pageAxis } = props;
        //设置数据视图
        const TosetView = pageAxis.getProperty(action.TosetView);
        const dialogView = Common.arrayFirst(pageAxis.pageConfig.dialogViews, (f) => f.name === action.dialogView);
        const dataGridView = pageAxis.getPropertyProperty(dialogView, action.dataGridView)

        action.parameters = { dataGridView, dialogView, TosetView }
    }

    //弹出层查看
    showdialogLookData(props, action) {
        if (!action.parameters) this.initShowdialogLookDataAction(props, action);
        const { pageAxis, property } = props;
        const { dialogView, lookView } = action.parameters;

        const data = property.params ? property.params : null;

        if (data) lookView.primaryKey = data[lookView.entity.primaryKey];

        const properties = lookView.properties.filter(f => f.isClear);
        this.setPropertiesValue(properties);

        if(lookView.reLoad) lookView.reLoad();

        this.showdialog(action, pageAxis, dialogView);
    }

    initShowdialogLookDataAction(props, action) {
        const { pageAxis } = props;
        //设置数据视图
        const dialogView = Common.arrayFirst(pageAxis.pageConfig.dialogViews, (f) => f.name === action.dialogView);
        const lookView = pageAxis.getPropertyProperty(dialogView, action.lookView);

        action.parameters = { dialogView, lookView }
    }
}