import React, { useEffect, useState } from 'react';
import styles from '../styles/wxAuthQrCode.scss';
import { Common } from 'UtilsCommon';

const signalR = require('@microsoft/signalr');

const isH5 = Common.isH5();

const isWeiXin = Common.isWeiXin();

export default (props) => {
    const { setWxUser } = props;
    const [url, setUrl] = useState('');

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder().withUrl("https://www.lianliyuan.site/signalr/service").build();

        connection.on("ReceiveMessage", (type, message) => {
            console.log(type);
            if (type === 'AuthSucceed') {
                setWxUser(JSON.parse(message));
            }
        });

        connection.start().then(() => {
            console.log('connection success');
            const url = `https://www.lianliyuan.site/api/image?connectionId=${connection.connectionId}`;
            setUrl(url)
        }).catch(function (err) {
            return console.error(err);
        });
    }, [setWxUser, setUrl]);

    if (!url) return null;

    let style = { minHeight: "100%", width: "100%" };
    if (!isH5) style = { minHeight: "100%", width: '480px', margin: "0 auto" }

    const title = isWeiXin ? '请长按打开小程序登录' : isH5 ? '请使用微信打开长按小程序码登录' : '请使用微信扫一扫小程序码登录'

    return (<div className={styles.divWxAuth} style={style}>
        <div className={styles.divCenter}>
            <div className={styles.divTitle}><span>{title}</span></div>
            <div className={styles.divData}>
                <img src={url} alt="" />
            </div>
            <div className={styles.divRemark}>
                <span><label style={{ color: 'red' }}>注：</label>首次打开小程序会出现“获取头像昵称”按钮，需先点击“获取头像昵称”授权获取头像昵称，再点击“授权登录”按钮授权登录。</span>
            </div>
        </div>
    </div>)
};