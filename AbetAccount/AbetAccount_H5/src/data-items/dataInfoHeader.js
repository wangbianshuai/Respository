import React from 'react';
import styles from '../styles/view.scss';

export default React.memo((props) => {
  const { pageRecord } = props

  return (
    <div className={styles.divContainer}>
      <div className={styles.divTitle}>
        <div className={styles.divLeft}><span>参赛者社区</span></div>
        <div className={styles.divRight}> {pageRecord > 0 && <span>发帖数:{pageRecord}</span>}</div>
      </div>
    </div>
  )
});