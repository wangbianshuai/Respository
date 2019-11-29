import React, { useMemo, useState } from "react"
import { Table, Alert, Pagination, Button } from "antd";
import BaseIndex from "./BaseIndex";
const { Column } = Table;

export default (props) => {
    const instance = useMemo(() => new DataGrid(), []);

    instance.Init2(props);

    instance.InitState("IsVisible", useState(true));
    instance.InitState("SelectedRowKeys", useState([]));
    instance.InitState("Sorter", useState({}));
    instance.InitState("SelectedRowKey", useState(""));

    return instance.render();
}

class DataGrid extends BaseIndex {

    Init2(props) {
        if (this.Init(props)) return;

        if (this.props.IsRowSelection) this.props.Property.GetSelectedRowKeys = () => this.state.SelectedRowKeys;

        this.props.Property.GetDataList = () => this.props.DataList;
        this.props.Property.GetSelectDataList = this.GetSelectDataList.bind(this)
        this.props.Property.SetSelectedRowKey = (key) => this.setState({ SelectedRowKey: key })
    }

    GetSelectDataList() {
        return this.props.DataList.filter(f => this.state.SelectedRowKeys.indexOf(f[this.props.PrimaryKey]) >= 0)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.DataList !== nextProps.DataList) this.SelectChanged([])

        return true;
    }

    GetColumn(p) {
        const name = p.PropertyName || p.Name;
        if (p.IsData === false) return (<Column title={p.Label} key={name} render={p.Render} width={p.ColumnWidth} fixed={p.Fixed} />)

        return (<Column title={p.Label} dataIndex={name} sorter={p.Sorter} sortOrder={this.state.Sorter.columnKey === name && this.state.Sorter.order} key={name} render={p.Render} width={p.ColumnWidth} fixed={p.Fixed} />)
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

        return <Alert message={this.RenderGroupByInfo()} type="info" showIcon={true} />
    }

    RenderGroupByInfo() {
        let html = this.props.GroupByInfoHtml;
        for (let key in this.props.GroupByInfo) {
            html = html.replace(new RegExp("{" + key + "}", "g"), this.props.GroupByInfo[key]);
        }

        return <div dangerouslySetInnerHTML={{ __html: html }}></div>
    }

    SelectChanged(selectedRowKeys) {
        if (this.props.IsSingleSelection && selectedRowKeys && selectedRowKeys.length > 1) {
            const len = this.props.DataList.filter(f => !f.IsCheckedDisabled).length;
            if (selectedRowKeys.length === len) return;
            selectedRowKeys = [selectedRowKeys[selectedRowKeys.length - 1]];
        }
        this.setState({ SelectedRowKeys: selectedRowKeys })
    }

    OnChange(pagination, filters, sorter) {
        this.setState({ Sorter: sorter });
        this.props.PageAxis.DataGridView.SetOrderBy(pagination, filters, sorter);
    }

    OnRowClick(record, index, e) {
        if (this.props.IsRowSelection && e.target && e.target.nodeName === "TD" && !record.IsCheckedDisabled) {
            let selectedRowKeys = [];
            if (this.props.IsSingleSelection) selectedRowKeys.push(record.key)
            else {
                selectedRowKeys = this.state.SelectedRowKeys.filter(f => f !== record.key)
                if (selectedRowKeys.length === this.state.SelectedRowKeys.length) selectedRowKeys.push(record.key);
            }
            this.SelectChanged(selectedRowKeys)
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

        if (key !== undefined && this.state.SelectedRowKey === key) list.push("RowSelected")
        return list.join(" ")
    }

    GetCheckboxProps(data) {
        return {
            disabled: data.IsCheckedDisabled,
            name: this.PrimaryKey
        }
    }

    SetShowColumns() {
        this.props.PageAxis.InvokeEventAction(this.props.Property.SetColumnsEventActionName, this.props);
    }

    render() {
        const rowSelection = this.props.IsRowSelection ? {
            selectedRowKeys: this.state.SelectedRowKeys,
            onChange: this.SelectChanged.bind(this),
            getCheckboxProps: this.GetCheckboxProps.bind(this)
        } : undefined;

        var justifyContent = "flex-end";
        const { SetColumnsEventActionName } = this.props.Property;
        if (SetColumnsEventActionName) justifyContent = "space-between";

        return (
            <React.Fragment>
                {this.RenderGroupByInfoAlert()}
                <Table dataSource={this.props.DataList} loading={this.props.IsLoading}
                    rowSelection={rowSelection} onChange={this.OnChange.bind(this)} onRow={this.onRow.bind(this)}
                    pagination={this.props.IsPartPaging ? false : this.GetPagination()} >
                    {this.props.DataProperties.map(p => this.GetColumn(p))}
                </Table>
                {this.props.IsPartPaging ? <div style={{ width: "100%", height: "60px", display: "flex", alignItems: "center", justifyContent: justifyContent }}>
                    {SetColumnsEventActionName && <Button onClick={this.SetShowColumns.bind(this)} style={{ marginLeft: 16 }}>自定义显示列</Button>}
                    <Pagination {...this.GetPagination()} />
                </div> : null}
            </React.Fragment>
        );
    }
}