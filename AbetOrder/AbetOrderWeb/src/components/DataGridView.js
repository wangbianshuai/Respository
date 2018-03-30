import React from "react"
import Index from "./Index"
import { Table } from "antd"
const { Column } = Table;

export default class DataGridView extends Index {
    constructor(props) {
        super(props)

        this.Name = "DataGridView";
    }

    GetColumn(p) {
        if (p.IsData === false) return (<Column title={p.Label} key={p.Name} render={p.Render} />)

        return (<Column title={p.Label} dataIndex={p.Name} key={p.Name} render={p.Render} />)
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

    render() {
        return (
            <div>
                <Table dataSource={this.props.DataList} loading={this.props.IsLoading}
                    pagination={this.GetPagination()} >
                    {this.props.DataProperties.map(p => this.GetColumn(p))}
                </Table>
            </div>
        );
    }
}