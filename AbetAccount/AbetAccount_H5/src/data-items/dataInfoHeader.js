import React from 'react';
import { Common } from 'UtilsCommon';
import styles from '../styles/dataInfoHeader.scss';

const getGroupByInfoHtml = (groupByInfo, groupByInfoHtml) => {
    let html = groupByInfoHtml;
    for (let key in groupByInfo) {
        html = html.replace(new RegExp('{' + key + '}', 'g'), groupByInfo[key]);
    }

    return html;
};

const getConditionTextList = (whereFields) => {
    const textList = [];
    whereFields.forEach(w => {
        if (!Common.isNullOrEmpty(w.Text)) textList.push(`${w.Label}:${w.Text}`);
    })
    return textList;
}

const renderConditionTextList = (textList) => {
    return <div className={styles.divConditionTexts}>
        {textList.map((m, i) => (<span key={i}>{m}</span>))}
    </div>
};

const renderColumns = (property) => {
    const properties = property.properties.filter(f => f.isVisible !== false && f.isColumnVisible !== false);

    return <div className={styles.divColumns}>
        {properties.map((m, i) => <span key={i}>【{m.label}】</span>)}
    </div>
};

export default React.memo((props) => {
    const { property, itemCount, pageRecord, groupByInfo } = props;
    const { groupByInfoHtml } = property;

    const conditionTextList = getConditionTextList(property.queryInfo.WhereFields);

    return (
        <div className={styles.divContainer}>
            {conditionTextList.length > 0 && renderConditionTextList(conditionTextList)}
            {groupByInfoHtml && <div className={styles.divGroupByInfo} dangerouslySetInnerHTML={{ __html: getGroupByInfoHtml(groupByInfo, groupByInfoHtml) }}></div>}
            <div className={styles.divPageInfo}><span>当前显示：{itemCount}条</span><span>总记录：{pageRecord}条</span></div>
            {property.isShowColumn && renderColumns(property)}
        </div>
    )
});

