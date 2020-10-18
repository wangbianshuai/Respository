import React, { useState } from 'react';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import Components from 'Components';
import styles from '../styles/view.scss';
import DataItems from 'DataItems'

const renderItem = (property, data, i) => {
    const props = { data, key: i, property, index: i }
    const { itemType } = property;
    if (DataItems[itemType]) return React.createElement(DataItems[itemType], props);
    return null;
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

    const { title, rightImageLink, leftImageUrl } = property;
    const className = Base.getClassName(property, styles);

    return <div className={className}>
        <div className={styles.divTitle}>
            <div className={styles.divLeft}>
                {leftImageUrl && <img alt='' src={Common.getImageUrl(leftImageUrl)} />}
                <span>{title}</span>
            </div>
            <div className={styles.divRight}> {Base.getRightImageLink(rightImageLink, 0)}</div>
        </div>
        <div className={styles.divData}>{options}</div>
    </div>;
}