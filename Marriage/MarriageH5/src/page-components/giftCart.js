import React, { useState, useCallback, useEffect } from 'react';
import { useGetDataSourceOptions } from 'UseHooks';
import { EnvConfig } from "Configs";
import { Checkbox, List, Button } from 'antd-mobile';
import Components from 'Components';
import styles from '../styles/view.scss';

const Base = Components.Base;

const getOptions = (property, view, pageAxis, parentValue) => {
    property.isComplete = true;
    return property.dataSource;
};

const rendeRow = (data) => {
    const { Image, GiftTitle, Points, Quantity } = data;
    const src = EnvConfig.getServiceUrl('ImageService')() + 'GiftsImages/' + Image;

    return (<div className={styles.divItem}>
        <div className={styles.divLeft}><img src={src} alt='' /> </div>
        <div className={styles.divRight}>
            <div className={styles.divTop}>
                <span>{GiftTitle}</span>
            </div>
            <div className={styles.divBottom}>
                <span className={styles.spanPoints}>Points：<label>{Points}</label></span>
                <span className={styles.spanPoints}>数量：<label>{Quantity}</label></span>
            </div>
        </div>
    </div>)
};

const renderOptions = (options, value, onChange) => {
    return options.map((m, i) => <Checkbox.CheckboxItem key={i}
        checked={value === m.UID} onChange={(e) => onChange(e, m)}>{rendeRow(m)}
    </Checkbox.CheckboxItem >)
};

const getTotalPoints = (options) => {
    let sum = 0;
    options.forEach(d => sum += d.Points);
    return sum;
}

const setBookViewVisible = (view, v) => {
    const p = view.properties[1];
    p.isVisible = v;
    if (p.setVisible) p.setVisible(v);
}

export default (props) => {
    const { property, view, pageAxis } = Base.getProps(props);

    const [value, setValue] = useState('');
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [dataList, setDataList] = useState(null);

    const [options] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

    const onChange = useCallback((e, m) => {
        setValue(value === m.UID ? '' : m.UID);
    }, [setValue, value]);

    const onDelete = useCallback(() => {
        if (!value) return;
        const list = dataList !== null ? dataList : options;
        setDataList(list.filter(f => f.UID !== value));

        const formData = {
            Param: JSON.stringify({ GiftInCartUID: value, Quantity: 0 }),
            Act: 'Gifts_UpdateGiftInCart'
        }
        pageAxis.dispatchAction('GiftService', 'removeCart', { formData }).then(res => {
            if (!pageAxis.isSuccessProps(res)) pageAxis.alert(res.message)
        });
    }, [pageAxis, dataList, setDataList, options, value]);

    const list = dataList !== null ? dataList : options;

    useEffect(() => {
        if (dataList !== null && dataList.length === 0) setBookViewVisible(view, false);
        else if (list.length > 0) setBookViewVisible(view, true);
    }, [dataList, list])

    property.setVisible = (v) => setIsVisible(v);
    
    if (!isVisible || !property.isComplete) return null;

    if (list.length === 0) return <div className={styles.divCartSpace}>空空如也</div>

    const totalPoints = getTotalPoints(list);

    return (<List className={styles.divGiftCart} style={property.style} renderHeader={() => <Button size='small' style={{ width: '4rem' }} onClick={onDelete} type='ghost'>移除</Button>}
        renderFooter={() => <span>合计：<label style={{ color: '#108ee9' }}>{totalPoints}</label></span>}>
        {renderOptions(list, value, onChange)}</List>)
}