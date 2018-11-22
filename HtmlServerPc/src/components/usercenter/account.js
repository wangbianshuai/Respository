import React from "react"
import { connect } from "dva"
import BaseIndex from "../Index";
import Header from "../common/header";
import Footer from "../common/footer";
import Menu from "./common/menu"
import { Common } from "UtilsCommon";

class Account extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "我的账户-个人资料-我的新新贷";
    }

    GetCssList() {
        return ["/build/mods/user/account/_.css"];
    }

    GetJsList() {
        return ["/build/mods/user/account/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetUserCenterAccount");
    }

    render() {
        if (!this.props.PageData || !this.props.PageData.global) return null;

        const PcBuildUrl = this.GetPcBuildUrl();
        const { globalData, isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB } = this.props.PageData;
        const MenuStatus = { isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB }
        const nowHours = new Date().getHours();

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} globalData={globalData} />

                <div className="g-top">
                    <div className="g-top-con">
                        <div className="container-1200">
                            <a href="../../">首页</a> &gt; <a href="/usercenter/accountInfo.html">我的新新贷</a> &gt;
                <a href="javascript:void(0);">个人资料</a> &gt; <a href="javascript:void(0);">我的账户</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="" MenuName2="" MenuStatus={MenuStatus} />

                    <div className="g-right">
                        <div className="m-con-wrap " id='myAccount'>
                            <div className="m-con-hd user-title">
                                <li>我的账户</li>
                            </div>
                            <div className='account-detail clearfix'>
                                <div className='head-portrait'>
                                    <img src={globalData.userDetailInfo.data.userDetailInfo.headimg} alt="" className='change-head fl' />
                                    <div>
                                        <p>
                                            {nowHours < 6 && <span>凌晨好，</span>}
                                            {nowHours >= 6 && nowHours < 12 && <span>上午好，</span>}
                                            {nowHours >= 12 && nowHours < 18 && <span>下午好，</span>}
                                            {nowHours >= 18 && nowHours <= 23 && <span>晚上好，</span>}
                                            <a href='/usercenter/personalInfo.html'>{globalData.userDetailInfo.data.userDetailInfo.nickname}</a>
                                            <a href="/help/aboutcreditlevel.html" className='position'>
                                                {globalData.userDetailInfo.data.userDetailInfo.creditLevel}<span className='position-tip hide'>点击查看新新贷信用等级规则<i></i></span>
                                            </a>
                                        </p>
                                        <em>上次登录：{globalData.userDetailInfo.data.userDetailInfo.lastLoginTime}</em>
                                    </div>
                                </div>
                                <div className='safety'>
                                    <p>
                                        安全等级：
                            <a className={globalData.userDetailInfo.data.userDetailInfo.infoPercent > 0 ? 'active grade' : 'grade'} href='/usercenter/personalInfo.html'>低</a>
                                        <a className={globalData.userDetailInfo.data.userDetailInfo.infoPercent > 40 ? 'active grade' : 'grade'} href='/usercenter/personalInfo.html'>中</a>
                                        <a className={globalData.userDetailInfo.data.userDetailInfo.infoPercent > 85 ? 'active grade' : 'grade'} href='/usercenter/personalInfo.html'>高</a>
                                        <a href="/usercenter/personalInfo.html" className='manage'>管理</a>
                                    </p>
                                    <div className='allicon'>
                                        <a className={globalData.userDetailInfo.data.userDetailInfo.isEmailAppro === '1' ? 'mail active' : 'mail'} href='/personal/info.html'>
                                            <span className='hide'><i></i>邮箱-<b>{globalData.userDetailInfo.data.userDetailInfo.isEmailAppro == '1' ? '已认证' : '未认证'}</b></span>
                                        </a>
                                        <a className={globalData.userDetailInfo.data.userDetailInfo.isMobileAppro === '1' ? 'tel active' : 'tel'} href='/personal/info.html'>
                                            <span className='hide'><i></i>手机-<b>{globalData.userDetailInfo.data.userDetailInfo.isMobileAppro == '1' ? '已认证' : '未认证'}</b></span>
                                        </a>

                                        <a className={globalData.userDetailInfo.data.userDetailInfo.payPassword === '1' ? 'lock active' : 'lock'} href='/personal/info.html'>
                                            <span className='hide'><i></i>支付密码-<b>{globalData.userDetailInfo.data.userDetailInfo.payPassword == '1' ? '已认证' : '未认证'}</b></span>
                                        </a>
                                        <a className={globalData.userDetailInfo.data.userDetailInfo.isRealnameAppro === '1' ? 'autonym active' : 'autonym'} href='/personal/info.html'>
                                            <span className='hide'><i></i>实名-<b>{globalData.userDetailInfo.data.userDetailInfo.isRealnameAppro == '1' ? '已认证' : '未认证'}</b></span>
                                        </a>
                                        <a className={globalData.userDetailInfo.data.userDetailInfo.isopenaccount === '1' ? 'deposit active' : 'deposit'} href='/personal/info.html' className=''>
                                            <span className='hide'><i></i>存管账户-<b>{globalData.userDetailInfo.data.userDetailInfo.isopenaccount == '1' ? '已认证' : '未认证'}</b></span>
                                        </a>
                                    </div>
                                </div>
                                <div className='br coins'>
                                    <p>优惠券：<a href='/usercenter/coupon.html'>{globalData.userDetailInfo.data.userDetailInfo.coupon}</a>个</p>
                                    <a href="/usercenter/recharge.html" className='btn'>充值</a>
                                    <p>新新币：<a href='/usercenter/fundRecord/coinLog.html'>{globalData.userDetailInfo.data.userDetailInfo.coins}</a>个</p>
                                    <a href="/usercenter/withdraw.html" className='btn ml'>提现</a>
                                </div>
                                {globalData.userDetailInfo.data.userDetailInfo.isopenaccount === '0' && <p className='deposit-tip'>为保障您的资金交易顺利进行，请先开通银行存管账户<a href="/usercenter/openAccount.html">立即开通</a></p>}
                                <div className='month-sum'>
                                    <div>
                                        <p>本月累计赚取(元)</p>
                                        <span>{Common.ToCurrency(globalData.assetStatistics.data.mapAccount.sumEarnedThisMonth)}</span>
                                    </div>
                                    <div>
                                        <p>本月待收收益(元)</p>
                                        <i>{Common.ToCurrency(globalData.assetStatistics.data.mapAccount.sumCollectionThisMonth)}</i>
                                    </div>
                                </div>
                                <div className='year-sum'>
                                    <p>今年累计赚取(元) <span>{Common.ToCurrency(globalData.assetStatistics.data.mapAccount.sumEarnedThisYear)}</span></p>
                                    <p className='mt'>累计待收收益(元) <i>{Common.ToCurrency(globalData.assetStatistics.data.mapAccount.dueInInterestSumTotal)}</i></p>
                                </div>
                                <div className='br operate'>
                                    <a href="/html/inviteFriends/inviteFriends.html" target="_blank" className="inviteFriends-detail">查看活动详情》</a>
                                    <p>邀请好友人数：<a href="/usercenter/inviteFriends/inviteFriendsDetail.html?type=friendsDetail" className="invite-friends-num">0</a>人</p>
                                    <p className='mt'>邀请好友已获得奖励：<a href="/usercenter/inviteFriends/inviteFriendsDetail.html?type=rewardDetail" className="invite-reward">0</a>元</p>
                                </div>
                            </div>
                            <div className="m-con-hd user-title property">
                                <li>资产分布</li>
                            </div>
                            <div>
                                <div className='my-property'>
                                    <div className='hover-tip'>
                                        <span></span>
                                        <p>资产总额=可用余额+新元宝（新手专享）+月进斗金+新元宝+月月派+新手标+散标+冻结金额<i></i></p>
                                    </div>
                                    <div className='centre'>
                                        <div className='sum-property'>
                                            <p>资产总额</p>
                                            <p><span>{Common.ToCurrency(globalData.assetStatistics.data.mapAccount.sumTotal)}</span>元</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='data-box clearfix'>
                                    <div className='table-box'>
                                        <table>
                                            <tr className='title'>
                                                <th>产品名称</th>
                                                <th>累计出借(元)</th>
                                                <th>累计收益(元)</th>
                                                <th>待收收益(元)</th>
                                            </tr>
                                            <tr name='usable' className='kyye-style'>
                                                <td>可用余额</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.mapAccount.usable)}(元)</td>
                                            </tr>
                                            <tr name='frozen' className='djje-style'>
                                                <td>冻结金额</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.mapAccount.frozen)}(元)</td>
                                            </tr>
                                            <tr name="xszx">
                                                <td className='J_xszx blue-color'>新元宝（新手专享)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.xscp30tMap.EFFECTIVEMONEY)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.xscp30tMap.COLLECTEDINTEREST)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.xscp30tMap.COLLECTINTEREST)}(元)</td>
                                            </tr>
                                            <tr name="yjdj">
                                                <td className='J_yjdj blue-color'>月进斗金</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.yuejindoujinMap.EFFECTIVEMONEY)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.yuejindoujinMap.COLLECTEDINTEREST)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.yuejindoujinMap.COLLECTINTEREST)}(元)</td>
                                            </tr>
                                            <tr name="xyb">
                                                <td className='J_xyb blue-color'>新元宝</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.xinyuanbaoMap.EFFECTIVEMONEY)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.xinyuanbaoMap.COLLECTEDINTEREST)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.xinyuanbaoMap.COLLECTINTEREST)}(元)</td>
                                            </tr>
                                            <tr name="yyp">
                                                <td className='J_yyp blue-color'>月月派</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.yypMap.EFFECTIVEMONEY)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.yypMap.COLLECTEDINTEREST)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.yypMap.COLLECTINTEREST)}(元)</td>
                                            </tr>
                                            <tr name="xsb">
                                                <td className='J_xsb blue-color'>新手标</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.xinshoubiaoMap.EFFECTIVEMONEY)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.xinshoubiaoMap.COLLECTEDINTEREST)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.xinshoubiaoMap.COLLECTINTEREST)}(元)</td>
                                            </tr>
                                            <tr name="sb">
                                                <td className='J_sb blue-color'>散标</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.sanbiaoMap.EFFECTIVEMONEY)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.sanbiaoMap.COLLECTEDINTEREST)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.sanbiaoMap.COLLECTINTEREST)}(元)</td>
                                            </tr>
                                            <tr name="other">
                                                <td className='J_other cursor'>其他</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.other.EFFECTIVEMONEY)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.other.COLLECTEDINTEREST)}(元)</td>
                                                <td>{Common.ToCurrency(globalData.assetStatistics.data.other.COLLECTINTEREST)}(元)</td>
                                            </tr>
                                        </table>
                                        {(isInvestRRY || isInvestQTDS || isInvestBBGS) && <p className='other-pro hide'>已下架产品：
                                            {isInvestRRY && <span>日日盈</span>}
                                            {isInvestQTDS && <span>七天大胜</span>}
                                            {isInvestBBGS && <span>步步高升</span>}
                                            <i></i>
                                        </p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='m-con-wrap hide' id='changeHead'>
                            <div className="m-con-hd user-title">
                                <li className='head-title'>头像设置 <i className='back J_back'>返回</i></li>
                            </div>
                            <div className='settings'>
                                <div className='choice'>
                                    <div className='old-head'>
                                        <img src={globalData.userDetailInfo.data.userDetailInfo.headimg} alt="" className='J_userPortrait' />
                                        <p>当前头像</p>
                                    </div>
                                    <p>选择一个头像</p>
                                    <div className='all-img J_SystemImgs'></div>
                                    <a href="#" className='btn J_setPortrait'>设置头像</a>
                                </div>
                                <div className='user-defined'>
                                    <p>上传自定义头像</p>
                                    <div className='upload'>
                                        <p className='clearfix'>
                                            <span className="fadetip fl">未选择文件</span>
                                            <i className='fl'>选择文件</i>
                                        </p>
                                        <form id='uploadPortrait'>
                                            <input type="file" name='pic' className='J_uploadMyImg' />
                                        </form>
                                    </div>
                                    <em>单张图片不超过2MB,图片格式仅支持jpg和jpeg</em>
                                    <div className='tailor hide'>
                                        <p>图片预览:请拖动选择区域选择要选的区域</p>
                                        <div className='tailor-img J_tailorImg'><img src="" className="J_cropperImg" /></div>
                                        <a href="#" className='btn J_savePortrait'>保存图片</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer PcBuildUrl={PcBuildUrl} globalData={globalData} />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.UserCenterAccount
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Account);