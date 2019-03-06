import React from "react"
import { connect } from "dva"
import { Common } from "UtilsCommon";
import { BaseIndex, Header, Footer, ComponentList, BackTop } from "ReactCommon";

class UserlicenseAgree extends BaseIndex {
    constructor(props) {
        super(props);
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        const token = ctx.cookies.get("Token");
        const ua = ctx.headers["user-agent"];

        return Promise.all(BaseIndex.InitInvokeActionList(app, UserlicenseAgree.Actions, UserlicenseAgree.GetPayload(token, ua)));
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

        this.InitInvokeActionList(UserlicenseAgree.Actions, UserlicenseAgree.GetPayload(this.Token));
    }

    CloseWindow() {
        window.open('', '_self', '');
        window.close();
    }

    Printdiv(printpage) {
        var newstr = document.all.item(printpage).innerHTML;
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.contentDocument.body.innerHTML = newstr;
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
        return false;
    }

    render() {
        const PcBuildUrl = this.GetPcBuildUrl();
        const { Link } = this.props;
        const IsLogin = this.JudgeLogin();
        const UserInfo = this.GetPropsValue("UserInfo", {});
        const IsPurchased = this.props.InvestStatus === true;

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} Page={this} IsLogin={IsLogin} NickName={UserInfo.nickname} UserType={UserInfo.userType} IsPurchased={IsPurchased} />

                <div className="g-top">
                    <div className="g-top-container">
                        <div className="container-1200">
                            <a href="http://www.xinxindai.com/">首页</a>&nbsp;&gt;&nbsp;<a href="javascript:void(0);">用户授权协议</a>
                        </div>
                    </div>
                </div>

                <div className="wrap-container" id="wrap-container">
                    <div className="content-main">
                        <div className="container-title">
                            <h3>用户授权协议</h3>
                        </div>
                        <h4>一、定义及解释</h4>
                        <p>（一）新新贷平台：用户在新新贷（上海）金融信息服务有限公司（以下简称“新新贷公司”）运营的网络借贷信息中介平台（以下简称“新新贷平台”）进行网络借贷交易，并由新新贷（上海）金融信息服务有限公司及其关联公司（下称"新新贷关联公司"）通过新新贷平台为用户提供相关网络借贷信息中介服务。《上海华瑞银行在线资金存管三方协议》（下称"三方协议"），该协议签署三方为平台注册用户（下称"用户"）、新新贷公司、上海华瑞银行股份有限公司（下称"华瑞"），本协议对三方均具有约束力的文件，具有合同上的法律效力。</p>
                        <p>用户同意，开通《三方协议》项下的上述所有服务及其相应的委托支付产品、用户交易资金结算账户（以下简称“交易账户”），同时授权华瑞按照新新贷平台发送的指令对用户开通的交易账户进行操作，用户已知晓上述服务可能无需用户再次输入支付密码。
                        </p>
                        <h4>二、声明与授权</h4>
                        <p>（一）用户同意，在使用《三方协议》项下的服务时的意思表示均出自于用户本人的真实意愿。同时用户确保在使用服务时所填写的信息均真实有效，否则因此导致的责任由用户自行承担。用户不可撤销地授权新新贷公司或者新新贷平台将用户在新新贷平台提交的实名信息（包括但不限于：姓名/名称、身份证号/营业执照、手机号码等）提交/发送给华瑞，承诺其具有完全民事权利/行为能力，且其向新新贷平台提供的实名信息均为真实有效。</p>
                        <p>（二）用户在此授权，华瑞有权根据用户在新新贷平台的网络借贷交易活动、指令及新新贷平台发送的指令，对用户的网络交易资金存管账户进行免密操作，以便用户在新新贷平台上正常开展网络借贷交易活动。用户同意，新新贷公司有权依据其与用户之间的约定以及用户的授权，向华瑞发送指令，且华瑞可以根据前述指令从用户的账户扣款，华瑞无须对用户与新新贷公司之间的约定以及用户对新新贷的授权作实质性审查。
                        </p>
                        <p>1、充值：用户不可撤销地授权新新贷平台向华瑞发送就用户绑定的银行卡账户向用户账户的充值指令，华瑞接受新新贷平台发送的前述指令后，受理完成该充值业务。</p>
                        <p>2、提现：用户不可撤销地授权新新贷平台向华瑞发送就用户账户向用户绑定的银行卡账户的提现指令，华瑞接受新新贷平台发送的前述指令后，从用户账户中划扣提现的金额至用户绑定的银行卡。</p>
                        <p>3、放款：按照用户与新新贷平台相关服务协议的约定，用户不可撤销地授权新新贷平台向华瑞提交“放款”请求的指令，华瑞对该指令仅进行表面性审核后对用户账户进行相应金额进行放款处理。 </p>
                        <p>4、还款：按照用户与新新贷平台相关服务协议的约定，用户不可撤销地授权新新贷平台向华瑞提交“还款”请求的指令，华瑞对该指令仅进行表面性审核后，从用户账户扣除相应的金额，完成还款操作。</p>
                        <p>5、查询指令及操作：用户不可撤销地授权新新贷公司作为唯一的查询方可以随时向华瑞调取或查询用户账号资金交易明细、余额等信息。用户不可撤销地授权华瑞将其账户的开户信息及账户交易信息全部提供/发送给新新贷平台。</p>
                        <p>6、划扣服务费：用户不可撤销的授权新新贷平台向华瑞发送就用户账户进行服务费（包括但不限于因新新贷为用户提供网络借贷信息中介服务及约定的任何其他服务，用户应向新新贷公司付的任何服务费用）划扣的指令，华瑞收到新新贷平台发送的前述指令后，即从用户账户中划扣约定的金额至新新贷公司指定的专户，而无需再另行通知用户。 </p>
                        <p>7、其他操作：新新贷平台基于用户与新新贷公司签订的相关服务协议或其他协议，可发送指令对用户账户进行与服务协议或其他协议约定的各项操作。</p>
                        <p>（三）用户同意，华瑞仅对因人工操作导致错误执行新新贷平台的指令承担责任，对于因新新贷平台发送指令错误或迟延，或新新贷平台未取得用户的事先授权而发送指令，导致用户的网络交易资金存管账户或银行账户发生的资金损失，华瑞不承担任何责任，用户应该与新新贷公司或交易对方自行解决前述纠纷。用户理解并明白华瑞仅在此过程中仅根据新新贷平台发送扣款指令划扣相应款项，除华瑞人工操作错误执行指令外，用户不得据此向华瑞主张任何索赔或补偿。 </p>
                        <p>(四)用户同意任何使用用户密码进行的交易委托或资金划转均视为用户本人所为和有效的用户指令。由于用户未尽到防范风险的义务造成其用户号及密码失密及其他非新新贷公司原因而导致的甲方损失，新新贷公司不承担任何责任。</p>
                        <h4>三、其他 </h4>
                        <p className="content-last">本协议依附于《三方协议》而存在，未尽事宜均以华瑞或新新贷公司或者新新贷平台不时更新公布的《三方协议》及相关规则为补充；本协议与《三方协议》及相关规则不一致的地方，以本协议为准。本协议中的所有术语，除非另有说明，否则其定义与三方协议的定义相同。</p>
                    </div>
                </div>
                <div className="container-1200">
                    <div className="operate-method">
                        <a onClick={this.CloseWindow.bind(this)}>【关闭此窗口】</a>
                        <a onClick={this.Printdiv.bind(this, "wrap-container")}>【打印此文件】</a>
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

UserlicenseAgree.Actions = BaseIndex.MapActions({});

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(UserlicenseAgree);