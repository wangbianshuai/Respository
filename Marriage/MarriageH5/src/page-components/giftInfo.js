import React, { useState, useCallback } from 'react';
import Components from 'Components';
import { EnvConfig } from "Configs";
import styles from '../styles/view.scss';
import { Button } from 'antd-mobile';

export default (props) => {
    const { property, view, pageAxis } = Components.Base.getProps(props);
    const [data, setData] = useState({});

    const onClick = useCallback(() => {
        pageAxis.invokeEventAction(property.addCartEventActionName, { property, view, pageAxis });
    }, [property, view, pageAxis]);

    property.setValueByData = (d) => setData(d);

    const { Image, GiftTitle, Points, WhoCanExchange } = data;

    const isExchange = WhoCanExchange <= pageAxis.loginUser.UserType;

    const src = EnvConfig.getServiceUrl('ImageService')() + 'GiftsImages/' + Image;

    return (<div className={styles.divGiftInfo}>
        <div className={styles.divLeft}><img src={src} alt='' /> </div>
        <div className={styles.divRight}>
            <div className={styles.divTop}>
                <span>{GiftTitle}</span>
                <span className={styles.spanPoints}>Points：<label>{Points}</label></span>
            </div>
            <div className={styles.divBottom}>
                {isExchange && <Button size='small' type='primary' onClick={onClick}>加入购物车</Button>}
            </div>
        </div>
    </div>)
};