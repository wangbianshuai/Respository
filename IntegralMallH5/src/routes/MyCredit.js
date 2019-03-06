import React from "react"
import { connect } from "dva"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Tabs, WhiteSpace, } from 'antd-mobile';
// import styles from "../styles/MyCredit.css";
import MyCreditListView from "../components/MyCreditListView";
import Header from "../components/MyCreditHeader";

class MyCredit extends Index {
    constructor(props) {
        super(props)//this:代表本类对象的引用。 super:代表父类的存储空间。
        this.title = "我的积分";
        this.EntityName = "MyCredit";
        this.state = { Visible: false, Title: this.Title, };

        this.componentWillMount2();
    }
    componentWillMount2() {

    }
    componentDidMount() {
        if (!this.JudgeLogin()) return;
        //获取客户积分详情
        const payload = { UserId: this.props.UserInfo.UserId };
        this.Dispatch("Account", "MyCredit", payload);//第一个参数是命名空间，第二个参数是ActionName，第三个参数是请求的参数
    }

    PropsChanged(nextProps) {

    }

    render() {
        if (!this.props.UserInfo) return null;
        if (!this.props.MyCreditDetails) return null;

        var UnderlineStyle =
        {
            border: '1px solid rgba(255,209,174,1)',
            //  width:'3.09375rem',
            height: '0.0625rem',
        };

        const tabs = [
            { title: '全部' },
            { title: '收入' },
            { title: '支出' },
        ];

        const creditArrayListAll = [];
        const creditArrayListIn = [];
        const creditArrayListOut = [];

        this.props.MyCreditDetails.CreditDetails.forEach((value, key, arr) => {
            if (value.IntegralStatus === "1" && value.IntegralValue !== "0") {
                creditArrayListAll.push(value);
                if (value.IntegralType === "1")
                    creditArrayListIn.push(value);
                if (value.IntegralType === "2")
                    creditArrayListOut.push(value);
            }
        });
        return <div>
            {/*<div className={styles.bannerTop}>
                <div className={styles.leftBack} style={{ backgroundSize: "0.46875rem 0.875rem" }}> &lt;</div>
                <div className={styles.creditName}>我的积分</div>
                <div className={styles.creditDetail} style={{ backgroundSize: "1.125rem 1.15625rem" }} />
            </div>
            <div className={styles.bannerBody}>

                <div className={styles.myIconBack} style={{ backgroundSize: "4.125rem 4.1875rem" }}>
                    <div className={styles.myIcon} style={{ backgroundSize: "3.3125rem 3.34375rem" }}></div>
                </div>
                <div className={styles.myNameInfo}>
                    <div className={styles.myName}>{this.props.MyCreditDetails.AccountName}</div>
                    <div className={styles.myLevel}>{this.props.MyCreditDetails.MemberLevel}</div>
                </div>
                <div className={styles.myCredit}>我的积分
                    <div className={styles.creditScore}>{this.props.MyCreditDetails.IntegralBalance}</div>
                </div>
            </div>*/}
            <Header Page={this} Title={"我的积分"} IsRight={true} />
            <div>
                <Tabs tabs={tabs} initialPage={0} animated={true} useOnPan={false} tabBarUnderlineStyle={UnderlineStyle} tabBarActiveTextColor={'#10122C'} tabBarInactiveTextColor={'#B6B6B6'}
                    tabBarTextStyle={{ fontSize: '0.875rem', fontFamily: 'SourceHanSansCN-Normal', lineHeight: '1.34375rem' }}>
                    <MyCreditListView DataList={creditArrayListAll} />
                    <MyCreditListView DataList={creditArrayListIn} />
                    <MyCreditListView DataList={creditArrayListOut} />
                </Tabs>
                <WhiteSpace />
            </div>
        </div>

    }
}

function mapStateToProps(state, ownProps) {
    const props = {
        UserInfo: state.Account.UserInfo,
        Loading: state.Account.Loading,
        MyCreditDetails: state.Account.MyCreditDetails
    };

    if (!Common.IsDist) console.log(props);

    return props;
}

export default connect(mapStateToProps, Index.MapDispatchToProps)(MyCredit)