import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class EntityEdit extends BaseIndex {

    //弹出选择视图选择数据列表，单选，弹出层之前对DataGridView进行验证是否选择行。
    //行为参数，DataGridView，弹出层视图 DialogView
    SelectRowUpdate(props, action) {
        if (!action.Parameters) this.InitSelectRowUpdateAction(props, action);
        const { PageAxis } = props;

        const { DataGridView, DialogView, AlertMessage } = action.Parameters;
        const { UdpateEntityOkActionType } = DialogView;

        const selectDataList = DataGridView.GetSelectDataList();
        if (selectDataList.length === 0) {
            this.Alert("请选择记录再操作！", PageAxis.ShowMessage, AlertMessage)
            return;
        }

        const entityData = selectDataList[0];

        this.SetPropertiesValue(DialogView.Properties, entityData)

        if (DialogView.ExpandDataLoad) PageAxis.GetFunction(DialogView.ExpandDataLoad)({ entityData, props, action });

        //设置接收数据行数返回数据
        PageAxis.Receives[UdpateEntityOkActionType] = (d) => this.ReceiveDialogOkActionType(d, props, action)

        const onOk = (e, p) => this.SetSelectRowUpdate(e, p, props, action, entityData);
        this.ShowDialog(action, PageAxis, DialogView, onOk);
    }

    //弹出层确定事件行为
    SetSelectRowUpdate(e, p, props, action, selectData) {
        const { DialogView } = action.Parameters;
        const { PageAxis } = props;

        action.OkProperty = p;

        const editProperties = DialogView.Properties.filter(f => f.IsEdit);

        let entityData = this.GetPropertyValues(editProperties, PageAxis);
        if (DialogView.ExpandSetEntityData) entityData = DialogView.ExpandSetEntityData(entityData);

        if (entityData === false) return;

        //获取编辑值
        const data = { OldEntityData: selectData, EntityData: entityData }

        //禁用确定按钮
        p.SetDisabled(true);

        //数据行为跟页面调用数据行为走
        PageAxis.Invoke(DialogView.UdpateEntityOkActionType, data);
    }

    InitSelectRowUpdateAction(props, action) {
        const { PageAxis } = props;
        const DataGridView = PageAxis.GetComponent(action.DataGridView);
        const DialogView = Common.ArrayFirst(PageAxis.PageConfig.DialogViews, (f) => f.Name === action.DialogView);
        const AlertMessage = PageAxis.GetControl(action.AlertMessage);

        action.Parameters = { DataGridView, DialogView, AlertMessage }
    }

    //保存实体数据，包含增加与更新
    SaveEntityData(props, action) {
        if (!action.Parameters) this.InitSaveEntityData(props, action);

        const { EditView, ExpandSetEntityData } = action.Parameters;
        const { PageAxis, Property } = props;

        let entityData = this.GetViewEntityData(props, EditView, ExpandSetEntityData);
        if (entityData === false) return;

        if (Property.ConfirmTip) PageAxis.Confirm(Property.ConfirmTip, () => this.SaveEditEntityData(props, action, EditView, entityData));
        else this.SaveEditEntityData(props, action, EditView, entityData);
    }

    SaveEditEntityData(props, action, EditView, entityData) {
        const { PageAxis, Property, EditData } = props;

        //设置传入的编辑数据
        if (EditData) for (let key in EditData) entityData[key] = EditData[key];

        EditView.EditData = entityData;

        const actionType = EditView.SaveEntityDataActionType || Property.SaveEntityDataActionType;

        //设置接收数据行数返回数据
        PageAxis.Receives[actionType] = (d) => this.ReceiveSaveEntityDataActionType(d, props, action);

        //获取编辑值
        const data = { OldEntityData: EditView.EntityData, Entity: EditView.Entity, EntityData: entityData, PageData: PageAxis.PageData }

        //禁用确定按钮
        Property.SetLoading && Property.SetLoading(true);

        //数据行为跟页面调用数据行为走
        PageAxis.Invoke(actionType, data);
    }

    SaveEntityDataViews(props, action) {
        if (!action.Parameters) this.InitSaveEntityDataViews(props, action);

        const { EditPropertiyViewList, ExpandSetEntityData } = action.Parameters;
        const { PageAxis, Property } = props;

        let entityData = {}, viewEntityData = null;

        for (let i = 0; i < EditPropertiyViewList.length; i++) {
            viewEntityData = this.GetViewEntityData(props, EditPropertiyViewList[i], ExpandSetEntityData);
            if (viewEntityData === false) { entityData = false; break; }
            else for (let key in viewEntityData) entityData[key] = viewEntityData[key];
        }

        if (entityData === false) return;

        const EditView = EditPropertiyViewList[0];

        if (Property.ConfirmTip) PageAxis.Confirm(Property.ConfirmTip, () => this.SaveEditEntityData(props, action, EditView, entityData));
        else this.SaveEditEntityData(props, action, EditView, entityData);
    }

    GetViewEntityData(props, view, ExpandSetEntityData) {
        const { PageAxis } = props;
        const { DefaultEditData } = view;

        let entityData = this.GetViewPropertiesValue(view.Properties, PageAxis);

        if (view.ExpandSetEntityData) entityData = view.ExpandSetEntityData(entityData);

        if (entityData === false) return false;

        if (ExpandSetEntityData) entityData = ExpandSetEntityData({ entityData, props, view });

        if (entityData === false) return false;

        //设置默认编辑数据
        if (DefaultEditData) for (let key in DefaultEditData) entityData[key] = DefaultEditData[key];

        return entityData;
    }

    ReceiveSaveEntityDataActionType(data, props, action) {
        const { EditPropertiyViewList, SetDisabledViewList, SuccessCallback } = action.Parameters;
        let EditView = action.Parameters.EditView
        if (EditPropertiyViewList) EditView = EditPropertiyViewList[0];

        const { PageAxis, Property } = props;
        if (Property.IsComplexEntity) setTimeout(() => Property.SetLoading && Property.SetLoading(false), 200);
        else Property.SetLoading && Property.SetLoading(false);
        if (this.IsSuccessNextsProps(data, PageAxis.Alert, null)) {
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

            const onOk = () => {
                if (action.ToPageUrl) PageAxis.ToPage(action.ToPageUrl);
            };

            if (SuccessCallback) SuccessCallback({ data, props, action });
            else PageAxis.AlertSuccess(EditView.SuccessTip || "保存成功", onOk);

            if (Property.SetTextType && Property.Text2) Property.SetTextType(Property.Text2, "default");
        }

        return false;
    }

    InitSaveEntityData(props, action) {
        const { PageAxis } = props;
        const EditView = PageAxis.GetView(action.EditView);
        const SuccessCallback = PageAxis.GetFunction(action.SuccessCallback);
        const ExpandSetEntityData = PageAxis.GetFunction(action.ExpandSetEntityData);

        let EditPropertiyViewList = null;
        if (action.EditPropertiyViewList) {
            EditPropertiyViewList = action.EditPropertiyViewList.map(m => PageAxis.GetView(m));
        }

        let SetDisabledViewList = null;
        if (action.SetDisabledViewList) SetDisabledViewList = action.SetDisabledViewList.map(m => PageAxis.GetView(m));

        action.Parameters = { EditView, EditPropertiyViewList, SetDisabledViewList, SuccessCallback, ExpandSetEntityData };
    }

    InitSaveEntityDataViews(props, action) {
        const { PageAxis } = props;
        const SuccessCallback = PageAxis.GetFunction(action.SuccessCallback);

        const EditPropertiyViewList = action.EditPropertiyViewList.map(m => PageAxis.GetView(m));

        let SetDisabledViewList = null;
        if (action.SetDisabledViewList) SetDisabledViewList = action.SetDisabledViewList.map(m => PageAxis.GetView(m));

        action.Parameters = { EditPropertiyViewList, SetDisabledViewList, SuccessCallback };
    }

    GetEntityData(props, action) {
        if (!action.Parameters) this.InitGetEntityData(props, action);

        const { EditView, SetRequestEntityData } = action.Parameters;
        const { PageAxis } = props;

        let entityData = {}

        if (EditView.Entity) {
            const { PropertyPrimaryKey, PrimaryKey } = EditView.Entity;

            var id = PageAxis.PageData[PrimaryKey];
            if (EditView.PrimaryKey) id = EditView.PrimaryKey;
            if (!id) return;

            const name = PropertyPrimaryKey || PrimaryKey;
            entityData[name] = id;
        }

        if (EditView.ExpandGetEntityDataParameter) entityData = EditView.ExpandGetEntityDataParameter(entityData);

        //设置请求实体数据
        if (SetRequestEntityData) entityData = SetRequestEntityData({ entityData, props, action });

        //设置接收数据行数返回数据
        PageAxis.Receives[EditView.GetEntityDataActionType] = (d) => this.ReceiveGetEntityDataActionType(d, props, action)

        //获取编辑值
        const data = { EntityData: entityData, Entity: EditView.Entity }

        if (action.AsyncRequest) data.AsyncRequest = action.AsyncRequest;

        //数据行为跟页面调用数据行为走
        PageAxis.Invoke(EditView.GetEntityDataActionType, data);
    }

    ReceiveGetEntityDataActionType(data, props, action) {
        const { EditView, EditPropertiyViewList, SetGetEntityDataLoad } = action.Parameters;

        const { PageAxis } = props;
        if (this.IsSuccessNextsProps(data, PageAxis.Alert, null)) {
            EditView.EntityData = data || {};
            //多个编辑视图
            if (EditPropertiyViewList) {
                EditPropertiyViewList.forEach(v => {
                    const name = v.PropertyName || v.Name;
                    v.EntityData = data[name] || data;
                    this.SetViewPropertiesValue(v.Properties, v.EntityData, true);

                    //扩展实体数据加载
                    v.ExpandEntityDataLoad && v.ExpandEntityDataLoad();
                });
            }
            else this.SetViewPropertiesValue(EditView.Properties, data, true);

            //扩展实体数据加载
            EditView.ExpandEntityDataLoad && EditView.ExpandEntityDataLoad();

            if (SetGetEntityDataLoad) SetGetEntityDataLoad({ data, props, action })
        }

        return false;
    }

    InitGetEntityData(props, action) {
        const { PageAxis } = props;
        const EditView = PageAxis.GetView(action.EditView);
        const SetGetEntityDataLoad = PageAxis.GetFunction(action.SetGetEntityDataLoad);
        const SetRequestEntityData = PageAxis.GetFunction(action.SetRequestEntityData);

        let EditPropertiyViewList = null;
        if (action.EditPropertiyViewList) {
            EditPropertiyViewList = action.EditPropertiyViewList.map(m => PageAxis.GetView(m));
        }

        action.Parameters = { EditView, EditPropertiyViewList, SetRequestEntityData, SetGetEntityDataLoad };
    }

    ClearPropertyValue(props, action) {
        if (!action.Parameters) this.InitClearPropertyValue(props, action);

        const { PageAxis, Property } = props;
        const { EditView } = action.Parameters;

        const properties = EditView.Properties.filter(f => f.IsClear);

        if (Property.ConfirmTip) PageAxis.Confirm(Property.ConfirmTip, () => this.SetPropertiesValue(properties));
        else this.SetPropertiesValue(properties)
    }

    InitClearPropertyValue(props, action) {
        const { PageAxis } = props;
        const EditView = PageAxis.GetView(action.EditView);

        action.Parameters = { EditView };
    }
}
