import React from 'react';
import styles from '../styles/view.scss';

export default (props) => {
    return (<div className={styles.divTechnicalInfo}>
        <span>如果你有</span>
        <span>新技术、新工艺、新方法</span>
        <span>新服务、新软件、新应用、新想法</span>
        <span>……</span>
        <span>做HORIBA Scientific的合作伙伴吧</span>
        <div className={styles.whiteSpace30}></div>
        <span className={styles.spanLight}>我们可以帮助你更好的实现它</span>
        <span className={styles.spanLight}>助你发展创新理念。</span>
    </div>)
};