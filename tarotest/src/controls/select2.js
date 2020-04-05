import Taro, { useState, useCallback } from '@tarojs/taro';
import { View, Text, Picker, Icon } from '@tarojs/components';
import { Common } from 'UtilsCommon';
import { useGetServiceDataSource } from "PageCommon";

const Select2 = (props) => {
  const { property } = props;
  const [value, setValue] = useState(getInitValue(property));
  const dataList = useGetServiceDataSource(props);

  property.getValue = () => value;
  property.setValue = setValue;

  const { placeholder, className, style } = property;

  const onChange = useCallback((e) => {
    if (dataList.length === 0) return;

    let valueName = 'value';
    if (property.serviceDataSource) valueName = property.serviceDataSource.valueName;

    setValue(dataList[e.detail.value][valueName]);
  }, [property, dataList]);

  const textList = getTextList(dataList, property);
  const text = getText(dataList, property, value);

  return (<View className='select2'>
    <Picker mode='selector' range={textList} onChange={onChange}>
      <View className={className || 'picker'} style={style}>
        <Text>{text || placeholder || 'please select'}</Text>
      </View>
    </Picker>
    {property.isNullable && text && <Icon size='20' type='clear' onClick={() => setValue('')} />}
  </View>);
};

function getTextList(dataList, property) {
  if (!dataList || !dataList.length) return [];

  let textName = 'text';
  if (property.serviceDataSource) textName = property.serviceDataSource.textName;

  return dataList.map(m => m[textName]);
}

function getText(dataList, property, value) {
  if (!dataList || !dataList.length) return '';

  let textName = 'text';
  let valueName = 'value';
  if (property.serviceDataSource) {
    textName = property.serviceDataSource.textName;
    valueName = property.serviceDataSource.valueName;
  }

  const data = dataList.find(a => Common.isEquals(a[valueName], value));
  return data ? data[textName] : '';
}

function getInitValue(property) {
  if (!Common.isNullOrEmpty(property.value)) return property.value;
  if (!Common.isNullOrEmpty(property.defalutValue)) return property.defalutValue;

  return undefined;
}

Select2.defaultProps = { property: {}, view: {} };
Select2.options = { addGlobalClass: true };

export default Select2;
