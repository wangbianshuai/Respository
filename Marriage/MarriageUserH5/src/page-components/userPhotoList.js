import React, { useState, useRef, useCallback } from 'react';
import { Button, NavBar, Icon, Checkbox } from 'antd-mobile';
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

const renderItem = (data, i, isEdit) => {
  const style = i / 2 !== 0 ? { borderLeft: '1px solid #ddd' } : undefined;
  return <div className={styles.divItem} style={style} key={data.PhotoId}>
    {isEdit && <div className={styles.divImage}><img src={data.PhotoUrl} alt='' /></div>}
    {!isEdit && <a href={data.PhotoUrl} rel="noreferrer" target='_blank'>
      <div className={styles.divImage}><img src={data.PhotoUrl} alt='' /></div>
    </a>}
    {isEdit && <Checkbox className={styles.iconDelete} onChange={(e) => { data.isDelete = e.target.checked }} />}
  </div>
}

const deletePhotos = (value, setValue, pageAxis) => {
  const ids = value.filter(f => f.isDelete).map(m => m.PhotoId);
  if (ids.length === 0) return;
  pageAxis.dispatchAction('MarriageUserPhotoService', 'deletePhotos', { PhotoIds: ids }).then(res => {
    if (pageAxis.isSuccessProps(res)) {
      const list = value.filter(f => !f.isDelete)
      setValue(list);
    }
    else pageAxis.alert(res.message);
  })

};

export default (props) => {
  const { property, pageAxis } = Components.Base.getProps(props);
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [value, setValue] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const inputFile = useRef(null)

  const onChange = useCallback((e) => {
    uploadImage(e, pageAxis, value, setValue);
  }, [pageAxis, value, setValue]);

  const onClick = useCallback(() => {
    if (isEdit) {
      deletePhotos(value, setValue, pageAxis);
      return;
    }
    if (value.length >= 20) {
      pageAxis.alert(' 生活照最多上传20张！');
      return;
    }
    inputFile.current.click();
  }, [inputFile, value, setValue, isEdit, pageAxis]);

  const onEdit = useCallback(() => {
    if (isEdit) value.forEach(v => { v.isDelete = false });
    setIsEdit(!isEdit);
  }, [isEdit, setIsEdit, value]);

  property.setVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);
  property.getValue = () => value;

  if (!isVisible) return null;

  return (<div className={styles.divUserPhoto}>
    <NavBar className={styles.divNavBar}
      mode="mark"
      rightContent={[
        <Button size='small' key={0} onClick={onClick} style={{ marginRight: '0.5rem' }}>{isEdit ? '删除' : '上传'}</Button>,
        <Button size='small' key={1} onClick={onEdit}>{isEdit ? '取消' : '编辑'}</Button>
      ]}
    >生活照</NavBar>
    <div className={styles.divData}>
      {value.map((m, i) => renderItem(m, i, isEdit))}
    </div>
    <input type='file' accept='image/*' onChange={onChange} ref={inputFile} style={{ display: 'none' }} />
  </div>)
};