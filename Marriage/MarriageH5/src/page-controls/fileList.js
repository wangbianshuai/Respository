import React, { useState, useCallback, useEffect, useRef } from 'react';
import { List, Button, Icon } from 'antd-mobile';
import { EnvConfig } from 'Configs'
import Controls from 'Controls';
import styles from '../styles/view.scss';

const getSelectValues = (list, isReadOnly, onDelete, onDownloadFile) => {
    if (!list || list.length === 0) {
        if (isReadOnly) return (<List.Item className={styles.divOptionValue}></List.Item>)
        return null;
    }
    return list.map((m, i) => <List.Item key={i} >
        <span onClick={() => onDownloadFile(m.UID)}>{m.FileName}</span>
        {!isReadOnly && <Icon type='cross' onClick={() => onDelete(m.UID)} style={{ float: 'right' }} />}
    </List.Item>);
};

const downloadFile = (KeyUID) => {
    const url = EnvConfig.getServiceUrl('ApiService')() + 'FileDownload.ashx';

    var form = document.createElement("form");
    form.method = "post";
    form.action = url;
    form.target = "_self";

    var input = document.createElement("input");
    input.type = "hidden";
    input.name = "KeyUID";
    input.value = KeyUID;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}
const download = (pageAxis, fileUID) => {
    const payload = {
        formData: {
            Param: JSON.stringify({ FileUID: fileUID }),
            Act: 'ClientDocuments_DownloadFile'
        }
    };
    pageAxis.dispatchAction('DocumentService', 'downloadFile', payload).then(res => {
        if (res.KeyUID) downloadFile(res.KeyUID)
        else pageAxis.alert(res.message)
    });
};

const renderHeader = (label, isReadOnly, onClick, onFileChange, inputFile) => {
    return <div className={styles.divGroupHeader}>
        <span>{label}{!isReadOnly && <span style={{ color: 'red' }}>*</span>}</span>
        {!isReadOnly && <Button size='small' type='ghost' onClick={onClick} className={styles.button}>上传</Button>}
        {!isReadOnly && <input type='file' accept='application/msword,application/vnd.ms-powerpoint,application/pdf' onChange={onFileChange} ref={inputFile} style={{ display: 'none' }} />}
    </div>
}

const uploadFile = (e, pageAxis, filesUID, setValue) => {
    if (e.target.files.length == 0) return;
    const file = e.target.files[0];

    const reg = /\.(doc|docx|ppt|pptx|pdf)$/i;
    if (!reg.test(file.name)) { pageAxis.alert("仅限word, ppt, pdf"); return; }

    // 大于 20MB
    if (file && file.size > 1024 * 1024 * 20) { pageAxis.alert('请使用小于20MB的文件'); return }

    const formData = new FormData();
    formData.append("FileData", file, file.name);
    formData.set('Act', 'ClientDocuments_UploadFile');
    formData.set('Param', JSON.stringify({ FilesUID: filesUID }));
    const payload = { formData }
    pageAxis.dispatchAction("DocumentService", "uploadFile", payload).then(res => {
        if (pageAxis.isSuccessProps(res)) setValue(res.Files)
        else pageAxis.alert(res.message);
    });
};

const { Base } = Controls;

export default (props) => {
    const { property, pageAxis } = Base.getProps(props);

    const [value, setValue] = useState([]);
    const [filesUID, setFilesUID] = useState('');
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);
    const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);
    const inputFile = useRef(null)

    const onFileChange = useCallback((e) => {
        uploadFile(e, pageAxis, filesUID, setValue);
    }, [pageAxis, filesUID, setValue]);

    const onClick = useCallback(() => {
        inputFile.current.click();
    }, [inputFile]);

    const onDelete = useCallback((fileUID) => {
        pageAxis.confirm('确认要删除此文件吗？', () => {
            const payload = {
                formData: {
                    Param: JSON.stringify({ UID: fileUID }),
                    Act: 'ClientDocuments_DelFile'
                }
            }
            pageAxis.dispatchAction("DocumentService", "deleteFile", payload).then(res => {
                if (pageAxis.isSuccessProps(res)) setValue(res.Files);
                else pageAxis.alert(res.message);
            });
        });
    }, [pageAxis, setValue]);

    const onDownloadFile = useCallback((fileUID) => {
        download(pageAxis, fileUID)
    }, [pageAxis]);

    useEffect(() => {
        if (property.isNew) {
            const payload = {
                formData: {
                    Param: '{}',
                    Act: 'ClientDocuments_GetFilesUID'
                }
            }
            pageAxis.dispatchAction("DocumentService", "getFilesUID", payload).then(res => {
                if (pageAxis.isSuccessProps(res)) property.setValueByData(res);
                else pageAxis.alert(res.message);
            });
        }
    }, [property])

    property.setVisible = (v) => setIsVisible(v);
    property.getValue = () => filesUID;
    property.setIsReadOnly = (v) => setIsReadOnly(v);
    property.setValueByData = (d) => {
        setFilesUID(d.FilesUID);
        setValue(d.Files)
    };
    property.judgeNullable = () => { return value.length === 0 ? '请上传文件' : '' }

    if (!isVisible) return null;

    const className = Base.getClassName(property, styles);
    const { label } = property;

    return (<List className={className} style={property.style} renderHeader={() => renderHeader(label, isReadOnly, onClick, onFileChange, inputFile)}>
        {getSelectValues(value, isReadOnly, onDelete, onDownloadFile)}
    </List>)
}