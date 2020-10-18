import React, { useState, useRef, useCallback } from 'react';
import { Button, List } from 'antd-mobile';
import { EnvConfig } from 'Configs';
import Base from './base';
import styles from '../styles/view.scss';

const uploadImage = (e, pageAxis, setImage) => {
    if (e.target.files.length == 0) return;
    const file = e.target.files[0];
    if (!/image/.test(file.type)) { pageAxis.alert("请选择图片"); return; }

    const reg = /\.(jpg|jpeg|png)$/i;
    if (!reg.test(file.name)) { pageAxis.alert("请选择jpg、jpeg、png格式图片"); return; }

    // 大于 2MB
    if (file && file.size > 1024 * 1024 * 2) { pageAxis.alert('请使用小于2MB的图片'); return }

    const reader = new FileReader();
    reader.onload = function (evt) {
        setImage(evt.target.result)
    }
    reader.readAsDataURL(file);
};

export default (props) => {
    const { property, pageAxis } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState(Base.getInitValue(property));
    const [image, setImage] = useState(null);
    const inputFile = useRef(null)

    const onChange = useCallback((e) => {
        uploadImage(e, pageAxis, setImage);
    }, [pageAxis, setImage]);

    const onClick = useCallback(() => {
        inputFile.current.click();
    }, [inputFile]);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);
    property.getValue = (v) => {
        if (inputFile.current.files.length > 0) return inputFile.current.files[0];
        else return null;
    }

    if (!isVisible) return null;

    const { label, style, pathName, isNullable } = property;

    const className = Base.getClassName(property, styles);

    const src = EnvConfig.getServiceUrl('ImageService')() + pathName + '/' + value;

    const render = <React.Fragment>
        {label && <div className={styles.divLabel}><span>{label}{isNullable === false ? <span style={{ color: 'red' }}>*</span> : ''}{image ? <span style={{ color: 'red' }}>(更新图片需保存)</span> : ''}</span></div>}
        {image && <div className={styles.divImage3}><img src={image} alt='' onClick={onClick} /></div>}
        {!image && value && <div className={styles.divImage3}><img src={src} alt='' onClick={onClick} /></div>}
        <Button size='small' type='ghost' onClick={onClick}>选择图片</Button>
        <input type='file' accept='image/*' onChange={onChange} ref={inputFile} style={{ display: 'none' }} />
    </React.Fragment>

    if (property.isListItem) {
        return (<List.Item className={className} style={property.style} >
            {render}
        </List.Item>)
    }

    return (<div className={className} style={style}>
        {render}
    </div>)
};