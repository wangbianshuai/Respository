import React, { useState, useMemo, useCallback } from "react";
import { Card, Button, Row, Col } from "antd";
import { Common } from "UtilsCommon";
import PropertyItem from "./propertyItem";
import Base from './base';

const setValue = (dataList, setDataList) => {
    dataList = dataList || [];
    setDataList(dataList);
};

const getPrimaryKey = (property) => {
    return property.entity ? property.entity.primaryKey : 'id';
};

const add = (data, property, dataList, setDataList) => {
    const primaryKey = getPrimaryKey(property);
    data[primaryKey] = data[primaryKey] || Common.createGuid();

    let blExists = false;
    const list = [];

    for (let i = 0; i < dataList.length; i++) {
        if (dataList[i][primaryKey] === data[primaryKey]) blExists = true;
        else list.push(dataList[i])
    }

    if (blExists) return;
    else list.push(data);

    setValue(list, setDataList);
};

const update = (data, property, dataList, setDataList) => {
    const primaryKey = getPrimaryKey(property);
    const id = data[primaryKey];
    const editData = Common.arrayFirst(dataList, (f) => Common.isEquals(f[primaryKey], id, true));
    if (editData !== null) {
        for (let key in data) editData[key] = data[key];

        setValue(dataList.map(m => m), setDataList);
    }
};

const remove = (id, property, dataList, setDataList) => {
    const primaryKey = getPrimaryKey(property);
    setValue(dataList.filter(f => !Common.isEquals(f[primaryKey], id, true)), setDataList);
};

const judgeNullable = (value, property, rowsColsProperties) => {
    const { nullTipMessage } = property;
    if (value.length === 0) return nullTipMessage;

    let msg = "", v = null, p = null;

    for (let i = 0; i < rowsColsProperties.length; i++) {
        p = rowsColsProperties[i];
        if (!p.getValue || !p.isEdit) continue;
        v = p.getValue();
        if (!p.isNullable && p.type === "Select" && Common.isNullOrEmpty(v)) {
            msg = p.nullTipMessage || "请选择" + p.label + "！"
            break;
        }
        else if (!p.isNullable && Common.isNullOrEmpty(v)) {
            msg = p.nullTipMessage || p.label + "不能为空！"
            break;
        }
    }

    return msg;
};

const assignProperty = (p, data, view, controlProperties, rowsColsProperties) => {
    const primaryKey = getPrimaryKey(view);
    const id = data[primaryKey];
    const id2 = p.id + id;

    if (!controlProperties[id]) controlProperties[id] = {};
    const itemProperties = controlProperties[id];

    const propertyName = p.propertyName || p.name;

    if (itemProperties[id2]) p = itemProperties[id2];
    else { p = Object.assign({}, p, { value: data[propertyName] }); itemProperties[id2] = p; }
    p.id = id2;
    p.dataId = id;
    p.data = data;
    p.isBind = true;

    rowsColsProperties.push(p);

    return p;
};

const renderItemProperty = (p, data, property, pageId, controlProperties, rowsColsProperties) => {
    p = assignProperty(p, data, property, controlProperties, rowsColsProperties);

    return <PropertyItem property={p} key={p.id} view={property} pageId={pageId} />
};

const renderRowCols = (data, property, pageId, controlProperties, rowsColsProperties) => {
    return property.properties.map(m => <Col span={m.span} key={m.id}>{renderItemProperty(m, data, property, pageId, controlProperties, rowsColsProperties)}</Col>)
};

const rendDataItem = (data, property, pageId, controlProperties, rowsColsProperties) => {
    const primaryKey = getPrimaryKey(property);
    data[primaryKey] = data[primaryKey] || Common.createGuid();
    return (
        <Row gutter={6} key={data[primaryKey]} style={{ padding: "8px 8px", borderBottom: "1px solid #e8e8e8" }}>
            {renderRowCols(data, property, pageId, controlProperties, rowsColsProperties)}
        </Row>
    )
};

const renderHeaderCols = (property) => {
    return property.properties.map(m => <Col span={m.span} key={m.name}>{m.header || m.label}</Col>)
};

const renderHeaderRowsCols = (property) => {
    return (
        <Row gutter={6} className={"rowHeader"}>
            {renderHeaderCols(property)}
        </Row>
    )
};

const renderAddButton = (property, addRow) => {
    if (property.isAdd === false) return null;
    return <Button onClick={addRow} icon="plus" type="primary">添加</Button>
};

const rendDataItemList = (dataList, property, pageId, controlProperties, rowsColsProperties) => {
    return dataList.map((m) => rendDataItem(m, property, pageId, controlProperties, rowsColsProperties));
};

export default React.memo((props) => {
    const { property, pageId } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [dataList, setDataList] = useState(property.value || property.defaultValue || []);

    const controlProperties = useMemo(() => ({}), []);
    const rowsColsProperties = [];

    const addRow = useCallback(() => {
        add({}, property, dataList, setDataList);
    }, [dataList, property, setDataList]);

    property.setVisible = (v) => setIsVisible(v);
    property.add = (v) => add(v, property, dataList, setDataList);
    property.update = (v) => update(v, property, dataList, setDataList);
    property.remove = (v) => remove(v, property, dataList, setDataList);
    property.setValue = (v) => setValue(v, setDataList);
    property.getValue = () => dataList;
    property.judgeNullable = (v) => judgeNullable(v, property, rowsColsProperties);

    if (!isVisible) return null;

    return (
        <Card title={property.title} headStyle={{ fontWeight: 700 }} extra={renderAddButton(property, addRow)}
            bordered={false} style={{ marginBottom: 16 }} bodyStyle={{ padding: 0, paddingTop: 4 }}>
            {renderHeaderRowsCols(property)}
            {rendDataItemList(dataList, property, pageId, controlProperties, rowsColsProperties)}
        </Card>
    );
});