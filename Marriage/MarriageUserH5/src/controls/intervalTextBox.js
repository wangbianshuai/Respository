import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Common } from 'UtilsCommon';
import { InputItem, List } from 'antd-mobile';
import Base from './base';
import styles from '../styles/view.scss';

const setMinMaxValue = (value, property) => {
  if (Common.isNullOrEmpty(value)) return value;

  const { MinValue, MaxValue, dataType } = property;
  if (dataType !== 'int' && dataType !== 'float') return value;

  if (Common.isNullOrEmpty(MinValue) && Common.isNullOrEmpty(MaxValue)) return value;

  const v = Common.getFloatValue(value);

  if (!Common.isNullOrEmpty(MinValue) && v < MinValue) value = MinValue;
  else if (!Common.isNullOrEmpty(MaxValue) && v > MaxValue) value = MaxValue;

  return value;
};

const judgeMinusDot = (value) => {
  if (value === '-') return true;
  if (value === '.') return false;

  if (value.substring(value.length - 1, value.length) === '0') return true;

  if (value.substring(0, value.length - 1).indexOf('.') > 0) return false;

  return value.substring(value.length - 1) === '.';
};

const change = (value, property, setValue) => {
  if (value && property.regExp) value = value.replace(new RegExp(property.regExp, 'ig'), '')
  if (value && property.dataType === 'float' && !judgeMinusDot(value)) value = Common.getNumber(value, property.scale);
  if (value && property.dataType === 'int') value = Common.getIntValue(value);

  if (value === 0 && value !== '0') value = '';

  value = setMinMaxValue(value, property);

  setValue(value);
  Base.bindDataValue(property, value);
};

const valueChange = (property, value, isMax) => {
  if (property.valueChange) property.valueChange(value, isMax);
};

const getArrayValue = (value) => {
  if (!value) return ['', ''];

  const vs = value.split(',');
  if (vs.length === 0) return ['', ''];

  return vs;
}

const setValue = (value, setMinValue, setMaxValue) => {
  var vs = getArrayValue(value);
  setMinValue(vs[0]);
  setMaxValue(vs[1])
}

const getValue = (minValue, maxValue) => {
  if (Common.isNullOrEmpty(minValue) && Common.isNullOrEmpty(maxValue)) return '';
  return minValue + ',' + maxValue;
}

const judgeValueRange = (label, minValue, maxValue) => {
  if (!Common.isNullOrEmpty(minValue) && !Common.isNullOrEmpty(maxValue)) {
    if (parseFloat(minValue) > parseFloat(maxValue)) {
      return label + '最小值不能大于最大值'
    }
  }
  return '';
}

export default (props) => {
  const { property } = Base.getProps(props);
  const arrayValue = useMemo(() => getArrayValue(property.value), [property]);
  const [minValue, setMinValue] = useState(arrayValue[0]);
  const [maxValue, setMaxValue] = useState(arrayValue[1]);
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [disabled, setDisabled] = useState(!!property.disabled);
  const [isReadOnly, setIsReadOnly] = useState(!!property.isReadOnly);

  const onMinChange = useCallback((v) => {
    change(v, property, setMinValue);
  }, [property, setMinValue]);

  const onMaxChange = useCallback((v) => {
    change(v, property, setMaxValue);
  }, [property, setMaxValue]);

  useEffect(() => {
    valueChange(property, minValue, false);
  }, [property, minValue]);

  useEffect(() => {
    valueChange(property, maxValue, true);
  }, [property, maxValue]);

  property.setVisible = (v) => setIsVisible(v);
  property.setValue = (v) => setValue(v, setMinValue, setMaxValue);
  property.getValue = () => getValue(minValue, maxValue);
  property.setDisabled = (v) => setDisabled(v);
  property.setIsReadOnly = (v) => setIsReadOnly(v);
  property.judgeValueRange = () => judgeValueRange(property.label, minValue, maxValue);

  if (!isVisible) return null;

  const { label, extra, clear, isNullable } = property;

  const type = 'text';

  const className = Base.getClassName(property, styles);

  let clear2 = clear === undefined ? true : clear;
  if (isReadOnly || disabled) clear2 = false;

  const minPlaceholder = isReadOnly ? '' : '最小值(' + property.placeHolder + ')';
  const maxPlaceholder = isReadOnly ? '' : '最大值(' + property.placeHolder + ')';

  return (
    <React.Fragment>
      <List.Item className={styles.divLabelItem}>{label}{isNullable === false && !isReadOnly ? <span style={{ color: 'red' }}>*</span> : ''}</List.Item>
      <div className={styles.divIntervalTextBox}>
        <InputItem placeholder={minPlaceholder}
          className={className}
          onChange={onMinChange}
          maxLength={property.maxLength}
          editable={!isReadOnly}
          disabled={disabled && !isReadOnly}
          type={type}
          clear={clear2}
          extra={extra}
          value={minValue}></InputItem>
        <div className={styles.divSpan}><span>至</span></div>
        <InputItem placeholder={maxPlaceholder}
          className={className}
          onChange={onMaxChange}
          maxLength={property.maxLength}
          editable={!isReadOnly}
          disabled={disabled && !isReadOnly}
          type={type}
          clear={clear2}
          extra={extra}
          value={maxValue}></InputItem>
      </div>
    </React.Fragment>
  );
};