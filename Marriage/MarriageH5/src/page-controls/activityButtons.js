import React from 'react';
import Controls from 'Controls';
import { router } from "dva";;
import styles from '../styles/activity.scss';

const { Link } = router;

const renderButtom = (button, index, activityUID) => {
    var text = ''
    var url = '';
    let isLink = false;
    //审核状态，-2：表单不存在，-1：表单记录不存在，0：待审核，1：审核通过，2：审核不通过
    if (button.auditStatus === -2) return '';
    else if (button.auditStatus === -1) {
        text = button.normalTitle;
        url = '/detail/activityForm?tabPage=0&uid=' + button.formUID + '&activityUID=' + activityUID;
        isLink = true;
    }
    else if (button.auditStatus === 0) text = button.auditTitle;
    else if (button.auditStatus === 1) {
        if (button.isRedirect) {
            text = button.redirectTitle;
            url = button.redirectUrl;
        }
        else text = button.auditPassTitle;
    }
    else if (button.auditStatus === 2) text = button.auditNoPassTitle;

    var enabled = button.auditStatus === -1 || (button.auditStatus === 1 && button.isRedirect);
    if (text) {
        if (isLink) return <Link to={url} key={index}>{text}</Link>
        else if (enabled) return <a href={url} key={index}>{text}</a>;
        else return <a className={styles.bgGray} key={index}>{text}</a>;
    }
    return null;
};

export default (props) => {
    const { property, pageAxis } = Controls.Base.getProps(props);

    const activityUID = pageAxis.pageData.UID;
    const className = Controls.Base.getClassName(property, styles);
    return (<div className={className}>
        {property.buttons && property.buttons.map((m, i) => renderButtom(m, i, activityUID))}
    </div>)
};