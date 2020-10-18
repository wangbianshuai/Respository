import React from 'react';
import styles from '../styles/view.scss';

export default (props) => {
    return (
        <div className={styles.divGetHeaderItem}>
            <span>日期</span>
            <span>标题</span>
            <span>状态</span>
        </div>
    );
}