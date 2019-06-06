import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class EntityEdit extends BaseIndex {

    //弹出选择视图选择数据列表，单选，弹出层之前对DataGridView进行验证是否选择行。
    //行为参数，DataGridView，弹出层视图 DialogView
    SelectRowUpdate(props, action) {
        if (!action.Parameters) this.InitSelectRowUpdateAction(props, action);
        const { EventActions } = props;

        const { DataGridView, DialogView, AlertMessage } = action.Parameters;
        const { UdpateEntityOkActionType } = DialogView;

        const selectDataList = DataGridView.GetSelectDataList();
        if (selectDataList.length === 0) {
            if (AlertMessage) AlertMessage.SetValue("请先选择数据行！")
            return;
        }

        const entityData = selectDataList[0];

        this.SetPropertiesValue(DialogView.Properties, entityData)

        //设置接收数据行数返回数据
        EventActions.Receives[UdpateEntityOkActionType] = (d) => this.ReceiveDialogOkActionType(d, props, action)

        const onOk = (e, p) => this.SetSelectRowUpdate(e, p, props, action, entityData);
        this.ShowDialog(action, EventActions, DialogView, onOk);
    }

    //弹出层确定事件行为
    SetSelectRowUpdate(e, p, props, action, selectData) {
        const { DialogView } = action.Parameters;
        const { EventActions } = props;

        action.OkProperty = p;

        const editProperties = DialogView.Properties.filter(f => f.IsEdit);

        let entityData = this.GetPropertyValues(editProperties, EventActions);
        if (DialogView.ExpandSetEntityData) entityData = DialogView.ExpandSetEntityData(entityData);

        if (entityData === false) return;

        //获取编辑值
        const data = { OldEntityData: selectData, EntityData: entityData }

        //禁用确定按钮
        p.SetDisabled(true);

        //数据行为跟页面调用数据行为走
        EventActions.Invoke(DialogView.UdpateEntityOkActionType, data);
    }

    InitSelectRowUpdateAction(props, action) {
        const { EventActions } = props;
        const DataGridView = EventActions.GetComponent(action.DataGridView);
        const DialogView = Common.ArrayFirst(EventActions.PageConfig.DialogViews, (f) => f.Name === action.DialogView);
        const AlertMessage = EventActions.GetControl(action.AlertMessage);

        action.Parameters = { DataGridView, DialogView, AlertMessage }
    }

    //保存实体数据，包含增加与更新
    SaveEntityData(props, action) {
        if (!action.Parameters) this.InitSaveEntityData(props, action);

        const { EditView } = action.Parameters;
        const { EventActions, Property } = props;

        let entityData = this.GetViewEntityData(props, EditView);
        if (entityData === false) return;

        if (Property.ConfirmTip) EventActions.Confirm(Property.ConfirmTip, () => this.SaveEditEntityData(props, action, EditView, entityData));
        else this.SaveEditEntityData(props, action, EditView, entityData);
    }

    SaveEditEntityData(props, action, EditView, entityData) {
        const { EventActions, Property, EditData } = props;

        //设置传入的编辑数据
        if (EditData) for (let key in EditData) entityData[key] = EditData[key];

        EditView.EditData = entityData;

        const actionType = EditView.SaveEntityDataActionType || Property.SaveEntityDataActionType;

        //设置接收数据行数返回数据
        EventActions.Receives[actionType] = (d) => this.ReceiveSaveEntityDataActionType(d, props, action);

        //获取编辑值
        const data = { OldEntityData: EditView.EntityData, EntityData: entityData }

        //禁用确定按钮
        Property.SetLoading(true);

        //数据行为跟页面调用数据行为走
        EventActions.Invoke(actionType, data);
    }

    SaveEntityDataViews(props, action) {
        if (!action.Parameters) this.InitSaveEntityDataViews(props, action);

        const { EditPropertiyViewList } = action.Parameters;
        const { EventActions, Property } = props;

        let entityData = {}, viewEntityData = null;

        for (let i = 0; i < EditPropertiyViewList.length; i++) {
            viewEntityData = this.GetViewEntityData(props, EditPropertiyViewList[i]);
            if (viewEntityData === false) { entityData = false; break; }
            else for (let key in viewEntityData) entityData[key] = viewEntityData[key];
        }

        if (entityData === false) return;

        const EditView = EditPropertiyViewList[0];

        if (Property.ConfirmTip) EventActions.Confirm(Property.ConfirmTip, () => this.SaveEditEntityData(props, action, EditView, entityData));
        else this.SaveEditEntityData(props, action, EditView, entityData);
    }

    GetViewEntityData(props, view) {
        const { EventActions } = props;
        const { DefaultEditData } = view;

        let entityData = this.GetViewPropertiesValue(view.Properties, EventActions);

        if (view.ExpandSetEntityData) entityData = view.ExpandSetEntityData(entityData);

        if (entityData === false) return false;

        //设置默认编辑数据
        if (DefaultEditData) for (let key in DefaultEditData) entityData[key] = DefaultEditData[key];

        return entityData;
    }

    ReceiveSaveEntityDataActionType(data, props, action) {
        const { EditPropertiyViewList, SetDisabledViewList, SuccessCallback } = action.Parameters;
        let EditView = action.Parameters.EditView
        if (EditPropertiyViewList) EditView = EditPropertiyViewList[0];

        const { EventActions, Property } = props;
        Property.SetLoading(false);
        if (this.IsSuccessNextsProps(data, EventActions.Alert, null)) {
            if (EditView.EntityData) EditView.EntityData = { ...EditView.EntityData, ...EditView.EditData }; //更新
            else if (EditPropertiyViewList) {
                //新增，清空属性值
                EditPropertiyViewList.forEach(v => {
                    if (v.IsClear) this.SetViewPropertiesValue(v.Properties, null);
                });
            }
            else if (EditView.IsClear) this.SetViewPropertiesValue(EditView.Properties, null); //新增，清空属性值

            //保存之后禁用控件
            if (SetDisabledViewList) {
                //新增，清空属性值
                SetDisabledViewList.forEach(v => {
                    this.SetViewPropertiesDisabled(v.Properties);
                });
            }

            if (SuccessCallback) SuccessCallback({ data, props, action });
            else EventActions.AlertSuccess(EditView.SuccessTip || "保存成功");
        }

        return false;
    }

    InitSaveEntityData(props, action) {
        const { EventActions } = props;
        const EditView = EventActions.GetView(action.EditView);
        const SuccessCallback = EventActions.GetFunction(action.SuccessCallback);

        let EditPropertiyViewList = null;
        if (action.EditPropertiyViewList) {
            EditPropertiyViewList = action.EditPropertiyViewList.map(m => EventActions.GetView(m));
        }

        let SetDisabledViewList = null;
        if (action.SetDisabledViewList) SetDisabledViewList = action.SetDisabledViewList.map(m => EventActions.GetView(m));

        action.Parameters = { EditView, EditPropertiyViewList, SetDisabledViewList, SuccessCallback };
    }

    InitSaveEntityDataViews(props, action) {
        const { EventActions } = props;
        const SuccessCallback = EventActions.GetFunction(action.SuccessCallback);

        const EditPropertiyViewList = action.EditPropertiyViewList.map(m => EventActions.GetView(m));

        let SetDisabledViewList = null;
        if (action.SetDisabledViewList) SetDisabledViewList = action.SetDisabledViewList.map(m => EventActions.GetView(m));

        action.Parameters = { EditPropertiyViewList, SetDisabledViewList, SuccessCallback };
    }

    GetEntityData(props, action) {
        if (!action.Parameters) this.InitGetEntityData(props, action);

        const { EditView, SetRequestEntityData } = action.Parameters;
        const { EventActions } = props;

        let entityData = {}

        if (EditView.Entity) {
            const PrimaryKey = EditView.Entity.PrimaryKey;

            const id = EventActions.PageData[PrimaryKey];
            if (!id) return;

            entityData[PrimaryKey] = id;
        }

        if (EditView.ExpandGetEntityDataParameter) entityData = EditView.ExpandGetEntityDataParameter(entityData);

        //设置请求实体数据
        if (SetRequestEntityData) entityData = SetRequestEntityData({ entityData, props, action });

        //设置接收数据行数返回数据
        EventActions.Receives[EditView.GetEntityDataActionType] = (d) => this.ReceiveGetEntityDataActionType(d, props, action)

        //获取编辑值
        const data = { EntityData: entityData }

        //数据行为跟页面调用数据行为走
        EventActions.Invoke(EditView.GetEntityDataActionType, data);
    }

    ReceiveGetEntityDataActionType(data, props, action) {
        const { EditView, EditPropertiyViewList, SetGetEntityDataLoad } = action.Parameters;

        const { EventActions } = props;
        if (this.IsSuccessNextsProps(data, EventActions.Alert, null)) {
            EditView.EntityData = data || {};
            //多个编辑视图
            if (EditPropertiyViewList) {
                EditPropertiyViewList.forEach(v => {
                    const name = v.PropertyName || v.Name;
                    v.EntityData = data[name] || data;
                    this.SetViewPropertiesValue(v.Properties, v.EntityData);

                    //扩展实体数据加载
                    v.ExpandEntityDataLoad && v.ExpandEntityDataLoad();
                });
            }
            else this.SetViewPropertiesValue(EditView.Properties, data);

            //扩展实体数据加载
            EditView.ExpandEntityDataLoad && EditView.ExpandEntityDataLoad();

            if (SetGetEntityDataLoad) SetGetEntityDataLoad({ data, props, action })
        }

        return false;
    }

    InitGetEntityData(props, action) {
        const { EventActions } = props;
        const EditView = EventActions.GetView(action.EditView);
        const SetGetEntityDataLoad = EventActions.GetFunction(action.SetGetEntityDataLoad);
        const SetRequestEntityData = EventActions.GetFunction(action.SetRequestEntityData);

        let EditPropertiyViewList = null;
        if (action.EditPropertiyViewList) {
            EditPropertiyViewList = action.EditPropertiyViewList.map(m => EventActions.GetView(m));
        }

        action.Parameters = { EditView, EditPropertiyViewList, SetRequestEntityData, SetGetEntityDataLoad };
    }

    ClearPropertyValue(props, action) {
        if (!action.Parameters) this.InitClearPropertyValue(props, action);

        const { EventActions, Property } = props;
        const { EditView } = action.Parameters;

        const properties = EditView.filter(f => f.IsClear);

        if (Property.ConfirmTip) EventActions.Confirm(Property.ConfirmTip, () => this.SetPropertiesValue(properties));
        else this.SetPropertiesValue(properties)
    }

    InitClearPropertyValue(props, action) {
        const { EventActions } = props;
        const EditView = EventActions.GetView(action.EditView);

        action.Parameters = { EditView };
    }
}