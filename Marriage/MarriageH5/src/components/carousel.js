import React, { useState } from 'react';
import { Carousel } from 'antd-mobile';
import { Common } from 'UtilsCommon';
import { EnvConfig } from 'Configs';
import { useGetDataSourceOptions } from 'UseHooks';
import Base from './base';
import styles from '../styles/view.scss';

const getImageLink = (property, d, i) => {
    const href = d[property.hrefName];
    const src = EnvConfig.getServiceUrl('ImageService')() + 'BannerImages/' + d[property.imageUrlName];
    return (
        <a key={i} href={href}>
            <div className={styles.divImage2} style={{ background: `url(${src}) no-repeat`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        </a>
    )
};

const getOptions = (property, view, pageAxis, parentValue) => {
    const options = [];

    const { dataSource } = property;

    Common.isArray(dataSource) && dataSource.forEach((d, i) => {
        if (property.isImageLink) options.push(getImageLink(property, d, i));
    });

    return options;
};

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

    property.setVisible = (v) => setIsVisible(v);
    property.refreshOptions = () => setOptions(getOptions(property, view, pageAxis));

    if (!isVisible) return null;

    const { autoplay, autoplayInterval, infinite } = property;

    const className = Base.getClassName(property, styles);

    if (options.length === 1) return <div className={className}>{options[0]}</div>;

    return (<Carousel className={className}
        autoplay={autoplay}
        autoplayInterval={autoplayInterval}
        infinite={infinite}
    >{options}</Carousel>)
}