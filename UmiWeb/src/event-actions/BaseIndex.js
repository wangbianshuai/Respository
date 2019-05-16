import { Common } from "UtilsCommon";

export default class BaseIndex {

    IsSuccessNextsProps(obj, Alert, AlertMessage) {
        let isSuccess = obj && obj.IsSuccess !== false;
        let msg = "";
        if (!isSuccess) msg = obj.Message;
        if (isSuccess && obj.code !== undefined) {
            isSuccess = Common.GetIntValue(obj.code) === 0;
            if (!isSuccess) msg = obj.message;
        }
        if (!isSuccess && msg) {
            if (AlertMessage) AlertMessage.SetValue(msg);
            else if (Alert) Alert(msg);
            else alert(msg);
        }
        return isSuccess;
    }

    IsSuccessNextsProps2(obj) {
        return obj && obj.IsSuccess !== false;
    }

    GetSelectToList(list, names) {
        const selectList = [];
        list.forEach(p => names.indexOf(p.Name) >= 0 && selectList.push(p))
        return selectList;
    }

    GetPropertyValues(properties, eventActions) {
        const data = {};
        let name = "", p = null, v = null, msg = "";

        for (let i = 0; i < properties.length; i++) {
            p = properties[i];
            name = p.PropertyName || p.Name;
            if (p.GetValue) {
                v = p.GetValue();
                if (!p.IsNullable && p.DataType === "Array" && (Common.IsNullOrEmpty(v) || v.length === 0)) {
                    msg = p.NullTipMessage || "请选择" + p.Label + "！"
                    break;
                }
                else if (!p.IsNullable && p.Type === "Select" && Common.IsNullOrEmpty(v)) {
                    msg = p.NullTipMessage || "请选择" + p.Label + "！"
                    break;
                }
                else if (!p.IsNullable && Common.IsNullOrEmpty(v)) {
                    msg = p.NullTipMessage || p.Label + "不能为空！"
                    break;
                }
                data[name] = v;
            }
        }

        if (!Common.IsNullOrEmpty(msg)) { eventActions.Alert(msg); return false; }

        return data;
    }

    SetPropertiesValue(properties, data) {
        data = data || {};

        let name = "", v = null;
        properties.forEach(p => {
            name = p.PropertyName || p.Name;
            v = data[name];
            if ((v === null || v === undefined) && p.DefaultValue) v = p.DefaultValue;
            if (p.SetValue) p.SetValue(v);
            else p.Value = v;
        })
    }

    ShowDialog(action, EventActions, dialogView, onOk, setValue) {
        if (!action.ModalDialog) {
            action.ModalDialog = {
                Id: dialogView.DialogId, Title: dialogView.Title, Visible: true,
                Width: dialogView.DialogWidth,
                Style: dialogView.DialogStyle,
                Component: EventActions.GetReactComponent(dialogView),
                OnOk: onOk
            };
            EventActions.SetModalDialog(action.ModalDialog);
        }
        else {
            setValue && setValue();
            action.ModalDialog.SetVisible(true);
        }
    }

    ReceiveDialogOkActionType(data, props, action) {
        action.OkProperty.SetDisabled(false);
        const { AlertMessage, DataGridView, DialogView } = action.Parameters;
        const { EventActions } = props;
        if (this.IsSuccessNextsProps(data, EventActions.Alert, null)) {
            AlertMessage.SetValue(DialogView.SuccessTip);
            //刷新查询
            DataGridView.Refresh();
            action.ModalDialog.SetVisible(false);
        }

        return false;
    }
}