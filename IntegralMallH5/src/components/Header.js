import React, { Component } from 'react'
import { Flex } from 'antd-mobile'
import styles from "../styles/Header.css"
import * as Common from "../utils/Common"

export default class Header extends Component {
    // constructor(props) {
    //     super(props)
    // }

    static get defaultProps() {
        return {
            Title: "",
            IsShowBack: true,
        }
    }

    //返回app或者上一页
    GoBackToApp() {
        try {
            //跟IOS Android原生交互返回
            // if (window.webkit) {
            //     if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            //         window.webkit.messageHandlers.CallBack.postMessage(null);
            //     } else {
            //         window.webkit.GoBack();
            //     }
            // } else {
            //     window.history.back();
            // }

            //跟React Native WebView交互返回
            window.postMessage(null,null);
        } catch (error) {
            console.log(error);
            window.history.back();
        }
    }

    BackPress(backUrl) {
        this.props.Page && (Common.IsNullOrEmpty(backUrl) ? this.props.Page.props.GoBack() : backUrl === "GoApp" ? this.GoBackToApp() : this.props.Page.props.ToPage(backUrl));
    }

    RenderRight() {
        return (
            <Flex className={styles.RightFlexMenu}>
                <img className={styles.RightImg} onClick={this.props.RightAction} src={require("../images/search2.png")} alt="img" />
            </Flex>
        )
    }

    RenderBack(backUrl) {
        return (
            <img className={styles.BackImage} onClick={this.BackPress.bind(this, backUrl)} src={require("../images/ArrowLefticon@2x.png")} alt="img" />
        )
    }

    render() {

        return (
            <Flex className={styles.HeaderFlex}>
                <Flex className={styles.BackFlex}>
                    {
                        this.props.IsShowBack ? this.RenderBack(this.props.BackUrl) : null
                    }
                </Flex>

                <Flex className={styles.TitleText}>{this.props.Title}</Flex>

                <Flex className={styles.RightFlex}>
                    {
                        this.props.IsRight ? this.RenderRight() : null
                    }
                </Flex>
            </Flex>
        )
    }
}