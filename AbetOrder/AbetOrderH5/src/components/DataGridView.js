import React from "react"
import Index from "./Index"
import { List, Pagination, Icon, WhiteSpace } from "antd-mobile"
import * as Common from "../utils/Common";
import DataGridViewRows from "../DataGridViewRows/Index"

export default class DataGridView extends Index {
    constructor(props) {
        super(props)

        this.Name = "DataGridView";
    }

    RenderGroupByInfoAlert() {
        if (!this.props.GroupByInfo || !this.props.GroupByInfoHtml) return null;

        return <div style={{ marginBottom: "8px", height: "60px", lineHeight: "60px", marginLeft: "16px" }} >{this.RenderGroupByInfo()}</div>
    }

    RenderGroupByInfo() {
        let html = this.props.GroupByInfoHtml;
        for (let key in this.props.GroupByInfo) {
            html = html.replace(new RegExp("{" + key + "}", "g"), this.props.GroupByInfo[key]);
        }

        return <div dangerouslySetInnerHTML={{ __html: html }}></div>
    }

    PageChange(e) {
        const { PageInfo } = this.props;

        this.props.PageIndexChange(e, PageInfo.PageSize);
    }

    RenderRow(d, i) {
        return DataGridViewRows(this.props.Page, this, d, i);
    }

    render() {
        const { PageInfo, DataList } = this.props

        const dataList = Common.IsArray(DataList) ? DataList : [];

        const current = PageInfo.PageCount > 0 ? PageInfo.PageIndex : 0;

        return (
            <div>
                {this.RenderGroupByInfoAlert()}
                <List>
                    {dataList.map((m, i) => this.RenderRow(m, i))}
                </List>
                <WhiteSpace />
                <WhiteSpace />
                {this.props.IsPaging === false ? null :
                    <Pagination total={PageInfo.PageCount}
                        current={current}
                        locale={{
                            prevText: (<span style={{ display: "flex", alignItems: "center" }}><Icon type="left" />上一页</span>),
                            nextText: (<span style={{ display: "flex", alignItems: "center" }}>下一页<Icon type="right" /></span>),
                        }}
                        onChange={this.PageChange.bind(this)}
                    />
                }
            </div>
        );
    }
}