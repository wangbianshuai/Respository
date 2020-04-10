import Taro, { useCallback } from '@tarojs/taro';
import { View } from '@tarojs/components';
import DailyDataRow from './dailyDataRow';
import PullRequestDataRow from './pullRequestDataRow';
import WorkingHoursDataRow from './workingHoursDataRow';
import StoryDataRow from './storyDataRow';
import WeekDataRow from './weekDataRow';
import UserDataRow from './userDataRow';

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
  if (entityName === 'PullRequest') return <PullRequestDataRow {...props2} />;
  if (entityName === 'WorkingHours') return <WorkingHoursDataRow {...props2} />;
  if (entityName === 'Story') return <StoryDataRow {...props2} />;
  if (entityName === 'Week') return <WeekDataRow {...props2} />;
  if (entityName === 'User') return <UserDataRow {...props2} />;

  return <View />;
};

export default DataRow;
