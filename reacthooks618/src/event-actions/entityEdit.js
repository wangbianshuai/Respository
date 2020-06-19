import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class EntityEdit extends BaseIndex {

    //弹出选择视图选择数据列表，单选，弹出层之前对DataGridView进行验证是否选择行。
    //行为参数，DataGridView，弹出层视图 DialogView
    SelectRowUpdate(props, action) {
        if (!action.Parameters) this.InitSelectRowUpdateAction(props, action);
        const { pageAxis } = props;

        const { dataGridView, DialogView, AlertMessage } = action.Parameters;
        const { UdpateEntityOkActionType } = DialogView;

        const selectDataList = dataGridView.getSelectDataList();
        if (selectDataList.length === 0) {
            this.Alert("请选择记录再操作！", pageAxis.ShowMessage, AlertMessage)
            return;
        }

        const entityData = selectDataList[0];

        this.setPropertiesValue(DialogView.properties, entityData)

        if (DialogView.expandDataLoad) pageAxis.getFunction(DialogView.expandDataLoad)({ entityData, props, action });

        //设置接收数据行数返回数据
        pageAxis.Receives[UdpateEntityOkActionType] = (d) => this.ReceiveDialogOkActionType(d, props, action)

        const onOk = (e, p) => this.setSelectRowUpdate(e, p, props, action, entityData);
        this.ShowDialog(action, pageAxis, DialogView, onOk);
    }

    //弹出层确定事件行为
    setSelectRowUpdate(e, p, props, action, selectData) {
        const { DialogView } = action.Parameters;
        const { pageAxis } = props;

        action.OkProperty = p;

        const editProperties = DialogView.properties.filter(f => f.isEdit);

        let entityData = this.getPropertyValues(editProperties, pageAxis);
        if (DialogView.expandsetEntityData) entityData = DialogView.expandsetEntityData(entityData);

        if (entityData === false) return;

        //获取编辑值
        const data = { OldEntityData: selectData, EntityData: entityData }

        //禁用确定按钮
        p.setDisabled(true);

        //数据行为跟页面调用数据行为走
        pageAxis.Invoke(DialogView.UdpateEntityOkActionType, data);
    }

    InitSelectRowUpdateAction(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getComponent(action.dataGridView);
        const DialogView = Common.arrayFirst(pageAxis.PageConfig.DialogViews, (f) => f.name === action.DialogView);
        const AlertMessage = pageAxis.getControl(action.AlertMessage);

        action.Parameters = { dataGridView, DialogView, AlertMessage }
    }

    //保存实体数据，包含增加与更新
    SaveEntityData(props, action) {
        if (!action.Parameters) this.InitSaveEntityData(props, action);

        const { EditView, expandsetEntityData } = action.Parameters;
        const { pageAxis, property } = props;

        let entityData = this.getViewEntityData(props, EditView, expandsetEntityData);
        if (entityData === false) return;

        if (property.ConfirmTip) pageAxis.Confirm(property.ConfirmTip, () => this.SaveEditEntityData(props, action, EditView, entityData));
        else this.SaveEditEntityData(props, action, EditView, entityData);
    }

    SaveEditEntityData(props, action, EditView, entityData) {
        const { pageAxis, property, EditData } = props;

        //设置传入的编辑数据
        if (EditData) for (let key in EditData) entityData[key] = EditData[key];

        EditView.EditData = entityData;

        const actionType = EditView.SaveEntityDataActionType || property.SaveEntityDataActionType;

        //设置接收数据行数返回数据
        pageAxis.Receives[actionType] = (d) => this.ReceiveSaveEntityDataActionType(d, props, action);

        //获取编辑值
        const data = { OldEntityData: EditView.EntityData, entity: EditView.entity, EntityData: entityData, pageData: pageAxis.pageData }

        //禁用确定按钮
        property.setLoading && property.setLoading(true);

        //数据行为跟页面调用数据行为走
        pageAxis.Invoke(actionType, data);
    }

    SaveEntityDataViews(props, action) {
        if (!action.Parameters) this.InitSaveEntityDataViews(props, action);

        const { EditPropertiyViewList, expandsetEntityData } = action.Parameters;
        const { pageAxis, property } = props;

        let entityData = {}, viewEntityData = null;

        for (let i = 0; i < EditPropertiyViewList.length; i++) {
            viewEntityData = this.getViewEntityData(props, EditPropertiyViewList[i], expandsetEntityData);
            if (viewEntityData === false) { entityData = false; break; }
            else for (let key in viewEntityData) entityData[key] = viewEntityData[key];
        }

        if (entityData === false) return;

        const EditView = EditPropertiyViewList[0];

        if (property.ConfirmTip) pageAxis.Confirm(property.ConfirmTip, () => this.SaveEditEntityData(props, action, EditView, entityData));
        else this.SaveEditEntityData(props, action, EditView, entityData);
    }

    getViewEntityData(props, view, expandsetEntityData) {
        const { pageAxis } = props;
        const { DefaultEditData } = view;

        let entityData = this.getViewPropertiesValue(view.properties, pageAxis);

        if (view.expandsetEntityData) entityData = view.expandsetEntityData(entityData);

        if (entityData === false) return false;

        if (expandsetEntityData) entityData = expandsetEntityData({ entityData, props, view });

        if (entityData === false) return false;

        //设置默认编辑数据
        if (DefaultEditData) for (let key in DefaultEditData) entityData[key] = DefaultEditData[key];

        return entityData;
    }

    ReceiveSaveEntityDataActionType(data, props, action) {
        const { EditPropertiyViewList, setDisabledViewList, successCallback } = action.Parameters;
        let EditView = action.Parameters.EditView
        if (EditPropertiyViewList) EditView = EditPropertiyViewList[0];

        const { pageAxis, property } = props;
        if (property.isComplexEntity) setTimeout(() => property.setLoading && property.setLoading(false), 200);
        else property.setLoading && property.setLoading(false);
        if (this.isSuccessNextsProps(data, pageAxis.Alert, null)) {
            if (EditView.EntityData) EditView.EntityData = { ...EditView.EntityData, ...EditView.EditData }; //更新
            else if (EditPropertiyViewList) {
                //新增，清空属性值
                EditPropertiyViewList.forEach(v => {
                    if (v.isClear) this.setViewPropertiesValue(v.properties, null);
                });
            }
            else if (EditView.isClear) this.setViewPropertiesValue(EditView.properties, null); //新增，清空属性值

            //保存之后禁用控件
            if (setDisabledViewList) {
                //新增，清空属性值
                setDisabledViewList.forEach(v => {
                    this.setViewPropertiesDisabled(v.properties);
                });
            }

            const onOk = () => {
                if (action.ToPageUrl) pageAxis.ToPage(action.ToPageUrl);
            };

            if (successCallback) successCallback({ data, props, action });
            else pageAxis.AlertSuccess(EditView.SuccessTip || "保存成功", onOk);

            if (property.setTextType && property.Text2) property.setTextType(property.Text2, "default");
        }

        return false;
    }

    InitSaveEntityData(props, action) {
        const { pageAxis } = props;
        const EditView = pageAxis.getView(action.EditView);
        const successCallback = pageAxis.getFunction(action.successCallback);
        const expandsetEntityData = pageAxis.getFunction(action.expandsetEntityData);

        let EditPropertiyViewList = null;
        if (action.EditPropertiyViewList) {
            EditPropertiyViewList = action.EditPropertiyViewList.map(m => pageAxis.getView(m));
        }

        let setDisabledViewList = null;
        if (action.setDisabledViewList) setDisabledViewList = action.setDisabledViewList.map(m => pageAxis.getView(m));

        action.Parameters = { EditView, EditPropertiyViewList, setDisabledViewList, successCallback, expandsetEntityData };
    }

    InitSaveEntityDataViews(props, action) {
        const { pageAxis } = props;
        const successCallback = pageAxis.getFunction(action.successCallback);

        const EditPropertiyViewList = action.EditPropertiyViewList.map(m => pageAxis.getView(m));

        let setDisabledViewList = null;
        if (action.setDisabledViewList) setDisabledViewList = action.setDisabledViewList.map(m => pageAxis.getView(m));

        action.Parameters = { EditPropertiyViewList, setDisabledViewList, successCallback };
    }

    getEntityData(props, action) {
        if (!action.Parameters) this.InitgetEntityData(props, action);

        const { EditView, setRequestEntityData } = action.Parameters;
        const { pageAxis } = props;

        let entityData = {}

        if (EditView.entity) {
            const { primaryKey } = EditView.entity;

            var id = pageAxis.pageData[primaryKey];
            if (EditView.primaryKey) id = EditView.primaryKey;
            if (!id) return;

            entityData[primaryKey] = id;
        }

        if (EditView.expandgetEntityDataParameter) entityData = EditView.expandgetEntityDataParameter(entityData);

        //设置请求实体数据
        if (setRequestEntityData) entityData = setRequestEntityData({ entityData, props, action });

        //设置接收数据行数返回数据
        pageAxis.Receives[EditView.getEntityDataActionType] = (d) => this.ReceivegetEntityDataActionType(d, props, action)

        //获取编辑值
        const data = { EntityData: entityData, entity: EditView.entity }

        if (action.AsyncRequest) data.AsyncRequest = action.AsyncRequest;

        //数据行为跟页面调用数据行为走
        pageAxis.Invoke(EditView.getEntityDataActionType, data);
    }

    ReceivegetEntityDataActionType(data, props, action) {
        const { EditView, EditPropertiyViewList, setgetEntityDataLoad } = action.Parameters;

        const { pageAxis } = props;
        if (this.isSuccessNextsProps(data, pageAxis.Alert, null)) {
            EditView.EntityData = data || {};
            //多个编辑视图
            if (EditPropertiyViewList) {
                EditPropertiyViewList.forEach(v => {
                    const name = v.propertyName || v.name;
                    v.EntityData = data[name] || data;
                    this.setViewPropertiesValue(v.properties, v.EntityData, true);

                    //扩展实体数据加载
                    v.expandEntityDataLoad && v.expandEntityDataLoad();
                });
            }
            else this.setViewPropertiesValue(EditView.properties, data, true);

            //扩展实体数据加载
            EditView.expandEntityDataLoad && EditView.expandEntityDataLoad();

            if (setgetEntityDataLoad) setgetEntityDataLoad({ data, props, action })
        }

        return false;
    }

    InitgetEntityData(props, action) {
        const { pageAxis } = props;
        const EditView = pageAxis.getView(action.EditView);
        const setgetEntityDataLoad = pageAxis.getFunction(action.setgetEntityDataLoad);
        const setRequestEntityData = pageAxis.getFunction(action.setRequestEntityData);

        let EditPropertiyViewList = null;
        if (action.EditPropertiyViewList) {
            EditPropertiyViewList = action.EditPropertiyViewList.map(m => pageAxis.getView(m));
        }

        action.Parameters = { EditView, EditPropertiyViewList, setRequestEntityData, setgetEntityDataLoad };
    }

    ClearPropertyValue(props, action) {
        if (!action.Parameters) this.InitClearPropertyValue(props, action);

        const { pageAxis, property } = props;
        const { EditView } = action.Parameters;

        const properties = EditView.properties.filter(f => f.isClear);

        if (property.ConfirmTip) pageAxis.Confirm(property.ConfirmTip, () => this.setPropertiesValue(properties));
        else this.setPropertiesValue(properties)
    }

    InitClearPropertyValue(props, action) {
        const { pageAxis } = props;
        const EditView = pageAxis.getView(action.EditView);

        action.Parameters = { EditView };
    }
}
