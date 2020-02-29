import React from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex"
import { MapToProps } from "ReactCommon";
import { Tree } from "antd";

const TreeNode = Tree.TreeNode;

class Tree2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({
            Options: [],
            ExpandedKeys: [],
            SelectedKeys: [],
        }, this.state);

        if (this.Property.IsTreeNodes) {
            this.Property.GetValue = this.GetTreeNodesValue.bind(this);
            this.Property.SetValue = this.SetTreeNodesValue.bind(this);
        }
    }

    GetTreeNodesValue() {
        if (Common.IsArray(this.TreeNodesValue)) this.TreeNodesValue.forEach(m => this.SetTreeNodeChecked(m));
        else if (Common.IsObject(this.TreeNodesValue)) this.SetTreeNodeChecked(this.TreeNodesValue);

        return this.TreeNodesValue;
    }

    SetTreeNodeChecked(node) {
        const { ValueName, UnCheckedValue, CheckedName, CheckedValue, ChildName } = this.Property;

        const v = Common.ArrayFirst(this.state.Value, (f) => Common.IsEquals(f, node[ValueName]));
        let blSelected = v != null;

        const children = node[ChildName];
        if (Common.IsArray(children) && children.length > 0) {
            children.map(m => this.SetTreeNodeChecked(m));

            if (!blSelected) {
                for (var i = 0; i < children.length; i++) {
                    if (Common.IsEquals(children[i][CheckedName], CheckedValue)) {
                        blSelected = true;
                        break;
                    }
                }
            }
        }

        node[CheckedName] = blSelected ? CheckedValue : UnCheckedValue;
    }

    SetTreeNodesValue(value) {
        this.TreeNodesValue = value;
        if (!Common.IsArray(value) && !Common.IsObject(value)) return;

        if (this.Property.IsNotRoot) value = value[this.Property.ChildName];

        const list = Common.IsArray(value) ? value : [value];

        this.SelectedKeys = [];
        const options = list.map(m => this.GetValuetToTreeNode(m));
        this.setState({ Options: options, Value: this.SelectedKeys })
    }

    GetValuetToTreeNode(node) {
        const { ValueName, TextName, CheckedName, CheckedValue, ChildName } = this.Property;
        let blSelected = Common.IsEquals(node[CheckedName], CheckedValue);

        const treeNode = { title: node[TextName], key: node[ValueName] };

        if (Common.IsArray(node[ChildName]) && node[ChildName].length > 0) {
            treeNode.children = node[ChildName].map(m => this.GetValuetToTreeNode(m));

            if (blSelected) {
                for (var i = 0; i < treeNode.children.length; i++) {
                    if (!treeNode.children[i].Selected) { blSelected = false; break; }
                }
            }
        }

        if (blSelected) this.SelectedKeys.push(node[ValueName]);

        treeNode.Selected = blSelected;

        return treeNode;
    }

    componentDidMount() {
        if (!this.Property.IsTreeNodes) this.GetDataSource();
    }

    GetOptions() {
        return this.GetTreeNode(this.Property.RootValue)
    }

    GetTreeNode(parentValue) {
        const dataList = this.Property.DataSource.filter(f => Common.IsEquals(f[this.ParentValueName], parentValue));

        let nodeList = [], node = null, children = null;
        dataList.forEach(m => {
            node = { title: m[this.TextName], key: m[this.ValueName] };
            children = this.GetTreeNode(node.key);
            if (children.length > 0) node.children = children;
            nodeList.push(node);
        });

        return nodeList;
    }

    OnExpand(expandedKeys) {
        this.setState({ ExpandedKeys: expandedKeys });
    }

    OnCheck(checkedKeys) {
        this.setState({ Value: checkedKeys });
    }

    OnSelect(selectedKeys, e) {
        if (this.Property.IsSelectValue) {
            e.nativeEvent.target.parentNode.parentNode.childNodes[1].click();
        }
        else this.setState({ SelectedKeys: selectedKeys });
    }

    RenderTreeNodes(dataList) {
        return dataList.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.RenderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property } = this.props

        let valueList = Common.IsNullOrEmpty(this.state.Value) ? [] : this.state.Value;
        if (!Common.IsArray(valueList)) valueList = valueList.split(",")

        return <Tree
            checkable={Property.IsCheckBox}
            onExpand={this.OnExpand.bind(this)}
            expandedKeys={this.state.ExpandedKeys}
            onCheck={this.OnCheck.bind(this)}
            checkedKeys={valueList}
            onSelect={this.OnSelect.bind(this)}
            selectedKeys={this.state.SelectedKeys}>
            {this.RenderTreeNodes(this.state.Options)}
        </Tree>

    }
}

function setProps(owner, page) {
    return {
        DispatchAction: owner.DispatchAction,
        GetStateValue: owner.GetStateValue
    }
}

export default MapToProps(setProps)(Tree2);