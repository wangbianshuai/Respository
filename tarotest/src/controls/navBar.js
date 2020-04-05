import Taro, { useCallback } from '@tarojs/taro';
import { AtNavBar } from 'taro-ui';
import { View } from '@tarojs/components';
import { PageAxis } from "PageCommon";

const NavBar = (props) => {
  const { property, view, pageId } = props;

  const { className, style, fixed, title, rightFirstIconType } = property;

  const onClickLeftIcon = useCallback(() => {
    if (!property.leftEventActionName) {
      Taro.navigateBack({ delta: 1 })
      return;
    }
    const pageAxis = PageAxis.getPageAxis(pageId);
    pageAxis.invokeEventAction(property.leftEventActionName, { property, view, pageAxis });
  }, [property, view, pageId]);

  const onClickRgIconSt = useCallback(() => {
    const pageAxis = PageAxis.getPageAxis(pageId);
    pageAxis.invokeEventAction(property.RightEventActionName, { property, view, pageAxis });
  }, [property, view, pageId]);

  return (<View><AtNavBar
    className={className}
    style={style}
    fixed={fixed}
    title={title}
    leftIconType='chevron-left'
    rightFirstIconType={rightFirstIconType}
    onClickLeftIcon={onClickLeftIcon}
    onClickRgIconSt={onClickRgIconSt}
  />
    {fixed && <View className='navBarSpace'></View>}
  </View>);
};

NavBar.defaultProps = { property: {}, view: {} };
NavBar.options = { addGlobalClass: true };

export default NavBar;
