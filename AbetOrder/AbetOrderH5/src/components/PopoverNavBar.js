import React, { Component } from "react"
import { Popover, NavBar, Icon } from 'antd-mobile';
const Item = Popover.Item;


export default class PopoverNavBar extends Component {
    constructor(props) {
        super(props)

        this.state = { PopoverVisible: false }
    }

    OnSelect = (option) => {
        this.setState({ PopoverVisible: false });

        if (option.props.value === "Logout") {
            this.props.Logout();
        }
    }

    OnVisibleChange(visible) {
        this.setState({ PopoverVisible: visible });
    }

    render() {
        return (<NavBar mode="light"
            rightContent={
                <Popover mask
                    overlayClassName="fortest"
                    overlayStyle={{ color: 'currentColor' }}
                    visible={this.state.PopoverVisible}
                    overlay={[
                        <Item key="1" value="Logout" icon={<Icon type="left" />}>{"退出登录(" + this.props.UserName + ")"}</Item>
                    ]}
                    align={{
                        overflow: { adjustY: 0, adjustX: 0 },
                        offset: [-10, 0],
                    }}
                    onVisibleChange={this.OnVisibleChange.bind(this)}
                    onSelect={this.OnSelect.bind(this)}>
                    <div style={{
                        height: '100%',
                        padding: '0 15px',
                        marginRight: '-15px',
                        display: 'flex',
                        alignItems: 'center',
                    }} >
                        <Icon type="ellipsis" />
                    </div>
                </Popover>
            }>
            {this.props.Title}
        </NavBar>);
    }
}