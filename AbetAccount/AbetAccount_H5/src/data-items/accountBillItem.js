import React, { useState } from 'react';
import { Link } from 'Configs';
import { Common } from 'UtilsCommon';
import styles from '../styles/accountBillItem.scss';

window._DataItems = window._DataItems || {};

export default React.memo((props) => {
    const { property } = props;
    const { BillId } = props.data;
    window._DataItems[BillId] = window._DataItems[BillId] || {}

    const { detailPageUrl } = property;
    const [visible, setVisible] = useState(true);
    const [data, setData] = useState(window._DataItems[BillId].data || props.data)

    const { Remark, Amount2, BillDate, AccountTypeName, AccountCategoryName, AccountItemName, BillUserName } = data;

    window._DataItems[BillId].remove = () => {
        window._DataItems[BillId].visibile = false;
        setVisible(false);
    };

    window._DataItems[BillId].update = (d) => {
        window._DataItems[BillId].data = d;
        setData(d);
    };

    if (!visible || window._DataItems[BillId].visibile === false) return null;

    let url = Common.addUrlParams(detailPageUrl, 'BillId', BillId);
    url = Common.addUrlParams(url, 'navTitle', '修改记账');

    return (<div className={styles.divContainer}>
        <Link to={url}>
            <div className={styles.divText1}>
                <span>{AccountItemName}/{AccountCategoryName}</span>
                {Amount2 >= 0 && <span style={{ color: '#1890ff' }}>{Common.toCurrency(Amount2)}</span>}
                {Amount2 < 0 && <span style={{ color: 'red' }}>{Common.toCurrency(Amount2)}</span>}
            </div>
            <div className={styles.divText2}>
                <span>{BillDate}</span>
                <span>{AccountTypeName}/{BillUserName}</span>
            </div>
            <div className={styles.divText3}>{Remark}</div>
        </Link>
    </div >)
});