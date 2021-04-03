import React, { useState } from 'react';
import { Common } from 'UtilsCommon';
import Base from './base';
import styles from '../styles/view.css';

export default (props) => {
    const { property, pageAxis } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState(Base.getInitValue(property));

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);

    if (!isVisible) return null;

    const { text, label, style } = property;
    let text2 = value || text;

    text2 = Common.replaceDataContent(pageAxis.pageData, text);

    if (!Common.isNullOrEmpty(value)) text2 = value;

    const className = Base.getClassName(property, styles);

    let label2 = null;

    if (label) label2 = <label>{label}</label>

    return (<span className={className} style={style}>{text2}{label2}</span>)
};