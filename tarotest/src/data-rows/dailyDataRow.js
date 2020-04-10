import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

const DailyDataRow = (props) => {
  const { data, onLongPress, onClick } = props;

  if (!data) return <View />;
  const rows = [
    { label: 'Story', text: data.StoryName },
    { label: 'Content', text: data.Content },
    { label: 'Remark', text: data.Remark },
    { label: 'User', text: data.CreateUserName },
    { label: 'Hours', text: data.HoursCount },
    { label: 'Working Date', text: data.WorkingDate },
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

DailyDataRow.options = { addGlobalClass: true };

export default DailyDataRow;
