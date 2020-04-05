import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { View2, List, DataGridView } from "Components"
import { Button2, SpanText, TextBox, TabBar, NavBar, Select2, TextArea2, DatePicker, SearchBar } from "Controls";
import { FormItem } from 'PageControls';
import { Common } from 'UtilsCommon';
import { PageAxis } from 'PageCommon';

const PropertyItem = (props) => {
  const { property, pageId, view } = props;

  if (!pageId) return <View />

  if (!property.id) property.id = Common.createGuid();

  const pageAxis = PageAxis.getPageAxis(pageId);

  const { visibleParamName } = property;

  if (visibleParamName && pageAxis && pageAxis.pageData && pageAxis.pageData[visibleParamName] === 'false') {
    return <View />
  }

  const props2 = { property, key: property.id, view: view || {}, pageId }

  const { type } = property;

  if (type === 'View') return <View2 {...props2} />;
  if (type === 'PropertyItem') return <PropertyItem {...props2} />;

  if (type === 'Button') return <Button2 {...props2} />;
  if (type === 'SpanText') return <SpanText {...props2} />;
  if (type === 'TextBox') return <TextBox {...props2} />;
  if (type === 'TabBar') return <TabBar {...props2} />;
  if (type === 'List') return <List {...props2} />;
  if (type === 'NavBar') return <NavBar {...props2} />;
  if (type === 'FormItem') return <FormItem {...props2} />;
  if (type === 'Select') return <Select2 {...props2} />;
  if (type === 'TextArea') return <TextArea2 {...props2} />;
  if (type === 'DatePicker') return <DatePicker {...props2} />;
  if (type === 'DataGridView') return <DataGridView {...props2} />;
  if (type === 'SearchBar') return <SearchBar {...props2} />;

  return <View />;
};

PropertyItem.defaultProps = { property: {}, view: {} };

export default PropertyItem;
