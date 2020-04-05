import Taro, { useState, useCallback } from '@tarojs/taro';
import { View, Text, Picker, Icon } from '@tarojs/components';
import { Common } from 'UtilsCommon';

const DatePicker = (props) => {
  const { property } = props;
  const [value, setValue] = useState(getInitValue(property));

  property.getValue = () => value;
  property.setValue = setValue;

  const { placeholder, className, style } = property;

  const onChange = useCallback((e) => {
    setValue(e.detail.value);
  }, []);

  return (<View className='select2'>
    <Picker mode='date' onChange={onChange} value={value}>
      <View className={className || 'picker'} style={style}>
        <Text>{value || placeholder || 'please select date'}</Text>
      </View>
    </Picker>
    {property.isNullable && value && <Icon size='20' type='clear' onClick={() => setValue('')} />}
  </View>);
};


function getInitValue(property) {
  if(property.isCurrentDay){
    property.defalutValue = Common.getCurrentDate().substr(0, 10);
  }

  if (!Common.isNullOrEmpty(property.value)) return property.value;
  if (!Common.isNullOrEmpty(property.defalutValue)) return property.defalutValue;

  return undefined;
}

DatePicker.defaultProps = { property: {}, view: {} };
DatePicker.options = { addGlobalClass: true };

export default DatePicker;
