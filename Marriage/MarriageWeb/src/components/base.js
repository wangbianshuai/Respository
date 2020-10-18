import React from 'react';
import { Row, Col, Form, Divider } from 'antd';
import { router } from "dva";
import { Common } from 'UtilsCommon';
import { usePageAxis } from 'UseHooks'
import PropertyItem from './propertyItem';

const { Link } = router;

const load = (property, view, pageAxis) => {
  if (property.eventActionName) pageAxis.invokeEventAction(property.eventActionName, { property, view, pageAxis });
};

const getPropertyItem = (p, property, pageId) => {
  const props = { property: p, view: property, pageId, key: p.key || p.id }

  return <PropertyItem {...props} />
};

const renderProperties = (property, pageId) => {
  return property.properties.map(m => getPropertyItem(m, property, pageId))
};

const getProps = (props) => {
  const { property, view, pageId } = props;
  const pageAxis = usePageAxis.getPageAxis(pageId);
  return { property, view, pageId, pageAxis };
};

const initSetView = (property) => {
  const rowDict = {};
  let xList = [];

  property.properties.forEach(p => {
    p.id = p.id || Common.createGuid()
    if (rowDict[p.x] === undefined) { rowDict[p.x] = []; xList.push({ rowId: p.rowId, x: p.x, property: p }); }
    rowDict[p.x].push(p);
  });

  xList = xList.sort((a, b) => a.x > b.x ? 1 : -1);

  for (let key in rowDict) rowDict[key] = rowDict[key].sort((a, b) => a.y > b.y ? 1 : -1);

  property.rowsCols = { xList, rowDictionary: rowDict };
};

const renderColumn = (col, property, pageId) => {
  col.key = col.key || 'pt_' + col.id;
  if (col.isColVisible) return getPropertyItem(col);
  else return (<Col key={col.colId} span={col.colSpan} style={col.colStyle}>{getPropertyItem(col, property, pageId)}</Col>);
};

const rendRowCols = (row, colList, property, pageId) => {
  const justify = row.property.Justify || 'start';
  const align = row.property.Align || 'top';
  const gutter = row.property.Gutter || 16
  return (<Row key={row.rowId} type='flex' style={row.rowStyle} justify={justify} align={align} gutter={gutter}>{colList.map(c => renderColumn(c, property, pageId))}</Row>);
};

const renderView = (property, pageId) => {
  const { xList, rowDictionary } = property.rowsCols;
  return (
    <React.Fragment>
      {xList.map(m => rendRowCols(m, rowDictionary[m.x], property, pageId))}
    </React.Fragment>
  )
};

const renderFormView = (property, pageId) => {
  const labelAlign = property.labelAlign || "right";
  return property.isForm ? <Form labelAlign={labelAlign}> {renderView(property, pageId)}</Form> : renderView(property, pageId)
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

const renderActions = (actionList, record, property, pageId) => {
  const list = []

  for (let i = 0; i < actionList.length; i++) {
    actionList[i].params = record;
    if (i > 0) list.push(<Divider type="vertical" key={i} />)
    if (actionList[i].isToPage) list.push(getLinkAction(actionList[i], record));
    else list.push(<PropertyItem property={actionList[i]} pageId={pageId} view={property} key={actionList[i].name} />)
  }

  return (<span>{list.map(m => m)}</span>)
};

export default {
  getProps,
  load,
  getPropertyItem,
  renderProperties,
  renderView,
  initSetView,
  renderFormView,
  getClassName,
  getLinkAction,
  renderActions
}