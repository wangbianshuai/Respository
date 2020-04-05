import Taro, { useCallback } from '@tarojs/taro';
import { AtList, AtListItem } from 'taro-ui';
import { PageAxis } from "PageCommon";
import { Common } from "UtilsCommon";

const List = (props) => {
  const { property, view, pageId } = props;

  const { className, style, hasBorder, itemList } = property;

  const clickAction = useCallback((item) => {
    property.selectItem = item;
    const pageAxis = PageAxis.getPageAxis(pageId);
    pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
  }, [property, view, pageId]);


  return (<AtList
    className={className}
    style={style}
    hasBorder={hasBorder}
  >
    {itemList && itemList.map((m) => {
      m.id = m.id || Common.createGuid();
      return <AtListItem {...m} key={m.id} onClick={() => clickAction(m)} />;
    })}
  </AtList>
  );
};

List.defaultProps = { property: {}, view: {} };
List.options = { addGlobalClass: true };

export default List;
