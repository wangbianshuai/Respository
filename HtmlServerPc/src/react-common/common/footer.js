import React, { Component } from "react";
import { Common } from "UtilsCommon";
import { Tip } from "ReactCommon";

export default class Footer extends Component {
    constructor(props) {
        super(props);

        this.state = { IsLinkClose: true };

        this.Init();
    }

    Init() {
        this.Page = this.props.Page;
        this.AddTipList = this.Page.InvokeRootPage("AddTipList");

        this.AddTipList([
            this.RenderTip("TipPhone", "css/i/qr-code-phone.png"),
            this.RenderTip("TipPhone2", "css/i/qr-code-phone.png"),
            this.RenderTip("TipWeixin", "css/i/qr-code-wechat.png"),
            this.RenderTip("TipWeibo", "css/i/qr-weibo.png")
        ]);
    }

    OnMouseOver(key) {
        return (e) => this[key].EffectsMouseOver(e, this.refs[key]);
    }

    SetRef(key) {
        return (c) => this[key] = c;
    }

    RenderTip(name, url) {
        const { PcBuildUrl } = this.props;

        return (
            <Tip ref={this.SetRef(name)} Position="fluctuate" key={Common.CreateGuid()}>
                <div className='qr-code-img'><img src={PcBuildUrl + url} height='100' width='100' /></div>
            </Tip>
        )
    }

    LinkClick() {
        return () => this.setState({ IsLinkClose: !this.state.IsLinkClose });
    }

    render() {
        const { Link } = this.props;
        const { IsLinkClose } = this.state;

        return (
            <div id="J_footer" className="footer">
                <div className="footer-wrap">
                    <div className="footer-info clearfix">
                        <div className="about-us">
                            <i className="call-us"></i>
                            <div className="qr-code-list">
                                <span>关注我们</span>
                                <i className="weibo-icon" onMouseOver={this.OnMouseOver("TipWeibo")} ref="TipWeibo"></i>
                                <i className="wechat-icon" onMouseOver={this.OnMouseOver("TipWeixin")} ref="TipWeixin"></i>
                                <span>下载手机客户端</span>
                                <i className="ios-icon" onMouseOver={this.OnMouseOver("TipPhone")} ref="TipPhone"></i>
                                <i className="android-icon" onMouseOver={this.OnMouseOver("TipPhone2")} ref="TipPhone2"></i>
                            </div>
                            <p className="about-us-warn">投资有风险，选择需谨慎</p>
                        </div>
                        <div className="footer-intro">
                            <ul>
                                <li className="first"><a href="/html/help/organization.html" target="_blank">新新贷介绍</a></li>
                                <li><a href="/html/help/platform.html" target="_blank">公告和新闻</a></li>
                                <li><a href="/html/help/contactus.html" target="_blank">联系我们</a></li>
                                <li><a href="/introduce/sitemap.html" target="_blank">网站地图</a></li>
                            </ul>
                        </div>
                        <div className="footer-safe">
                            <ul>
                                <li className="first"><a href="/html/help/safesecurity.html" v="">安全保障</a></li>
                                <li><a href="/html/help/complirun.html" target="_blank">合规运营</a></li>
                                <li><a href="/html/help/runreports.html" target="_blank">运营报告</a></li>
                                <li><a href="/html/help/riskmanager.html" target="_blank">风险控制</a></li>
                            </ul>
                        </div>
                        <div className="footer-newer">
                            <ul>
                                <li className="first"><a href="/html/introduce/guide.html" target="_blank">新手福利</a></li>
                                <li><a href="/help/aboutxxd.html" target="_blank">常见问题</a></li>
                                <li><a href="/help/aboutxxd.html" target="_blank">帮助中心</a></li>
                                <li><a href="/help/aboutxxd.html" target="_blank">资费介绍</a></li>
                            </ul>
                        </div>
                        <div className="footer-phone">
                            <ul>
                                <li className="first"><a href="/html/promotion/index.html">手机新新贷</a></li>
                                <li className="ios_apk"><a href="http://www.xinxindai.com/html/promotion/index.html"> iOS</a></li>
                                <li className="android_apk"><a href="http://www.xinxindai.com/static/download/xinxindai_release_new.apk"> Android</a></li>
                                <li><a href="/question/toQuestionPage.html?termCode=riskEva20160117" target="_blank">风险偏好评估</a></li>
                                <li className='borrow-scan'><a href="/html/borrowScan/index.html">手机新宜贷</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className={"footer-link clearfix" + (IsLinkClose ? " close-down" : "")} >
                        <span className="footer-link-title">友情链接：</span>
                        <ul className="footer-link-list clearfix">
                            {Link && Link.map && Link.map(item => <li key={Common.CreateGuid()}><a href={item.textHref} target="view_window">{item.text}</a></li>)}
                        </ul>
                        <span className="switch-icon" onClick={this.LinkClick()}></span>
                    </div>
                    <div className="footer-bottom">
                        <div className="text"><a href="#">Copyright @新新贷（上海）金融信息服务有限公司 沪ICP备12026657号-1 版权所有，未经许可不得复制、转载或摘编，违者必究</a><span>V6.6.1</span><br />增值电信业务经营许可证B2-20151008<i className="chapter"></i><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010902001060">沪公网安备 31010902001060号</a></div>
                        <div className="footer-icons">
                            <a href="http://www.shjbzx.cn/" target="_blank" className="x1"> </a>
                            <a href="http://www.itrust.org.cn/yz/pjwx.asp?wm=1057638558" target="_blank" className="x2"> </a>
                            <a href="https://ss.knet.cn/verifyseal.dll?sn=e14050731010948597brpb000000&amp;comefrom=trust&amp;trustKey=dn&amp;trustValue=www.xinxindai.com" target="_blank" className="x3"> </a>
                            <a href="https://search.szfw.org/cert/l/CX20140224003875003530" target="_blank" className="x4"> </a>
                            <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010902001060" target="_blank" className="x5"> </a>
                            <a href="http://www.itrust.org.cn/home/index/itrust_certifi/wm/1057638558" target="_blank" className="x6"></a>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
