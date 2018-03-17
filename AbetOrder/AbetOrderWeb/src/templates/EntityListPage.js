import * as Common from "../utils/Common"

//实体列表页
/*
Config配置结构：
{
    EntityName:实体名
    PrimaryKey:主键
    SearchNames:搜索关键字对应搜索属性名集合，以逗号隔开
    SelectNames:查询数据列名集合
    DataUrl:查询数据URL
    TemplateName:列表页模板名称
    DataItemTemplateName:数据行模板名称
    DataItemConfig:数据行配置,结构相应模板配置结构
    IsNewAdd:是否可新增
    IsDelete:是否可删除
    IsPaging:是否分页
    PageSize:分页大小,
    Title:标题,
    EventActionList:事件行动列表
}
*/

const EntityListPageConfig = {};

export default function EntityListPage(config, id) {
    if (EntityListPageConfig[id]) return EntityListPageConfig[id];

    const _Config = { Config: config, Id: id }

    //初始化配置
    InitConfig(_Config, config)

    //查询视图
    InitSearchView(_Config);

    AddRowColId(_Config.SearchView)

    //操作视图
    InitOperationView(_Config);

    AddRowColId(_Config.OperationView)

    //数据视图
    InitDataView(_Config);
    AddId(_Config.DataView)

    //编辑视图
    InitEditView(_Config);

    AddRowColId(_Config.EditView)

    //行为列表
    InitActionList(_Config);

    EntityListPageConfig[id] = _Config;

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
    a.IsNewAdd = true
    a.IsDelete = true
    a.IsUpdate = true
    a.IsPaging = true
    a.PageSize = 20
    a.PageIndex = 1
    a.InitEventActionList = []
    a.ActionList = [];
    a.DataView = { Properties: [], StateName: "DataList", Name: "DataView" };
    a.StateList = [{ Name: b.Name, StateName: "Loading" }];

    const copyNames = ["Title", "EntityName", "PrimaryKey", "SearchNames", "SelectNames", "DataUrl", "EditPageUrl",
        "IsNewAdd", "IsUpdate", "IsDelete", "IsPaging", "PageSize", "EditNames", "OrderByList", "Name",
        "InitEventActionList", "Properties", "DataColumnNames", "DataView"];

    Common.Copy(a, b, copyNames)
}

function InitSearchView(config) {
    if (config.SearchView === undefined) {
        config.SearchView = { IsVisible: true, Properties: [], Name: "SearchView" };
    }

    if (config.SearchNames) {
        let x = 0, y = 0, p = null;
        config.SearchNames.forEach(n => {
            if (x === 0) x = 1;
            if (y === 3) { x += 1; y = 0 }
            y++;

            for (let i = 0; i < config.Properties.length; i++) {
                if (n === config.Properties[i].Name) {
                    p = Object.assign({ Type: "TextBox", OperateLogic: "like", X: x, Y: y, IsSearch: true, ColSpan: 6 }, config.Properties[i]);
                    if (p.SearchProperty) for (let key in p.SearchProperty) { p[key] = p.SearchProperty[key] }
                    config.SearchView.Properties.push(p);
                    break;
                }
            }
        });
    }

    const maxX = Math.max.apply(null, config.SearchView.Properties.map(m => m.X));
    const maxY = Math.max.apply(null, config.SearchView.Properties.filter(f => f.X === maxX).map(m => m.Y))

    const searchButton = {
        Name: "SearchAction",
        Type: "Button",
        Text: "查询",
        ButtonType: "primary",
        X: maxX,
        Y: maxY + 1,
        ActionType: "Query",
        ActionName: "SearchData"
    };

    config.SearchView.Properties.push(searchButton);

    config.InitEventActionList.push({
        Name: "SearchData",
        Type: "Query",
        Property: searchButton
    });
}

function InitOperationView(config) {
    if (config.OperationView === undefined) {
        config.OperationView = { IsVisible: true, Properties: [], Name: "OperationView" };
    }
    let x = 0, y = 0;
    if (config.IsNewAdd) {
        x = 1;
        y = 1;
        config.OperationView.Properties.push({
            Name: "AddAction",
            Type: "Button",
            Text: "新增",
            ButtonType: "primary",
            Icon: "plus",
            X: x,
            Y: y,
            EditPageUrl: config.EditPageUrl,
            ActionType: "EntityEdit",
            ActionName: "NewAdd"
        });
    }
}

function InitActionList(config) {
    config.ActionList.push(AddAction("QueryData", "DataList", "View" + config.EntityName, true));
    config.ActionList.push(AddAction("QueryPage", "PageInfo", "PageInfo"));
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

function InitDataView(config) {
    if (config.DataColumnNames === undefined) {
        config.DataView.Properties = config.Properties.map(m => Object.assign({}, m));
    }
    else {
        for (let i = 0; i < config.DataColumnNames.length; i++) {
            for (let j = 0; j < config.Properties.length; j++) {
                if (config.DataColumnNames[i] === config.Properties[j].Name) {
                    config.DataView.Properties.push(Object.assign({}, config.Properties[j]));
                    break;
                }
            }
        }
    }
}

function InitEditView(config) {
    if (config.EditView === undefined) {
        config.EditView = { Properties: [], IsVisible: true, ColumnCount: 1, Name: "EditView" };
        if (config.Config.EditViewWidth > 0) config.EditView.Width = config.Config.EditViewWidth;

        //组合不能为空属性名
        if (config.Config.NoNullableGroupNames) config.EditView.NoNullableGroupNames = config.Config.NoNullableGroupNames;
    }

    if (config.EditNames) {
        let x = 0, y = 0, p = null;
        config.EditNames.forEach(n => {
            if (x === 0) x = 1;
            if (y === config.EditView.ColumnCount) { x += 1; y = 0 }
            y++;

            for (let i = 0; i < config.Properties.length; i++) {
                if (n === config.Properties[i].Name) {
                    p = Object.assign({ Type: "TextBox", X: x, Y: y, ColSpan: 20, IsEdit: true, IsNullable: true }, config.Properties[i]);
                    if (p.EditProperty) for (let key in p.EditProperty) { p[key] = p.EditProperty[key] }
                    config.EditView.Properties.push(p);
                    break;
                }
            }
        });
    }
}