import React, { useState } from 'react';
import { Common } from 'UtilsCommon';
import { router } from "dva";
import Base from './base';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { property, pageAxis } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    property.setVisible = (v) => setIsVisible(v);

    if (!isVisible) return null;

    const { text, style, isDiv, isAddUrl } = property;

    let url = property.url;

    if (isAddUrl) {
        const { pathname, search } = pageAxis.props.location;
        url = Common.addUrlParams(url, 'url', pathname + search);
    }

    const className = Base.getClassName(property, styles);

    if (isDiv) return (<div className={className} style={style}><Link to={url}>{text}</Link></div>)

    return (<Link className={className} style={style} to={url}>{text}</Link>)
};