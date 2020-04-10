import Taro, { useState, useCallback } from '@tarojs/taro';
import { AtInput } from 'taro-ui';
import { Common } from 'UtilsCommon';

const TextBox = (props) => {
  const { property } = props;
  const [value, setValue] = useState(getInitValue(property));

  property.getValue = () => value;
  property.setValue = setValue;

  const onChange = useCallback((inputValue) => {
    let value2 = inputValue;
    const { regExp, dataType } = property;
    if (value2 && regExp) value2 = value2.replace(regExp, "")
    if (value2 && dataType === "float" && !judgeMinusDot(value2)) value2 = Common.getNumber(value2, property.scale);
    if (value2 && dataType === "int") value2 = Common.getIntValue(value2);

    if (value2 === 0 && inputValue !== "0") value2 = "";

    value2 = setMinMaxValue(value2, property);

    setValue(value2);
  }, [property]);

  const { name, title, maxLength, inputType, placeholder, className, style } = property;
  let type = 'text';
  if (inputType) type = inputType;

  return (<AtInput
    name={name}
    className={className}
    style={style}
    title={title}
    type={type}
    maxLength={maxLength}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />);
};

function setMinMaxValue(value, property) {
  if (Common.isNullOrEmpty(value)) return value;

  const { minValue, maxValue, dataType } = property;
  if (dataType !== "int" && dataType !== "float") return value;

  if (Common.isNullOrEmpty(minValue) && Common.isNullOrEmpty(maxValue)) return value;

  const v = Common.getFloatValue(value);

  if (!Common.isNullOrEmpty(minValue) && v < minValue) value = minValue;
  else if (!Common.isNullOrEmpty(maxValue) && v > maxValue) value = maxValue;

  return value;
}

function judgeMinusDot(value) {
  if (value === "-") return true;
  if (value === ".") return false;

  if (value.substring(value.length - 1, value.length) === "0") return true;

  if (value.substring(0, value.length - 1).indexOf(".") > 0) return false;

  return value.substring(value.length - 1) === ".";
}

function getInitValue(property) {
  if (!Common.isNullOrEmpty(property.value)) return property.value;
  if (!Common.isNullOrEmpty(property.defalutValue)) return property.defalutValue;

  return undefined;
}

TextBox.defaultProps = { property: {}, view: {} };
TextBox.options = { addGlobalClass: true };

export default TextBox;
