import React, { useState } from 'react';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import Components from 'Components';
import styles from '../styles/view.scss';
import DataItems from 'DataItems'

const renderItem = (property, data, i) => {
    const props = { data, key: i, property }
    return React.createElement(DataItems.LabUserItem, props);
};

const getOptions = (property, view, pageAxis, parentValue) => {
    const options = [];

    const { dataSource } = property;

    Common.isArray(dataSource) && dataSource.forEach((d, i) => {
        options.push(renderItem(property, d, i))
    });

    return options;
};

export default (props) => {
    const { Base } = Components;
    const { property, view, pageAxis } = Base.getProps(props);

    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

    property.setVisible = (v) => setIsVisible(v);
    property.refreshOptions = () => setOptions(getOptions(property, view, pageAxis));

    if (!isVisible) return null;

    const className = Base.getClassName(property, styles);

    return <div className={className}>
        <div className={styles.divHeader}><span>每一个实验室账号最多允许绑定10个User账号</span></div>
        <div className={styles.divLabel}><span>用户列表</span></div>
        {options}
    </div>;
}