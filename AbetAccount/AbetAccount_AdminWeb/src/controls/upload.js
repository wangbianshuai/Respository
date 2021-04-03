import React, { useCallback, useState } from 'react';
import { Common } from 'UtilsCommon';
import { EnvConfig } from 'Configs';
import { Upload, Button, Icon } from 'antd';
import Base from './base';

const change = (data, property, view, pageAxis, setValue) => {
  let fileList = data.fileList;

  if (data.file.status === 'error') {
    pageAxis.showMessage(`${data.file.name} 文件上传失败！`);
  }
  else if (data.file.status === 'done') {
    const response = data.file.response;
    if (response) {
      if (property.setResponse) property.setResponse(response, property, view);
      else {
        if (response.IsSuccess) {
          property.setUploadResponse && property.setUploadResponse(response)
        }
        else if (response.Message) pageAxis.showMessage(response.Message);
      }
    }
  }

  fileList = fileList.map((file) => {
    if (file.response && file.response.FilePath) file.url = file.response.FilePath;
    else if (property.setResponseUrl) file.url = property.setResponseUrl(file);
    return file;
  });

  setValue(fileList);
};

const getRootPath = () => {
  return EnvConfig.getServiceUrl('ApiService')();
}

const getFullUrl = (url) => {
  url = url === undefined ? '' : url;
  if (url.indexOf('http') !== 0) url = getRootPath() + url
  return Common.addUrlRandom(url)
};

const beforeUpload = (file, property, pageAxis) => {
  if (property.accept) {
    const type = property.accept.replace(new RegExp(',', 'g'), '|');
    const reg = new RegExp(type)

    const names = file.name.split('.');
    const ft = '.' + names[names.length - 1];

    if (!reg.test(ft)) {
      pageAxis.showMessage('请上传' + type + '文件！');
      return false;
    }
  }

  if (file.size === 0) {
    pageAxis.showMessage('上传文件大小为零！');
    return false;
  }

  if (property.FileSize > 0 && file.size > property.FileSize) {
    pageAxis.showMessage('上传文件大小不能大于' + property.FileSizeText + '！');
    return false;
  }

  if (property.beforeUpload) return property.beforeUpload(file);

  return true
}

export default (props) => {
  const { property, view, pageAxis } = Base.getProps(props);

  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [value, setValue] = useState(Base.getInitValue(property) || []);
  const [uploadUrl, setUploadUrl] = useState(property.uploadUrl);
  const [accept, setAccept] = useState(property.accept);
  const [disabled, setDisabled] = useState(!!property.disabled);
  const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);

  const onChange = useCallback((data) => {
    change(data, property, view, pageAxis, setValue);
  }, [property, view, pageAxis, setValue]);

  const onBeforeUpload = useCallback((file) => {
    beforeUpload(file, property, pageAxis)
  }, [property, pageAxis])

  property.setIsVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v);
  property.getValue = () => value;
  property.setDisabled = (v) => setDisabled(v);
  property.setIsReadOnly = (v) => setIsReadOnly(v);
  property.setUploadUrl = (v) => setUploadUrl(v);
  property.setAccept = (v) => setAccept(v);

  if (!isVisible) return null;

  const { text, extLabel, extStyle, name, fileName, headers } = property;
  const text2 = text || '上传';
  const name2 = fileName || name;
  return (
    <Upload name={name2}
      action={getFullUrl(uploadUrl)}
      accept={accept}
      headers={headers}
      fileList={value}
      withCredentials={true}
      beforeUpload={onBeforeUpload}
      onChange={onChange} >
      <Button disabled={disabled || isReadOnly}>
        <Icon type='upload' /> {text2}
      </Button>
      {extLabel && <span style={extStyle}>{extLabel}</span>}
    </Upload>
  )
}