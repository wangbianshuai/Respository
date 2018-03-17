import * as Common from "../utils/Common"

const EntityEditPageConfig = {};

export default function EntityEditPage(config, id) {
    if (EntityEditPageConfig[id]) return EntityEditPageConfig[id];

    const _Config = { Config: config, Id: id }

    //初始化配置
    InitConfig(_Config, config)

    //操作视图
    InitOperationView(_Config);

    AddRowColId(_Config.OperationView)

    //编辑视图
    InitEditView(_Config);

    AddRowColId(_Config.EditView)

    //复杂对象视图
    InintComplexView(_Config);

    //行为列表
    InitActionList(_Config);

    EntityEditPageConfig[id] = _Config;

    return _Config
}

function AddId(view) {
    if (view && view.Properties) view.Properties.forEach(p => p.Id = Common.CreateGuid());
}

function AddRowColId(view) {
    if (view && view.Properties) view.Properties.forEach(p => {
        p.Id = Common.CreateGuid();
        p.RowId = Common.CreateGuid();
        p.ColId = Common.CreateGuid()
    });
}

function InitConfig(a, b) {
    a.InitEventActionList = []
    a.ActionList = [];
    a.IsNewAdd = true;
    a.IsUpdate = true;
    a.IsDelete = true;
    a.IsEditPage = true;
    a.StateList = [{ Name: b.Name, StateName: "Loading" }];

    const copyNames = ["Title", "EntityName", "PrimaryKey", "Name", "InsertUrl", "UpdateUrl", "GetEntityDataUrl",
        "InitEventActionList", "ActionList", "Properties"];

    Common.Copy(a, b, copyNames)
}

function InitOperationView(config) {
    if (config.OperationView === undefined) {
        config.OperationView = { IsVisible: true, Properties: [], Name: "OperationView" };
    }
    let x = 1, y = 1;

    if (config.IsNewAdd || config.IsUpdate) {
        config.OperationView.Properties.push({
            Name: "SaveAction",
            Type: "Button",
            Text: "保存",
            ButtonType: "primary",
            Icon: "save",
            X: x,
            Y: y,
            ActionType: "EntityEdit",
            ActionName: "EditOk"
        });
    }

    if (config.IsNewAdd) {
        x = 1;
        y = 2;
        config.OperationView.Properties.push({
            Name: "AddAction",
            Type: "Button",
            Text: "新增",
            Icon: "plus",
            X: x,
            Y: y,
            EditPageUrl: "/ContentEdit",
            ActionType: "EntityEdit",
            ActionName: "NewAdd",
            IsEditEnable: true,
            IsVisible: false
        });
    }

    if (config.IsDelete) {
        x = 1;
        y = 3;
        config.OperationView.Properties.push({
            Name: "DeleteAction",
            Type: "Button",
            Text: "删除",
            Icon: "delete",
            X: x,
            Y: y,
            ActionType: "EntityEdit",
            ActionName: "Delete2",
            IsEditEnable: true,
            IsVisible: false
        });
    }

    if (Common.IsArray(config.Config.OperationProperties)) {
        let p = null;
        for (let i = 0; i < config.Config.OperationProperties.length; i++) {
            y += 1;
            p = Object.assign({ X: x, Y: y }, config.Config.OperationProperties[i]);
            config.OperationView.Properties.push(p);
        }
    }
}

function InitActionList(config) {
    let a = AddAction("GetEntityData", "EntityData", config.EntityName);
    a.Method = "GET";
    config.ActionList.push(a);
    config.ActionList.push(AddAction("Insert", "InsertInfo", "", true));
    a = AddAction("Update", "UpdateInfo", "", true);
    a.Method = "PUT";
    config.ActionList.push(a);
    a = AddAction("Delete", "DeleteInfo", "", true);
    a.Method = "DELETE"
    config.ActionList.push(a);
}

function AddAction(actoinName, stateName, dataKey, isModalMessage) {
    return { ActionName: actoinName, StateName: stateName, DataKey: dataKey, IsModalMessage: isModalMessage }
}

function InitEditView(config) {
    if (config.EditView === undefined) {
        config.EditView = { Properties: [], IsVisible: true, Title: config.Config.EditViewTitle, Name: "EditView" };
    }

    let p = null;
    for (let i = 0; i < config.Properties.length; i++) {
        p = Object.assign({ IsEdit: true, IsNullable: true }, config.Properties[i]);
        config.EditView.Properties.push(p);
    }
}

function InintComplexView(config) {
    if (config.Config.ComplexView) {
        let view = Object.assign({ IsNewAdd: true, IsUpdate: true, IdDelete: true }, config.Config.ComplexView);
        if (view.DataView === undefined) {
            view.DataView = { Properties: [], IsVisible: true, Name: "DataView" };
        }

        let p = null;
        for (let i = 0; i < view.Properties.length; i++) {
            p = Object.assign({ IsEdit: true, IsNullable: true, Id: Common.CreateGuid() }, view.Properties[i]);
            view.DataView.Properties.push(p);
        }
        config.ComplexView = view

    }
}