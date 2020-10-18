import React, { useState } from 'react';
import { Common } from 'UtilsCommon';
import Base from './base';
import styles from '../styles/view.scss';

const getText = (property, value) => {
    if (property.dataSource) {
        const data = Common.arrayFirst(property.dataSource, f => Common.isEquals(f.value, value));
        if (data !== null) return data.text;
    }
    return value;
}

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

    if (!Common.isNullOrEmpty(value)) text2 = getText(property, value);

    const className = Base.getClassName(property, styles);

    return (<div className={className} style={style}><span className={styles.spanLeft}>{label}</span><span className={styles.spanRight}>{text2}</span></div>)
};