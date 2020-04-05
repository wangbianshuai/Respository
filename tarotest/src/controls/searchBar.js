import Taro, { useState, useMemo, useCallback } from '@tarojs/taro';
import { AtSearchBar } from 'taro-ui';
import { Common } from 'UtilsCommon';
import { PageAxis } from "PageCommon";

const SearchBar = (props) => {
  const { property, view, pageId } = props;
  const [value, setValue] = useState(getInitValue(property));
  const [disabled, setDisabled] = useState(false);

  const obj = useMemo(() => ({ id: Common.createGuid() }), []);

  init(obj, property, setDisabled);

  property.getValue = () => value;
  property.setValue = setValue;
  property.setDisabled = setDisabled;

  const onActionClick = useCallback(() => {
    const pageAxis = PageAxis.getPageAxis(pageId);
    pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
  }, [property, view, pageId]);

  const onClear = useCallback(() => {
    setValue('');
    setTimeout(() => onActionClick(), 100);
  }, [onActionClick]);

  const { fixed, actionName, maxLength, placeholder, className, style } = property;

  return (
    <AtSearchBar
      className={className} style={style}
      fixed={fixed}
      maxLength={maxLength}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={setValue}
      onClear={onClear}
      actionName={actionName || 'Search'}
      onActionClick={onActionClick}
    />);
};

function init(obj, property, setDisabled) {
  if (property.id && !obj.isInit) obj.isInit = true; else return;

  property.setDisabled = setDisabled;
}

function getInitValue(property) {
  if (!Common.isNullOrEmpty(property.value)) return property.value;
  if (!Common.isNullOrEmpty(property.defalutValue)) return property.defalutValue;

  return undefined;
}

SearchBar.defaultProps = { property: {}, view: {} };
SearchBar.options = { addGlobalClass: true };

export default SearchBar;
