import React, { useState } from 'react';
import Components from 'Components';
import styles from '../styles/view.css';

const renderItem = (data, i, isLast) => {
  const style = {};
  if (i < 4) style.borderTop = '1px solid #ddd';
  if (i / 2 !== 0 || i === 0) style.borderLeft = '1px solid #ddd';
  if ((i + 1) % 4 === 0 || isLast) style.borderRight = '1px solid #ddd';

  return <div className={styles.divItem} style={style} key={data.PhotoId}>
    <a href={data.PhotoUrl} rel="noreferrer" target='_blank'>
      <div className={styles.divImage}><img src={data.PhotoUrl} alt='' /></div>
    </a>
  </div>
}

export default (props) => {
  const { property } = Components.Base.getProps(props);
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [value, setValue] = useState([]);

  property.setVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);
  property.getValue = () => value;

  if (!isVisible) return null;

  return (<div className={styles.divUserPhoto}>
    <div className={styles.divData}>
      {value.map((m, i) => renderItem(m, i, value.length === i + 1))}
    </div>
  </div>)
};