import React from "react"
import { connect } from "dva"
import { Common } from "UtilsCommon";
import { BaseIndex, Header, Footer, ComponentList, BackTop } from "ReactCommon";

class InvestFail extends BaseIndex {
    constructor(props) {
        super(props);
        this.state = { SecondNumber: 5 }
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        const token = ctx.cookies.get("Token");
        const ua = ctx.headers["user-agent"];

        return Promise.all(BaseIndex.InitInvokeActionList(app, InvestFail.Actions, InvestFail.GetPayload(token, ua)));
    }

    static GetPayload(token, ua) {
        return {
            Token: token,
            UserAgent: ua,
            InvestmentService: { InvestStatus: { data: {} } }
        };
    }

    componentDidMount() {
        this.Token = Common.GetCookie("Token");

        this.InitInvokeActionList(InvestFail.Actions, InvestFail.GetPayload(this.Token));

        this.CountDown();
    }

    CountDown() {
        var number = this.state.SecondNumber;
        this.IntervalId = setInterval(() => {
            number--;
            if (number <= 0) {
                number = 0;
                window.location.href = "/usercenter/openAccount.html";
            }
            else this.setState({ SecondNumber: number })
        }, 1000);
    }

    componentWillUnmount() {
        if (this.IntervalId > 0) clearInterval(this.IntervalId);
    }

    render() {
        const PcBuildUrl = this.GetPcBuildUrl();
        const { Link } = this.props;
        const IsLogin = this.JudgeLogin();
        const UserInfo = this.GetPropsValue("UserInfo", {});
        const IsPurchased = this.props.InvestStatus === true;
        const { SecondNumber } = this.state;

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} Page={this} IsLogin={IsLogin} NickName={UserInfo.nickname} UserType={UserInfo.userType} IsPurchased={IsPurchased} />

                <div className="detail-crumbs">
                    <div className="crumbs">
                        <a href="//www.xinxindai.com/">首页</a> &gt; <a href='/usercenter/accountInfo.html'>我的新新贷</a> &gt; <b>操作失败</b>
                    </div>
                </div>

                <div className='container'>
                    <h3><i></i>出借失败了！</h3>
                    <div className='demand'>
                        <h5>应监管需要，您需要先开通银行存管账户才能够顺利出借哦～</h5>
                        <p><span className='time'>{SecondNumber}</span>秒后为您自动跳转至开户页……</p>
                    </div>
                    <a href="/usercenter/openAccount.html" className='open-account'>立即开户</a>
                </div>

                <Footer PcBuildUrl={PcBuildUrl} Link={Link} Page={this} />
                <ComponentList Name="Tips" Page={this} />
                <ComponentList Name="Dialogs" Page={this} />
                <BackTop Page={this} />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = BaseIndex.MapStateToProps(state, ownProps, {});

    !Common.IsDist && console.log(props);
    return props;
}

InvestFail.Actions = BaseIndex.MapActions({});

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(InvestFail);