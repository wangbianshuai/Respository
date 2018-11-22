import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Menu from "../common/menu"

class AccountInfo extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "企业实名认证";
    }

    GetCssList() {
        return ["/build/css/reset.css", "/build/mods/company/account-info/_.css"];
    }

    GetJsList() {
        return ["/build/mods/company/account-info/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetCompanyAccountInfo");
    }

    render() {
        if (!this.props.PageData || !this.props.PageData.global) return null;

        const PcBuildUrl = this.GetPcBuildUrl();
        const { globalData, isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB } = this.props.PageData;
        const MenuStatus = { isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB }

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} globalData={globalData} IsCompany={true} IsCompanyActive={false} />

                <div className="g-top">
                    <div className="g-top-con">
                        <div className="container-1200">
                            <a href="../../">首页</a> &gt; <a href="/usercenter/accountInfo.html">我的新新贷</a> &gt; <a href="javascript:void(0);">企业用户</a> &gt; <a href="javascript:void(0);">我的账户</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="userinfo" MenuName2="account-info" MenuStatus={MenuStatus} IsCompany={true} />
                    <div className="g-right">
                        <div className="m-con-wrap" id="account">
                            <div className="m-con-hd title">企业信息</div>
                            <div className="content-step fourth-step" id="J_fourth">

                                <div className="m-con-bd">
                                    <div className="fourth-list fourth-first">
                                        <div className="fourth-info">
                                            <label for="J_firmTitle">公司名称:</label>
                                            <input type="text" id="J_firmTitle" name="firmTitle" disabled />
                                            <span className="cur-tips">*</span>
                                        </div>
                                        <div className="fourth-info fourth-info-last">
                                            <label for="J_firmAddress">公司地址:</label>
                                            <input type="text" id="J_firmAddress" name="firmAddress" />
                                            <p className="info-error hidden" id="J_addrError">请输入公司地址</p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                    </div>
                                    <div className="fourth-list">
                                        <div className="fourth-info">
                                            <label for="J_regTel">注册电话:</label>
                                            <input type="text" id="J_regTel" name="firmTitle" maxlength="15" />
                                            <p className="info-error hidden" id="J_telError"></p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                        <div className="fourth-info fourth-info-last">
                                            <label for="J_workAddress">办公地址</label>
                                            <input type="text" id="J_workAddress" name="firmAddress" />
                                        </div>
                                    </div>
                                    <div className="fourth-list fourth-check">
                                        <div className="fourth-info">
                                            <label for="J_regTel">三证合一:</label>
                                            <div className="select-operate" id="J_selectOperate">
                                                <input name="regTel" type="radio" value="true" checked="checked" id="J_selectTrue" className="select-true" /><span>是</span>
                                                <input name="regTel" type="radio" value="false" id="J_selectFalse" className="select-false" /><span>否</span>
                                            </div>
                                        </div>
                                        <div className="fourth-info fourth-info-last">
                                            <label for="J_businessNum">营业执照编号:</label>
                                            <input type="text" id="J_businessNum" name="businessNum" />
                                            <p className="info-error hidden">请输入公司名字</p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                    </div>

                                    <div className="fourth-list disnone" id="J_falseOperate">
                                        <div className="fourth-info">
                                            <label for="J_organizationNum">组织机构代码证:</label>
                                            <input type="text" id="J_organizationNum" name="organizationNum" />
                                            <p className="info-error hidden" id="J_organizationNumError">请选择公司规模</p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                        <div className="fourth-info fourth-info-last info-capital">
                                            <label for="J_taxNum">税务登记证:</label>
                                            <input type="text" id="J_taxNum" name="taxNum" />
                                        </div>
                                    </div>
                                    <div className="fourth-list">
                                        <div className="fourth-info">
                                            <label for="J_companyScale">公司规模:</label>
                                            <select id="J_companyScale" className="company-scale"></select>
                                            <p className="info-error hidden" id="J_companyError">请选择公司规模</p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                        <div className="fourth-info fourth-info-last">
                                            <label for="J_regTime">注册时间:</label>
                                            <input type="text" id="J_regTime" name="regTime" />
                                            <p className="info-error hidden" id="J_regTimeError"></p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                    </div>
                                    <div className="fourth-list">
                                        <div className="fourth-info">
                                            <label for="J_shareholderName">股东姓名:</label>
                                            <input type="text" id="J_shareholderName" name="shareholderName" />
                                            <p className="info-error hidden" id="J_shareholderError">股东姓名不能为空</p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                        <div className="fourth-info fourth-info-last info-capital">
                                            <label for="J_regCapital">注册资本:</label>
                                            <input type="text" id="J_regCapital" name="regCapital" />
                                            <p className="info-error hidden" id="J_regCapitalError"></p>
                                            <span className="cur-tips cur-special">万元*</span>
                                        </div>
                                    </div>
                                    <div className="fourth-list">
                                        <div className="fourth-info">
                                            <label for="J_shareholderType">股东类型:</label>
                                            <select id="J_shareholderType" className="shareholder-type"></select>
                                        </div>
                                        <div className="fourth-info fourth-info-last">
                                            <label for="J_businessArea">经营区域:</label>
                                            <input type="text" id="J_businessArea" name="businessArea" />
                                        </div>
                                    </div>
                                    <div className="fourth-list">
                                        <div className="fourth-info">
                                            <label for="J_shareholderPapers">股东证件类型:</label>
                                            <select id="J_shareholderPapers" className="shareholder-type"></select>
                                            <p className="info-error hidden" id="J_shareholderPapersError">请选择股东证件类型</p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                        <div className="fourth-info fourth-info-last info-capital">
                                            <label for="J_payCapital">实缴资本:</label>
                                            <input type="text" id="J_payCapital" name="payCapital" />
                                            <p className="info-error hidden" id="J_payCapitalError"></p>
                                            <span className="cur-tips cur-special">万元*</span>
                                        </div>
                                    </div>
                                    <div className="fourth-list">
                                        <div className="fourth-info">
                                            <label for="J_shareholderCardid">股东身份证号:</label>
                                            <input type="text" id="J_shareholderCardid" name="shareholderCardid" />
                                            <p className="info-error hidden" id="J_shareholderCardidError">股东身份证号不能为空</p>
                                            <span className="cur-tips" id="J_shareholderCardidCur">*</span>
                                        </div>
                                        <div className="fourth-info fourth-info-last">
                                            <label for="J_profession">所属行业:</label>
                                            <select id="J_profession" className="profession"></select>
                                            <p className="info-error hidden" id="J_professionError"></p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="m-con-bd">

                                    <div className="fourth-list">
                                        <div className="fourth-info">
                                            <label for="J_legalName">法人姓名:</label>
                                            <input type="text" id="J_legalName" disabled name="legal-name" />
                                        </div>
                                        <div className="fourth-info fourth-info-last">
                                            <label for="J_trueName">常用联系人姓名:</label>
                                            <input type="text" id="J_trueName" name="trueName" />
                                            <p className="info-error hidden" id="J_trueNameError"></p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                    </div>
                                    <div className="fourth-list">
                                        <div className="fourth-info">
                                            <label for="J_legalID">法人身份证号:</label>
                                            <input type="text" id="J_legalID" disabled name="legalID" />
                                        </div>
                                        <div className="fourth-info fourth-info-last">
                                            <label for="J_contactNum">常用联系人手机:</label>
                                            <input type="text" id="J_contactNum" name="legal-name" maxlength="11" />
                                            <p className="info-error hidden" id="J_contactNumError"></p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                    </div>
                                    <div className="fourth-list">
                                        <div className="fourth-info">
                                            <label for="J_mobileNum">法人手机号:</label>
                                            <input type="text" id="J_mobileNum" name="legal-name" maxlength="11" />
                                            <p className="info-error hidden" id="J_mobileNumError"></p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                        <div className="fourth-info fourth-info-last">
                                            <label for="J_firmEmail">企业邮箱:</label>
                                            <input type="text" id="J_firmEmail" name="trueName" />
                                            <p className="info-error hidden" id="J_firmEmailError"></p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bottom-upload">
                                    <div className="fourth-list">
                                        <div className="fourth-info fourth-file">
                                            <label for="J_licenseFile" className="label-small">营业执照副本图片:</label>
                                            <div className="file-upload">
                                                <p>请选择要上传的照片</p>
                                                <i>选择&nbsp; &gt;</i>
                                                <input type="file" name="pic" id="J_licenseFile" data-pic="" />
                                            </div>
                                            <p className="info-error hidden" id="J_licenseFileError"></p>
                                            <span className="cur-tips">*</span>
                                        </div>
                                    </div>
                                    <div id="J_fileFalse" className="disnone">
                                        <div className="fourth-list">
                                            <div className="fourth-info fourth-file">
                                                <label for="J_organizationFile" className="label-small">组织机构图片:</label>
                                                <div className="file-upload">
                                                    <p>请选择要上传的照片</p>
                                                    <i>选择&nbsp; &gt;</i>
                                                    <input type="file" name="pic" id="J_organizationFile" data-pic="" />
                                                </div>
                                                <p className="info-error hidden" id="J_organizationFileError"></p>
                                                <span className="cur-tips">*</span>
                                            </div>
                                        </div>
                                        <div className="fourth-list">
                                            <div className="fourth-info fourth-file">
                                                <label for="J_taxFile" className="label-small">税务登记证图片:</label>
                                                <div className="file-upload">
                                                    <p>请选择要上传的照片</p>
                                                    <i>选择&nbsp; &gt;</i>
                                                    <input type="file" name="pic" id="J_taxFile" data-pic="" />
                                                </div>
                                                <p className="info-error hidden" id="J_taxFileError"></p>
                                                <span className="cur-tips">*</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <botton className="submit-btn" id="J_infoSubmit">提交</botton>
                            </div>

                        </div>
                    </div>
                </div>
                <Footer PcBuildUrl={PcBuildUrl} globalData={globalData}  />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.CompanyAccountInfo
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(AccountInfo);