import React, { useState } from 'react';
import { EnvConfig } from "Configs";
import { List } from 'antd-mobile';
import Components from 'Components';
import styles from '../styles/view.scss';

const Base = Components.Base;

const rendeRow = (data, i) => {
    const { Image, GiftTitle, Points, Quantity } = data;
    const src = EnvConfig.getServiceUrl('ImageService')() + 'GiftsImages/' + Image;

    return (<div className={styles.divItem} key={i} style={{ paddingTop: '0.3125rem', paddingBottom: '0.3125rem' }}>
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

const renderOptions = (options) => {
    return options.map((m, i) => rendeRow(m, i));
};

const getTotalPoints = (options) => {
    let sum = 0;
    options.forEach(d => sum += d.Points);
    return sum;
}

export default (props) => {
    const { property } = Base.getProps(props);

    const [value, setValue] = useState([]);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);

    if (!isVisible || value.length === 0) return null;

    const totalPoints = getTotalPoints(value);

    return (<List className={styles.divGiftCart} style={property.style} renderHeader={() => '礼品明细'}
        renderFooter={() => <span>合计：<label style={{ color: '#108ee9' }}>{totalPoints}</label></span>}>
        {renderOptions(value)}</List>)
}