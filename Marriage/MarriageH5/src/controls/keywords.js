import React, { useState, useCallback } from 'react';
import { Common } from 'UtilsCommon';
import { InputItem, List, Button, Icon } from 'antd-mobile';
import Base from './base';
import styles from '../styles/view.scss';

const getSelectValues = (list, isReadOnly, onDelete) => {
    if (list.length === 0) {
        if (isReadOnly) return (<List.Item className={styles.divOptionValue}></List.Item>)
        return null;
    }
    return <List.Item className={styles.divOptionValue}>
        {list.map((m, i) => <span key={i}>{m}
            {!isReadOnly && <Icon type='cross' onClick={() => onDelete(i)} style={{ float: 'right', marginTop: "-1px" }} />}
        </span>)}
    </List.Item>
};
const getValue = (v) => {
    if (Common.isNullOrEmpty(v)) return [];
    return v.split('|');
}

export default (props) => {
    const { property } = Base.getProps(props);

    const [value, setValue] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);

    const onChange = useCallback((v) => {
        v = v.replace(/|/g, '');
        setInputValue(v);
    }, [setInputValue]);

    const onClick = useCallback(() => {
        if (Common.isNullOrEmpty(inputValue)) return;
        setInputValue('');
        inputValue = Common.trim(inputValue)
        if (value.includes(inputValue)) return;
        value.push(inputValue)
        setValue(value);
    }, [setValue, value, setInputValue, inputValue]);

    const onDelete = useCallback((index) => {
        setValue(value.filter((f, i) => i !== index));
    }, [setValue, value]);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(getValue(v));
    property.getValue = () => value.length > 0 ? value.join('|') : Common.trim(inputValue);
    property.setIsReadOnly = (v) => setIsReadOnly(v);

    if (!isVisible) return null;

    const className = Base.getClassName(property, styles);
    const { label } = property;

    const extra = <Button size='small' type='ghost' onClick={onClick}>添加</Button>;

    return (<List className={className} style={property.style} renderHeader={() => label}>
        {!isReadOnly && <InputItem placeholder={'（可选填）'}
            onChange={onChange}
            maxLength={50}
            clear={true}
            extra={extra}
            value={inputValue}></InputItem>}
        {getSelectValues(value, isReadOnly, onDelete)}
    </List>)
}