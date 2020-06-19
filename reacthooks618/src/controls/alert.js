import React, { useState } from "react"
import { alert } from "antd"
import { Common } from "UtilsCommon";
import Base from './base';

export default (props) => {
    const { property } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState(Base.getInitValue(property));

    if (!property.setVisible) property.setVisible = (v) => setIsVisible(v);
    if (!property.setValue) property.setValue = (v) => setValue(v);

    if (!isVisible) return null;

    const showIcon = !Common.isNullOrEmpty(value);

    return <alert message={value} type="info" showIcon={showIcon} style={{ marginBottom: 8, marginTop: 8, height: 40 }} />
}