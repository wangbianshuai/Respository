import React, { useState } from 'react';
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

window._ListHeader = {};

const removeItem = (id, primaryKey, props, setRefresh) => {
    let index = -1;
    const { dataList, pageInfo } = props;
    for (let i = 0; i < dataList.length; i++) {
        if (Common.isEquals(dataList[i][primaryKey], id, true)) {
            index = i;
        }
    }
    if (index >= 0) {
        dataList.splice(index, 1);
        pageInfo.pageRecord -= 1;
        setRefresh(Common.createGuid())
    }
}

export default React.memo((props) => {
    const { property, dataList, pageInfo, primaryKey, groupByInfo } = props;
    const [refreshId, setRefresh] = useState('');

    const itemCount = dataList.length;
    const { groupByInfoHtml } = property;

    window._ListHeader.removeItem = (id) => removeItem(id, primaryKey, props, setRefresh);

    if (dataList.length == 0) return <div className={styles.divActivityIndicator}><span>暂无数据</span></div>;

    const conditionTextList = getConditionTextList(property.queryInfo.WhereFields);

    return (
        <div className={styles.divContainer}>
            {conditionTextList.length > 0 && renderConditionTextList(conditionTextList)}
            {groupByInfoHtml && <div className={styles.divGroupByInfo} dangerouslySetInnerHTML={{ __html: getGroupByInfoHtml(groupByInfo, groupByInfoHtml) }}></div>}
            <div className={styles.divPageInfo}><span>当前显示：{itemCount}条</span><span>总记录：{pageInfo.pageRecord}条</span></div>
        </div>
    )
});

