import React from 'react';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { ArticleUID, ArticleTitle, CreatedDate, ArticleType } = props.data;

    let detailPageUrl = '';
    let articleTypeName = '';
    if (ArticleType === 10) {
        detailPageUrl = '/detail/library?tabPage=0';
        articleTypeName = '图书馆';
    }
    else if (ArticleType === 20) {
        detailPageUrl = '/detail/activity?tabPage=0';
        articleTypeName = '活动';
    }
    else if (ArticleType === 30) {
        detailPageUrl = '/detail/experience?tabPage=1';
        articleTypeName = '科研经验';
    }
    else if (ArticleType === 40) {
        detailPageUrl = '/detail/video?tabPage=2';
        articleTypeName = '云课堂';
    }

    let url = Common.addUrlParams(detailPageUrl, 'UID', ArticleUID);
    url = Common.addUrlParams(url, 'title', ArticleTitle);

    return (
        <Link to={url}>
            <div className={styles.divItem}>
                <span className={styles.spanTitle}>{ArticleTitle}</span>
                <div className={styles.divTypeDate}>
                    <span className={styles.spanType}><img src={Common.getImageUrl('videotype.png')} alt='' />{articleTypeName}</span>
                    <span className={styles.spanDate}><img src={Common.getImageUrl('calendar.png')} alt='' />{CreatedDate}</span>
                </div>
            </div>
        </Link>
    );
}