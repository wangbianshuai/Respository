import React from 'react';

const getPageComponent = (path, props, key) => {
    if (path === "/") path = "/home/index";
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

const getTabBarProperty = (styles) => ({
    barTintColor: '#187FC4',
    unselectedTintColor: '#ffffff',
    tintColor: '#17B8D8',
    items: [
        getItem('home', 'index', '首页', styles),
        getItem('footmark', 'index', '足迹', styles, true),
        getItem('gift', 'index', '商城', styles, true),
        getItem('mine', 'index', '我的', styles, true)
    ]
});

const getPathName = (location) => {
    const { pathname } = location;
    const keys = pathname.split('/').slice(1);
    return keys[0] || 'home';
};

export default {
    getPageComponent,
    getItem,
    getTabBarProperty,
    getPathName
}