import React from 'react';
import styles from '../styles/view.scss';

export default (props) => {
    const { text } = props.data;

    return (
        <div className={styles.divItem}>
            <span>{text}</span>
        </div>
    );
}