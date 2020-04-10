import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

const StoryDataRow = (props) => {
  const { data, onLongPress, onClick } = props;

  if (!data) return <View />;
  const rows = [
    { label: 'Story Id', text: data.StoryId },
    { label: 'Story Title', text: data.StoryTitle },
    { label: 'Date', text: data.StartDate || '' + ' - ' + data.EndDate || '' },
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

StoryDataRow.options = { addGlobalClass: true };

export default StoryDataRow;
