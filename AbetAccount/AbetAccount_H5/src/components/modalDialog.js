import React, { useState, useMemo, useCallback } from 'react';
import { Modal } from 'antd-mobile';
import styles from '../styles/view.scss';

const ok = (property, okProperty) => {
    if (okProperty.setDisabled === undefined) {
        okProperty.element = window.event.target;
        okProperty.setDisabled = (disabled) => { okProperty.element.disabled = disabled }
        okProperty.setLoading = okProperty.setDisabled;
    }

    if (property.onOk) property.onOk(window.event, okProperty);
};

const okClick = (property, okProperty) => {
    if (property.onOk) property.onOk(window.event, okProperty);
}

const cancelClick = (property, okProperty, setVisible) => {
    if (okProperty && okProperty.setLoading) okProperty.setLoading(false);
    setVisible(false);
    if (property.onCancel) property.onCancel();
};

const cancel = (property, okProperty, setVisible) => {
    if (okProperty && okProperty.setDisabled) okProperty.setDisabled(false);
    setVisible(false);
    if (property.onCancel) property.onCancel();
};

const renderComponent = (property) => {
    const { component, style } = property;

    if (style) return <div style={style}>{component}</div>
    else return component;
}


export default (props) => {
    const { property } = props;
    const [visible, setVisible] = useState(property.visible);

    const okPorperty = useMemo(() => ({}), []);

    const onOk = useCallback(() => {
        ok(property, okPorperty);
    }, [property, okPorperty]);

    const onClose = useCallback(() => {
        cancel(property, okPorperty, setVisible)
    }, [property, okPorperty, setVisible]);

    property.setVisible = (v) => setVisible(v);

    const { isOk, title, okText, className, wrapClassName, isViewType } = property;

    const footer = [];
    footer.push({ text: '取消', onPress: onClose });
    if (isOk) footer.push({ text: okText || '确定', onPress: onOk });

    if (isViewType) {
        property.onCancelClick = () => cancel(property, property.okProperty, setVisible);
        property.onOkClick = (p) => { property.okProperty = p; ok(property, p) }
        if (property.isVisibleType) {
            return (
                <div className={styles[property.className]} style={{ display: visible ? '' : 'none' }}>
                    {property.component}
                </div>
            )
        }
        else if (visible) return property.component;
        return null;
    }

    return (
        <Modal title={title} visible={visible}
            onClose={onClose}
            transparent={true}
            footer={footer}
            className={styles[className]}
            wrapClassName={styles[wrapClassName]}
        >
            {renderComponent(property)}
        </Modal>
    )
};