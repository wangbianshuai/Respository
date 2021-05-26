import React from 'react';
import { Common } from 'UtilsCommon';
import styles from '../styles/accountBillItem.scss';

const rendDataProperty = (property, index, data) => {
    const { name } = property;
    const value = data[name];

    const isMoney = name === 'Amount2' || name === 'Tax2';

    return (<span className={styles.spanText} key={index}>[
        {isMoney && value >= 0 && <label style={{ color: '#1890ff' }}>{Common.toCurrency(value)}</label>}
        {isMoney && value < 0 && <label style={{ color: 'red' }}>{Common.toCurrency(value)}</label>}
        {!isMoney && value}]
    </span>)
}

export default React.memo((props) => {
    const { property, data } = props;

    const properties = property.properties.filter(f => f.isVisible !== false && f.isColumnVisible !== false);

    return (<div className={styles.divContainer2}>
        {properties.map((m, i) => rendDataProperty(m, i, data))}
    </div >)
});