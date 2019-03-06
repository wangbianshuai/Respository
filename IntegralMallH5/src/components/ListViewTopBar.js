import React, { Component } from 'react'
import { Flex, Tag, Popover, WingBlank, SegmentedControl } from 'antd-mobile'
import styles from "../styles/ListViewTopBar.css"
import * as Common from "../utils/Common"

const Item = Popover.Item;

export default class ListViewTopBar extends Component {
    // constructor(props) {
    //     super(props)
    // }

    state = {
        data: ['全部', '家用电器', '电子数码', '电脑手机', '女装男装'],
        visible: false,//控制气泡显示
        orderSelected: { value: "DisplayIndex", isasc: "true" },//气泡中当前选择的项
        tagSelectedIndex: 0,//tag中当前选择的项的索引
    }

    static get defaultProps() {
        return {
            Title: "",
        }
    }

    //Tag select onChange
    onChange(e) {
        this.setState({
            tagSelectedIndex: e.nativeEvent.selectedSegmentIndex,//更新tag中当前选择的索引
        });

        console.log(`index: ${e.nativeEvent.selectedSegmentIndex} value: ${e.nativeEvent.value}`);
    }

    onValueChange(selected) {
        this.tagSelected = selected;//tag中当前选择的项
        //刷新产品列表
        this.props.Page && this.props.Page.RefreshListView(
            selected,
            this.state.orderSelected.value,
            this.state.orderSelected.isasc === "true");
    }


    //弹出气泡
    PopupPopover() {
        this.setState({
            visible: true,
        });
    }

    onSelect = (opt) => {
        this.setState({
            visible: false,
            orderSelected: { value: opt.props.value, isasc: opt.props.isasc },
        });
        //刷新产品列表
        this.props.Page &&
            this.props.Page.RefreshListView(
                Common.IsNullOrEmptyReturnDefault(this.tagSelected, "全部"),
                opt.props.value,
                opt.props.isasc === "true");
    };

    handleVisibleChange = (visible) => {
        this.setState({
            visible,
        });
    };

    render() {
        return (
            <Flex className={styles.HeaderFlex}>
                {/* <Flex justify="center" className={styles.TagFlex} >
                    {
                        this.state.data.map((item, index) => {
                            return <Tag onChange={this.onChange.bind(this)} key={index}>{item}</Tag>
                        })
                    }
                </Flex> */}
                <Flex justify="start" direction="row" wrap="nowrap" align="center" className={styles.TagFlex} >
                    <WingBlank size="sm">
                        <SegmentedControl
                            tintColor="#B6B6B6"
                            selectedIndex={this.state.tagSelectedIndex}
                            style={{ height: '38px', width: '300px' }}
                            values={[...this.state.data]}
                            onChange={this.onChange.bind(this)}
                            onValueChange={this.onValueChange.bind(this)}
                        />
                    </WingBlank>
                </Flex>
                <Flex justify="center" className={styles.SortFlex} onClick={this.PopupPopover.bind(this)}>
                    排序<img src={require("../images/sort@1.png")} alt="img" />
                    <Popover mask
                        overlayClassName="fortest"
                        overlayStyle={{ color: 'currentColor' }}
                        visible={this.state.visible}
                        overlay={[
                            (<Item key="4" value="DisplayIndex" isasc="true" data-seed="logId">默认排序</Item>),
                            (<Item key="5" value="IntegralValue" isasc="true" style={{ whiteSpace: 'nowrap' }}>积分升序</Item>),
                            (<Item key="6" value="PublishDate" isasc="false" style={{ whiteSpace: 'nowrap' }}>上架时间</Item>),
                        ]}
                        align={{
                            overflow: { adjustY: 0, adjustX: 0 },
                            offset: [-15, 25],
                        }}
                        onVisibleChange={this.handleVisibleChange.bind(this)}
                        onSelect={this.onSelect.bind(this)}>
                        <div style={{
                            height: '100%',
                            padding: '0 15px',
                            marginRight: '-15px',
                            display: 'flex',
                            alignItems: 'center',
                        }}></div>
                    </Popover>
                </Flex>
            </Flex>
        )
    }
}