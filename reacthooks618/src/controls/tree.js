import React from "react"
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex"
import { MapToProps } from "UseHooks";
import { Tree } from "antd";

const TreeNode = Tree.TreeNode;

class Tree2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({
            Options: [],
            expandedKeys: [],
            SelectedKeys: [],
        }, this.state);

        if (this.property.isTreeNodes) {
            this.property.getValue = this.getTreeNodesValue.bind(this);
            this.property.setValue = this.setTreeNodesValue.bind(this);
        }
    }

    getTreeNodesValue() {
        if (Common.isArray(this.TreeNodesValue)) this.TreeNodesValue.forEach(m => this.setTreeNodeChecked(m));
        else if (Common.isObject(this.TreeNodesValue)) this.setTreeNodeChecked(this.TreeNodesValue);

        return this.TreeNodesValue;
    }

    setTreeNodeChecked(node) {
        const { ValueName, UnCheckedValue, CheckedName, CheckedValue, ChildName } = this.property;

        const v = Common.arrayFirst(this.state.Value, (f) => Common.isEquals(f, node[ValueName]));
        let blSelected = v != null;

        const children = node[ChildName];
        if (Common.isArray(children) && children.length > 0) {
            children.map(m => this.setTreeNodeChecked(m));

            if (!blSelected) {
                for (var i = 0; i < children.length; i++) {
                    if (Common.isEquals(children[i][CheckedName], CheckedValue)) {
                        blSelected = true;
                        break;
                    }
                }
            }
        }

        node[CheckedName] = blSelected ? CheckedValue : UnCheckedValue;
    }

    setTreeNodesValue(value) {
        this.TreeNodesValue = value;
        if (!Common.isArray(value) && !Common.isObject(value)) return;

        if (this.property.isNotRoot) value = value[this.property.ChildName];

        const list = Common.isArray(value) ? value : [value];

        this.SelectedKeys = [];
        const options = list.map(m => this.getValuetToTreeNode(m));
        this.setState({ Options: options, Value: this.SelectedKeys })
    }

    getValuetToTreeNode(node) {
        const { ValueName, TextName, CheckedName, CheckedValue, ChildName } = this.property;
        let blSelected = Common.isEquals(node[CheckedName], CheckedValue);

        const treeNode = { title: node[TextName], key: node[ValueName] };

        if (Common.isArray(node[ChildName]) && node[ChildName].length > 0) {
            treeNode.children = node[ChildName].map(m => this.getValuetToTreeNode(m));

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
        if (!this.property.isTreeNodes) this.getDataSource();
    }

    getOptions() {
        return this.getTreeNode(this.property.RootValue)
    }

    getTreeNode(parentValue) {
        const dataList = this.property.DataSource.filter(f => Common.isEquals(f[this.ParentValueName], parentValue));

        let nodeList = [], node = null, children = null;
        dataList.forEach(m => {
            node = { title: m[this.TextName], key: m[this.ValueName] };
            children = this.getTreeNode(node.key);
            if (children.length > 0) node.children = children;
            nodeList.push(node);
        });

        return nodeList;
    }

    Onexpand(expandedKeys) {
        this.setState({ expandedKeys: expandedKeys });
    }

    OnCheck(checkedKeys) {
        this.setState({ Value: checkedKeys });
    }

    OnSelect(selectedKeys, e) {
        if (this.property.isSelectValue) {
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
        if (!this.state.isVisible) return null;

        const { property } = this.props

        let valueList = Common.isNullOrEmpty(this.state.Value) ? [] : this.state.Value;
        if (!Common.isArray(valueList)) valueList = valueList.split(",")

        return <Tree
            checkable={property.isCheckBox}
            onexpand={this.Onexpand.bind(this)}
            expandedKeys={this.state.expandedKeys}
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
        getStateValue: owner.getStateValue
    }
}

//export default MapToProps(setProps)(Tree2);

export default (props)=>{

    return <Tree/>
};