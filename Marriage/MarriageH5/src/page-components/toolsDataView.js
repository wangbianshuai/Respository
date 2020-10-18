import React, { useState } from 'react';
import { Common } from 'UtilsCommon';
import { useGetDataSourceOptions } from 'UseHooks';
import Components from 'Components';
import styles from '../styles/view.scss';
import { router } from "dva";

const { Link } = router;

const renderItem = (property, data, i) => {
    let url = property.detailPageUrl
    url = Common.addUrlParams(url, 'title', data.title);
    url = Common.addUrlParams(url, 'index', i + 1);

    return (
        <Link to={url} key={i}>
            <div className={styles.divItem}>
                <span className={styles.spanTitle}>{data.title}</span>
                <span className={styles.spanContent} style={{ WebkitBoxOrient: "vertical" }}>{data.content}</span>
            </div>
        </Link>
    );
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

    const [options] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

    property.setVisible = (v) => setIsVisible(v);

    if (!isVisible) return null;

    const className = Base.getClassName(property, styles);

    return <div className={className}>
        <div className={styles.divData}>{options}</div>
    </div>;
}