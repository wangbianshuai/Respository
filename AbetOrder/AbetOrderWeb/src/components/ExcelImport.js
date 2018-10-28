import React from "react"
import Upload2 from "../controls/Upload2";
import * as Common from "../utils/Common"
import ExcelImportMessageList from "./ExcelImportMessageList"
import Index from "./Index"

export default class ExcelImport extends Index {
    constructor(props) {
        super(props)

        this.Property = props.Property;
        this.Page = props.Page;
    }

    componentWillMount() {
        let url = this.GetRootPath();
        url = Common.AddUrlParams(url, "Token", Common.GetStorage("Token"));
        url = Common.AddUrlParams(url, "LoginUserId", Common.GetStorage("LoginUserId"));
        url = Common.AddUrlParams(url, "EntityName", this.Page.props.PageConfig.EntityName);
        this.Property.Accept = ".xlsx";
        this.Property.FileSize = 1024 * 1024 * 4;
        this.FileSizeText = "4M";
        this.Property.UploadUrl = url;
        this.Property.IsInitState = true;
        this.Property.SetResponse = this.SetResponse.bind(this);
    }

    SetResponse(res) {
        if (res.IsSuccess === false) { this.Page.ShowModalMessage(res.Message2); return; }

        if (res.MessageList && res.MessageList.length > 0) {
            this.ShowMessageList(res);
            if (res.Message2 && res.Message2.indexOf("操作成功") === 0) {
                //刷新查询
                this.Page.EventActions.Query.Refresh("Insert");
            }
        }
        else if (res.Message2) {
            this.Page.ShowModalMessage(unescape(res.Message2));

            if (res.Message2.indexOf("操作成功") === 0) {
                //刷新查询
                this.Page.EventActions.Query.Refresh("Insert");
            }
        }
    }

    ShowMessageList(res) {
        const title = "Excel导入提示信息";

        if (this.MessageListView === undefined) {
            this.MessageListView = { Id: Common.CreateGuid(), Title: title, Width: 900, Visible: true, IsOk: false };
            this.MessageListView.Component = this.GetMessageListComponent(res);
            this.Page.SetModalDialog(this.MessageListView);
        }
        else this.LoadMessageList(res);
    }

    LoadMessageList(res) {
        this.MessageListView.LoadData && this.MessageListView.LoadData(res);
    }

    GetMessageListComponent(res) {
        return <ExcelImportMessageList Property={this.MessageListView} Page={this.Page} Data={res} />
    }

    GetRootPath() {
        return Common.DataApiUrl.replace("api/", "ExcelImportHandler.ashx")
    }

    render() {
        const props = { Page: this.Page, Property: this.Property, View: this.props.View }

        return <Upload2 {...props} key={this.Property.Id} />;
    }
}