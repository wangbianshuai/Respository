import Taro, { useState, useCallback } from '@tarojs/taro';
import { AtTabBar } from 'taro-ui';
import { PageAxis } from "PageCommon";

const TabBar = (props) => {
  const { property, view, pageId } = props;
  const [current, setCurrent] = useState(property.current || 0);

  const { className, style, fixed, tabList } = property;

  const clickAction = useCallback((value) => {
    setCurrent(value);
    const pageAxis = PageAxis.getPageAxis(pageId);
    pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis, selectIndex: value });
  }, [property, view, pageId]);

  return (<AtTabBar
    className={className}
    style={style}
    fixed={fixed}
    tabList={tabList}
    current={current}
    onClick={clickAction}
  />);
};

TabBar.defaultProps = { property: {}, view: {} };
TabBar.options = { addGlobalClass: true };

export default TabBar;
