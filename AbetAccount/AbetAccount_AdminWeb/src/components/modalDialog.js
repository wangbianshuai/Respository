import React, { useState, useMemo, useCallback } from 'react';
import { Modal, Button } from 'antd';

const ok = (e, property, okProperty) => {
    if (okProperty.setDisabled === undefined) {
        okProperty.element = e.target;
        okProperty.setDisabled = (disabled) => { okProperty.element.disabled = disabled }
        okProperty.setLoading = (loading) => { okProperty.element.disabled = loading }
    }

    if (property.onOk) property.onOk(e, okProperty);
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

const renderLookFooter = (onCancel) => {
    return (
        <div>
            <Button onClick={onCancel}>取消</Button>
        </div>
    )
}

export default React.memo((props) => {
    const { property } = props;
    const [visible, setVisible] = useState(property.visible);

    const okPorperty = useMemo(() => ({}), []);

    const onOk = useCallback((e) => {
        ok(e, property, okPorperty);
    }, [property, okPorperty]);

    const onCancel = useCallback(() => {
        cancel(property, okPorperty, setVisible)
    }, [property, okPorperty, setVisible]);

    property.setVisible = (v) => setVisible(v);

    const { isOk, title, width, okText, bodyStyle } = property;

    if (isOk === false) {
        return (
            <Modal title={title} visible={visible} bodyStyle={bodyStyle}
                width={width} onCancel={onCancel}
                footer={renderLookFooter(onCancel)}>
                {renderComponent(property)}
            </Modal>
        )
    }
    else {
        return (
            <Modal title={title} visible={visible} bodyStyle={bodyStyle}
                okText={okText || '确定'} cancelText='取消' width={width}
                onOk={onOk} onCancel={onCancel} >
                {renderComponent(property)}
            </Modal>
        )
    }
});