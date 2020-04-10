import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

const WeekDataRow = (props) => {
  const { data, onLongPress, onClick } = props;

  if (!data) return <View />;
  const rows = [
    { label: 'Date', text: data.StartDate || '' + ' - ' + data.EndDate || '' },
    { label: 'Working Hours', text: data.WorkingHours },
    { label: 'Remark', text: data.Remark },
    { label: 'Create Date', text: data.CreateDate },
  ];

  return (
    <View className='dataRow' onLongPress={onLongPress} onClick={onClick}>
      {
        rows.map((m, i) => (
          <View className='fieldRow' key={i}>
            <Text className='label'>{m.label}:</Text>
            <Text className='text'>{m.text}</Text>
          </View>
        ))
      }
    </View>
  );
};

WeekDataRow.options = { addGlobalClass: true };

export default WeekDataRow;
