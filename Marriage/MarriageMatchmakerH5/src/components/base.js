import React from 'react';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import { usePageAxis } from 'UseHooks'
import PropertyItem from './propertyItem';
import styles from '../styles/view.scss';

const { Link } = router;

const load = (property, view, pageAxis) => {
  if (property.eventActionName) pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
};

const getPropertyItem = (p, property, pageId) => {
  if (!p.id) p.id = Common.createGuid();
  if (p.isNullable === undefined) p.isNullable = true;
  const props = { property: p, view: property, pageId, key: p.key || p.id }
  return <PropertyItem {...props} />
};

const renderProperties = (property, pageId) => {
  return property.properties.map(m => getPropertyItem(m, property, pageId))
};

const getProps = (props) => {
  const { property, view, pageId } = props;
  if (!property.id) property.id = Common.createGuid();
  const pageAxis = usePageAxis.getPageAxis(pageId);
  return { property, view, pageId, pageAxis };
};

const getClassName = (property, styles, defaultClassName) => {
  let className = property.className || defaultClassName;
  if (className && styles[className]) className = styles[className];
  return className;
}

const getLinkAction = (p, record) => {
  const text = p.text;
  if (!Common.isNullOrEmpty(text)) {
    let url = p.pageUrl, v;

    p.propertyNames.forEach(n => {
      v = record[n];
      url = url.replace("#{" + n + "}", escape(v));
    })

    url = Common.addUrlRandom(url);

    return <Link to={url} key={p.name}>{text}</Link>
  }
  return text;
}

const getImageLink = (d, i) => {
  const src = Common.getImageUrl(d.imageUrl);
  return (
    <Link key={i} to={d.url}>
      <img alt='' src={src} />
      <span>{d.text}</span>
    </Link>
  )
};

const getRightImageLink = (d, i) => {
  const src = Common.getImageUrl(d.imageUrl);
  return (
    <Link key={i} to={d.url}>
      <span>{d.text}</span>
      <img alt='' src={src} />
    </Link>
  )
};

const initSetView = (property) => {
  const rowDict = {};
  let xList = [];

  property.properties.forEach(p => {
    p.id = p.id || Common.createGuid();
    p.rowId = p.rowId || Common.createGuid();
    if (rowDict[p.x] === undefined) { rowDict[p.x] = []; xList.push({ rowId: p.rowId, x: p.x, property: p }); }
    rowDict[p.x].push(p);
  });

  xList = xList.sort((a, b) => a.x > b.x ? 1 : -1);

  for (let key in rowDict) rowDict[key] = rowDict[key].sort((a, b) => a.y > b.y ? 1 : -1);

  property.rowsCols = { xList, rowDictionary: rowDict };
};

const rendRowCols = (row, colList, property, pageId) => {
  return (<div key={row.rowId} style={row.property.rowStyle} className={styles[row.property.rowClassName || 'divRow']}>
    {colList.map(c => getPropertyItem(c, property, pageId))}</div>);
};

const renderView = (property, pageId) => {
  const { xList, rowDictionary } = property.rowsCols;
  return (
    <React.Fragment>
      {xList.map(m => rendRowCols(m, rowDictionary[m.x], property, pageId))}
    </React.Fragment>
  )
};

export default {
  getProps,
  load,
  getPropertyItem,
  renderProperties,
  getClassName,
  getLinkAction,
  getImageLink,
  getRightImageLink,
  initSetView,
  renderView
}