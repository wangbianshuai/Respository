import * as Common from "../utils/Common"
import Index from "./Index"

export default class EntityEdit extends Index {
    constructor(options) {
        super(options)
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
                const { EditView } = PageConfig;

                if (PageConfig.IsEditPage) {
                    const id = nextProps.InsertInfo.PrimaryKey;
                    const url = `/${PageConfig.Name}?${PageConfig.PrimaryKey}=${id}`
                    props.ToPage(url);
                }
                else {
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
                const { EditView } = PageConfig;

                if (PageConfig.IsEditPage) {
                    this.Page.ShowMessage("保存成功！")
                    this.SetOkDisabled(false);
                }
                else {
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
        const { EditView } = PageConfig
        const title = (entityData === null ? "新增" : "修改") + PageConfig.Title

        this.SetEntityData(null)
        this.GetEntityData(entityData);

        if (EditView.SetEdit) EditView.SetEdit({ IsVisible: true, Title: title })
    }

    SetEntityData(entityData) {
        const { PageConfig } = this.Page.props;
        const { EditView } = PageConfig;

        let value = null;
        if (entityData != null) {
            EditView.Properties.forEach(p => {
                value = entityData === null ? p.DefaultValue : entityData[p.Name];
                if (p.SetValue !== undefined) p.SetValue(value);
                else p.Value = value;
            });

            if (PageConfig.ComplexView && PageConfig.ComplexView.SetDataList) {
                let dataList = entityData[PageConfig.ComplexView.PropertyName];
                if (Common.IsArray(dataList)) {
                    dataList = dataList.map(m => { return { ...m, IsEdit: true, IsDelete: true } })
                    PageConfig.ComplexView.SetDataList(dataList);
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
            const { EditView } = PageConfig
            if (Common.IsEmptyObject(EditView.EntityData)) return

            this.DeleteEntityData(EditView.EntityData[PageConfig.PrimaryKey])
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
        const { PageConfig } = this.Page.props;
        const { EditView } = PageConfig
        const { EntityData } = EditView;

        this.OkProperty = property;

        const data = {};

        EditView.Properties.forEach(p => { if (p.GetValue) data[p.Name] = p.GetValue() })

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

        if (!Common.IsNullOrEmpty(msg)) {
            this.Page.ShowMessage(msg);
            return;
        }

        if (PageConfig.ComplexView && PageConfig.ComplexView.GetValue) {
            data[PageConfig.ComplexView.PropertyName] = PageConfig.ComplexView.GetValue();
        }

        let url = PageConfig.InsertUrl ? PageConfig.InsertUrl : PageConfig.EntityName;

        if (!Common.IsEmptyObject(EntityData)) {
            url = PageConfig.UpdateUrl ? PageConfig.UpdateUrl : PageConfig.EntityName;
            const id = EntityData[PageConfig.PrimaryKey];
            url += "(" + id + ")";

            data[PageConfig.PrimaryKey] = id;
            if (EntityData.RowVersion) data.RowVersion = EntityData.RowVersion;

            this.SaveData("Update", url, data)
        }
        else this.SaveData("Insert", url, data)
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
        this.Page.Dispatch(action, data)
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