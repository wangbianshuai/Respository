import React, { useState, useRef, useCallback } from 'react';
import { Button, NavBar, Icon } from 'antd-mobile';
import { Common } from 'UtilsCommon';
import Components from 'Components';
import styles from '../styles/view.scss';

const validateImage = (file, pageAxis) => {
  if (!/image/.test(file.type)) { pageAxis.alert("请选择图片"); return; }

  const reg = /\.(jpg|jpeg|png)$/i;
  if (!reg.test(file.name)) { pageAxis.alert("请选择jpg、jpeg、png格式图片"); return; }

  // 大于 10MB
  if (file && file.size > 1024 * 1024 * 10) { pageAxis.alert('请使用小于10MB的图片'); return }
  return true;
}

const getImage = (file) => {
  const maxSize = 2048;
  if (file.size < maxSize * 1024) return Promise.resolve(file);

  return Common.compressImage(file).then(res => {
    return Promise.resolve(Common.dataURLtoFile(res, file.name));
  });
}

const savePhoto = (pageAxis, url, value, setValue) => {
  pageAxis.dispatchAction('MarriageUserPhotoService', 'savePhoto', { PhotoUrl: url }).then(res => {
    if (pageAxis.isSuccessProps(res)) {
      const list = [{ PhotoId: res.PhotoId, PhotoUrl: url }].concat(value);
      setValue(list);
    }
    else pageAxis.alert(res.message);
  })
};

const uploadImage = (e, pageAxis, value, setValue) => {
  if (e.target.files.length === 0) return;
  const file = e.target.files[0];
  if (!validateImage(file, pageAxis)) return;

  getImage(file).then(img => {
    var formData = new FormData();
    formData.append('file', img, img.name);

    pageAxis.dispatchAction('ResourcesService', 'uploadFile', { formData: formData }).then(res => {
      if (pageAxis.isSuccessProps(res)) savePhoto(pageAxis, res.FileUrl, value, setValue);
      else pageAxis.alert(res.message);
    })
  });
};

const renderItem = (data, i) => {
  return <div className={styles.divItem} key={i}><a href={data.PhotoUrl} rel="noreferrer" target='_blank'><img src={data.PhotoUrl} alt='' /></a></div>
}

export default (props) => {
  const { property, pageAxis } = Components.Base.getProps(props);
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [value, setValue] = useState([]);

  const inputFile = useRef(null)

  const onChange = useCallback((e) => {
    uploadImage(e, pageAxis, value, setValue);
  }, [pageAxis, value, setValue]);

  const onClick = useCallback(() => {
    inputFile.current.click();
  }, [inputFile]);

  property.setVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);
  property.getValue = () => value;

  if (!isVisible) return null;

  return (<div className={styles.divUserPhoto}>
    <NavBar className={styles.divNavBar}
      mode="mark"
      rightContent={[
        <Button size='small' key={0} onClick={onClick}>选择照片</Button>
      ]}
    >生活照</NavBar>
    <div className={styles.divData}>
      {value.map((m, i) => renderItem(m, i))}
    </div>
    <input type='file' accept='image/*' onChange={onChange} ref={inputFile} style={{ display: 'none' }} />
  </div>)
};