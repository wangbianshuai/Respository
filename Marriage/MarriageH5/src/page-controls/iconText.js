import React, { useState } from 'react';
import Controls from 'Controls';
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const getText = (property, value) => {
    if (property.dataSource) {
        const data = Common.arrayFirst(property.dataSource, f => Common.isEquals(f.value, value));
        if (data !== null) return data.text;
    }
    return value;
}

export default (props) => {
    const { property } = Controls.Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState(Controls.Base.getInitValue(property));

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);

    if (!isVisible || !value) return null;

    const { style, iconName } = property;

    const className = Controls.Base.getClassName(property, styles);

    return (<div className={className} style={style}><span><img src={Common.getImageUrl(iconName)} alt='' />{getText(property, value)}</span></div>)
};