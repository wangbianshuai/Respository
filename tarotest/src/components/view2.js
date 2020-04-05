import Taro, { useMemo, useState, useEffect, useDidShow } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { Common } from 'UtilsCommon';
import { PageAxis } from "PageCommon";
import PropertyItem from "./propertyItem";

const View2 = (props) => {
  const { property, view, pageId } = props;
  const [visible, setVisible] = useState(property.visible !== false);

  const pageAxis = PageAxis.getPageAxis(pageId);

  const obj = useMemo(() => ({
    id: Common.createGuid(),
  }), []);

  init(obj, property, setVisible);

  useDidShow(() => {
    if (property.eventActionName) pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
  });

  if (!visible) return <View />;

  if (!property.properties || property.properties.length === 0) return <View />;

  if (property.hasView) return (
    <View className={property.className} style={property.style}>
      {property.properties.map(p => {
        const props2 = { property: p, view: property, pageId }
        return <PropertyItem {...props2} key={p.id} />
      })}
    </View>
  );

  return property.properties.map(p => {
    const props2 = { property: p, view: property, pageId };
    return <PropertyItem {...props2} key={p.id} />;
  });
};

function init(obj, property, setVisible) {
  if (property.id && !obj.isInit) obj.isInit = true; else return;

  property.setVisible = setVisible;
}

View2.defaultProps = { property: { properties: [] }, view: {} };
View2.options = { addGlobalClass: true };

export default View2;
