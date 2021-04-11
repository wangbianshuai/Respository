import React, { useEffect } from 'react';
import Controls from 'Controls';
import Components from 'Components';
import PageControls from 'PageControls';
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

//设置显示权限
const getIsVisible = (property, pageAxis) => {
    let isVisible = property.isVisible !== false;

    //判断是否有显示权限
    if (isVisible)  isVisible = pageAxis.getRight(property.name);
    
    property.isVisible = isVisible;
}

const getReactComponent = (property, view, pageId) => {
    const props = { property: property, key: property.id, view: view || {}, pageId }

    return createComponent(property.type, props);
}

export default (props) => {
    const { property, view, pageId, pageAxis } = Base.getProps(props);

    getIsVisible(property, pageAxis)

    useEffect(() => {
        pageAxis.getReactComponent = getReactComponent;
    }, [property, pageAxis]);

    return getReactComponent(property, view, pageId);
}