import { Common, Validate } from "UtilsCommon";

export default class BaseIndex {

    IsSuccessNextsProps(obj, Alert, AlertMessage) {
        let isSuccess = obj && obj.IsSuccess !== false;
        let msg = "";
        if (!isSuccess) msg = obj.Message;
        if (isSuccess && obj.code !== undefined) {
            isSuccess = Common.GetIntValue(obj.code) === 0;
            if (!isSuccess) msg = obj.message;
        }
        if (!isSuccess && msg) this.Alert(msg, Alert, AlertMessage);

        return isSuccess;
    }

    Alert(msg, alert2, alertMessage) {
        if (alertMessage) alertMessage.SetValue(msg);
        else if (alert2) alert2(msg);
        else alert(msg);
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

            if (p.GetDisabled && p.GetDisabled()) {
                if (p.GetValueToData) p.GetValueToData(data)
                else data[name] = null;
                continue;
            }

            if (p.GetValueToData) {
                if (p.GetValueToData(data) === false) {
                    msg = p.TipMessage;
                    break;
                }
            }
            else if (p.GetValue) {
                v = p.GetValue();
                let isNullable = p.IsJudgeNullable === false || p.IsNullable;
                if (!isNullable && p.DataType === "Array" && (Common.IsNullOrEmpty(v) || v.length === 0)) {
                    msg = p.NullTipMessage || "请选择" + p.Label + "！"
                    break;
                }
                else if (!isNullable && p.Type === "Select" && Common.IsNullOrEmpty(v)) {
                    msg = p.NullTipMessage || "请选择" + p.Label + "！"
                    break;
                }
                else if (!isNullable && Common.IsNullOrEmpty(v)) {
                    msg = p.NullTipMessage || p.Label + "不能为空！"
                    break;
                }
                else if (!isNullable && p.JudgeNullable) {
                    msg = p.JudgeNullable(v);
                    if (!Common.IsNullOrEmpty(msg)) break;
                }
                else if (!Common.IsNullOrEmpty(v) && p.ValidateNames) {
                    for (let i = 0; i < p.ValidateNames.length; i++) {
                        msg = this.ValidateValue(p.ValidateNames[i], v, p);
                        if (Common.IsNullOrEmpty(msg)) break;
                    };

                    if (!Common.IsNullOrEmpty(msg)) break;
                }

                data[name] = v;

                //目前主要是文本框带单位选择
                if (p.PropertyName2 && p.GetValue2) {
                    data[p.PropertyName2] = p.GetValue2();
                }
            }
        }

        if (!Common.IsNullOrEmpty(msg)) { eventActions.Alert(msg); return false; }

        return data;
    }

    ValidateValue(validateName, v, p) {
        if (!Validate[validateName]) return "";

        var msg = Validate[validateName](v);
        if (msg === true) msg = ""
        else if (p.ValidateTipMessage) msg = p.ValidateTipMessage;

        return msg;
    }

    SetViewPropertiesDisabled(properties) {
        properties.forEach(p => {
            if (p.IsEdit || p.IsDisabled) {
                if (p.SetDisabled) p.SetDisabled(true);
                else p.Disabled = true;
            }
        });
    }

    SetViewPropertiesVisible(properties, visible) {
        properties.forEach(p => {
            if (p.SetVisible) p.SetVisible(visible);
            else p.IsVisible = visible;
        });
    }

    SetViewPropertiesExpanded(properties, isExpanded) {
        properties.forEach(p => {
            if (p.SetExpanded) p.SetExpanded(isExpanded);
            else p.IsExpanded = isExpanded;
        });
    }

    SetPropertiesValue(properties, data, isUpdateReadOnly) {
        data = data || {};

        const isDefault = Common.IsEmptyObject(data);

        let name = "", v = null;
        properties.forEach(p => {
            if (p.SetValueByData) p.SetValueByData(data)
            else {
                name = p.PropertyName || p.Name;
                v = data[name];
                if ((v === null || v === undefined) && p.DefaultValue && (isDefault || p.IsDefault)) v = p.DefaultValue;
                if (p.SetValue) p.SetValue(v);
                else p.Value = v;

                //目前主要是文本框带单位选择
                if (p.PropertyName2) {
                    v = data[p.PropertyName2];
                    if ((v === null || v === undefined) && p.DefaultValue2) v = p.DefaultValue2;
                    if (p.SetValue2) p.SetValue2(v);
                    else p.Value2 = v;
                }
            }

            if (isUpdateReadOnly && p.IsUpdateReadOnly) {
                if (p.SetReadOnly) p.SetReadOnly(true);
                else p.IsReadOnly = true;
            }
        })
    }

    ShowDialog(action, EventActions, dialogView, onOk, setValue) {
        if (!action.ModalDialog) {
            action.ModalDialog = {
                Id: dialogView.DialogId, Title: dialogView.DialogTitle, Visible: true,
                Width: dialogView.DialogWidth,
                Style: dialogView.DialogStyle,
                BodyStyle: dialogView.BodyStyle,
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

    GetViewPropertiesValue(properties, eventActions) {
        const editProperties = properties.filter(f => f.IsEdit && !f.IsView && f.IsVisible !== false);

        let entityData = this.GetPropertyValues(editProperties, eventActions);

        if (entityData === false) return entityData;

        //视图作为控件，把视图属性值平移到父级上
        const viewProperties = properties.filter(f => f.IsEdit && f.IsView && f.IsVisible !== false);

        let viewPropertyData = null;
        for (let i = 0; i < viewProperties.length; i++) {
            viewPropertyData = this.GetViewPropertiesValue(viewProperties[i].Properties, eventActions);
            if (viewPropertyData === false) { entityData = viewPropertyData; break; }
            else for (let key in viewPropertyData) entityData[key] = viewPropertyData[key];
        }

        return entityData;
    }

    SetViewPropertiesValue(properties, data, isUpdateReadOnly) {
        this.SetPropertiesValue(properties, data, isUpdateReadOnly);

        const viewProperties = properties.filter(f => f.IsView);

        for (let i = 0; i < viewProperties.length; i++) {
            this.SetViewPropertiesValue(viewProperties[i].Properties, data, isUpdateReadOnly);
        }
    }
}