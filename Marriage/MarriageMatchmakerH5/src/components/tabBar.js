import React, { useCallback } from 'react';
import { TabBar } from 'antd-mobile';
import { Common, PageCommon } from 'UtilsCommon';

const getImage = (url, className) => {
    return <img src={Common.getImageUrl(url)} alt="" className={className} />
};

const judgeSelected = (item, pathName) => {
    return Common.isEquals(item.pathName, pathName, true)
};

const press = (item, pathName, history) => {
    if (judgeSelected(item, pathName)) return;

    let url = `/${item.pathName}/${item.pageName}`;

    const token = Common.getStorage('token');
    if (item.isLogin && !token) {
        url = `/user/login?url=${url}`;
        url = Common.addUrlRandom(url);
    }
    history.push(url);
};

const renderItem = (item, pathName, history) => {
    item.id = item.id || Common.createGuid();

    const onPress = useCallback(() => {
        press(item, pathName, history)
    }, [item, pathName])

    return (
        <TabBar.Item key={item.id} title={item.title}
            icon={getImage(item.imageUrl, item.imageClassName)}
            selectedIcon={getImage(item.selectedImageUrl, item.imageClassName)}
            onPress={onPress}
            selected={judgeSelected(item, pathName)}>
        </TabBar.Item>
    )
};

export default (props) => {
    const { barTintColor, tabBarPosition, unselectedTintColor, tintColor, items } = props.property;

    return (
        <TabBar barTintColor={barTintColor} tabBarPosition={tabBarPosition} unselectedTintColor={unselectedTintColor}
            tintColor={tintColor} >
            {items.map(m => renderItem(m, props.pathName, props.history))}
        </TabBar>
    )
};