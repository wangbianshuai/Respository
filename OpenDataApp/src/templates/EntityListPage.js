import * as Common from "../utils/Common"
import ListViewDataItem from "./ListViewDataItem"

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
export default function EntityListPage(config) {
    const _Config = { Config: config }

    //初始化配置
    InitConfig(_Config, config)

    //NavBar 导航栏
    InitNavBar(_Config)

    //两行 WhiteSpace 上下留白
    InitWhiteSpace1(_Config)

    //SearchBar 搜索栏
    InitSearchBar(_Config)

    //两行 WhiteSpace 上下留白
    InitWhiteSpace2(_Config)

    //ListView 长列表
    InitListView(_Config)

    return _Config
}

function InitConfig(a, b) {
    a.IsNewAdd = true
    a.IsDelete = true
    a.IsPaging = true
    a.PageSize = 20
    a.Properties = []
    a.IsNavBar = true
    a.WhiteSpaceCount1 = 1
    a.IsSearchBar = true
    a.WhiteSpaceCount2 = 2

    const copyNames = ["Title", "EntityName", "PrimaryKey", "SearchNames", "SelectNames", "DataUrl", "IsNewAdd", "IsDelete", "IsPaging", "PageSize"]
    copyNames.push("EventActionList")

    Common.Copy(a, b, copyNames)
}

//NavBar 导航栏
function InitNavBar(a) {
    a.IsNavBar && a.Properties.push({
        Name: "Header",
        Type: "NavBar",
        Title: a.Title
    })
}

//两行 WhiteSpace 上下留白
function InitWhiteSpace1(a) {
    if (a.WhiteSpaceCount1 > 0) {
        for (let i = 1; i <= a.WhiteSpaceCount1; i++) a.Properties.push({
            Name: "WhiteSpaceCount1_" + i,
            Type: "WhiteSpace"
        })
    }
}

//SearchBar 搜索栏
function InitSearchBar(a) {
    a.IsSearchBar && a.Properties.push({
        Name: "SearchBar1",
        Type: "SearchBar",
        PlaceHolder: "搜索",
        MaxLength: 50
    })
}

//两行 WhiteSpace 上下留白
function InitWhiteSpace2(a) {
    if (a.WhiteSpaceCount2 > 0) {
        for (let i = 1; i <= a.WhiteSpaceCount2; i++) a.Properties.push({
            Name: "WhiteSpaceCount2_" + i,
            Type: "WhiteSpace"
        })
    }
}

//ListView 长列表
function InitListView(a) {
    a.Properties.push({
        Name: "DataListView",
        Type: "ListView",
        RowConfig: ListViewDataItem(a.Config)
    })
}