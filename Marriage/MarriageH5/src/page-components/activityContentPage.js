import React, { useState, useEffect } from 'react';
import Components from 'Components';
import { Common } from '../utils-common';
import styles from '../styles/activity.scss';

const Base = Components.Base;

const isH5 = Common.isH5();
const isWeixin = Common.isWeiXin();

const getWxAccessTipProperties = () => {
    return [{ name: "wxAccessTip", type: 'WxAccessTip' }]
};

const getHtmlContent = (pageContent) => {
    return { name: `pageContent`, type: 'HtmlContent', className: 'divPageContent', value: pageContent };
}

const getButtons = (buttons) => {
    return { name: `activityButtons`, type: 'ActivityButtons', className: 'divPageButton', buttons };
}

const getProperties = (data) => {
    return [
        getHtmlContent(data.pageContent),
        getButtons(data.buttons)
    ]
};

const getContentPage = (pageAxis, uid, setProperties) => {
    let openId = pageAxis.pageData.openId || Common.getStorage(uid);

    if (!isWeixin && !openId) {
        openId = Common.createGuid();
        Common.setStorage(uid, openId);
    }

    let formData = new FormData();
    formData.append('param', JSON.stringify({ uid, openId }));
    formData.append('act', 'Event_GetPageInfo');

    pageAxis.dispatchAction('ActivityService', "getContentPage", { formData }).then(res => {
        if (pageAxis.isSuccessProps(res)) {
            if (res.pageTitle) document.title = res.pageTitle;

            //是否允许在PC上打开, 1:允许在PC上打开；2：不允许
            if (!isWeixin && res.allowPcBrowser === 2) {
                setProperties(getWxAccessTipProperties());
                return;
            }

            setProperties(getProperties(res));
        }
        else pageAxis.alert(res.message);
    });
};

export default (props) => {
    const { property, pageAxis } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [value, setValue] = useState('');
    const [properties, setProperties] = useState(null);

    property.setVisible = (v) => setIsVisible(v);
    property.setValue = (v) => setValue(v);

    useEffect(() => {
        value && getContentPage(pageAxis, value, setProperties)
    }, [pageAxis, value, setProperties]);

    property.properties = properties;

    if (!isVisible || !value) return null;
    if (properties === null || properties.length === 0) return null;

    if (!isH5) property.style = { width: '480px', margin: "0 auto" }

    const { style } = property;

    const className = Base.getClassName(property, styles);

    return (
        <div className={className} style={style}>
            {Base.renderProperties(property, pageAxis.id)}
        </div>
    )
};