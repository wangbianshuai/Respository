import React, { useState, useCallback } from 'react';
import { Common } from 'UtilsCommon';
import { usePageAxis } from 'UseHooks';
import styles from '../styles/layout.scss';

export default (props) => {
    const { pageData } = props;

    const [visibles, setVisibles] = useState(null);
    const [collectText, setCollectText] = useState(pageData.collectText)

    const onLookClick = useCallback(() => {
        const pageAxis = usePageAxis.getPageAxis(pageData.pageId);
        pageAxis.invokeEventAction('look', {});
    }, [pageData]);

    const onDownloadClick = useCallback(() => {
        const pageAxis = usePageAxis.getPageAxis(pageData.pageId);
        pageAxis.invokeEventAction('download', {});
    }, [pageData]);

    const onConsultClick = useCallback(() => {
        const pageAxis = usePageAxis.getPageAxis(pageData.pageId);
        pageAxis.invokeEventAction('consult', {});
    }, [pageData]);

    const onSignupClick = useCallback(() => {
        const pageAxis = usePageAxis.getPageAxis(pageData.pageId);
        pageAxis.invokeEventAction('signup', {});
    }, [pageData]);

    const onCollectClick = useCallback(() => {
        const pageAxis = usePageAxis.getPageAxis(pageData.pageId);
        pageAxis.invokeEventAction('collect', { isCollect: collectText === '取消收藏' });
    }, [pageData, collectText]);

    pageData.setBottomButtonVisibles = (v) => setVisibles(v);
    pageData.setCollectText = (t) => setCollectText(t);

    if (!collectText || !visibles) return null;

    return <React.Fragment>
        {visibles.signup && <div className={styles.divButton} onClick={onSignupClick}>
            <img src={Common.getImageUrl('signup.png')} alt='' /><span>报名</span>
        </div>}
        <div className={styles.divButton} onClick={onCollectClick}>
            <img src={Common.getImageUrl('collect.png')} alt='' /><span>{collectText}</span>
        </div>
        {visibles.look && <div className={styles.divButton} onClick={onLookClick}>
            <img src={Common.getImageUrl('look.png')} alt='' /><span>查看</span>
        </div>}
        {visibles.download && <div className={styles.divButton} onClick={onDownloadClick}>
            <img src={Common.getImageUrl('download.png')} alt='' /><span>下载</span>
        </div>}
        {visibles.consult && <div className={styles.divButton} onClick={onConsultClick}>
            <img src={Common.getImageUrl('consult.png')} alt='' /><span>咨询</span>
        </div>}
    </React.Fragment>
}