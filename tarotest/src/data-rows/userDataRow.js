import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

const UserDataRow = (props) => {
  const { data, onLongPress, onClick } = props;

  if (!data) return <View />;
  const rows = [
    { label: 'Login Name', text: data.LoginName  },
    { label: 'User Name', text: data.UserName },
    { label: 'Last Login Date', text: data.LastLoginDate },
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

UserDataRow.options = { addGlobalClass: true };

export default UserDataRow;
