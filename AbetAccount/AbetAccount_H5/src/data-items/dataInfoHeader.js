import React from 'react';
import styles from '../styles/dataInfoHeader.scss';

const getGroupByInfoHtml = (groupByInfo, groupByInfoHtml) => {
    let html = groupByInfoHtml;
    for (let key in groupByInfo) {
        html = html.replace(new RegExp('{' + key + '}', 'g'), groupByInfo[key]);
    }

    return html;
};


export default React.memo((props) => {
    const { property, itemCount, pageRecord, groupByInfo } = props

    const { groupByInfoHtml } = property;

    return (
        <div className={styles.divContainer}>
            {groupByInfoHtml && <div className={styles.divGroupByInfo} dangerouslySetInnerHTML={{ __html: getGroupByInfoHtml(groupByInfo, groupByInfoHtml) }}></div>}
            <div className={styles.divPageInfo}><span>当前显示：{itemCount}条</span><span>总记录：{pageRecord}条</span></div>
        </div>
    )
});

