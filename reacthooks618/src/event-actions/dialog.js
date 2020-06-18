import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex";

export default class Dialog extends BaseIndex {

    //弹出选择视图选择数据列表，可多选或单选，弹出层之前对DataGridView进行验证是否选择行。
    //行为参数，DataGridView，弹出层视图 DialogView，选择数据绑定组件DataComponent
    SelectViewDataToList(props, action) {
        if (!action.Parameters) this.InitSelectViewDataToListAction(props, action);
        const { pageAxis } = props;

        const { DataGridView, DialogView, AlertMessage } = action.Parameters;
        const { setSelectValuesOkActionType } = DialogView;

        const selectRowKeys = DataGridView.getSelectedRowKeys();
        if (selectRowKeys.length === 0) {
            this.Alert("请选择记录再操作！", pageAxis.ShowMessage, AlertMessage)
            return;
        }

        if (selectRowKeys.length > 0) if (AlertMessage) AlertMessage.setValue("")

        DialogView.SelectRowKeys = selectRowKeys;

        //设置接收数据行数返回数据
        pageAxis.Receives[setSelectValuesOkActionType] = (d) => this.ReceiveDialogOkActionType(d, props, action)

        //扩展数据加载
        if (DialogView.expandDataLoad) DialogView.expandDataLoad(props, action);

        const onOk = (e, p) => this.setSelectViewDataToList(e, p, props, action, selectRowKeys);
        this.ShowDialog(action, pageAxis, DialogView, onOk, action.setValue);
    }

    //弹出层确定事件行为
    setSelectViewDataToList(e, p, props, action, selectRowKeys) {
        const { DialogView, DataComponent, DataProperties, DataGridView } = action.Parameters;
        const { pageAxis } = props;

        action.OkProperty = p;

        //获取选择值
        let selectValues = null, selectData = null;
        if (DataComponent) {
            selectValues = DataComponent.getValue();
            if (!(selectValues && selectValues.length > 0)) {
                pageAxis.Alert("请选择记录再操作！")
                return;
            }
        }
        else selectData = this.getPropertyValues(DataProperties, pageAxis);

        if (selectData === false) return;

        const selectDataList = DataGridView.getSelectDataList();

        const data = { SelectRowKeys: selectRowKeys, SelectValues: selectValues, SelectData: selectData, RowDataList: selectDataList, PageData: pageAxis.PageData }

        //禁用确定按钮
        p.setDisabled(true);

        //数据行为跟页面调用数据行为走
        //setSelectValuesOkActionType:设置选择值集合确认数据行为类型
        pageAxis.Invoke(DialogView.setSelectValuesOkActionType, data);
    }

    InitSelectViewDataToListAction(props, action) {
        const { pageAxis } = props;
        const DataGridView = pageAxis.getComponent(action.DataGridView);
        const DialogView = Common.arrayFirst(pageAxis.PageConfig.DialogViews, (f) => f.name === action.DialogView);

        //DataComponent存在，则取DataComponent，不存在取DataProperties属性名集合
        let DataComponent = null, DataProperties = null;
        if (action.DataComponent) {
            DataComponent = Common.arrayFirst(DialogView.Properties, (f) => f.name === action.DataComponent);
            action.setValue = () => DataComponent.setValue(null)
        }
        else {
            DataProperties = this.getSelectToList(DialogView.Properties, action.DataProperties);
            action.setValue = () => this.setPropertiesValue(DataProperties, null)
        }

        const AlertMessage = pageAxis.getControl(action.AlertMessage);

        action.Parameters = { DataGridView, DialogView, DataComponent, DataProperties, AlertMessage }
    }

    //弹出层搜索查询选择行数据
    SearchQueryDataSelectRowData(props, action) {
        if (!action.Parameters) this.InitSearchQueryDataSelectRowDataAction(props, action);
        const { pageAxis } = props;
        const { DialogView } = action.Parameters;

        const onOk = (e, p) => this.setSelectValueDialogOk(e, p, props, action);
        this.ShowDialog(action, pageAxis, DialogView, onOk);
    }

    setSelectValueDialogOk(e, p, props, action) {
        const { DataGridView, TosetView } = action.Parameters;
        const { pageAxis } = props;

        const selectDataList = DataGridView.getSelectDataList();
        if (selectDataList.length === 0) {
            pageAxis.Alert("请选择记录再操作！");
            return;
        }

        TosetView.SelectData = selectDataList[0];

        this.setViewPropertiesValue(TosetView.Properties, TosetView.SelectData);

        action.ModalDialog.setVisible(false);
    }

    InitSearchQueryDataSelectRowDataAction(props, action) {
        const { pageAxis } = props;
        //设置数据视图
        const TosetView = pageAxis.getView(action.TosetView);
        const DialogView = Common.arrayFirst(pageAxis.PageConfig.DialogViews, (f) => f.name === action.DialogView);
        const DataGridView = pageAxis.getViewProperty(DialogView, action.DataGridView)

        action.Parameters = { DataGridView, DialogView, TosetView }
    }

    //弹出层查看
    ShowDialogLookData(props, action) {
        if (!action.Parameters) this.InitShowDialogLookDataAction(props, action);
        const { pageAxis, property } = props;
        const { DialogView, LookView } = action.Parameters;

        const data = property.Params ? property.Params : null;

        if (data) LookView.PrimaryKey = data[LookView.Entity.PrimaryKey];

        const properties = LookView.Properties.filter(f => f.isClear);
        this.setPropertiesValue(properties);

        if(LookView.ReLoad) LookView.ReLoad();

        this.ShowDialog(action, pageAxis, DialogView);
    }

    InitShowDialogLookDataAction(props, action) {
        const { pageAxis } = props;
        //设置数据视图
        const DialogView = Common.arrayFirst(pageAxis.PageConfig.DialogViews, (f) => f.name === action.DialogView);
        const LookView = pageAxis.getViewProperty(DialogView, action.LookView);

        action.Parameters = { DialogView, LookView }
    }
}