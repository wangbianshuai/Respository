import React, { useState, useCallback, useMemo, useEffect } from "react"
import Controls from "Controls";
import Base from './base';
import styles from '../styles/view.scss';

const stopInterval = (obj) => {
    if (obj.intervalId > 0) clearInterval(obj.intervalId);
};

const showSecondCount = (obj, setSendText, setIsSending) => {
    setSendText('60s后重新发送');
    setIsSending(true);

    let time = 60
    stopInterval(obj);
    obj.intervalId = setInterval(() => {
        time--
        setSendText(time + 's后重新发送');
        if (time == 0) {
            stopInterval(obj);

            setSendText('重发验证码');
            setIsSending(false);
        }
    }, 1000)
}

export default (props) => {
    const { property, view, pageId, pageAxis } = Base.getProps(props);
    const [sendText, setSendText] = useState('发送验证码');
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const obj = useMemo(() => ({}), []);

    useEffect(() => () => stopInterval(obj), [obj]);

    const sendVerifyCode = useCallback(() => {
        if (isSending || isLoading) return;
        pageAxis.invokeEventAction(property.sendSmsEventActionName, { property, view, pageAxis });
    }, [isSending, property, view, pageAxis])

    property.showSecondCount = () => showSecondCount(obj, setSendText, setIsSending)
    property.setItemVisible = (v) => setIsVisible(v);
    property.setLoading = (v) => setIsLoading(v);

    if (!isVisible) return null;

    const className1 = styles.divVerifyButton;
    const className2 = isSending || isLoading ? styles.verifyButtonDisabled : "";

    return (
        <div className={styles.divSmsVerify}>
            <Controls.TextBox property={property} View={view} pageId={pageId} />
            <div className={[className1, className2].join(' ')} onClick={sendVerifyCode}><span>{sendText}</span></div>
        </div>
    )
};