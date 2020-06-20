import React, { useState, useEffect } from 'react';
import Controls from 'Controls';
import Components from 'Components';
import PageControls from 'PageControls';
import { Common } from 'UtilsCommon';
import { Form, Col } from 'antd';
import Base from './base';

const getPageComponent = (type, props) => {
    if (!type) return null;

    try {
        const pageComponent = require(`../page-components/${type}`).default;
        if (pageComponent) return React.createElement(pageComponent, props);
        return null;
    }
    catch (err) {
        console.warn('components/propertyItem/getPageComponent', err);
        return null
    }
};

const createComponent = (type, props) => {
    if (Components[type]) return React.createElement(Components[type], props);
    else if (Controls[type]) return React.createElement(Controls[type], props);
    else if (PageControls[type]) return React.createElement(PageControls[type], props);
    else return getPageComponent(type, props);
};

//设置只读权限
const setIsReadOnly = (property, pageAxis) => {
    let readOnly = !!property.isReadOnly;
    //判断是否有显示权限
    if (!readOnly && property.readRightName) readOnly = !pageAxis.getRight(property.readRightName);

    if (readOnly && !property.isNullable) property.isNullable = true;
    if (readOnly && property.placeHolder) property.placeHolder = '';

    property.isReadOnly = readOnly;
}

//设置显示权限
const getIsVisible = (property, pageAxis) => {
    if (property.isGetIsVisibe) return property.isVisible;

    property.isGetIsVisibe = true;

    let isVisible = property.isVisible !== false;

    //判断是否有显示权限
    if (isVisible) isVisible = pageAxis.getRight(property.name);
    //判断多个权限名组合有否显示
    if (isVisible && property.rightNames) {
        let visible = false;
        for (let i = 0; i < property.rightNames.length; i++) {
            visible = pageAxis.getRight(property.rightNames[i]);
            if (!visible) break;
        }
        isVisible = visible;
    }

    property.isVisible = isVisible;

    return isVisible;
}

const getReactComponent = (property, view, pageId) => {
    const props = { property: property, key: property.id, view: view || {}, pageId }

    return createComponent(property.type, props);
}

const renderLabel = (property, label) => {
    if (property.isAddOptional) {
        const exLabel = property.ExLabel || '';
        return <React.Fragment>{label}<span style={{ color: '#999999' }}>（选填）</span>{exLabel}</React.Fragment>
    }

    return label;
}

const renderItem = (property, view, pageId, isVisible, label) => {
    const labelCol = property.labelCol || 6;
    const wrapperCol = property.wrapperCol || 18;

    if (property.isFormItem && !property.isFormView) {
        var style = property.style || {};
        if (!isVisible && !property.isColVisible) { style = { ...style }; style.display = 'none'; }

        if (Common.isNullOrEmpty(property.label)) {
            return (<Form.Item style={style} className={property.formItemClassName}>{getReactComponent(property, view, pageId)}</Form.Item>)
        }
        else {
            return (<Form.Item label={renderLabel(property, label)} style={style} colon={property.isColon !== false}
                labelCol={{ span: labelCol }} required={property.isEdit && !property.isNullable} className={property.formItemClassName}
                wrapperCol={{ span: wrapperCol }} >{getReactComponent(property, view, pageId)}</Form.Item>)
        }
    }
    return getReactComponent(property, view, pageId);
}

export default (props) => {
    const { property, view, pageId, pageAxis } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(getIsVisible(property, pageAxis));
    const [label, setLabel] = useState(property.label);

    useEffect(() => {
        if (property.isFormItem) {
            property.setFormItemVisible = (v) => setIsVisible(v);
            property.setLabel = (l) => setLabel(l);
        }

        setIsReadOnly(property, pageAxis);

        pageAxis.getReactComponent = getReactComponent;
    }, [property, pageAxis]);

    if (!property.isColVisible) return renderItem(property, view, pageId, isVisible, label);

    var style = property.ColStyle || {};
    if (!isVisible) { style = { ...style }; style.display = 'none'; }

    return <Col key={property.ColId} span={property.colSpan} style={style}>{renderItem(property, view, pageId, isVisible, label)}</Col>
}