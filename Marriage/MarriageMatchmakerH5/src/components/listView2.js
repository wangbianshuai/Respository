import React, { useMemo, useCallback, useState } from 'react';
import { ListView, ActivityIndicator, PullToRefresh } from "antd-mobile";
import styles from '../styles/view.scss';

const renderFooter = (isLoadingMore) => {
  return (<div className={styles.divActivityIndicator}><ActivityIndicator animating={isLoadingMore} color="#FE9502" text='正在加载中……' /></div>)
};

const renderNoData = (noDataTip) => {
  return (<div className={styles.divActivityIndicator}><span>{noDataTip}</span></div>)
}

export default (props) => {
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

  const onScroll = useCallback((e) => {
    if (!property.isHideCondition) return;
    const ele = e.target.parentElement.parentElement;

    if (obj.isSetPaddingTop) {
      obj.isSetPaddingTop = false;
      return;
    }

    if (!obj.paddingTop) {
      let paddingTop = window.getComputedStyle(ele, null).paddingTop.replace('px', '');
      obj.paddingTop = !paddingTop ? 0 : parseFloat(paddingTop);
    }
    if (obj.paddingTop === 0) return;

    const scrollTop = e.target.scrollTop;
    let top = obj.paddingTop - scrollTop;
    top = top < 0 ? 0 : top;

    obj.isSetPaddingTop = true;
    if (scrollTop === 0) ele.style.paddingTop = '';
    else ele.style.paddingTop = `${top}px`;
  }, [obj, property]);

  property.setIsLoadingMore = (v) => v !== isLoadingMore && setIsLoadingMore(v);
  property.setRefreshing = (v) => v !== refreshing && setRefreshing(v);

  const dataSource = dataList && dataList.length > 0 ? obj.listDataSource.cloneWithRows(dataList) : dataList && dataList.length === 0 ? [] : null

  if (!dataSource) return null;

  if (dataSource.length === 0) return renderNoData(property.noDataTip || '暂无数据')

  const className = styles[property.listClassName || 'divData'];

  return (<ListView dataSource={dataSource}
    renderRow={renderRow}
    className={className}
    onEndReached={onEndReached}
    onEndReachedThreshold={50}
    onScroll={onScroll}
    renderHeader={renderHeader}
    renderFooter={() => renderFooter(isLoadingMore)}
    pullToRefresh={
      <PullToRefresh refreshing={refreshing} onRefresh={onRefresh} />
    }
  />)
}