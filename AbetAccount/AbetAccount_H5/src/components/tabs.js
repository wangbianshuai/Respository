import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Tabs } from 'antd-mobile';
import { Common } from 'UtilsCommon';
import styles from '../styles/view.scss';
import Base from './base';

const getTabs = (property) => {
  if (property.tabs) return property.tabs;
  return property.properties.map((m, i) => ({ title: m.tabLabel, sub: i + 1, url: m.url }));
};

const _TabsData = {};

export default (props) => {
  const { property, view, pageId, pageAxis } = Base.getProps(props);
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);

  const [currentClassName, setCurrentClassName] = useState(initCurrentClassName);

  const tabs = useMemo(() => getTabs(property), [property]);

  useEffect(() => {
    Base.load(property, view, pageAxis);
  }, [property, view, pageAxis]);

  const onTabClick = useCallback((tab) => {
    if (tab.url) pageAxis.toPage(tab.url);
    else {
      if (property.isChangeClassName) {
        if (tab.sub > property.subIndex) setCurrentClassName(property.className + tab.sub)
        else setCurrentClassName(null)
      }
      _TabsData[property.name].currentTabPage = tab.sub - 1;
    }
  }, [pageAxis, property, setCurrentClassName])

  property.setVisible = (v) => setIsVisible(v);

  let initialPage = 0;
  if (!_TabsData[property.name]) _TabsData[property.name] = {};
  if (_TabsData[property.name].currentTabPage !== undefined && !pageAxis.pageData.tabPage) {
    initialPage = _TabsData[property.name].currentTabPage
  }
  else initialPage = property.initialPage || Common.getIntValue(pageAxis.pageData.tabPage);

  const initCurrentClassName = property.isChangeClassName && (parseInt(initialPage) + 1) > property.subIndex ? property.className + (parseInt(initialPage) + 1) : null;

  if (!isVisible) return null;

  let className = Base.getClassName(property, styles);
  if (currentClassName) className = styles[currentClassName];

  const { style, tabBarStyle, isDiv, tabPage } = property;
  const swipeable = property.swipeable === undefined ? false : property.swipeable;

  if (isDiv) return (<div className={className} style={style}>
    <Tabs tabs={tabs} style={style} initialPage={initialPage} onTabClick={onTabClick} swipeable={swipeable}
      prerenderingSiblingsNumber={0} tabBarStyle={tabBarStyle}>
      {property.properties && Base.renderProperties(property, pageId)}
    </Tabs></div>)

  return (
    <Tabs tabs={tabs} style={style} initialPage={initialPage} onTabClick={onTabClick} swipeable={swipeable}
      prerenderingSiblingsNumber={0} tabBarStyle={tabBarStyle}>
      {property.properties && Base.renderProperties(property, pageId)}
    </Tabs>
  )
}

