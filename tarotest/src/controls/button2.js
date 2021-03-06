import Taro, { useMemo, useState, useCallback } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { Common } from 'UtilsCommon';
import { PageAxis } from "PageCommon";

const Button2 = (props) => {
  const { property, view, pageId } = props;
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);

  const pageAxis = PageAxis.getPageAxis(pageId);

  const { text, buttonType, size, className, style } = property;

  const obj = useMemo(() => ({
    id: Common.createGuid(),
  }), []);

  init(obj, property, setLoading, setVisible);

  const clickAction = useCallback(() => {
    pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
  }, [property, view, pageAxis]);

  if (!visible) return <View />;

  if (className || style) {
    return <View className={className} style={style} ><AtButton type={buttonType} size={size} loading={loading} onClick={clickAction}>{text}</AtButton></View>
  }

  return (<AtButton type={buttonType} size={size} loading={loading} onClick={clickAction}>{text}</AtButton>);
};

function init(obj, property, setLoading, setVisible) {
  if (property.id && !obj.isInit) obj.isInit = true; else return;

  property.setLoading = setLoading;
  property.setVisible = setVisible;
}

Button2.defaultProps = { property: {}, view: {} };
Button2.options = { addGlobalClass: true };

export default Button2;
