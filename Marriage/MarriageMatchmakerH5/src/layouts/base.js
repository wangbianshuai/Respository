import React from 'react';

const getPageComponent = (path, props, key) => {
    if (path === "/") path = "/boygirl/index";
    if (key) props = { ...props, key }

    try {
        const pageComponent = require(`../routes${path}`).default;
        if (pageComponent) return React.createElement(pageComponent, props);
        return null;
    }
    catch (err) {
        console.warn('layouts/base/getPageComponent', err);
        return null
    }
};

const getItem = (pathName, pageName, title, styles, isLogin) => {
    return { pathName, pageName, title, isLogin, imageClassName: styles.navImage, imageUrl: `${pathName}.png`, selectedImageUrl: `${pathName}_selected.png` };
}

const getMatchmakerTabBarProperty = (styles) => ({
    items: [
        getItem('boygirl', 'index', ' 男&女', styles),
        getItem('marriage', 'index', '相亲', styles, true),
        getItem('mine', 'index', '我的', styles, true)
    ]
});

const getPathName = (location) => {
    const { pathname } = location;
    const keys = pathname.split('/').slice(1);
    return keys[0] || 'marriage';
};

export default {
    getPageComponent,
    getItem,
    getMatchmakerTabBarProperty,
    getPathName
}