import React from "react"
import { Common } from "UtilsCommon";
import PropertyItem from "./propertyItem";
import { List } from "antd";
import Base from './base';

const judgeNullable = (value, property, itemsetDisabledProperties) => {
    const { nullTipMessage } = property;
    if (value.length === 0) return nullTipMessage;

    const list = itemsetDisabledProperties.filter(f => f.isEdit && f.isVisible !== false);

    let msg = "", v = null, p = null;

    for (let i = 0; i < list.length; i++) {
        p = list[i];
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

const setValue = (dataList, setDataList) => {
    dataList = dataList || [];
    setDataList(dataList);
};

const add = (data, property, dataList, setDataList) => {
    const { primaryKey } = property;

    const id = data[primaryKey];
    let blExists = false;
    const list = [];

    for (let i = 0; i < dataList.length; i++) {
        if (dataList[i][primaryKey] === id) blExists = true;
        else list.push(dataList[i])
    }

    if (blExists) return;
    else list.push(data);

    setValue(list, setDataList);
};

const update = (data, property, dataList, controlProperties) => {
    const { primaryKey } = property;
    const id = data[primaryKey];
    const editData = Common.arrayFirst(dataList, (f) => Common.isEquals(f[primaryKey], id, true));
    if (editData !== null) {
        for (let key in data) editData[key] = data[key];

        const itemProperties = controlProperties[id];
        if (itemProperties) {
            let p = null, name = null;
            for (var key2 in itemProperties) {
                p = itemProperties[key2];
                name = p.propertyName || p.name;

                if (data[name] !== undefined) {
                    p.value = data[name];
                    p.setValue && p.setValue(p.value);
                }
            }
        }
    }
};

const remove = (id, property, dataList, setDataList) => {
    const { primaryKey } = property;
    setValue(dataList.filter(f => !Common.isEquals(f[primaryKey], id, true)), setDataList);
};

const setDisabled = (disabled, itemsetDisabledProperties) => {
    itemsetDisabledProperties.forEach(p => p.setDisabled && p.setDisabled(disabled));
};

const assingProperties = (properties, id, data, index, property, dataList, controlProperties, itemsetDisabledProperties) => {
    return properties.map(p => assignProperty(p, id, data, index, property, dataList, controlProperties, itemsetDisabledProperties));
};

const assignProperty = (p, id, data, index, property, dataList, controlProperties, itemsetDisabledProperties) => {
    const id2 = p.id + id;

    if (!controlProperties[id]) controlProperties[id] = {};
    const itemProperties = controlProperties[id];

    const propertyName = p.propertyName || p.name;

    if (itemProperties[id2]) p = itemProperties[id2];
    else { p = Object.assign({}, p, { value: data[propertyName] }); itemProperties[id2] = p; }
    p.id = p.id + id;
    p.dataId = id;
    p.data = data;
    p.isBind = true;

    if (p.isEdit || p.isDisabled) itemsetDisabledProperties.push(p);

    const visibleName = `${p.name}Visible`
    if (data[visibleName] !== undefined) p.isVisible = data[visibleName];

    const { deletePropertyName, isFirstDelete } = property;
    if (isFirstDelete === false && p.name === deletePropertyName && index === 0) p.isVisible = false;

    if (p.isLastNoVisible && index === dataList.length - 1) p.isVisible = false;

    if (p.properties) p.properties = assingProperties(p.properties, id, data, index, property, dataList, controlProperties, itemsetDisabledProperties);

    return p;
};

const renderItemProperty = (p, id, data, index, property, pageId, dataList, controlProperties, itemsetDisabledProperties) => {
    p = assignProperty(p, id, data, index, property, dataList, controlProperties, itemsetDisabledProperties);

    return <PropertyItem property={p} key={p.id} view={property} pageId={pageId} />
};

const renderListItem = (data, index, property, pageId, dataList, controlProperties, itemsetDisabledProperties) => {
    const { primaryKey, properties, itemProps } = property;
    const id = data[primaryKey];

    if (property.isComplexEdit) return properties.map(p => renderItemProperty(p, id, data, index, property, pageId, dataList, controlProperties, itemsetDisabledProperties));

    const itemProps = itemProps || {}
    return (
        <List.Item key={id} {...itemProps}>
            {properties.map(p => renderItemProperty(p, id, data, index, property, pageId, dataList, controlProperties, itemsetDisabledProperties))}
        </List.Item>
    )
};

export default (props) => {
    const { property, pageId } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [dataList, setDataList] = useState(property.value || property.defaultValue || []);

    const controlProperties = useMemo(() => ({}), []);
    const itemsetDisabledProperties = [];

    property.setVisible = (v) => setIsVisible(v);
    property.add = (v) => add(v, property, dataList, setDataList);
    property.update = (v) => update(v, property, dataList, controlProperties);
    property.remove = (v) => remove(v, property, dataList, setDataList);
    property.setValue = (v) => setValue(v, setDataList);
    property.getValue = () => dataList;
    property.setDisabled = (v) => setDisabled(v, itemsetDisabledProperties);
    property.judgeNullable = (v) => judgeNullable(v, property, itemsetDisabledProperties);

    if (isVisible) return null;

    if (dataList.length === 0) return null;


    if (property.isComplexEdit) return dataList.map((m, i) => renderListItem(m, i, property, pageId, dataList, controlProperties, itemsetDisabledProperties))

    const listProps = this.property.listProps || {}
    return (
        <List {...listProps}>
            {dataList.map((m, i) => renderListItem(m, i, property, pageId, dataList, controlProperties, itemsetDisabledProperties))}
        </List>
    )
};