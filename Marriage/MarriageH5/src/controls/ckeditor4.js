import React, { useState, useCallback, useEffect } from 'react';
import { List } from 'antd-mobile';
import CKEditor from 'ckeditor4-react';
import Base from './base';
import styles from '../styles/view.scss';

CKEditor.editorUrl = 'http://www.wikispectra.com/miniSite/plug/ckeditor/ckeditor.js';

const change = (value, property, setValue) => {
    setValue(value);
    Base.bindDataValue(property, value);
};

const valueChange = (property, value) => {
    if (property.valueChange) property.valueChange(value);
};

const getCkEditorConfig = () => {
    return {
        toolbar: [
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat'] },
            { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
            { name: 'links', items: ['Link', 'Unlink'] },
            { name: 'insert', items: ['Smiley', 'TextColor', 'BGColor', 'Format'] },
        ],
        pasteFromWordIgnoreFontFace: true,
        pasteFromWordRemoveFontStyles: false,
        pasteFromWordRemoveStyles: false,
    }
}

export default (props) => {
    const { property } = Base.getProps(props);
    const [value, setValue] = useState(Base.getInitValue(property));
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [disabled, setDisabled] = useState(!!property.disabled);
    const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);

    const onChange = useCallback((e) => {
        change(e.editor.getData(), property, setValue);
    }, [property, setValue]);

    useEffect(() => {
        valueChange(property, value);
    }, [property, value]);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => { property.value = v; setValue(v); }
    property.getValue = () => Base.getValue(property, value);
    property.setDisabled = (v) => setDisabled(v);
    property.setIsReadOnly = (v) => setIsReadOnly(v);

    if (!isVisible) return null;

    const { label, style, isNullable, isRed } = property;

    const className = Base.getClassName(property, styles);

    if (isReadOnly || disabled) {
        return (<List.Item className={className} style={style} >
            <div className={styles.divItemLabel}>{label}</div>
            <div dangerouslySetInnerHTML={{ __html: value }}></div>
        </List.Item>)
    }

    return (<List.Item className={className} style={style} >
        <div className={styles.divItemLabel}>{label}{isNullable === false && isRed ? <span style={{ color: 'red' }}>*</span> : ''}</div>
        <CKEditor data={value} config={getCkEditorConfig()} key={property.value || property.id} onChange={onChange} />
    </List.Item>
    );
};