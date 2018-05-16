import React from "react"
import Index from "./Index"
import { List, Toast } from "antd-mobile"
const { Item } = List;

export default class DataGridView extends Index {
    constructor(props) {
        super(props)

        this.Name = "DataGridView";
    }

    GetColumn(p) {
        if (p.IsData === false) return (<Item title={p.Label} key={p.Name} render={p.Render} width={p.ColumnWidth} fixed={p.Fixed} />)

        return (<Item title={p.Label} dataIndex={p.Name} key={p.Name} render={p.Render} width={p.ColumnWidth} fixed={p.Fixed} />)
    }

    GetPagination() {
        if (this.props.IsPaging === false) return false;
        const { PageInfo } = this.props

        return {
            current: PageInfo.PageIndex,
            total: PageInfo.PageRecord,
            pageSize: PageInfo.PageSize,
            showTotal: (total, range) => `当前${range[0]}-${range[1]}，共 ${total} 条记录`,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30', '50'],
            onShowSizeChange: this.props.PageIndexChange,
            onChange: this.props.PageIndexChange
        }
    }

    RenderGroupByInfoAlert() {
        if (!this.props.GroupByInfo || !this.props.GroupByInfoHtml) return null;

        return <Toast message={this.RenderGroupByInfo()} type="info" showIcon={true} style={{ marginBottom: "8px" }} />
    }

    RenderGroupByInfo() {
        let html = this.props.GroupByInfoHtml;
        for (let key in this.props.GroupByInfo) {
            html = html.replace(new RegExp("{" + key + "}", "g"), this.props.GroupByInfo[key]);
        }

        return <div dangerouslySetInnerHTML={{ __html: html }}></div>
    }

    render() {
        return (
            <div>
                {this.RenderGroupByInfoAlert()}
                <List dataSource={this.props.DataList} loading={this.props.IsLoading} scroll={this.props.TableScroll}
                    pagination={this.GetPagination()} expandedRowRender={this.props.ExpandedRowRender}>
                    {this.props.DataProperties.map(p => this.GetColumn(p))}
                </List>
            </div>
        );
    }
}