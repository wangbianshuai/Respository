import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex";

export default class Dialog extends BaseIndex {

    //弹出选择视图选择数据列表，可多选或单选，弹出层之前对DataGridView进行验证是否选择行。
    //行为参数，DataGridView，弹出层视图 DialogView，选择数据绑定组件DataComponent
    SelectViewDataToList(props, action) {
        if (!action.Parameters) this.InitSelectViewDataToListAction(props, action);
        const { EventActions } = props;

        const { DataGridView, DialogView, AlertMessage } = action.Parameters;
        const { SetSelectValuesOkActionType } = DialogView;

        const selectRowKeys = DataGridView.GetSelectedRowKeys();
        if (selectRowKeys.length === 0) {
            this.Alert("请选择记录再操作！", EventActions.ShowMessage, AlertMessage)
            return;
        }

        if (selectRowKeys.length > 0) if (AlertMessage) AlertMessage.SetValue("")

        DialogView.SelectRowKeys = selectRowKeys;

        //设置接收数据行数返回数据
        EventActions.Receives[SetSelectValuesOkActionType] = (d) => this.ReceiveDialogOkActionType(d, props, action)

        //扩展数据加载
        if (DialogView.ExpandDataLoad) DialogView.ExpandDataLoad(props, action);

        const onOk = (e, p) => this.SetSelectViewDataToList(e, p, props, action, selectRowKeys);
        this.ShowDialog(action, EventActions, DialogView, onOk, action.SetValue);
    }

    //弹出层确定事件行为
    SetSelectViewDataToList(e, p, props, action, selectRowKeys) {
        const { DialogView, DataComponent, DataProperties, DataGridView } = action.Parameters;
        const { EventActions } = props;

        action.OkProperty = p;

        //获取选择值
        let selectValues = null, selectData = null;
        if (DataComponent) {
            selectValues = DataComponent.GetValue();
            if (!(selectValues && selectValues.length > 0)) {
                EventActions.Alert("请选择记录再操作！")
                return;
            }
        }
        else selectData = this.GetPropertyValues(DataProperties, EventActions);

        if (selectData === false) return;

        const selectDataList = DataGridView.GetSelectDataList();

        const data = { SelectRowKeys: selectRowKeys, SelectValues: selectValues, SelectData: selectData, RowDataList: selectDataList, PageData: EventActions.PageData }

        //禁用确定按钮
        p.SetDisabled(true);

        //数据行为跟页面调用数据行为走
        //SetSelectValuesOkActionType:设置选择值集合确认数据行为类型
        EventActions.Invoke(DialogView.SetSelectValuesOkActionType, data);
    }

    InitSelectViewDataToListAction(props, action) {
        const { EventActions } = props;
        const DataGridView = EventActions.GetComponent(action.DataGridView);
        const DialogView = Common.ArrayFirst(EventActions.PageConfig.DialogViews, (f) => f.Name === action.DialogView);

        //DataComponent存在，则取DataComponent，不存在取DataProperties属性名集合
        let DataComponent = null, DataProperties = null;
        if (action.DataComponent) {
            DataComponent = Common.ArrayFirst(DialogView.Properties, (f) => f.Name === action.DataComponent);
            action.SetValue = () => DataComponent.SetValue(null)
        }
        else {
            DataProperties = this.GetSelectToList(DialogView.Properties, action.DataProperties);
            action.SetValue = () => this.SetPropertiesValue(DataProperties, null)
        }

        const AlertMessage = EventActions.GetControl(action.AlertMessage);

        action.Parameters = { DataGridView, DialogView, DataComponent, DataProperties, AlertMessage }
    }

    //弹出层搜索查询选择行数据
    SearchQueryDataSelectRowData(props, action) {
        if (!action.Parameters) this.InitSearchQueryDataSelectRowDataAction(props, action);
        const { EventActions } = props;
        const { DialogView } = action.Parameters;

        const onOk = (e, p) => this.SetSelectValueDialogOk(e, p, props, action);
        this.ShowDialog(action, EventActions, DialogView, onOk);
    }

    SetSelectValueDialogOk(e, p, props, action) {
        const { DataGridView, ToSetView } = action.Parameters;
        const { EventActions } = props;

        const selectDataList = DataGridView.GetSelectDataList();
        if (selectDataList.length === 0) {
            EventActions.Alert("请选择记录再操作！");
            return;
        }

        ToSetView.SelectData = selectDataList[0];

        this.SetViewPropertiesValue(ToSetView.Properties, ToSetView.SelectData);

        action.ModalDialog.SetVisible(false);
    }

    InitSearchQueryDataSelectRowDataAction(props, action) {
        const { EventActions } = props;
        //设置数据视图
        const ToSetView = EventActions.GetView(action.ToSetView);
        const DialogView = Common.ArrayFirst(EventActions.PageConfig.DialogViews, (f) => f.Name === action.DialogView);
        const DataGridView = EventActions.GetViewProperty(DialogView, action.DataGridView)

        action.Parameters = { DataGridView, DialogView, ToSetView }
    }

    //弹出层查看
    ShowDialogLookData(props, action) {
        if (!action.Parameters) this.InitShowDialogLookDataAction(props, action);
        const { EventActions, Property } = props;
        const { DialogView, LookView } = action.Parameters;

        const data = Property.Params ? Property.Params : null;

        if (data) LookView.PrimaryKey = data[LookView.Entity.PrimaryKey];

        const properties = LookView.Properties.filter(f => f.IsClear);
        this.SetPropertiesValue(properties);

        if(LookView.ReLoad) LookView.ReLoad();

        this.ShowDialog(action, EventActions, DialogView);
    }

    InitShowDialogLookDataAction(props, action) {
        const { EventActions } = props;
        //设置数据视图
        const DialogView = Common.ArrayFirst(EventActions.PageConfig.DialogViews, (f) => f.Name === action.DialogView);
        const LookView = EventActions.GetViewProperty(DialogView, action.LookView);

        action.Parameters = { DialogView, LookView }
    }
}