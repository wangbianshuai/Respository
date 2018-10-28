import React from "react"
import Index from "./Index"
import { Table, Alert } from "antd"
const { Column } = Table;

export default class DataGridView extends Index {
    constructor(props) {
        super(props)

        this.Name = "DataGridView";

        this.state = { SelectedRowKeys: [], Sorter: {}, SelectedRowKey: "" }

        this.InitRowSelection();
    }

    InitRowSelection() {
        if (this.props.IsRowSelection) this.props.Page.EventActions.DataGrid.GetSelectedRowKeys = () => this.state.SelectedRowKeys;

        this.props.Page.EventActions.DataGrid.GetDataList = () => this.props.DataList;
        this.props.Page.EventActions.DataGrid.SetSelectedRowKey = (key) => this.setState({ SelectedRowKey: key })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.DataList !== nextProps.DataList) this.SelectChanged([])
    }

    GetColumn(p) {
        if (p.IsData === false) return (<Column title={p.Label} key={p.Name} render={p.Render} width={p.ColumnWidth} fixed={p.Fixed} />)

        return (<Column title={p.Label} dataIndex={p.Name} sorter={p.Sorter} sortOrder={this.state.Sorter.columnKey === p.Name && this.state.Sorter.order} key={p.Name} render={p.Render} width={p.ColumnWidth} fixed={p.Fixed} />)
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

        return <Alert message={this.RenderGroupByInfo()} type="info" showIcon={true} style={{ marginBottom: "8px" }} />
    }

    RenderGroupByInfo() {
        let html = this.props.GroupByInfoHtml;
        for (let key in this.props.GroupByInfo) {
            html = html.replace(new RegExp("{" + key + "}", "g"), this.props.GroupByInfo[key]);
        }

        return <div dangerouslySetInnerHTML={{ __html: html }}></div>
    }

    SelectChanged(selectedRowKeys) {
        this.setState({ SelectedRowKeys: selectedRowKeys })
    }

    OnChange(pagination, filters, sorter) {
        this.setState({ Sorter: sorter });
        this.props.Page.EventActions.Query.SetOrderBy(pagination, filters, sorter);
    }

    OnRowClick(record, index, e) {
        if (this.props.IsRowSelection && e.target && e.target.nodeName === "TD") {
            const selectedRowKeys = this.state.SelectedRowKeys.filter(f => f !== record.key)
            if (selectedRowKeys.length === this.state.SelectedRowKeys.length) selectedRowKeys.push(record.key)
            this.setState({ SelectedRowKeys: selectedRowKeys })
            return
        }

        this.setState({ SelectedRowKey: record.key });
    }

    onRow(record, index) {
        return {
            className: this.GetRowClassName(record.key),
            onClick: this.OnRowClick.bind(this, record, index)
        }
    }

    GetRowClassName(key) {
        const list = ["ant-table-row", "ant-table-row-level-0"]
        if (this.state.SelectedRowKey === key) list.push("RowSelected")
        return list.join(" ")
    }

    render() {
        const rowSelection = this.props.IsRowSelection ? {
            selectedRowKeys: this.state.SelectedRowKeys,
            onChange: this.SelectChanged.bind(this)
        } : undefined;

        return (
            <div>
                {this.RenderGroupByInfoAlert()}
                <Table dataSource={this.props.DataList} loading={this.props.IsLoading} scroll={this.props.TableScroll}
                    rowSelection={rowSelection} onChange={this.OnChange.bind(this)} onRow={this.onRow.bind(this)}
                    pagination={this.GetPagination()} expandedRowRender={this.props.ExpandedRowRender}>
                    {this.props.DataProperties.map(p => this.GetColumn(p))}
                </Table>
            </div>
        );
    }
}