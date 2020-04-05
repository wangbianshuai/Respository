import Taro, { useState, useCallback } from '@tarojs/taro';
import { AtTextarea } from 'taro-ui';
import { Common } from 'UtilsCommon';

const TextArea = (props) => {
  const { property } = props;
  const [value, setValue] = useState(getInitValue(property));

  property.getValue = () => value;
  property.setValue = setValue;

  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const { maxLength, placeholder, className, style } = property;

  return (<AtTextarea
    className={className}
    style={style}
    placeholder={placeholder}
    value={value}
    maxLength={maxLength}
    onChange={onChange}
  />);
};

function getInitValue(property) {
  if (!Common.isNullOrEmpty(property.value)) return property.value;
  if (!Common.isNullOrEmpty(property.defalutValue)) return property.defalutValue;

  return undefined;
}

TextArea.defaultProps = { property: {}, view: {} };
TextArea.options = { addGlobalClass: true };

export default TextArea;
