import React, { useEffect, useState } from 'react';
import styles from '../styles/wxAuthQrCode.scss';
import QrCode from 'qrcode-react'
import { Common } from 'UtilsCommon';

const signalR = require('@microsoft/signalr');

const isH5 = Common.isH5();

export default (props) => {
    const { setWxUser } = props;
    const [url, setUrl] = useState('');

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder().withUrl("https://live.a2china.cn/signalr/service").build();

        connection.on("ReceiveMessage", (type, message) => {
            console.log(type);
            if (type === 'AuthSucceed') {
                setWxUser(JSON.parse(message));
            }
        });

        connection.start().then(() => {
            console.log('connection success');
            const url = `http://digital.a2china.cn/scrm/events/page/wxauth.html?companyId=1&infoType=2&connectionId=${connection.connectionId}`;
            setUrl(url)
        }).catch(function (err) {
            return console.error(err);
        });
    }, [setWxUser, setUrl]);

    if (!url) return null;

    let style = { minHeight: "100%", width: "100%" };
    if (!isH5) style = { minHeight: "100%", width: '480px', margin: "0 auto" }

    return (<div className={styles.divWxAuth} style={style}>
        <div className={styles.divCenter}>
            <div className={styles.divTitle}><span>请使用微信扫一扫登录</span></div>
            <div className={styles.divData}>
                <QrCode value={url} />
            </div>
        </div>
    </div>)
};