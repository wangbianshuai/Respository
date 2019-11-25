import { useState, useMemo, useCallback } from "react";
import { Modal, Button } from "antd";

export default ({ Property }) => {
    const [visible, setVisible] = useState(true);

    const okProperty = useMemo(() => { return {} }, []);

    if (!Property.SetVisible) Property.SetVisible = (v) => setVisible(v);

    const ok = Ok(okProperty, Property);

    const cancel = Cancel(Property, setVisible)

    if (!Property || !visible) return null;

    const { IsOk, Title, Width, OkText, BodyStyle } = Property;

    if (IsOk === false) {
        return (
            <Modal title={Title} visible={true} bodyStyle={BodyStyle}
                width={Width} onCancel={cancel}
                footer={RenderLookFooter(cancel)}>
                {RenderComponent(Property)}
            </Modal>
        )
    }
    else {
        return (
            <Modal title={Title} visible={true} bodyStyle={BodyStyle}
                okText={OkText || "Ok"} cancelText="Cancel" width={Width}
                onOk={ok} onCancel={cancel} >
                {RenderComponent(Property)}
            </Modal>
        )
    }
}

function Ok(okProperty, property) {
    return useCallback((e) => {
        if (okProperty.SetDisabled === undefined) {
            okProperty.Element = e.target;
            okProperty.SetDisabled = (disabled) => { okProperty.Element.disabled = disabled }
        }

        if (property.OnOk) property.OnOk(e, property);
    }, [okProperty, property]);
}

function Cancel(property, setVisible) {
    return useCallback(() => {
        if (property && property.SetDisabled) property.SetDisabled(false);
        setVisible(false)
        if (property.OnCancel) property.OnCancel();
    }, [property, setVisible])
}

function RenderComponent(property) {
    const { Component, Style } = property;

    if (Style) return <div style={Style}>{Component}</div>
    else return Component;
}

function RenderLookFooter(cancel) {
    return (
        <div>
            <Button onClick={cancel}>Cancel</Button>
        </div>
    )
}