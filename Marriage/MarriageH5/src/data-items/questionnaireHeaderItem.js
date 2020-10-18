import React from 'react';
import styles from '../styles/view.scss';

export default (props) => {
    return (
        <div className={styles.divQuestionnaireHeaderItem}>
            <span>标题</span>
            <span>开始日期</span>
            <span>结束日期</span>
        </div>
    );
}