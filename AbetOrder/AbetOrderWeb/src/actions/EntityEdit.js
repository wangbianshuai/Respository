import * as Common from "../utils/Common"
import Index from "./Index"

export default class EntityEdit extends Index {
    constructor(options) {
        super(options)

        this.Name = "EntityEdit";
    }

    PropsChanged(props, nextProps) {
        //添加
        this.ReceiveInsertInfo(props, nextProps);

        //获取实体数据
        this.ReceiveEntityData(props, nextProps);

        //更新
        this.ReceiveUpdateInfo(props, nextProps);

        //删除
        this.ReceiveDeleteInfo(props, nextProps);
    }

    ReceiveInsertInfo(props, nextProps) {
        if (this.Page.JudgeChanged(nextProps, "InsertInfo")) {
            if (nextProps.InsertInfo && nextProps.InsertInfo.Succeed) {
                const { PageConfig } = props;

                if (PageConfig.IsEditPage) {
                    const id = nextProps.InsertInfo.PrimaryKey;
                    const url = `/${PageConfig.Name}?${PageConfig.PrimaryKey}=${id}`
                    props.ToPage(url);
                }
                else {
                    const { EditView } = PageConfig;

                    EditView.SetEdit && EditView.SetEdit({ IsVisible: false });

                    //刷新查询
                    this.Page.EventActions.Query.Refresh("Insert");
                }
            }
            else this.SetOkDisabled(false);
        }
    }

    ReceiveUpdateInfo(props, nextProps) {
        if (this.Page.JudgeChanged(nextProps, "UpdateInfo")) {
            if (nextProps.UpdateInfo && nextProps.UpdateInfo.Succeed) {
                const { PageConfig } = props;

                if (PageConfig.IsEditPage) {
                    this.Page.ShowMessage("保存成功！")
                    this.SetOkDisabled(false);
                }
                else {
                    const { EditView } = PageConfig;

                    EditView.SetEdit && EditView.SetEdit({ IsVisible: false });

                    //刷新查询
                    this.Page.EventActions.Query.Refresh("Update");
                }
            }
            else this.SetOkDisabled(false);
        }
    }

    //删除
    ReceiveDeleteInfo(props, nextProps) {
        if (this.Page.JudgeChanged(nextProps, "DeleteInfo")) {
            if (nextProps.DeleteInfo && nextProps.DeleteInfo.Succeed) {
                const { PageConfig } = props;

                if (PageConfig.IsEditPage) {
                    const url = "/" + PageConfig.Name;
                    props.ToPage(url);
                }
                else {
                    //刷新查询
                    this.Page.EventActions.Query.Refresh("Delete");
                }
            }
        }
    }

    SetOkDisabled(disabled) {
        this.OkProperty && this.OkProperty.SetDisabled && this.OkProperty.SetDisabled(disabled);
    }

    ReceiveEntityData(props, nextProps) {
        if (this.Page.JudgeChanged(nextProps, "EntityData")) {
            let entityData = !nextProps.EntityData || nextProps.EntityData.IsSuccess === false ? null : nextProps.EntityData
            this.SetEntityData(entityData);
        }
    }

    NewAdd(property, params) {
        if (Common.IsNullOrEmpty(property.EditPageUrl)) this.EditEntityData(null);
        else this.Page.props.ToPage(property.EditPageUrl);
    }

    Edit(property, params) {
        if (Common.IsNullOrEmpty(property.EditPageUrl)) this.EditEntityData(params);
        else {
            let url = property.EditPageUrl;
            const { PageConfig } = this.Page.props;
            url = Common.AddUrlParams(url, PageConfig.PrimaryKey, params[PageConfig.PrimaryKey]);
            this.Page.props.ToPage(url);
        }
    }

    EditEntityData(entityData) {
        const { PageConfig } = this.Page.props;

        this.SetEntityData(null)
        this.GetEntityData(entityData);

        if (!PageConfig.TabViews) {
            const title = (entityData === null ? "新增" : "修改") + PageConfig.Title

            const { EditView } = PageConfig
            if (EditView.SetEdit) EditView.SetEdit({ IsVisible: true, Title: title });
        }
    }

    SetEntityData(entityData) {
        const { PageConfig } = this.Page.props;

        if (PageConfig.TabViews) return this.SetTabViewsEntityData(entityData);

        this.SetViewEntityData(PageConfig, entityData);
    }

    SetTabViewsEntityData(entityData) {
        const { PageConfig } = this.Page.props;

        PageConfig.TabViews.forEach(v => {
            if (v.EditView) this.SetViewEntityData(v, entityData);
            else if (v.SetValue) v.SetValue(entityData);
        })

        PageConfig.EntityData = entityData;
    }

    SetViewEntityData(view, entityData) {
        const { EditView } = view;

        let value = null;
        if (entityData != null) {
            EditView.Properties.forEach(p => {
                value = entityData[p.Name];
                if (p.SetValue !== undefined) p.SetValue(value);
                else p.Value = value;

                if (p.IsUpdate === false && p.SetDisabled) p.SetDisabled(true);
            });

            if (view.ComplexView && view.ComplexView.SetDataList) {
                let dataList = entityData[view.ComplexView.PropertyName];
                if (Common.IsArray(dataList)) {
                    dataList = dataList.map(m => { return { ...m, IsEdit: true, IsDelete: true } })
                    view.ComplexView.SetDataList(dataList);
                }
            }
        }
        else {
            EditView.Properties.forEach(p => {
                if (p.InitState !== undefined) p.InitState();
            });
        }

        EditView.EntityData = entityData;

        EditView.DataLoad && EditView.DataLoad();
    }

    Delete(property, params) {
        const { PageConfig } = this.Page.props;

        this.DeleteEntityData(params[PageConfig.PrimaryKey])
    }

    Delete2(property, params) {
        this.Page.ShowConfirm("确认要删除吗？", () => {
            const { PageConfig } = this.Page.props;

            let id = ""
            if (PageConfig.TabViews) {
                if (Common.IsEmptyObject(PageConfig.EntityData)) return
                id = PageConfig.EntityData[PageConfig.PrimaryKey];
            }
            else {
                const { EditView } = PageConfig
                if (Common.IsEmptyObject(EditView.EntityData)) return
                id = EditView.EntityData[PageConfig.PrimaryKey];
            }

            this.DeleteEntityData(id);
        });
    }

    DeleteEntityData(id) {
        const { PageConfig } = this.Page.props;

        let url = PageConfig.EntityName + "/Delete2(" + id + ")";

        const action = this.Page.GetAction("Delete");
        if (!action) return;

        this.Page.SetActionState(action);
        this.Page.Dispatch(action, { Url: url });
    }

    GetEntityData(entityData) {
        if (entityData === null) return;

        const { PageConfig } = this.Page.props;

        const id = entityData[PageConfig.PrimaryKey];

        this.GetEntityDataById(id)
    }

    GetEntityDataById(id) {
        const { PageConfig } = this.Page.props;

        let url = PageConfig.EntityName + "(" + id + ")";
        if (!Common.IsNullOrEmpty(PageConfig.GetEntityDataUrl)) url = PageConfig.GetEntityDataUrl + "(" + id + ")";

        const action = this.Page.GetAction("GetEntityData");
        if (!action) return;

        this.Page.SetActionState(action);
        this.Page.Dispatch(action, { Url: url });
    }

    EditOk(property, params) {
        this.OkProperty = property;
        const { PageConfig } = this.Page.props;

        if (PageConfig.TabViews) return this.EditTabViewsOk(property, params);

        const data = this.GetViewData(PageConfig);
        if (data === false) return;

        const { EditView } = PageConfig;
        const { EntityData } = EditView;

        this.SaveEntityData(EntityData, data)
    }

    GetViewData(view) {
        const { EditView } = view;

        let data = {};

        let p = null, v = null, msg = "";
        for (let i = 0; i < EditView.Properties.length; i++) {
            p = EditView.Properties[i];
            if (p.IsEdit && p.GetValue) {
                v = p.GetValue();
                if (!p.IsNullable && Common.IsNullOrEmpty(v)) {
                    msg = p.Label + "不能为空！"
                    break;
                }
                data[p.Name] = v;
            }
        }

        if (Common.IsNullOrEmpty(msg)) msg = this.JudgeNoNullableGroupNames(EditView, data);

        if (!Common.IsNullOrEmpty(msg)) { this.Page.ShowMessage(msg); return false; }

        if (view.ComplexView && view.ComplexView.GetValue) data[view.ComplexView.PropertyName] = view.ComplexView.GetValue();

        if (EditView.ExpandSetEditData) data = EditView.ExpandSetEditData(data);

        return data;
    }

    SaveEntityData(entityData, data) {
        const { PageConfig } = this.Page.props;

        let url = PageConfig.InsertUrl ? PageConfig.InsertUrl : PageConfig.EntityName;

        if (!Common.IsEmptyObject(entityData)) {
            url = PageConfig.UpdateUrl ? PageConfig.UpdateUrl : PageConfig.EntityName;
            const id = entityData[PageConfig.PrimaryKey];
            url += "(" + id + ")";

            data[PageConfig.PrimaryKey] = id;
            if (entityData.RowVersion) data.RowVersion = entityData.RowVersion;

            this.SaveData("Update", url, data)
        }
        else this.SaveData("Insert", url, data)
    }

    EditTabViewsOk(property, params) {
        const { PageConfig } = this.Page.props;
        const { EntityData } = PageConfig;

        let data = {}, v = null, viewData = null;

        for (let i = 0; i < PageConfig.TabViews.length; i++) {
            v = PageConfig.TabViews[i];
            if (v.EditView) viewData = this.GetViewData(v);
            else if (v.GetValue) viewData = v.GetValue();

            if (viewData === false) { data = false; break; }
            else if (Common.IsObject(viewData)) for (var key in viewData) data[key] = viewData[key];
        }

        if (data === false) return;


        this.SaveEntityData(EntityData, data)
    }

    SaveData(actionName, url, entityData) {
        const { PageConfig } = this.Page.props;

        const action = this.Page.GetAction(actionName);
        if (!action) return;

        const data = {};
        data[PageConfig.EntityName] = entityData;
        data.Url = url;

        this.SetOkDisabled(true);

        this.Page.SetActionState(action);
        this.Page.Dispatch(action, data);
    }

    //判断组合不能为空属性值
    JudgeNoNullableGroupNames(view, data) {
        let msg = "", p = null, blNullable = true;

        if (Common.IsArray(view.NoNullableGroupNames)) {
            for (let i = 0; i < view.NoNullableGroupNames.length; i++) {
                p = view.NoNullableGroupNames[i]
                blNullable = true;
                for (let j = 0; j < p.Names.length; j++) {
                    if (!Common.IsNullOrEmpty(data[p.Names[j]])) { blNullable = false; break; }
                }
                if (blNullable) { msg = p.Message; break; }
            }
        }

        return msg;
    }
}