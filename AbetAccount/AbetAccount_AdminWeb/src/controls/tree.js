import React, { useState, useCallback, useMemo } from 'react';
import { Common } from "UtilsCommon";
import { useGetDataSourceOptions } from 'UseHooks';
import { Tree } from "antd";
import Base from './base';

const TreeNode = Tree.TreeNode;

const getTreeNode = (property, parentValue) => {
  Base.setValueTextName(property);
  const { parentValueName, valueName, textName } = property;

  const dataList = property.dataSource.filter(f => Common.isEquals(f[parentValueName], parentValue));

  let nodeList = [], node = null, children = null;
  dataList.forEach(m => {
    node = { title: m[textName], key: m[valueName] };
    children = getTreeNode(property, node.key);
    if (children.length > 0) node.children = children;
    nodeList.push(node);
  });

  return nodeList;
};

const getOptions = (property, view, pageAxis, parentValue) => {
  return getTreeNode(property, property.rootValue)
};

const getValuetToTreeNode = (property, node, selectedKeys) => {
  const { valueName, textName, checkedName, checkedValue, childName } = property;
  let blSelected = Common.isEquals(node[checkedName], checkedValue);

  const treeNode = { title: node[textName], key: node[valueName] };

  if (Common.isArray(node[childName]) && node[childName].length > 0) {
    treeNode.children = node[childName].map(m => getValuetToTreeNode(property, m, selectedKeys));

    if (blSelected) {
      for (var i = 0; i < treeNode.children.length; i++) {
        if (!treeNode.children[i].selected) { blSelected = false; break; }
      }
    }
  }

  if (blSelected) selectedKeys.push(node[valueName]);

  treeNode.selected = blSelected;

  return treeNode;
};

const setTreeNodesValue = (property, obj, value, setOptions, setSelectedKeys) => {
  obj.treeNodesValue = value;
  if (!Common.isArray(value) && !Common.isObject(value)) return;

  if (property.isNotRoot) value = value[property.childName];

  const list = Common.isArray(value) ? value : [value];

  const selectedKeys = [];
  const options = list.map(m => getValuetToTreeNode(property, m, selectedKeys));
  setOptions(options);
  setSelectedKeys(selectedKeys);
}

const setTreeNodeChecked = (property, node, value) => {
  const { valueName, unCheckedValue, checkedName, checkedValue, childName } = property;

  const v = Common.arrayFirst(value, (f) => Common.isEquals(f, node[valueName]));
  let blSelected = v != null;

  const children = node[childName];
  if (Common.isArray(children) && children.length > 0) {
    children.map(m => setTreeNodeChecked(property, m, value));

    if (!blSelected) {
      for (var i = 0; i < children.length; i++) {
        if (Common.isEquals(children[i][checkedName], checkedValue)) {
          blSelected = true;
          break;
        }
      }
    }
  }

  node[checkedName] = blSelected ? checkedValue : unCheckedValue;
};

const getTreeNodesValue = (property, treeNodesValue, value) => {
  if (Common.isArray(treeNodesValue)) treeNodesValue.forEach(m => setTreeNodeChecked(property, m, value));
  else if (Common.isObject(treeNodesValue)) setTreeNodeChecked(property, treeNodesValue, value);

  return treeNodesValue;
};

const renderTreeNodes = (dataList) => {
  return dataList.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  });
};

export default (props) => {
  const { property, view, pageAxis } = Base.getProps(props);

  const obj = useMemo(() => ({}), []);

  const [value, setValue] = useState(Base.getInitValue(property));
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isVisible, setIsVisible] = useState(property.isVisible !== false);
  const [options, setOptions] = useGetDataSourceOptions(property, view, pageAxis, getOptions);

  const onCheck = useCallback((checkedKeys) => {
    setValue(checkedKeys);
  }, [setValue]);

  const onExpand = useCallback((keys) => {
    setExpandedKeys(keys);
  }, [setExpandedKeys]);

  const onSelect = useCallback((keys, e) => {
    if (property.isSelectValue) {
      e.nativeEvent.target.parentNode.parentNode.childNodes[1].click();
    }
    else setSelectedKeys(keys);
  }, [property, setSelectedKeys]);

  property.setIsVisible = (v) => setIsVisible(v);
  if (property.isTreeNodes) {
    property.getValue = () => getTreeNodesValue(property, obj.treeNodesValue, value);
    property.setValue = (v) => setTreeNodesValue(property, obj, v, setOptions, setSelectedKeys);
  }
  else {
    property.setValue = (v) => setValue(v);
    property.getValue = () => Base.getValue(property, value);
  }
  if (!isVisible) return null;

  let valueList = Common.isNullOrEmpty(value) ? [] : value;
  if (!Common.isArray(valueList)) valueList = valueList.split(",")

  return <Tree
    checkable={property.isCheckBox}
    onExpand={onExpand}
    expandedKeys={expandedKeys}
    onCheck={onCheck}
    checkedKeys={valueList}
    onSelect={onSelect}
    selectedKeys={selectedKeys}>
    {renderTreeNodes(options)}
  </Tree>
}