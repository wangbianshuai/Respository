import React, { useState } from 'react';
import { Html2H5 } from 'UtilsCommon';
import { EnvConfig } from 'Configs';
import Base from './base';
import styles from '../styles/view.scss';

const getRepaceStrs = () => {
  const url = EnvConfig.getServiceUrl('ImageService')();
  return {
    '../HoribaUploadFiles': `${url}/HoribaUploadFiles`
  }
};

export default (props) => {
  const { property } = Base.getProps(props);
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [value, setValue] = useState(Base.getInitValue(property));

  property.setVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);

  if (!isVisible) return null;

  const { style } = property;

  const className = Base.getClassName(property, styles);

  return (<div className={className} style={style} dangerouslySetInnerHTML={{ __html: Html2H5(value, getRepaceStrs()) }} ></div>)
};