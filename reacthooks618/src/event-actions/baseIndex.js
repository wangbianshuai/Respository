import { Common, Validate } from "UtilsCommon";

export default class BaseIndex {

    isSuccessNextsProps(obj, Alert, AlertMessage) {
        let isSuccess = obj && obj.isSuccess !== false;
        let msg = "";
        if (!isSuccess) msg = obj.message;
        if (isSuccess && obj.code !== undefined) {
            isSuccess = Common.getIntValue(obj.code) === 0;
            if (!isSuccess) msg = obj.message;
        }
        if (!isSuccess && msg) this.Alert(msg, Alert, AlertMessage);

        return isSuccess;
    }

    Alert(msg, alert2, alertMessage) {
        if (alertMessage) alertMessage.setValue(msg);
        else if (alert2) alert2(msg);
        else alert(msg);
    }

    isSuccessNextsProps2(obj) {
        return obj && obj.isSuccess !== false;
    }

    getSelectToList(list, names) {
        const selectList = [];
        list.forEach(p => names.indexOf(p.name) >= 0 && selectList.push(p))
        return selectList;
    }

    getPropertyValues(properties, eventActions) {
        const data = {};
        let name = "", p = null, v = null, msg = "";

        for (let i = 0; i < properties.length; i++) {
            p = properties[i];
            name = p.propertyName || p.name;

            if (p.getDisabled && p.getDisabled()) {
                if (p.getValueToData) p.getValueToData(data)
                else data[name] = null;
                continue;
            }

            if (p.getValueToData) {
                if (p.getValueToData(data) === false) {
                    msg = p.TipMessage;
                    break;
                }
            }
            else if (p.getValue) {
                v = p.getValue();
                let isNullable = p.isJudgeNullable === false || p.isNullable;
                if (!isNullable && p.DataType === "Array" && (Common.isNullOrEmpty(v) || v.length === 0)) {
                    msg = p.nullTipMessage || "请选择" + p.label + "！"
                    break;
                }
                else if (!isNullable && p.type === "Select" && Common.isNullOrEmpty(v)) {
                    msg = p.nullTipMessage || "请选择" + p.label + "！"
                    break;
                }
                else if (!isNullable && Common.isNullOrEmpty(v)) {
                    msg = p.nullTipMessage || p.label + "不能为空！"
                    break;
                }
                else if (!isNullable && p.judgeNullable) {
                    msg = p.judgeNullable(v);
                    if (!Common.isNullOrEmpty(msg)) break;
                }
                else if (!Common.isNullOrEmpty(v) && p.ValidateNames) {
                    for (let i = 0; i < p.ValidateNames.length; i++) {
                        msg = this.ValidateValue(p.ValidateNames[i], v, p);
                        if (Common.isNullOrEmpty(msg)) break;
                    };

                    if (!Common.isNullOrEmpty(msg)) break;
                }

                data[name] = v;

                //目前主要是文本框带单位选择
                if (p.PropertyName2 && p.getValue2) {
                    data[p.PropertyName2] = p.getValue2();
                }
            }
        }

        if (!Common.isNullOrEmpty(msg)) { eventActions.Alert(msg); return false; }

        return data;
    }

    ValidateValue(validateName, v, p) {
        if (!Validate[validateName]) return "";

        var msg = Validate[validateName](v);
        if (msg === true) msg = ""
        else if (p.ValidateTipMessage) msg = p.ValidateTipMessage;

        return msg;
    }

    setViewPropertiesDisabled(properties) {
        properties.forEach(p => {
            if (p.isEdit || p.isDisabled) {
                if (p.setDisabled) p.setDisabled(true);
                else p.disabled = true;
            }
        });
    }

    setViewPropertiesVisible(properties, visible) {
        properties.forEach(p => {
            if (p.setVisible) p.setVisible(visible);
            else p.isVisible = visible;
        });
    }

    setViewPropertiesexpanded(properties, isexpanded) {
        properties.forEach(p => {
            if (p.setexpanded) p.setexpanded(isexpanded);
            else p.isexpanded = isexpanded;
        });
    }

    setPropertiesValue(properties, data, isUpdateReadOnly) {
        data = data || {};

        const isDefault = Common.isEmptyObject(data);

        let name = "", v = null;
        properties.forEach(p => {
            if (p.setValueByData) p.setValueByData(data)
            else {
                name = p.propertyName || p.name;
                v = data[name];
                if ((v === null || v === undefined) && p.defaultValue && (isDefault || p.isDefault)) v = p.defaultValue;
                if (p.setValue) p.setValue(v);
                else p.value = v;

                //目前主要是文本框带单位选择
                if (p.PropertyName2) {
                    v = data[p.PropertyName2];
                    if ((v === null || v === undefined) && p.DefaultValue2) v = p.DefaultValue2;
                    if (p.setValue2) p.setValue2(v);
                    else p.Value2 = v;
                }
            }

            if (isUpdateReadOnly && p.isUpdateReadOnly) {
                if (p.setReadOnly) p.setReadOnly(true);
                else p.isReadOnly = true;
            }
        })
    }

    ShowDialog(action, pageAxis, dialogView, onOk, setValue) {
        if (!action.ModalDialog) {
            action.ModalDialog = {
                id: dialogView.DialogId, title: dialogView.DialogTitle, Visible: true,
                Width: dialogView.DialogWidth,
                style: dialogView.DialogStyle,
                bodyStyle: dialogView.bodyStyle,
                Component: pageAxis.getReactComponent(dialogView),
                isOk: !!onOk,
                OnOk: onOk
            };
            pageAxis.setModalDialog(action.ModalDialog);
        }
        else {
            setValue && setValue();
            action.ModalDialog.setVisible(true);
        }
    }

    ReceiveDialogOkActionType(data, props, action) {
        action.OkProperty.setDisabled(false);
        const { AlertMessage, dataGridView, DialogView } = action.Parameters;
        const { pageAxis } = props;
        if (this.isSuccessNextsProps(data, pageAxis.Alert, null)) {
            AlertMessage.setValue(DialogView.SuccessTip);
            //刷新查询
            dataGridView.refresh();
            action.ModalDialog.setVisible(false);
        }

        return false;
    }

    getViewPropertiesValue(properties, eventActions) {
        const editProperties = properties.filter(f => f.isEdit && !f.isView && f.isVisible !== false);

        let entityData = this.getPropertyValues(editProperties, eventActions);

        if (entityData === false) return entityData;

        //视图作为控件，把视图属性值平移到父级上
        const viewProperties = properties.filter(f => f.isEdit && f.isView && f.isVisible !== false);

        let viewPropertyData = null;
        for (let i = 0; i < viewProperties.length; i++) {
            viewPropertyData = this.getViewPropertiesValue(viewProperties[i].properties, eventActions);
            if (viewPropertyData === false) { entityData = viewPropertyData; break; }
            else for (let key in viewPropertyData) entityData[key] = viewPropertyData[key];
        }

        return entityData;
    }

    setViewPropertiesValue(properties, data, isUpdateReadOnly) {
        this.setPropertiesValue(properties, data, isUpdateReadOnly);

        const viewProperties = properties.filter(f => f.isView);

        for (let i = 0; i < viewProperties.length; i++) {
            this.setViewPropertiesValue(viewProperties[i].properties, data, isUpdateReadOnly);
        }
    }
}