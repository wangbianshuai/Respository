import React from 'react';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

const { Link } = router;

export default (props) => {
    const { title, content } = props.data;
    let url = props.property.detailPageUrl
    url = Common.addUrlParams(url, 'title', title);
    url = Common.addUrlParams(url, 'index', props.index + 1);

    return (
        <Link to={url}>
            <div className={styles.divItem}>
                <span className={styles.spanTitle}>{title}</span>
                {content && <span className={styles.spanAbstract} style={{ WebkitBoxOrient: "vertical" }}>{content}</span>}
            </div>
        </Link>
    );
}