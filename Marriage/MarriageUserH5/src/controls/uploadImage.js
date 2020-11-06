import React, { useState, useRef, useCallback } from 'react';
import { Button, List } from 'antd-mobile';
import { Common } from 'UtilsCommon';
import Base from './base';
import styles from '../styles/view.scss';

const validateImage = (file, pageAxis) => {
    if (!/image/.test(file.type)) { pageAxis.alert("请选择图片"); return; }

    const reg = /\.(jpg|jpeg|png)$/i;
    if (!reg.test(file.name)) { pageAxis.alert("请选择jpg、jpeg、png格式图片"); return; }

    // 大于 10MB
    if (file && file.size > 1024 * 1024 * 10) { pageAxis.alert('请使用小于10MB的图片'); return }
    return true;
}

const getImage = (file, property) => {
    const { width, height, type, quality, maxWidth, maxHeight, maxSize } = property;

    if (maxSize && file.size < maxSize * 1024) return Promise.resolve(file);

    return Common.compressImage(file, width, height, type || 'image/png', quality || 1, maxWidth, maxHeight).then(res => {
        return Promise.resolve(Common.dataURLtoFile(res, file.name));
    });
}

const uploadImage = (e, pageAxis, property, setValue) => {
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!validateImage(file, pageAxis)) return;

    getImage(file, property).then(img => {
        var formData = new FormData();
        formData.append('file', img, img.name);

        pageAxis.dispatchAction('ResourcesService', 'uploadFile', { formData: formData }).then(res => {
            if (pageAxis.isSuccessProps(res)) setValue(res.FileUrl)
            else pageAxis.alert(res.message);
        })
    });
};

export default (props) => {
    const { property, pageAxis } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState(Base.getInitValue(property));

    const inputFile = useRef(null)

    const onChange = useCallback((e) => {
        uploadImage(e, pageAxis, property, setValue);
    }, [pageAxis, property, setValue]);

    const onClick = useCallback(() => {
        inputFile.current.click();
    }, [inputFile]);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);
    property.getValue = () => value;

    if (!isVisible) return null;

    const { label, style, isNullable } = property;

    const className = Base.getClassName(property, styles);

    const render = <React.Fragment>
        {label && <div className={styles.divLabel}><span>{label}{isNullable === false ? <span style={{ color: 'red' }}>*</span> : ''}</span></div>}
        {value && <div className={styles.divImage3}><img src={value} alt='' onClick={onClick} /></div>}
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