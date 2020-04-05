import Taro, { useMemo, useState } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Common } from 'UtilsCommon';
import { TextBox, Select2, TextArea2, DatePicker } from "Controls";

const FormItem = (props) => {
  const { property, pageId, view } = props;
  const [visible, setVisible] = useState(property.visible !== false);

  const obj = useMemo(() => ({
    id: Common.createGuid(),
  }), []);

  init(obj, property, setVisible);

  if (!visible) return <View />;

  const { viewClassName, viewStyle, isNullable, label, labelClassName, labelStyle } = property;

  return <View className={viewClassName} style={viewStyle}>
    <View className={labelClassName} style={labelStyle}><Text className='textLabel'>{label}</Text>
      {!isNullable && <Text className='redLabel'>*</Text>}
    </View>
    {property.controlType === "TextBox" && <TextBox property={property} pageId={pageId} view={view} />}
    {property.controlType === "Select" && <Select2 property={property} pageId={pageId} view={view} />}
    {property.controlType === "TextArea" && <TextArea2 property={property} pageId={pageId} view={view} />}
    {property.controlType === "DatePicker" && <DatePicker property={property} pageId={pageId} view={view} />}
  </View>
};

function init(obj, property, setVisible) {
  if (property.id && !obj.isInit) obj.isInit = true; else return;

  property.setLabelItemVisible = setVisible;
}

FormItem.defaultProps = { property: { isNullable: true }, view: {} };
FormItem.options = { addGlobalClass: true };

export default FormItem;
