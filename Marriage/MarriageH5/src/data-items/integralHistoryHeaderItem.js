import React from 'react';
import styles from '../styles/view.scss';

export default (props) => {
    return (
        <div className={styles.divHeaderItem}>
            <span>日期</span>
            <span>积分</span>
            <span>详情</span>
            <span>贡献者</span>
        </div>
    );
}