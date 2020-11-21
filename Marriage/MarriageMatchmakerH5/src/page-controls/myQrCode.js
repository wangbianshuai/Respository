import React from 'react';
import styles from '../styles/wxAuthQrCode.scss';
import QrCode from 'qrcode-react'
import Controls from 'Controls';

export default (props) => {
  const { pageAxis } = Controls.Base.getProps(props);

  const url = 'http://www.lianliyuan.site/user/#/?matchmakerId=' + pageAxis.pageData.matchmakerId;

  return (<div className={styles.divWxAuth} style={{width:'100%',height:'100%'}}>
    <div className={styles.divCenter}>
      <div className={styles.divTitle}><span>扫码注册连理缘，缘分等着你</span></div>
      <div className={styles.divData}>
        <QrCode value={url} />
      </div>
    </div>
  </div>)
};