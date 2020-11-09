import React, { useCallback } from 'react';
import { TabBar } from 'antd-mobile';
import { Common } from 'UtilsCommon';

const getImage = (url, className) => {
    return <img src={Common.getImageUrl(url)} alt="" className={className} />
};

const judgeSelected = (item, pathName) => {
    return Common.isEquals(item.pathName, pathName, true)
};

const press = (item, pathName, history) => {
    if (judgeSelected(item, pathName)) return;

    let url = `/${item.pathName}/${item.pageName}`;
    history.push(url);
};

const renderItem = (item, pathName, onPress) => {
    item.id = item.id || Common.createGuid();

    return (
        <TabBar.Item key={item.id} title={item.title}
            icon={getImage(item.imageUrl, item.imageClassName)}
            selectedIcon={getImage(item.selectedImageUrl, item.imageClassName)}
            onPress={() => onPress(item)}
            selected={judgeSelected(item, pathName)}>
        </TabBar.Item>
    )
};

export default (props) => {
    const { barTintColor, tabBarPosition, unselectedTintColor, tintColor, items } = props.property;
    const { pathName, history } = props;
    const onPress = useCallback((item) => {
        press(item, pathName, history)
    }, [pathName, history])

    return (
        <TabBar barTintColor={barTintColor} tabBarPosition={tabBarPosition} unselectedTintColor={unselectedTintColor}
            tintColor={tintColor} >
            {items.map(m => renderItem(m, props.pathName, onPress))}
        </TabBar>
    )
};