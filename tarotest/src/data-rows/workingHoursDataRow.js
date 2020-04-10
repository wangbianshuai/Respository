import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

const WorkingHoursDataRow = (props) => {
  const { data, onLongPress, onClick } = props;

  if (!data) return <View />;
  const rows = [
    { label: 'Week', text: data.WeekName },
    { label: 'Story', text: data.StoryName },
    { label: 'Content', text: data.Content },
    { label: 'Week Working Hours', text: data.WeekWorkingHours },
    { label: 'Working Hours', text: data.HourCount },
    { label: 'Remark', text: data.Remark },
    { label: 'User', text: data.CreateUserName },
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

WorkingHoursDataRow.options = { addGlobalClass: true };

export default WorkingHoursDataRow;
