import React, { useState, useCallback, useRef } from 'react';
import { router } from "dva";
import Components from 'Components';
import { EnvConfig } from "Configs";
import styles from '../styles/view.scss';

const { Link } = router;

const refreshUserInfo = (pageAxis, setData) => {
    const formData = {
        Param: '{}',
        Act: 'User_GetInfo'
    }

    pageAxis.dispatchAction('UserService', "getInfo", { formData }).then(res => {
        if (pageAxis.isSuccessProps(res)) setData(res);
        else pageAxis.alert(res.message);
    });
};

const uploadImage = (e, pageAxis, setData) => {
    if (e.target.files.length == 0) return;
    const file = e.target.files[0];
    if (!/image/.test(file.type)) { pageAxis.alert("请选择图片"); return; }

    const reg = /\.(jpg|jpeg|png)$/i;
    if (!reg.test(file.name)) { pageAxis.alert("请选择jpg、jpeg、png格式图片"); return; }

    // 大于 2MB
    if (file && file.size > 1024 * 1024 * 2) { pageAxis.alert('请使用小于2MB的图片'); return }

    const formData = new FormData();
    formData.append("Image", file, file.name);
    formData.set('Act', 'User_UpdateInfo_NV');
    formData.set('Param', '{}');
    const payload = { formData }
    pageAxis.dispatchAction("UserService", "uploadHeadImage", payload).then(res => {
        if (pageAxis.isSuccessProps(res)) refreshUserInfo(pageAxis, setData)
        else pageAxis.alert(res.message);
    });
};

export default (props) => {
    const { property, pageAxis } = Components.Base.getProps(props);
    const [data, setData] = useState({});
    const inputFile = useRef(null)

    const onChange = useCallback((e) => {
        uploadImage(e, pageAxis, setData);
    }, [pageAxis, setData]);

    const onClick = useCallback(() => {
        inputFile.current.click();
    }, [inputFile]);

    property.setValueByData = (d) => setData(d);

    const { HeadImage, FirstName, TotalPoint } = data

    let src = '';
    if (HeadImage) src = EnvConfig.getServiceUrl('ImageService')() + 'HeadImage/' + HeadImage;
    else if (data.UID) src = EnvConfig.getServiceUrl('ImageService')() + 'assets/images/NoImg.svg';

    return (<div className={styles.divUserTopInfo}>
        {src && <div className={styles.divLeft}><img src={src} alt='' onClick={onClick} />
            <input type='file' accept='image/*' onChange={onChange} ref={inputFile} style={{ display: 'none' }} />
        </div>}
        {data.UID && <div className={styles.divRight}>
            <div className={styles.divTop}><span>{FirstName}</span> <Link to='/user/login'>切换用户</Link></div>
            <div className={styles.divBottom}>
                <span>积分：{TotalPoint}分</span>
                <Link to='/integral/get'>索取积分</Link>
                <Link to='/integral/history'>积分历史</Link>
                <Link to='/integral/policy?ParamID=2'>积分政策</Link>
            </div>
        </div>
        }

    </div>)
};