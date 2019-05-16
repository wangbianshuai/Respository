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
        if (!EventActions.Receives[UdpateEntityOkActionType]) {
            EventActions.Receives[UdpateEntityOkActionType] = (d) => this.ReceiveDialogOkActionType(d, props, action)
        }

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

        let entityData = this.GetViewPropertiesValue(EditView.Properties, EventActions);

        if (EditView.ExpandSetEntityData) entityData = EditView.ExpandSetEntityData(entityData);

        if (entityData === false) return;

        EditView.EditData = entityData;

        //设置接收数据行数返回数据
        if (!EventActions.Receives[EditView.SaveEntityDataActionType]) {
            EventActions.Receives[EditView.SaveEntityDataActionType] = (d) => this.ReceiveSaveEntityDataActionType(d, props, action)
        }

        //获取编辑值
        const data = { OldEntityData: EditView.EntityData, EntityData: entityData }

        //禁用确定按钮
        Property.SetLoading(true);

        //数据行为跟页面调用数据行为走
        EventActions.Invoke(EditView.SaveEntityDataActionType, data);
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

    ReceiveSaveEntityDataActionType(data, props, action) {
        const { EditView } = action.Parameters;

        const { EventActions, Property } = props;
        Property.SetLoading(false);
        if (this.IsSuccessNextsProps(data, EventActions.Alert, null)) {
            EditView.EntityData = { ...EditView.EditData, ...data };
            EventActions.AlertSuccess(EditView.SuccessTip || "保存成功");
        }

        return false;
    }

    InitSaveEntityData(props, action) {
        const { EventActions } = props;
        const EditView = EventActions.GetView(action.EditView);

        action.Parameters = { EditView };
    }

    GetEntityData(props, action) {
        if (!action.Parameters) this.InitGetEntityData(props, action);

        const { EditView } = action.Parameters;
        const { EventActions } = props;
        const PrimaryKey = EditView.Entity.PrimaryKey;

        const id = EventActions.PageData[PrimaryKey];
        if (!id) return;

        let entityData = {}
        entityData[PrimaryKey] = id;

        if (EditView.ExpandGetEntityDataParameter) entityData = EditView.ExpandGetEntityDataParameter(entityData);

        //设置接收数据行数返回数据
        if (!EventActions.Receives[EditView.GetEntityDataActionType]) {
            EventActions.Receives[EditView.GetEntityDataActionType] = (d) => this.ReceiveGetEntityDataActionType(d, props, action)
        }

        //获取编辑值
        const data = { EntityData: entityData }

        //数据行为跟页面调用数据行为走
        EventActions.Invoke(EditView.GetEntityDataActionType, data);
    }

    ReceiveGetEntityDataActionType(data, props, action) {
        const { EditView } = action.Parameters;

        const { EventActions } = props;
        if (this.IsSuccessNextsProps(data, EventActions.Alert, null)) {
            EditView.EntityData = data;
            this.SetViewPropertiesValue(EditView.Properties, data);
        }

        return false;
    }

    SetViewPropertiesValue(properties, data) {
        this.SetPropertiesValue(properties, data);

        const viewProperties = properties.filter(f => f.IsView);

        for (let i = 0; i < viewProperties.length; i++) {
            this.SetViewPropertiesValue(viewProperties[i].Properties, data);
        }
    }

    InitGetEntityData(props, action) {
        const { EventActions } = props;
        const EditView = EventActions.GetView(action.EditView);

        action.Parameters = { EditView };
    }
}