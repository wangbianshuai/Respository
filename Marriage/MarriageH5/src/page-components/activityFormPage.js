import React, { useState, useEffect } from 'react';
import Components from 'Components';
import styles from '../styles/view.scss';
import { List } from 'antd-mobile';
import { Common } from '../utils-common';

const isH5 = Common.isH5();

const getDataSource = (options) => {
    if (!options) return;
    return options.map(m => ({ value: m.text, text: m.text }));
}

const getButton = (ele) => {
    const style = {};
    if (ele.color) style.color = ele.color;
    if (ele.backgroundColor) style.backgroundColor = ele.backgroundColor;
    const eventActionName = 'saveEntityData';
    return { name: `Field${ele.fId}`, eventActionName, size: 'large', saveEntityDataActionType: 3201, isListItem: true, type: 'Button', style, text: ele.title, buttonType: 'primary' };
}

const getHtmlContent = (ele) => {
    return { name: `Field${ele.fId}`, type: 'HtmlContent', className: 'divContent', value: ele.data };
}

const getTextBox = (ele) => {
    let validateNames = [];
    if (parseInt(ele.inputType, 10) === 2) validateNames = ['validateEmail'];
    else if (parseInt(ele.inputType, 10) === 3) validateNames = ['validateMobile'];
    const { defaultValue } = ele;
    return { name: `Field${ele.fId}`, isLabelItem: true, defaultValue, validateNames, type: 'TextBox', maxLength: 100, placeHolder: ele.required ? '请输入' + ele.title : '可选填', inputType: ele.inputType, label: ele.title, isEdit: true, isNullable: !ele.required };
}

const getTextArea = (ele) => {
    const { defaultValue } = ele;
    return { name: `Field${ele.fId}`, defaultValue, isLabelItem: true, type: 'TextBox', maxLength: 500, controlType: 'textarea', placeHolder: ele.required ? '请输入' + ele.title : '可选填', label: ele.title, isEdit: true, isNullable: !ele.required };
}

const getRadio = (ele) => {
    return { name: `Field${ele.fId}`, type: 'Radio', isLabelItem: true, defaultValue: ele.options && ele.options.length > 0 ? ele.options[0].text : null, label: ele.title, dataSource: getDataSource(ele.options), isEdit: true, isNullable: !ele.required };
}

const getCheckBoxGroup = (ele) => {
    return { name: `Field${ele.fId}`, isJson: true, type: 'CheckBoxGroup', nullTipMessage: '请选择' + ele.title, isList: true, label: ele.title, dataSource: getDataSource(ele.options), isEdit: true, isNullable: !ele.required };
}

const getPicker = (ele) => {
    const { defaultValue } = ele;
    return { name: `Field${ele.fId}`, defaultValue, isLabelItem: true, className: 'divPicker', type: 'Picker', label: ele.title, dataSource: getDataSource(ele.options), isEdit: true, isNullable: !ele.required };
}

const formElementToProperty = (ele, i, pageAxis, fixFieldData) => {
    ele.fId = Common.isNullOrEmpty(ele.fId) ? (i + 1) : ele.fId;
    if (ele.isFix && pageAxis.fixedFields) {
        const key = `Field${ele.fId}`;
        pageAxis.fixedFields[key] = ele.fixField;
    }
    if (ele.isFix && fixFieldData) {
        ele.defaultValue = fixFieldData[ele.fixField];
    }
    //type：1：确定按钮；2：富文本；101：单行输入；102：多行输入；103：单项选择；104：多项选择；105：下拉列表；
    //inputType,1:字符串，2：邮箱，3：手机
    switch (ele.type) {
        case 1: return getButton(ele);
        case 2: return getHtmlContent(ele);
        case 101: return getTextBox(ele);
        case 102: return getTextArea(ele);
        case 103: return getRadio(ele);
        case 104: return getCheckBoxGroup(ele);
        case 105: return getPicker(ele);
        default: return {};
    }
};

const getProperties = (data, pageAxis) => {
    if (!data.formElements) return [];
    const formElements = JSON.parse(data.formElements);
    const ele = Common.arrayFirst(formElements, f => f.type === 1);
    if (ele === null) formElements.push({ title: '提交', type: 1 });

    return formElements.map((m, i) => formElementToProperty(m, i, pageAxis, data.fixFieldData));
};

//关注二维码
const getFollowQRProperty = (qrUrl) => {
    return { name: "followQR", type: 'FollowQR', value: qrUrl }
}

const getWxAccessTipProperties = () => {
    return [{ name: "wxAccessTip", type: 'WxAccessTip' }]
};

const judgeFollowPublicAccount = (data, pageAxis, setProperties, setQrCodeProperty) => {
    const formData = {
        param: JSON.stringify({ openId: pageAxis.pageData.openId, type: 1, uid: pageAxis.pageData.uid, companID: data.companID }),
        act: 'JudgeFollowPublicAccount',
    };

    pageAxis.dispatchAction('ActivityService', "judgeFollowPublicAccount", { formData }).then(res => {
        if (pageAxis.isSuccessProps(res)) {
            //已提交，显示提交结果信息
            if (res.isSubmit) {
                pageAxis.saveEntityDataCallback();
                return;
            }

            setProperties(getProperties(data, pageAxis));

            if (res.qrUrl) setQrCodeProperty(getFollowQRProperty(res.qrUrl));
        }
        else pageAxis.alert(res.message);
    });
};

const getFormConfig = (pageAxis, setProperties, setQrCodeProperty) => {
    const { uid } = pageAxis.pageData;
    if (!uid) return;

    if (!pageAxis.judgeLogin()) return;

    const isWeixin = Common.isWeiXin();

    const formData = {
        param: JSON.stringify({ uid, openId: pageAxis.pageData.openId }),
        act: 'Event_GetForm',
    };

    pageAxis.dispatchAction('ActivityService', "getFormConfig", { formData }).then(res => {
        if (pageAxis.isSuccessProps(res)) {
            pageAxis.formConfig = res;

            if (res.formTitle) document.title = res.formTitle;

            //是否允许在PC上打开, 1:允许在PC上打开；2：不允许
            if (!isWeixin && res.allowPcBrowser === 2) {
                setProperties(getWxAccessTipProperties());
                return;
            }

            const formId = Common.getStorage("formId_" + uid);
            //已提交，显示提交结果信息
            if (res.isSubmit || (!isWeixin && formId === uid)) {
                pageAxis.saveEntityDataCallback();
                return;
            }

            //已获取openId，判断是否关注公众号
            if (isWeixin && pageAxis.pageData.openId && res.wXIdentificationType === 1) {
                judgeFollowPublicAccount(res, pageAxis, setProperties, setQrCodeProperty);
                return;
            }

            setProperties(getProperties(res, pageAxis));
        }
        else pageAxis.alert(res.message);
    });
};

export default (props) => {
    const Base = Components.Base;
    const { property, pageAxis } = Components.Base.getProps(props);
    const [properties, setProperties] = useState(null);
    const [qrCodeProperty, setQrCodeProperty] = useState(null);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    property.setVisible = (v) => setIsVisible(v);

    useEffect(() => {
        getFormConfig(pageAxis, setProperties, setQrCodeProperty)
    }, [pageAxis, setProperties, setQrCodeProperty])

    if (!isVisible) return null;

    if (properties === null || properties.length === 0) return null;

    property.properties = properties;

    const className = Base.getClassName(property, styles);

    if (!isH5) property.style = { width: '480px', margin: "0 auto" }

    if (property.isList) {
        return (
            <div className={styles.divActionForm} style={property.style}>
                <List className={className}>
                    {Base.renderProperties(property, pageAxis.id)}
                    <div style={{ width: '100%', height: 50 }}></div>
                </List>
                {qrCodeProperty && Base.getPropertyItem(qrCodeProperty, property, pageAxis.id)}
            </div>
        )
    }
    if (property.isDiv) return <div className={className} style={property.style}>{Base.renderProperties(property, pageAxis.id)}</div>
    return Base.renderProperties(property, pageAxis.id);
};