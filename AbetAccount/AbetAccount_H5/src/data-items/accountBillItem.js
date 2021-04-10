import React from 'react';
import { Link } from 'Configs';
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';

export default React.memo((props) => {
    const { property } = props;
    const { Remark, BillId } = props.data;
    const { detailPageUrl } = property;

    let url = Common.addUrlParams(detailPageUrl, 'BillId', BillId);

    return (<div className={styles.divAccountBillItem}>
        <Link to={url}>
            <div>{Remark}</div>
        </Link>
    </div >)
});