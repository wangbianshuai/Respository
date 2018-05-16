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
        this.Property.LoadData = (orderId) => this.LoadData(orderId);

        this.DataProperties = this.InitDataProperties();

        this.LoadData(this.props.OrderId)
    }

    InitDataProperties() {
        return [{ Name: "DisplayIndex", Label: "序号" }, { Name: "Name", Label: "名称" }, {
            Name: "ImageUrl",
            Label: "缩略图或路径",
            Render: (text, record) => this.RenderImageUrl(text, record)
        }]
    }

    RenderImageUrl(text, record) {
        let url = "";
        if (!Common.IsNullOrEmpty(text)) url = Common.DataApiUrl.replace("api/", "") + text;

        return <a href={url} target="_blank">
            {
                Common.IsImageUrl(url) ? <img src={url} alt="" border="0" width="120" height="90" /> : text
            }
        </a>
    }

    LoadData(orderId) {
        this.Property.SetVisible(true);

        this.setState({ IsDataLoading: true });

        const action = this.Page.GetAction("GetOrderImageList");

        action.Url = `OrderImage?&$orderby=DisplayIndex&$filter=FileType eq 2 and OrderId eq '${orderId}'`;

        this.GetDataSource({ IsResponse: true }, "GetOrderImageList", "OrderImageList", (list) => {
            this.SetDataList(list);
        }, action);
    }

    SetDataList(list) {
        const dataList = Common.IsArray(list) ? list : [];
        this.setState({ DataList: dataList, IsDataLoading: false })
    }

    render() {
        return (<DataGridView Page={this.props.Page} DataList={this.state.DataList} IsPaging={false}
            IsLoading={this.state.IsDataLoading} DataProperties={this.DataProperties} />)
    }
}