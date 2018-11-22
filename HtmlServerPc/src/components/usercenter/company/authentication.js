import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";

class Authentication extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "企业认证";
    }

    GetCssList() {
        return ["/build/mods/company/authentication/_.css"];
    }

    GetJsList() {
        return ["/build/mods/company/authentication/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetCompanyAuthentication");
    }

    render() {
        if (!this.props.PageData || !this.props.PageData.global) return null;

        const PcBuildUrl = this.GetPcBuildUrl();
        const { globalData } = this.props.PageData;

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} globalData={globalData} IsCompany={true} IsCompanyActive={false} />

                <div className="pages-list">
                    <div className="g-top-con">
                        <a href="javascript:void(0);">注册</a> &gt; <span id="J_showStepInfo">法人实名认证</span>
                    </div>
                </div>
                <div className="container">
                    <div className="step-lists">
                        <ul id="J_stepLists">
                            <li className="step-common step-first">
                                <b>1</b>
                                <span>法人实名认证</span>
                            </li>
                            <li className="step-common" id="second">
                                <b>2</b>
                                <span>企业认证</span>
                            </li>
                            <li className="step-common" id="third">
                                <b>3</b>
                                <span>对公户信息</span>
                            </li>
                            <li className="step-common" id="fourth">
                                <b>4</b>
                                <span>企业信息</span>
                            </li>
                            <li className="step-common" id="fifth">
                                <b>5</b>
                                <span>存管开户</span>
                            </li>
                        </ul>
                    </div>
                    <div className="content-step identify-common first-step disnone" id="J_first">
                        <h3>请填写法人身份信息</h3>
                        <div className="step1" id="J_realNameStep1">
                            <div className="user-common">
                                <label for="J_userName">姓名</label>
                                <input type="text" id="J_userName" placeholder="请输入法人真实姓名" name="userName" maxlength="20" />
                            </div>
                            <div className="user-common user-id">
                                <label for="J_IDNumber">身份证号</label>
                                <input type="text" id="J_IDNumber" placeholder="请输入法人身份证号码" name="userId" maxlength="18" />
                            </div>
                            <div className="error-tips step1-error hidden" id="J_firstStep1Error">
                                身份证号格式不正确!
                </div>
                            <botton className="step-btn" id="J_step1RealBtn">下一步</botton><a className="step1-artificial hidden" href="#" id="J_realNameArtificial">提交人工审核</a>
                        </div>
                        <div className="step2 disnone" id="J_realNameStep2">
                            <div className="user-common">
                                <label for="J_userNameArty">姓名</label>
                                <input type="text" id="J_userNameArty" placeholder="请输入法人真实姓名" name="userNameArty" maxlength="20" />
                            </div>
                            <div className="user-common user-id">
                                <label for="J_IDNumberArty">身份证号</label>
                                <input type="text" id="J_IDNumberArty" placeholder="请输入法人身份证号码" name="IDNumberArty" maxlength="18" />
                            </div>
                            <div className="step2-upload upload-front upload-file">
                                <div className="upload-default">
                                    <i></i>
                                    <span>身份证正面照片</span>
                                    <input type="file" name="uploadName" id="J_realUploadFile1" data-pic="" />
                                </div>
                                <div className="upload-img disnone" id="J_IDCardFront">
                                    <img src="" />
                                </div>
                            </div>
                            <div className="step2-upload upload-back upload-file">
                                <div className="upload-default">
                                    <i></i>
                                    <span>身份证反面照片</span>
                                    <input type="file" name="uploadName" id="J_realUploadFile2" data-pic="" />
                                </div>
                                <div className="upload-img disnone" id="J_IDCardBack">
                                    <img src="" />
                                </div>
                            </div>
                            <div className="error-tips step1-error hidden" id="J_firstStep2Error"></div>
                            <botton className="step-btn" id="J_step2RealBtn">下一步</botton>
                        </div>
                    </div>
                    <div className="content-step identify-common second-step disnone" id="J_second">
                        <h3>请填写企业认证信息</h3>
                        <div className="step1" id="J_secondStep1">
                            <div className="user-common">
                                <label for="J_firmName">企业名称</label>
                                <input type="text" id="J_firmName" placeholder="请输入您的企业名称" name="firmName" maxlength="100" />
                            </div>
                            <div className="user-common user-firm-id">
                                <label for="J_firmId">注册号或统一企业信用代码</label>
                                <input type="text" id="J_firmId" placeholder="请输入您的注册号或统一企业信用代码" name="firmId" maxlength="25" />
                            </div>
                            <div className="error-tips step1-error hidden" id="J_secondStep1Error">
                                已存在相同的企业信息!
                </div>
                            <botton className="step-btn" id="J_step1FirmBtn">下一步</botton><a className="step1-artificial hidden" href="#" id="J_stepFirmArtificial">提交人工审核</a>
                        </div>
                        <div className="step2 disnone" id="J_secondStep2">
                            <div className="user-common">
                                <label for="J_firmNameArty">企业名称</label>
                                <input type="text" id="J_firmNameArty" placeholder="请输入您的企业名称" name="firmNameArty" maxlength="100" />
                            </div>
                            <div className="user-common user-firm-id">
                                <label for="J_firmIdArty">注册号或统一企业信用代码</label>
                                <input type="text" id="J_firmIdArty" placeholder="请输入您的注册号或统一企业信用代码" name="firmIdArty" maxlength="25" />
                            </div>
                            <div className="user-common user-select">
                                <label for="J_firmUploadTrue">三证合一</label>
                                <div className="firm-upload" id="J_firmUpload">
                                    <input name="firmUpload" type="radio" value="true" checked="checked" id="J_firmUploadTrue" className="upload-true" /><span>是</span>
                                    <input name="firmUpload" type="radio" value="false" id="J_firmUploadFalse" className="upload-false" /><span>否</span>
                                </div>
                            </div>
                            <div className="firm-true-total" id="J_firmUploadT">
                                <div className="step2-upload firm-upload-true upload-file">
                                    <div className="upload-default">
                                        <i></i>
                                        <span>上传营业执照</span>
                                        <input type="file" name="uploadName" id="J_firmUploadFile1" data-pic="" />
                                    </div>
                                    <div className="upload-img disnone" id="J_firmBussinessPic1">
                                        <img src="" />
                                    </div>
                                </div>
                            </div>
                            <div className="firm-false-total disnone" id="J_firmUploadF">
                                <div className="step2-upload firm-upload-false upload-file">
                                    <div className="upload-default">
                                        <i></i>
                                        <span>上传营业执照</span>
                                        <input type="file" name="uploadName" id="J_firmUploadFile2" data-pic="" />
                                    </div>
                                    <div className="upload-img disnone" id="J_firmBussinessPic2">
                                        <img src="" />
                                    </div>
                                </div>
                                <div className="step2-upload firm-upload-false upload-file">
                                    <div className="upload-default">
                                        <i></i>
                                        <span>上传组织机构代码证</span>
                                        <input type="file" name="uploadName" id="J_firmUploadFile3" data-pic="" />
                                    </div>
                                    <div className="upload-img disnone" id="J_orginstitutionPic">
                                        <img src="" />
                                    </div>
                                </div>
                                <div className="step2-upload firm-upload-false upload-file">
                                    <div className="upload-default">
                                        <i></i>
                                        <span>上传税务登记证</span>
                                        <input type="file" name="uploadName" id="J_firmUploadFile4" data-pic="" />
                                    </div>
                                    <div className="upload-img disnone" id="J_taxregistrationPic">
                                        <img src="" />
                                    </div>
                                </div>
                            </div>
                            <div className="error-tips step2-error hidden" id="J_secondStep2Error">
                                已存在相同的企业信息!
                </div>
                            <botton className="step-btn firm-true" id="J_step2FirmBtn">下一步</botton>
                        </div>
                    </div>
                    <div className="content-step identify-common third-step disnone" id="J_third">
                        <h3>确定企业对公户信息</h3>
                        <div className="step1" id="J_thirdStep1">
                            <div className="user-common user-linkBank-num">
                                <label for="J_linkBank">联行号</label>
                                <input type="text" id="J_linkBank" placeholder="请输入联行号" onkeyup="value=value.replace(/[^\d]/g,'')" maxlength="200" value="" name="link-bank" />
                                <div className="linkBank-select" id="J_linkBankSelect"><span></span></div>
                                <a href="javascript:void(0);" id="J_getLinkBank">如何获取联行号</a>
                            </div>
                            <div className="user-common user-area">
                                <label for="J_provinceNum">省/市</label>
                                <input type="text" id="J_provinceNum" className="area-name" value="" readonly="readonly" />
                                <span>市/区</span>
                                <input type="text" id="J_cityNum" className="city-name" value="" readonly="readonly" />
                            </div>
                            <div className="user-common user-bank">
                                <label for="J_selectBank">开户银行</label>
                                <input type="text" id="J_selectBank" value="" readonly="readonly" />
                            </div>
                            <div className="user-common bank-name">
                                <label for="J_branchBank">开户支行名称</label>
                                <input type="text" id="J_branchBank" name="bank-name" readonly="readonly" />
                            </div>
                            <div className="user-common bank-num">
                                <label for="J_bankNum">对公户账户</label>
                                <input type="text" id="J_bankNum" placeholder="请输入对公户账户" onkeyup="value=value.replace(/[^\d]/g,'')" name="bankNum" maxlength="200" />
                            </div>
                            <div className="error-tips step1-error hidden" id="J_bankNumError">
                                已存在相同的银行卡信息。
                </div>
                            <botton className="step-btn firm-true" id="J_step1BankBtn">下一步</botton><a className="step1-artificial disnone" href="#" id="J_stepBankArtificial">提交人工审核</a>
                        </div>
                        <div className="step2 disnone" id="J_thirdStep2">
                            <div className="user-common user-linkBank-num">
                                <label for="J_linkBank">联行号</label>
                                <input type="text" id="J_link2Bank" placeholder="请输入联行号" onkeyup="value=value.replace(/[^\d]/g,'')" maxlength="200" value="" name="link2-bank" />
                                <div className="linkBank-select" id="J_link2BankSelect"><span></span></div>
                                <a href="javascript:void(0);" id="J_get2LinkBank">如何获取联行号</a>
                            </div>
                            <div className="user-common user-area">
                                <label for="J_province2Num">省/市</label>
                                <input type="text" id="J_province2Num" className="area-name" value="" readonly="readonly" />
                                <span>市/区</span>
                                <input type="text" id="J_city2Num" className="city-name" value="" readonly="readonly" />
                            </div>
                            <div className="user-common user-bank">
                                <label for="J_select2Bank">开户银行</label>
                                <input type="text" id="J_select2Bank" value="" readonly="readonly" />
                            </div>
                            <div className="user-common bank-name">
                                <label for="branch-bank-name">开户支行名称</label>
                                <input type="text" id="branch-bank-name" name="bank-name" readonly="readonly" />
                            </div>
                            <div className="user-common bank-num">
                                <label for="J_bank2Num">对公户账户</label>
                                <input type="text" id="J_bank2Num" placeholder="请输入对公户账户" onkeyup="value=value.replace(/[^\d]/g,'')" name="bankNum" maxlength="200" />
                            </div>
                            <div className="step2-upload">
                                <div id="bank-upload" className="upload-default">
                                    <i></i>
                                    <span>上传银行开户许可证</span>
                                    <input type="file" id="upload-bank" />
                                </div>
                                <div className="upload-img disnone">
                                    <img src="" />
                                </div>
                            </div>
                            <div className="error-tips step1-error hidden" id="J_BankError">
                                已存在相同的银行卡信息。
                </div>
                            <botton className="step-btn firm-true" id="J_step2BankBtn">下一步</botton>
                        </div>
                    </div>
                    <div className="content-step fourth-step disnone" id="J_fourth">
                        <h3>请填写企业信息</h3>
                        <div className="fourth-list fourth-first">
                            <div className="fourth-info">
                                <label for="J_firmTitle">企业名称:</label>
                                <input type="text" id="J_firmTitle" name="firmTitle" />
                                <span className="cur-tips" id="J_firmCur">*</span>
                            </div>
                            <div className="fourth-info fourth-info-last">
                                <label for="J_firmAddress">注册地址:</label>
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
                                <label for="J_workAddress">办公地址:</label>
                                <input type="text" id="J_workAddress" name="firmAddress" />
                            </div>
                        </div>
                        <div className="fourth-list fourth-check">
                            <div className="fourth-info">
                                <label for="J_regTel" className="label-big">是否三证合一</label>
                                <div className="select-operate" id="J_selectOperate">
                                    <input name="regTel" type="radio" value="true" checked="checked" id="J_selectTrue" className="select-true" /><span>是</span>
                                    <input name="regTel" type="radio" value="false" id="J_selectFalse" className="select-false" /><span>否</span>
                                </div>
                            </div>
                            <div className="fourth-info fourth-info-last">
                                <label for="J_businessNum">营业执照编号:</label>
                                <input type="text" id="J_businessNum" name="businessNum" />
                                <p className="info-error hidden"></p>
                                <span className="cur-tips" id="J_businessNumCur">*</span>
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
                                <p className="info-error hidden" id="J_taxNumError"></p>
                                <span className="cur-tips">*</span>
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
                        <hr />
                        <div className="fourth-list">
                            <div className="fourth-info">
                                <label for="J_legalName">法人姓名:</label>
                                <input type="text" id="J_legalName" name="legal-name" />
                                <p className="info-error hidden" id="J_legalNameError"></p>
                                <span className="cur-tips" id="J_legalNameCur">*</span>
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
                                <input type="text" id="J_legalID" name="legalID" />
                                <p className="info-error hidden" id="J_legalIDError"></p>
                                <span className="cur-tips" id="J_legalIDCur">*</span>
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
                                <span className="cur-tips" id="J_mobileNumCur">*</span>
                            </div>
                            <div className="fourth-info fourth-info-last">
                                <label for="J_firmEmail">企业邮箱:</label>
                                <input type="text" id="J_firmEmail" name="trueName" />
                                <p className="info-error hidden" id="J_firmEmailError"></p>
                                <span className="cur-tips">*</span>
                            </div>
                        </div>
                        <hr />
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
                        <botton className="step-btn fourth-btn" id="J_fourthInfoBtn">下一步</botton>
                    </div>
                    <div className="content-step identify-common fifth-step disnone" id="J_fifth">
                        <h3>资金存管机构：华瑞银行股份有限公司（简称：华瑞银行）</h3>
                        <div className="user-common fifth-step-one">
                            <label for="J_legalPerson">法人姓名</label>
                            <input type="text" className="read-info" id="J_legalPerson" placeholder="请输入您的真实姓名" name="legalName" maxlength="20" readonly="readonly" />
                        </div>
                        <div className="user-common">
                            <label for="J_legalPersonID">证件号码</label>
                            <input type="text" className="read-info" id="J_legalPersonID" placeholder="请输入您的证件号码" name="legalName" maxlength="20" readonly="readonly" />
                        </div>
                        <div className="user-common">
                            <label for="J_legalPersonNum">手机号码</label>
                            <input type="text" className="read-info" id="J_legalPersonNum" placeholder="请输入您的手机号码" name="legalName" maxlength="11" readonly="readonly" />
                        </div>
                        <div className="user-common">
                            <label for="J_legalFirmName">企业名称</label>
                            <input type="text" className="read-info" id="J_legalFirmName" placeholder="请输入企业名称" name="legalName" maxlength="100" readonly="readonly" />
                        </div>
                        <div className="user-common">
                            <label for="J_legalBank">开户银行</label>
                            <input type="text" className="read-info" id="J_legalBank" placeholder="请输入开户行" name="legalName" maxlength="100" readonly="readonly" />
                        </div>
                        <div className="user-common user-area">
                            <label for="J_legalProvice">省/市</label>
                            <select id="J_legalProvice" className="area-name read-info" disabled="disabled">
                                <option value="100000">请选择省/市</option>
                            </select>
                            <span>市/区</span>
                            <select id="J_legalCity" className="city-name read-info" disabled="disabled">
                                <option value="100000">请选择市/区</option>
                            </select>
                        </div>
                        <div className="user-common disnone" id="J_legalPart">
                            <label for="J_legalOtherBank">开户支行名称</label>
                            <input type="text" className="read-info" id="J_legalOtherBank" placeholder="请输入开户支行" name="legalName" maxlength="100" readonly="readonly" />
                        </div>
                        <div className="user-common">
                            <label for="J_legalBankNumber">基本户账户</label>
                            <input type="text" className="read-info" id="J_legalBankNumber" placeholder="请输入卡号" name="legalName" maxlength="20" readonly="readonly" />
                        </div>
                        <form className="disnone" action="" method="post" id="J_submitFuiou" target="_blank">

                        </form>
                        <div className="user-check">
                            <input type="checkbox" id="J_check" name="check" checked="checked" /><span>我已阅读并同意</span>
                            <a href="/usercenter/company/license.html" target="_blank" id="J_userProtocol">《用户授权协议》</a>
                        </div>
                        <div className="error-tips step1-error hidden" id="J_fifthError">
                        </div>
                        <botton className="step-btn fifth-btn" id="J_openEpository">同意协议并开通存管账户</botton>
                    </div>
                    <div className="content-step show-artificial disnone" id="J_showArtificial">
                        <div className="artificial-cur">
                            <img src={PcBuildUrl + 'img/artificial-check.png'} />
                            <span id="J_showArtificialContent">人工审核中</span>
                        </div>
                    </div>
                </div>
                <div className="dialog-tips disnone" id="J_dialogTips">
                    <div className="content-tips disnone" id="J_openWait">
                        <i className="close"></i>
                        <h4>提示</h4>
                        <p>开户完成前请不要关闭此窗口，完成开户后请根据您的情况点击下面的按钮。</p>
                        <div className="open-btn">
                            <button id="J_applyBtn">已经申请开户</button>
                            <button className="tips-btn" id="J_cancelBtn">暂不开户</button>
                        </div>
                    </div>
                    <div className="content-tips tips-special disnone" id="J_openComplete">
                        <i className="close"></i>
                        <h4>提示</h4>
                        <p id="J_tipsMsg">您已完成存管银行开户</p>
                        <div className="go-to">
                            <button id="J_companyCenter">前往企业中心</button>
                        </div>
                    </div>
                    <div className="content-tips third-dialog disnone" id="J_thirdDialog">
                        <i className="close"></i>
                        <h4>提示</h4>
                        <p>请拨打开户支行客服热线获取联行号，<br />准确的联行号可以提高开户成功率</p>
                    </div>
                </div>
                <Footer PcBuildUrl={PcBuildUrl} globalData={globalData}  />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.CompanyAuthentication
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Authentication);