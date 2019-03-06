import React from "react"
import { connect } from "dva"
import { Common } from "UtilsCommon";
import { BaseIndex, Header, Footer, ComponentList, BackTop } from "ReactCommon";

class AuthorizStatus extends BaseIndex {
    constructor(props) {
        super(props);
    }


    //服务器渲染加载数据
    static LoadData(ctx, app) {
        const token = ctx.cookies.get("Token");
        const ua = ctx.headers["user-agent"];

        return Promise.all(BaseIndex.InitInvokeActionList(app, AuthorizStatus.Actions, AuthorizStatus.GetPayload(token, ua)));
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

        this.InitInvokeActionList(AuthorizStatus.Actions, AuthorizStatus.GetPayload(this.Token));
    }

    render() {
        const PcBuildUrl = this.GetPcBuildUrl();
        const { Link } = this.props;
        const IsLogin = this.JudgeLogin();
        const UserInfo = this.GetPropsValue("UserInfo", {});
        const IsPurchased = this.props.InvestStatus === true;
        const code = "", message = "";

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} Page={this} IsLogin={IsLogin} NickName={UserInfo.nickname} UserType={UserInfo.userType} IsPurchased={IsPurchased} />

                <div className="detail-crumbs">
                    <div className="crumbs">
                        <a href="//www.xinxindai.com/">首页</a> &gt; <b>操作成功</b>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <div className="warning" id="J_showSucess">
                        <div className="disnone" id="J_showCode">{code}</div>
                        <i className={code ? "fail-icon" : "sucess-icon"}></i><p className="showInfo" >{message}</p>
                    </div>
                    <div className='button'>
                        <input type="button" value='返回首页' onClick={() => window.location.href = "/"} />
                    </div>
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

AuthorizStatus.Actions = BaseIndex.MapActions({});

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(AuthorizStatus);