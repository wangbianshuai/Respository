import React, { Component } from "react";
import Dialog from "../dialog/Index";

class Index extends Component {
    constructor(props) {
        super(props);

        props.Show(this.props.Show);
    }

    static get defaultProps() {
        return {
            Logout: Function(),
            Show: Function()
        }
    }

    render() {
        return (
            <div className='dialog-borrow'>
                <div className='content-tips'><i className='close' onClick={this.props.Close.bind(this)}></i><h4>提示</h4>
                    <p>请重新申请企业用户</p>
                    <div className='go-to'>
                        <button onClick={this.props.Logout}>前往注册</button></div>
                </div>
            </div>
        )
    }
}

export default Dialog(Index);