import React, { useCallback } from 'react';
import styles from '../styles/wxAuthQrCode.scss';
import { Common } from 'UtilsCommon';
import QrCode from 'qrcode-react'
import { Button } from 'antd-mobile'
import Controls from 'Controls';

export default (props) => {
  const { pageAxis } = Controls.Base.getProps(props);

  const url = 'https://www.lianliyuan.site/user/#/?matchmakerId=' + pageAxis.pageData.matchmakerId;

  const onClick = useCallback(() => {
    Common.copyToClip(url);
    pageAxis.alertSuccess('复制成功！')
  }, [url, pageAxis])

  return (<div className={styles.divWxAuth} style={{ width: '100%', height: '100%' }}>
    <div className={styles.divCenter}>
      <div className={styles.divTitle}><span>扫码注册连理缘，缘分等着你</span></div>
      <div className={styles.divData}>
        <QrCode value={url} />
      </div>
      <div className={styles.divButton}>
        <Button type="ghost" onClick={onClick}>复制二维码链接</Button>
      </div>
    </div>
  </div>)
};