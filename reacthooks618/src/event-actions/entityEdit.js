import BaseIndex from './baseIndex';
import { Common } from "UtilsCommon";

export default class EntityEdit extends BaseIndex {

    //弹出选择视图选择数据列表，单选，弹出层之前对DataGridView进行验证是否选择行。
    //行为参数，DataGridView，弹出层视图 dialogView
    selectRowUpdate(props, action) {
        if (!action.parameters) this.initSelectRowUpdateAction(props, action);
        const { pageAxis } = props;

        const { dataGridView, dialogView, alertMessage } = action.parameters;
        const { udpateEntityOkActionType } = dialogView;

        const selectDataList = dataGridView.getSelectDataList();
        if (selectDataList.length === 0) {
            this.alert("请选择记录再操作！", pageAxis.showMessage, alertMessage)
            return;
        }

        const entityData = selectDataList[0];

        this.setPropertiesValue(dialogView.properties, entityData)

        if (dialogView.expandDataLoad) pageAxis.getFunction(dialogView.expandDataLoad)({ entityData, props, action });

        //设置接收数据行数返回数据
        pageAxis.receives[udpateEntityOkActionType] = (d) => this.receiveDialogOkActionType(d, props, action)

        const onOk = (e, p) => this.setSelectRowUpdate(e, p, props, action, entityData);
        this.showdialog(action, pageAxis, dialogView, onOk);
    }

    //弹出层确定事件行为
    setSelectRowUpdate(e, p, props, action, selectData) {
        const { dialogView } = action.parameters;
        const { pageAxis } = props;

        action.OkProperty = p;

        const editProperties = dialogView.properties.filter(f => f.isEdit);

        let entityData = this.getPropertyValues(editProperties, pageAxis);
        if (dialogView.expandSetEntityData) entityData = dialogView.expandSetEntityData(entityData);

        if (entityData === false) return;

        //获取编辑值
        const data = { oldEntityData: selectData, entityData }

        //禁用确定按钮
        p.setDisabled(true);

        //数据行为跟页面调用数据行为走
        pageAxis.invokeDataAction(dialogView.udpateEntityOkActionType, data);
    }

    initSelectRowUpdateAction(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getProperty(action.dataGridView);
        const dialogView = Common.arrayFirst(pageAxis.pageConfig.dialogViews, (f) => f.name === action.dialogView);
        const alertMessage = pageAxis.getProperty(action.alertMessage);

        action.parameters = { dataGridView, dialogView, alertMessage }
    }

    //保存实体数据，包含增加与更新
    saveEntityData(props, action) {
        if (!action.parameters) this.initSaveEntityData(props, action);

        const { editView, expandSetEntityData } = action.parameters;
        const { pageAxis, property } = props;

        let entityData = this.getPropertyEntityData(props, editView, expandSetEntityData);
        if (entityData === false) return;

        if (property.confirmTip) pageAxis.confirm(property.confirmTip, () => this.saveEditEntityData(props, action, editView, entityData));
        else this.saveEditEntityData(props, action, editView, entityData);
    }

    saveEditEntityData(props, action, editView, entityData) {
        const { pageAxis, property, editData } = props;

        //设置传入的编辑数据
        if (editData) for (let key in editData) entityData[key] = editData[key];

        editView.editData = entityData;

        const actionType = editView.saveEntityDataActionType || property.saveEntityDataActionType;

        //设置接收数据行数返回数据
        pageAxis.receives[actionType] = (d) => this.receiveSaveEntityDataActionType(d, props, action);

        //获取编辑值
        const data = { oldEntityData: editView.entityData, entity: editView.entity, entityData: entityData, pageData: pageAxis.pageData }

        //禁用确定按钮
        property.setLoading && property.setLoading(true);

        //数据行为跟页面调用数据行为走
        pageAxis.invokeDataAction(actionType, data);
    }

    saveEntityDataViews(props, action) {
        if (!action.parameters) this.initSaveEntityDataViews(props, action);

        const { editPropertiyViewList, expandSetEntityData } = action.parameters;
        const { pageAxis, property } = props;

        let entityData = {}, viewEntityData = null;

        for (let i = 0; i < editPropertiyViewList.length; i++) {
            viewEntityData = this.getPropertyEntityData(props, editPropertiyViewList[i], expandSetEntityData);
            if (viewEntityData === false) { entityData = false; break; }
            else for (let key in viewEntityData) entityData[key] = viewEntityData[key];
        }

        if (entityData === false) return;

        const editView = editPropertiyViewList[0];

        if (property.confirmTip) pageAxis.confirm(property.confirmTip, () => this.saveEditEntityData(props, action, editView, entityData));
        else this.saveEditEntityData(props, action, editView, entityData);
    }

    getPropertyEntityData(props, view, expandSetEntityData) {
        const { pageAxis } = props;
        const { defaultEditData } = view;

        let entityData = this.getPropertyPropertiesValue(view.properties, pageAxis);

        if (view.expandSetEntityData) entityData = view.expandSetEntityData(entityData);

        if (entityData === false) return false;

        if (expandSetEntityData) entityData = expandSetEntityData({ entityData, props, view });

        if (entityData === false) return false;

        //设置默认编辑数据
        if (defaultEditData) for (let key in defaultEditData) entityData[key] = defaultEditData[key];

        return entityData;
    }

    receiveSaveEntityDataActionType(data, props, action) {
        const { editPropertiyViewList, setDisabledViewList, successCallback } = action.parameters;
        let editView = action.parameters.editView
        if (editPropertiyViewList) editView = editPropertiyViewList[0];

        const { pageAxis, property } = props;
        if (property.isComplexEntity) setTimeout(() => property.setLoading && property.setLoading(false), 200);
        else property.setLoading && property.setLoading(false);
        if (this.isSuccessNextsProps(data, pageAxis.alert, null)) {
            if (editView.entityData) editView.entityData = { ...editView.entityData, ...editView.editData }; //更新
            else if (editPropertiyViewList) {
                //新增，清空属性值
                editPropertiyViewList.forEach(v => {
                    if (v.isClear) this.setViewPropertiesValue(v.properties, null);
                });
            }
            else if (editView.isClear) this.setViewPropertiesValue(editView.properties, null); //新增，清空属性值

            //保存之后禁用控件
            if (setDisabledViewList) {
                //新增，清空属性值
                setDisabledViewList.forEach(v => {
                    this.setViewPropertiesDisabled(v.properties);
                });
            }

            const onOk = () => {
                if (action.toPageUrl) pageAxis.toPage(action.toPageUrl);
            };

            if (successCallback) successCallback({ data, props, action });
            else pageAxis.alertSuccess(editView.successTip || "保存成功", onOk);

            if (property.setTextType && property.text2) property.setTextType(property.text2, "default");
        }

        return false;
    }

    initSaveEntityData(props, action) {
        const { pageAxis } = props;
        const editView = pageAxis.getProperty(action.editView);
        const successCallback = pageAxis.getFunction(action.successCallback);
        const expandSetEntityData = pageAxis.getFunction(action.expandSetEntityData);

        let editPropertiyViewList = null;
        if (action.editPropertiyViewList) {
            editPropertiyViewList = action.editPropertiyViewList.map(m => pageAxis.getProperty(m));
        }

        let setDisabledViewList = null;
        if (action.setDisabledViewList) setDisabledViewList = action.setDisabledViewList.map(m => pageAxis.getProperty(m));

        action.parameters = { editView, editPropertiyViewList, setDisabledViewList, successCallback, expandSetEntityData };
    }

    initSaveEntityDataViews(props, action) {
        const { pageAxis } = props;
        const successCallback = pageAxis.getFunction(action.successCallback);

        const editPropertiyViewList = action.editPropertiyViewList.map(m => pageAxis.getProperty(m));

        let setDisabledViewList = null;
        if (action.setDisabledViewList) setDisabledViewList = action.setDisabledViewList.map(m => pageAxis.getProperty(m));

        action.parameters = { editPropertiyViewList, setDisabledViewList, successCallback };
    }

    getEntityData(props, action) {
        if (!action.parameters) this.initGetEntityData(props, action);

        const { editView, setRequestEntityData } = action.parameters;
        const { pageAxis } = props;

        let entityData = {}

        if (editView.entity) {
            const { primaryKey } = editView.entity;

            var id = pageAxis.pageData[primaryKey];
            if (editView.primaryKey) id = editView.primaryKey;
            if (!id) return;

            entityData[primaryKey] = id;
        }

        if (editView.expandgetEntityDataParameter) entityData = editView.expandgetEntityDataParameter(entityData);

        //设置请求实体数据
        if (setRequestEntityData) entityData = setRequestEntityData({ entityData, props, action });

        //设置接收数据行数返回数据
        pageAxis.receives[editView.getEntityDataActionType] = (d) => this.receivegetEntityDataActionType(d, props, action)

        //获取编辑值
        const data = { entityData: entityData, entity: editView.entity }

        if (action.asyncRequest) data.asyncRequest = action.asyncRequest;

        //数据行为跟页面调用数据行为走
        pageAxis.invokeDataAction(editView.getEntityDataActionType, data);
    }

    receivegetEntityDataActionType(data, props, action) {
        const { editView, editPropertiyViewList, setGetEntityDataLoad } = action.parameters;

        const { pageAxis } = props;
        if (this.isSuccessNextsProps(data, pageAxis.alert, null)) {
            editView.entityData = data || {};
            //多个编辑视图
            if (editPropertiyViewList) {
                editPropertiyViewList.forEach(v => {
                    const name = v.propertyName || v.name;
                    v.entityData = data[name] || data;
                    this.setViewPropertiesValue(v.properties, v.entityData, true);

                    //扩展实体数据加载
                    v.expandEntityDataLoad && v.expandEntityDataLoad();
                });
            }
            else this.setViewPropertiesValue(editView.properties, data, true);

            //扩展实体数据加载
            editView.expandEntityDataLoad && editView.expandEntityDataLoad();

            if (setGetEntityDataLoad) setGetEntityDataLoad({ data, props, action })
        }

        return false;
    }

    initGetEntityData(props, action) {
        const { pageAxis } = props;
        const editView = pageAxis.getProperty(action.editView);
        const setGetEntityDataLoad = pageAxis.getFunction(action.setGetEntityDataLoad);
        const setRequestEntityData = pageAxis.getFunction(action.setRequestEntityData);

        let editPropertiyViewList = null;
        if (action.editPropertiyViewList) {
            editPropertiyViewList = action.editPropertiyViewList.map(m => pageAxis.getProperty(m));
        }

        action.parameters = { editView, editPropertiyViewList, setRequestEntityData, setGetEntityDataLoad };
    }

    clearPropertyValue(props, action) {
        if (!action.parameters) this.initClearPropertyValue(props, action);

        const { pageAxis, property } = props;
        const { editView } = action.parameters;

        const properties = editView.properties.filter(f => f.isClear);

        if (property.confirmTip) pageAxis.confirm(property.confirmTip, () => this.setPropertiesValue(properties));
        else this.setPropertiesValue(properties)
    }

    initClearPropertyValue(props, action) {
        const { pageAxis } = props;
        const editView = pageAxis.getProperty(action.editView);

        action.parameters = { editView };
    }
}
