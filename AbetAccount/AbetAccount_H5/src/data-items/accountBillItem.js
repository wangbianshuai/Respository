import React from 'react';
import { Link } from 'Configs';
import { Common } from 'UtilsCommon';
import styles from '../styles/accountBillItem.scss';

export default React.memo((props) => {
    const { property, data } = props;
    const { detailPageUrl } = property;
    const { Remark, BillId, Amount2, BillDate, AccountTypeName, AccountCategoryName, AccountItemName, BillUserName } = data;

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