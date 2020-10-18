import React, { useState, useEffect, useCallback } from 'react';
import Components from 'Components';
import styles from '../styles/view.scss';

export default (props) => {
    const { Base } = Components;
    const { property, pageAxis } = Base.getProps(props);

    const [data, setData] = useState(null);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

    useEffect(() => {
        const formData = {
            Param: '{ParamID:2}',
            Act: 'SysSetting_GetSingleSysSettingInfo'
        }
        pageAxis.dispatchAction('UserService', 'getSingleSysSettingInfo', { formData }).then(res => {
            if (pageAxis.isSuccessProps(res)) setData(res);
            else pageAxis.alert(res.message);
        })
    }, [pageAxis, setData]);

    const showSalesInfo = useCallback(() => {
        pageAxis.invokeEventAction('showSalesInfo', { property: { entityData: data }, pageAxis })
    }, [pageAxis, data]);

    const showServiceFlow = useCallback(() => {
        pageAxis.invokeEventAction('showServiceFlow', { property: { entityData: data }, pageAxis })
    }, [pageAxis, data]);

    property.setVisible = (v) => setIsVisible(v);

    if (!isVisible || !data) return null;

    const className = Base.getClassName(property, styles);

    return <div className={className}>
        <div className={styles.divItem}>
            <div className={styles.divTitle}><span>售后支持</span></div>
            <div className={styles.divText} onClick={showSalesInfo}><span>HORIBA售后</span></div>
            <div className={styles.divText} onClick={showServiceFlow}><span>售后服务流程</span></div>
            <a href={data.SysValue01} target='_blank' ><div className={styles.divText}><span>维修申请</span></div></a>
            <a href={data.SysValue05} target='_blank' ><div className={styles.divText}><span>安装满意度调查</span></div></a>
            <a href={data.SysValue03} target='_blank' ><div className={styles.divText}><span>服务满意度调查</span></div></a>
        </div>
        <div className={styles.whiteSpace30}></div>
    </div>;
}