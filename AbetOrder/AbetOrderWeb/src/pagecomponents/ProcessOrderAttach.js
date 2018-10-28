import React from "react"
import Index from "./Index"
import DataGridView from "../components/DataGridView";
import * as Common from "../utils/Common";

export default class ProcessOrderAttach extends Index {
    constructor(props) {
        super(props)

        this.state = { DataList: [], IsDataLoading: false }
    }

    componentWillMount() {
        this.Property.LoadData = (orderId, fileType) => this.LoadData(orderId, fileType);

        this.DataProperties = this.InitDataProperties();

        this.LoadData(this.props.OrderId, this.props.FileType);
    }

    InitDataProperties() {
        return [{ Name: "DisplayIndex", Label: "序号" }, { Name: "Name", Label: "名称" }, {
            Name: "ImageUrl",
            Label: "路径",
            Render: (text, record) => this.RenderImageUrl(text, record)
        }]
    }

    RenderImageUrl(text, record) {
        let url = "";
        if (!Common.IsNullOrEmpty(text)) url = Common.DataApiUrl.replace("api/", "") + text;

        return <a href={url} target="_blank">{text}</a>
    }

    LoadData(orderId, fileType) {
        this.Property.SetVisible(true);

        this.setState({ IsDataLoading: true });

        const action = this.Page.GetAction("GetOrderImageList");

        action.Url = `OrderImage?&$orderby=DisplayIndex&$filter=FileType eq ${fileType} and OrderId eq '${orderId}'`;

        this.GetDataSource({ IsResponse: true, IsInitState: true }, "GetOrderImageList", "OrderImageList", (list) => {
            this.SetDataList(list);
        }, action);
    }

    SetDataList(list) {
        const dataList = Common.IsArray(list) ? list : [];
        dataList.forEach((d, i) => { d.key = d.Id; d.DisplayIndex = i + 1; });
        this.setState({ DataList: dataList, IsDataLoading: false })
    }

    render() {
        return (<DataGridView Page={this.props.Page} DataList={this.state.DataList} IsPaging={false}
            IsLoading={this.state.IsDataLoading} DataProperties={this.DataProperties} />)
    }
}