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
        }, this.state)
    }

    componentDidMount() {
        this.GetDataSource();
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

    OnSelect(selectedKeys, info) {
        this.setState({ SelectedKeys: selectedKeys });
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