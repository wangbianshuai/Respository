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
            if (AlertMessage) AlertMessage.SetValue("请先选择数据行！")
            return;
        }

        //设置接收数据行数返回数据
        if (!EventActions.Receives[SetSelectValuesOkActionType]) {
            EventActions.Receives[SetSelectValuesOkActionType] = (d) => this.ReceiveDialogOkActionType(d, props, action)
        }

        const onOk = (e, p) => this.SetSelectViewDataToList(e, p, props, action, selectRowKeys);
        this.ShowDialog(action, EventActions, DialogView, onOk, action.SetValue);
    }

    //弹出层确定事件行为
    SetSelectViewDataToList(e, p, props, action, selectRowKeys) {
        const { DialogView, DataComponent, DataProperties } = action.Parameters;
        const { EventActions } = props;

        action.OkProperty = p;

        //获取选择值
        let selectValues = null, selectData = null;
        if (DataComponent) {
            selectValues = DataComponent.GetValue();
            if (!(selectValues && selectValues.length > 0)) {
                EventActions.Alert("请先选择数据行！")
                return;
            }
        }
        else selectData = this.GetPropertyValues(DataProperties, EventActions);

        if (selectData === false) return;

        const data = { SelectRowKeys: selectRowKeys, SelectValues: selectValues, SelectData: selectData, EventActionType: action.Type }

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
}