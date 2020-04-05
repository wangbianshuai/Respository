import Taro, { useCallback, useMemo } from '@tarojs/taro';
import { AtNavBar } from 'taro-ui';
import { View } from '@tarojs/components';
import { PageAxis } from "PageCommon";
import { Common } from "UtilsCommon";

const NavBar = (props) => {
  const { property, view, pageId } = props;

  const { className, style, fixed, title, updateTitle, rightFirstIconType } = property;

  const pageAxis = PageAxis.getPageAxis(pageId);

  const onClickLeftIcon = useCallback(() => {
    pageAxis && pageAxis.toBack();
  }, [pageAxis]);

  const onClickRgIconSt = useCallback(() => {
    pageAxis && pageAxis.invokeEventAction(property.rightFirstEventActionName, { property, view, pageAxis });
  }, [property, view, pageAxis]);

  let isUpdate = useMemo(() => pageAxis && view.entity && pageAxis.pageData && !Common.isNullOrEmpty(pageAxis.pageData[view.entity.primaryKey]), [pageAxis, view]);
  const title2 = isUpdate ? updateTitle : title;

  const isEdit = !(pageAxis && pageAxis.pageData && pageAxis.pageData.isEdit === 'false');

  const rightFirstIconType2 = isUpdate && isEdit ? 'trash' : rightFirstIconType;

  return (<View><AtNavBar
    className={className}
    style={style}
    fixed={fixed}
    title={title2}
    leftIconType='chevron-left'
    rightFirstIconType={rightFirstIconType2}
    onClickLeftIcon={onClickLeftIcon}
    onClickRgIconSt={onClickRgIconSt}
  />
    {fixed && <View className='navBarSpace'></View>}
  </View>);
};

NavBar.defaultProps = { property: {}, view: {} };
NavBar.options = { addGlobalClass: true };

export default NavBar;
