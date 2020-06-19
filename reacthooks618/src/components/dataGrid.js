import React, { useState, useEffect, useCallback } from "react"
import { Table, Alert, Pagination, Button } from "antd";
import { Common } from "UtilsCommon";
const { Column } = Table;

const getSelectDataList = (dataList, selectedRowKeys, primaryKey) => {
    return dataList.filter(f => selectedRowKeys.includes(f[primaryKey]))
};

const getColumn = (p, sorter) => {
    const name = p.propertyName || p.name;
    if (p.isData === false) return (<Column title={p.label} key={name} render={p.render} width={p.columnWidth} fixed={p.fixed} />)

    return (<Column title={p.label} dataIndex={name} sorter={p.sorter}
        sortOrder={sorter.columnKey === name && sorter.order}
        key={name} render={p.render} width={p.columnWidth} fixed={p.fixed} />)
}

const getPagination = (isPaging, pageInfo, pageIndexChange) => {
    if (isPaging === false) return false;

    return {
        current: pageInfo.pageIndex,
        total: pageInfo.pageRecord,
        pageSize: pageInfo.pageSize,
        showTotal: (total, range) => `当前${range[0]}-${range[1]}，共 ${total} 条记录`,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50'],
        onShowSizeChange: pageIndexChange,
        onChange: pageIndexChange
    }
};
const renderGroupByInfo = (groupByInfo, groupByInfoHtml) => {
    let html = groupByInfoHtml;
    for (let key in groupByInfo) {
        html = html.replace(new RegExp("{" + key + "}", "g"), groupByInfo[key]);
    }

    return <div dangerouslysetInnerHTML={{ __html: html }}></div>
};

const renderGroupByInfoAlert = (groupByInfo, groupByInfoHtml) => {
    if (Common.isEmptyObject(groupByInfo) || !groupByInfoHtml) return null;

    return <Alert message={renderGroupByInfo(groupByInfo, groupByInfoHtml)} type="info" showIcon={true} />
};

const selectChanged = (selectedRowKeys, setSelectedRowKeys, isSingleSelection, dataList) => {
    if (isSingleSelection && selectedRowKeys && selectedRowKeys.length > 1) {
        const len = dataList.filter(f => !f.isCheckedDisabled).length;
        if (selectedRowKeys.length === len) return;
        selectedRowKeys = [selectedRowKeys[selectedRowKeys.length - 1]];
    }
    setSelectedRowKeys(selectedRowKeys);
};

const rowClick = (record, index, e, isRowSelection, isSingleSelection, stateSelectedRowKeys, setSelectedRowKeys, setSelectedRowKey, dataList) => {
    if (isRowSelection && e.target && e.target.nodeName === "TD" && !record.isCheckedDisabled) {
        let selectedRowKeys = [];
        if (isSingleSelection) selectedRowKeys.push(record.key)
        else {
            selectedRowKeys = stateSelectedRowKeys.filter(f => f !== record.key)
            if (selectedRowKeys.length === stateSelectedRowKeys.length) selectedRowKeys.push(record.key);
        }
        selectChanged(selectedRowKeys, setSelectedRowKeys, isSingleSelection, dataList)
        return
    }

    setSelectedRowKey(record.key);
};

const getRowClassName = (key, selectedRowKey) => {
    const list = ["ant-table-row", "ant-table-row-level-0"]

    if (key !== undefined && selectedRowKey === key) list.push("rowSelected")
    return list.join(" ")
}

const onRow = (onRowClick, selectedRowKey) => (record, index) => {
    return {
        className: getRowClassName(record.key, selectedRowKey),
        onClick: (e) => onRowClick(record, index, e)
    }
};

const getCheckboxProps = (data, primaryKey) => {
    return {
        disabled: data.isCheckedDisabled,
        name: primaryKey
    }
};

const setShowColumns = (property, pageAxis, props) => {
    pageAxis.invokeEventAction(property.setColumnsEventActionName, props);
};

export default (props) => {
    const { property, isRowSelection, dataList, primaryKey, isSingleSelection, pageId, dataProperties,
        pageInfo, isPaging, pageIndexChange, groupByInfo, groupByInfoHtml, setOrderBy } = props;
    const pageAxis = usePageAxis.getPageAxis(pageId);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [sorter, setSorter] = useState({});
    const [selectedRowKey, setSelectedRowKey] = useState('');

    useEffect(() => {
        selectChanged([], setSelectedRowKeys, isSingleSelection, dataList);
    }, [dataList, setSelectedRowKeys, isSingleSelection]);

    const onChange = useCallback((pagination, filters, sorter2) => {
        setSorter(sorter2);
        setOrderBy(pagination, filters, sorter);
    }, [setSorter, setOrderBy]);

    const onRowClick = useCallback((record, index, e) => {
        rowClick(record, index, e, isRowSelection, isSingleSelection, selectedRowKeys, setSelectedRowKeys, setSelectedRowKey, dataList);
    }, [isRowSelection, isSingleSelection, selectedRowKeys, setSelectedRowKeys, setSelectedRowKey, dataList]);

    const onSetShowColumns = useCallback(() => {
        setShowColumns(property, pageAxis, props)
    }, [property, pageAxis, prop]);

    if (isRowSelection && !property.getSelectedRowKeys) property.getSelectedRowKeys = () => selectedRowKeys;

    if (!property.getDataList) property.getDataList = () => dataList;
    if (!property.getSelectDataList) property.getSelectDataList = () => getSelectDataList(dataList, selectedRowKeys, primaryKey);
    if (!property.setSelectedRowKey) property.setSelectedRowKey = (key) => setSelectedRowKey(key);

    const rowSelection = isRowSelection ? {
        selectedRowKeys: selectedRowKeys,
        onChange: (v) => selectChanged(v, setSelectedRowKeys, isSingleSelection, dataList),
        getCheckboxProps: (d) => getCheckboxProps(d, primaryKey)
    } : undefined;

    var justifyContent = "flex-end";
    const { setColumnsEventActionName } = property;
    if (setColumnsEventActionName) justifyContent = "space-between";

    return (
        <React.Fragment>
            {renderGroupByInfoAlert(groupByInfo, groupByInfoHtml)}
            <Table dataSource={dataList} loading={isLoading}
                rowSelection={rowSelection} onChange={onChange} onRow={onRow(onRowClick, selectedRowKey)}
                pagination={isPartPaging ? false : getPagination(isPaging, pageInfo, pageIndexChange)} >
                {dataProperties.map(p => getColumn(p, sorter))}
            </Table>
            {isPartPaging ? <div style={{ width: "100%", height: "60px", display: "flex", alignItems: "center", justifyContent: justifyContent }}>
                {setColumnsEventActionName && <Button onClick={onSetShowColumns} style={{ marginLeft: 16 }}>自定义显示列</Button>}
                <Pagination {...getPagination(isPaging, pageInfo, pageIndexChange)} />
            </div> : null}
        </React.Fragment>
    );
};