import React, { useState } from 'react';
import { Common } from 'UtilsCommon';
import { Icon } from 'antd-mobile';
import styles from '../styles/view.scss';
import ProductRecommendActivity from './productRecommendActivity';

const renderElement = (label, text) => {
    return <div className={styles.divLeftRightSpan2}>
        <span className={styles.spanLeft}>{label}</span><span className={styles.spanRight}>{text}</span>
    </div>
}

const renderItem = (data, i, property, view, pageAxis, upDown, setUpDowm) => {
    const recommendActivity = Common.clone(property.recommendActivity);
    recommendActivity.serviceDataSource.payload.formData.Param = `{ProductUIDs:"${data.ProductUID},PageSize:10,PageNumber:1"}`;

    return (
        <div className={styles.divItem} key={i}>
            <div className={styles.divTitle} onClick={() => setUpDowm(upDown === "up" ? "down" : "up")}><Icon type={upDown} size="sm" /><span>{data.Model}</span></div>
            {upDown === "up" && <React.Fragment>
                <div className={styles.divTitle2}><span>仪器基本信息</span></div>
                {renderElement('产品', data.ProductsName)}
                {renderElement('软件版本', data.SoftwareVersion)}
                {renderElement('System ID', data.SystemID)}
                {renderElement('序列号', data.SerialNumber)}
                {renderElement('合同日期', data.ContractDate)}
                {renderElement('保修期', data.WarrantyDate)}
                <div className={styles.divTitle2}><span>推荐活动</span></div>
                <ProductRecommendActivity view={view} pageId={pageAxis.id} property={recommendActivity} />
            </React.Fragment>}
        </div>
    )
};


export default (props) => {
    const [upDown, setUpDowm] = useState('up');
    const { data, i, property, view, pageAxis } = props;

    return renderItem(data, i, property, view, pageAxis, upDown, setUpDowm);

}