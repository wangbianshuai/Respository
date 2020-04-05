import Taro, { useCallback } from '@tarojs/taro';
import { View } from '@tarojs/components';
import DailyDataRow from './dailyDataRow';

const DataRow = (props) => {
  const { data, entityName, onLongPressRow, onClikRow } = props;

  const onLongPress = useCallback(() => {
    onLongPressRow && onLongPressRow(data);
  }, [data, onLongPressRow]);

  const onClick = useCallback(() => {
    onClikRow && onClikRow(data)
  }, [data, onClikRow]);

  const props2 = { data, onLongPress, onClick };

  if (entityName === 'Daily') return <DailyDataRow {...props2} />;

  return <View />;
};

export default DataRow;
