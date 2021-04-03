import React, { useCallback } from 'react'
import { Popconfirm } from 'antd'
import Base from './base';

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const confirmAction = useCallback(() => {
        pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
    }, [property, view, pageAxis]);

    const text = property.label || property.text

    return (
        <Popconfirm title={property.title} onConfirm={confirmAction} okText='确定' cancelText='取消'>
            <a href={property.href}>{text}</a>
        </Popconfirm>
    )
};