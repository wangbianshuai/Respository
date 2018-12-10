import React, { Component } from 'react'
import { Flex } from 'antd-mobile'
import styles from "../styles/MyCreditHeader.css"
import { Link } from "dva/router"

export default class MyCreditHeader extends Component {

    static get defaultProps() {
        return {
            Title: "",
            IsShowBack: true
        }
    }

    BackPress() {
        this.props.Page && this.props.Page.props.GoBack();
    }

    RenderRight() {
        return (
            <Flex className={styles.RightFlexMenu} onClick={this.props.RightAction}>
                <img className={styles.RightImg} src={require("../images/CreditDetail.png")} alt="img" />
            </Flex>
        )
    }

    render() {
        const DataList  = this.props.Page.props.MyCreditDetails

        if (DataList === null) return;
        return (<div className={styles.banner} style={{ backgroundSize: "100% 9.3125rem" }} >
          <div className={styles.bannerTop}>
                <div className={styles.leftBack} style={{ backgroundSize: "0.46875rem 0.875rem" }} onClick={this.BackPress.bind(this)}> 
                    <img className={styles.BackImage} src={require("../images/ArrowLefticon@2x.png")} alt="img" />
                </div>
                <div className={styles.creditName}>我的积分</div>
                 <Link to={`CreditRule`}>
                    <div className={styles.creditDetail} style={{ backgroundSize: "1.125rem 1.15625rem" }} />
                    </Link>
            </div>
            <div className={styles.bannerBody}>
                <div className={styles.myIconBack} style={{ backgroundSize: "4.125rem 4.1875rem" }}>
                    <div className={styles.myIcon} style={{ backgroundSize: "3.3125rem 3.34375rem" }}></div>
                </div>
                <div className={styles.myNameInfo}>
                    <div className={styles.myName}>{DataList.AccountName}</div>
                    <div className={styles.myLevel}>{DataList.MemberLevel}</div>
                </div>
                <div className={styles.myCredit}>我的积分
                    <div className={styles.creditScore}>{DataList.IntegralBalance}</div>
                </div>
            </div>
             <div className={styles.innerTitle}>积分明细</div>
             </div>
        )
    }
}