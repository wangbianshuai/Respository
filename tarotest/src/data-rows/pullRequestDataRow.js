import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

const PullRequestDataRow = (props) => {
  const { data, onLongPress, onClick } = props;

  if (!data) return <View />;
  const rows = [
    { label: 'Story', text: data.StoryName },
    { label: 'Pull Request Title', text: data.PullRequestTitle },
    { label: 'Test Cases', text: data.TestCases },
    { label: 'Comments', text: data.Comments },
    { label: 'Remark', text: data.Remark },
    { label: 'User', text: data.CreateUserName },
    { label: 'Date', text: data.StartDate || '' + ' - ' + data.EndDate || '' },
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

PullRequestDataRow.options = { addGlobalClass: true };

export default PullRequestDataRow;
