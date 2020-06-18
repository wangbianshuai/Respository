import React, { Component } from "react"
import { Table, Alert, Pagination, Button } from "antd";
import { Common } from "UtilsCommon";
const { Column } = Table;

export default class DataGrid extends Component {
    constructor(props) {
        super(props)

        this.name = "DataGrid";

        this.state = { SelectedRowKeys: [], Sorter: {}, SelectedRowKey: "" }

        this.Init();
    }

    Init() {
        if (this.props.isRowSelection) this.props.property.getSelectedRowKeys = () => this.state.SelectedRowKeys;

        this.props.property.getDataList = () => this.props.DataList;
        this.props.property.getSelectDataList = this.getSelectDataList.bind(this)
        this.props.property.setSelectedRowKey = (key) => this.setState({ SelectedRowKey: key })
    }

    getSelectDataList() {
        return this.props.DataList.filter(f => this.state.SelectedRowKeys.indexOf(f[this.props.PrimaryKey]) >= 0)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.DataList !== nextProps.DataList) this.SelectChanged([])

        return true;
    }

    getColumn(p) {
        const name = p.propertyName || p.name;
        if (p.isData === false) return (<Column title={p.label} key={name} render={p.Render} width={p.ColumnWidth} fixed={p.Fixed} />)

        return (<Column title={p.label} dataIndex={name} sorter={p.Sorter} sortOrder={this.state.Sorter.columnKey === name && this.state.Sorter.order} key={name} render={p.Render} width={p.ColumnWidth} fixed={p.Fixed} />)
    }

    getPagination() {
        if (this.props.isPaging === false) return false;
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
        if (Common.isEmptyObject(this.props.GroupByInfo) || !this.props.GroupByInfoHtml) return null;

        return <Alert message={this.RenderGroupByInfo()} type="info" showIcon={true} />
    }

    RenderGroupByInfo() {
        let html = this.props.GroupByInfoHtml;
        for (let key in this.props.GroupByInfo) {
            html = html.replace(new RegExp("{" + key + "}", "g"), this.props.GroupByInfo[key]);
        }

        return <div dangerouslysetInnerHTML={{ __html: html }}></div>
    }

    SelectChanged(selectedRowKeys) {
        if (this.props.isSingleSelection && selectedRowKeys && selectedRowKeys.length > 1) {
            const len = this.props.DataList.filter(f => !f.isCheckedDisabled).length;
            if (selectedRowKeys.length === len) return;
            selectedRowKeys = [selectedRowKeys[selectedRowKeys.length - 1]];
        }
        this.setState({ SelectedRowKeys: selectedRowKeys })
    }

    OnChange(pagination, filters, sorter) {
        this.setState({ Sorter: sorter });
        this.props.pageAxis.DataGridView.setOrderBy(pagination, filters, sorter);
    }

    OnRowClick(record, index, e) {
        if (this.props.isRowSelection && e.target && e.target.nodeName === "TD" && !record.isCheckedDisabled) {
            let selectedRowKeys = [];
            if (this.props.isSingleSelection) selectedRowKeys.push(record.key)
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
            className: this.getRowClassName(record.key),
            onClick: this.OnRowClick.bind(this, record, index)
        }
    }

    getRowClassName(key) {
        const list = ["ant-table-row", "ant-table-row-level-0"]

        if (key !== undefined && this.state.SelectedRowKey === key) list.push("RowSelected")
        return list.join(" ")
    }

    getCheckboxProps(data) {
        return {
            disabled: data.isCheckedDisabled,
            name: this.PrimaryKey
        }
    }

    setShowColumns() {
        this.props.pageAxis.InvokeAction(this.props.property.setColumnsEventActionName, this.props);
    }

    render() {
        const rowSelection = this.props.isRowSelection ? {
            selectedRowKeys: this.state.SelectedRowKeys,
            onChange: this.SelectChanged.bind(this),
            getCheckboxProps: this.getCheckboxProps.bind(this)
        } : undefined;

        var justifyContent = "flex-end";
        const { setColumnsEventActionName } = this.props.property;
        if (setColumnsEventActionName) justifyContent = "space-between";

        return (
            <React.Fragment>
                {this.RenderGroupByInfoAlert()}
                <Table dataSource={this.props.DataList} loading={this.props.isLoading}
                    rowSelection={rowSelection} onChange={this.OnChange.bind(this)} onRow={this.onRow.bind(this)}
                    pagination={this.props.isPartPaging ? false : this.getPagination()} >
                    {this.props.DataProperties.map(p => this.getColumn(p))}
                </Table>
                {this.props.isPartPaging ? <div style={{ width: "100%", height: "60px", display: "flex", alignItems: "center", justifyContent: justifyContent }}>
                    {setColumnsEventActionName && <Button onClick={this.setShowColumns.bind(this)} style={{ marginLeft: 16 }}>自定义显示列</Button>}
                    <Pagination {...this.getPagination()} />
                </div> : null}
            </React.Fragment>
        );
    }
}