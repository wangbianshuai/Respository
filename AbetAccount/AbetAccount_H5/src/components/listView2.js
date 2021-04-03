import React, { useMemo, useCallback, useState } from 'react';
import { ListView, ActivityIndicator, PullToRefresh } from "antd-mobile";
import styles from '../styles/view.scss';

const renderFooter = (isLoadingMore) => {
  return (<div className={styles.divActivityIndicator}><ActivityIndicator animating={isLoadingMore} color="#FE9502" text='正在加载中……' /></div>)
};

const renderNoData = (noDataTip) => {
  return (<div className={styles.divActivityIndicator}><span>{noDataTip}</span></div>)
}

export default React.memo((props) => {
  const { property, dataList, pageIndex, renderHeader, renderRow, pageIndexChange } = props;

  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const obj = useMemo(() => ({
    listDataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
  }), []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    pageIndexChange(1);
  }, [setRefreshing, pageIndexChange]);

  const onEndReached = useCallback(() => {
    setIsLoadingMore(true)
    pageIndexChange(pageIndex + 1)
  }, [setIsLoadingMore, pageIndex, pageIndexChange]);

  property.setIsLoadingMore = (v) => v !== isLoadingMore && setIsLoadingMore(v);
  property.setRefreshing = (v) => v !== refreshing && setRefreshing(v);

  const dataSource = dataList && dataList.length > 0 ? obj.listDataSource.cloneWithRows(dataList) : dataList && dataList.length === 0 ? [] : null

  if (!dataSource) return null;

  if (dataSource.length === 0) return renderNoData(property.noDataTip || '暂无数据')

  const className = styles[property.listClassName || 'divData'];

  const size = dataList ? dataList.length : 0;

  return (<ListView dataSource={dataSource}
    renderRow={renderRow}
    className={className}
    onEndReached={onEndReached}
    onEndReachedThreshold={50}
    pageSize={size}
    renderHeader={renderHeader}
    renderFooter={() => renderFooter(isLoadingMore)}
    pullToRefresh={
      <PullToRefresh refreshing={refreshing} onRefresh={onRefresh} />
    }
  />)
});