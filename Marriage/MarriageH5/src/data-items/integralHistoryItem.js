import React from 'react';
import styles from '../styles/view.scss';

export default (props) => {
    const { CreatedDate, Point, Description, ContributorFirstName } = props.data;
    return (
        <div className={styles.divDataRow}>
            <span>{CreatedDate}</span>
            <span>{Point}</span>
            <span>{Description}</span>
            <span>{ContributorFirstName}</span>
        </div>
    );
}