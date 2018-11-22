require(['base', 'echarts', 'cropper', "trackBase", 'store', 'side', 'juicer', 'companyHeader', 'footer', 'laydate', "dialog",'formValidate','backTop', 'json', 'requirejs'], function ($, echarts, cropper, track, store, side, jui, header, footer, laydate, dialog) {

    header.init();
    footer.init();
$(function () {
if(parseInt($('.g-left').height()) < parseInt($('.g-right').height())){
    $('.g-left').css('min-height',$('.g-right').height() + 'px');
}
var dataUrl ={
    queryUserCompanyInfo:'/userCenter/user/queryUserCompanyInfo',                    //根据Token查询企业信息
    saveUserCompanyInfo:'/userCenter/user/saveUserCompanyInfo',             //企业信息保存接口
    checkEnterpriseEmailIsUnique:'/userCenter/user/checkEnterpriseEmailIsUnique'  //判断邮箱是否已经申请
};

var commonFun = {
    showError:function (dom,msg) {
        $('#'+dom).html(msg);
        $('#'+dom).removeClass('hidden');
    },
    hideError:function (dom) {
        $('#'+dom).addClass('hidden');
    },
    //  防止多次点击
    disabledBtn:function (dom) {
        $('#'+dom).attr('disabled','disabled');
    },
    //    解除点击
    enableBtn:function(dom){
        $('#'+dom).removeAttr('disabled','disabled');
    },
    uploadFile:function (file, dir, success, error){
        // 大于 2MB
        if(file && file.size >= 2097152) return error({message: '请使用小于2MB的文件'});
        var formData = new FormData();

        // add assoc key values, this will be posts values
        formData.append("file", file, file.name);
        formData.append("bizCode", 'COMPANY_AUTHENTICATION');
        formData.append("fileDir", dir);
        $.ajax({
            url:'/fileCenter/files',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                clientId: 'XXD_FRONT_END',
                clientTime: Date.now().valueOf(),
            },
            success: success,
            error: error,
        })
    },
    getLoadFile:function (bizCode,fileIds,success,error){
        // 大于 2MB
        $.ajax({
            url:'/fileCenter/files',
            type: 'GET',
            headers: {
                clientId: 'XXD_FRONT_END',
                clientTime: Date.now().valueOf(),
            },
            data: {fileIds: fileIds, bizCode: bizCode},
            success: success,
            error: error,
        })
    },
    checkEmail:function (emailVal,callback) {
        $.xxdAjax({
            url:dataUrl.checkEnterpriseEmailIsUnique+'?email='+emailVal,
            type:'get',
            clientId: "XXD_FRONT_END",
            token:token,
            data     : {},
            dataType : 'json',
            callbacks:function(result){
                if(result.code=="200000"){
                    if(result.data.code==0){
                        callback && callback(true);
                    }else{
                        callback && callback(false);
                    }
                }else{
                    if(result.code=="200400"){
                        alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                    }
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        })

    }
}

var token = (document.cookie.match(/( |^)Token=([a-zA-Z0-9_\-]+)(;|$)/)||[])[2];
//第四步企业信息录入
var fourth={
    queryCompanyInfo:function (o) {
        $.xxdAjax({
            url:dataUrl.queryUserCompanyInfo+'?token='+token,
            type:'get',
            clientId: "XXD_FRONT_END",
            token:token,
            data     : {},
            dataType : 'json',
            callbacks:function(result){
                if(result.code=="200000"){
                    var dataList;
                    if(result.data.code==0 && (dataList=result.data.data)){
                        o.cb && o.cb(dataList);
                    }
                }else{
                    if(result.code=="200400"){
                        alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                    }
                }
            },
            error:function(){
                float.alert({content:msg.errorMsg});
            }
        })
    },
    showCompanyInfo:function () {
        fourth.queryCompanyInfo({
            cb:function (result) {
                //  公司名
                if(result.companyname){
                    $('#J_firmTitle').val(result.companyname);
                    $('#J_firmTitle').addClass('read-info');
                    $('#J_firmTitle').attr('readonly','readonly');
                    $('#J_firmCur').addClass('hidden');

                }
                //  注册地址（公司地址）
                if(result.registeredaddress){
                    $('#J_firmAddress').val(result.registeredaddress);
                }
                //办公地址
                if(result.companyaddress){
                    $('#J_workAddress').val(result.companyaddress);
                }
                //  注册电话
                if(result.registerphoneno){
                    $('#J_regTel').val(result.registerphoneno);
                }
                //营业执照编码
                if(result.buslicenseno){
                    $('#J_businessNum').val(result.buslicenseno);
                    $('#J_businessNum').addClass('read-info');
                    $('#J_businessNum').attr('readonly','readonly');
                    $('#J_businessNumCur').addClass('hidden');
                }
                //注册时间
                if(result.registrationtime){
                    $('#J_regTime').val(result.registrationtime);
                }
                //股东姓名（必填）
                if(result.shareholdername){
                    $('#J_shareholderName').val(result.shareholdername);
                }else{
                    if(result.comrepname){
                        $('#J_shareholderName').val(result.comrepname);
                    }
                }
                //股东身份证号（必填）
                if(result.shareholdercardid){
                    $('#J_shareholderCardid').val(result.shareholdercardid);
                }else{
                    if(result.comrecardid){
                        $('#J_shareholderCardid').val(result.comrecardid);
                    }
                }
                //注册资本
                if(result.registeredcapital){
                    $('#J_regCapital').val(result.registeredcapital);
                }
                //经营区域
                if(result.managementarea){
                    $('#J_businessArea').val(result.managementarea);
                }
                //实缴资本
                if(result.actualpayment){
                    $('#J_payCapital').val(result.actualpayment);
                }

                // 法人姓名
                if(result.comrepname){
                    $('#J_legalName').val(result.comrepname);
                    $('#J_legalName').addClass('read-info');
                    $('#J_legalName').attr('readonly','readonly');
                    $('#J_legalNameCur').addClass('hidden');
                }
                // 法人身份证号
                if(result.comrecardid){
                    $('#J_legalID').val(result.comrecardid);
                    $('#J_legalID').addClass('read-info');
                    $('#J_legalID').attr('readonly','readonly');
                    $('#J_legalIDCur').addClass('hidden');
                }
                // 法人手机号
                if(result.comrepmobileno){
                    $('#J_mobileNum').val(result.comrepmobileno);
                }
                //是否三证展示
                if(result.isscc=="1"){
                    $('#J_selectTrue').attr('checked','checked');
                    $('#J_falseOperate').addClass('disnone');
                    $('#J_fileFalse').addClass('disnone');
                }else{
                    $('#J_selectFalse').attr('checked','checked');
                    if(result.orginstitutionno){
                        $('#J_organizationNum').val(result.orginstitutionno);
                    }
                    //税务证号
                    if(result.taxregistrationno){
                        $('#J_taxNum').val(result.taxregistrationno);
                    }
                    $('#J_falseOperate').removeClass('disnone');
                    $('#J_fileFalse').removeClass('disnone');
                   //组织机构图片
                    if(result.orginstitutionurl){
                        $('#J_organizationFile').data('pic',result.orginstitutionurl);
                        getFile('[' + result.orginstitutionurl + ']', $('#J_organizationFile'));
                    }
                  // 税务登记证图片
                    if(result.taxregistrationurl){
                        $('#J_taxFile').data('pic',result.orginstitutionurl);
                        getFile('[' + result.taxregistrationurl + ']', $('#J_taxFile'));
                    }

                }
                //常用联系人
                if(result.commonpername){
                    $('#J_trueName').val(result.commonpername);
                }
                //常用联系人手机号
                if(result.commonpermobileno){
                    $('#J_contactNum').val(result.commonpermobileno)
                }
                //企业邮箱
                if(result.commonperemailno){
                    $('#J_firmEmail').val(result.commonperemailno);
                }

                //    公司规模（companySize）
                if(result.companySizeList.length>=1){
                    var oDom='<option value="100000" disabled selected>--请选择--</option>';
                    $.each(result.companySizeList,function(index,item){
                        //参数是否存在
                        if(result.companysize && result.companysize==item.pkey){
                            oDom += ('<option value="' + item.pkey + '" selected>' + item.pvalue + '</option>');
                        }else{
                            oDom += ('<option value="' + item.pkey + '">' + item.pvalue + '</option>');
                        }
                    });
                    $('#J_companyScale').html(oDom);
                }
                //    股东类型
                if(result.shareholderTypeList.length>=1){
                    var oDom='<option value=""  selected>--请选择--</option>';
                    $.each(result.shareholderTypeList,function(index,item){
                        if(result.shareholdertype && result.shareholdertype==item.pkey){
                            oDom += ('<option value="' + item.pkey + '" selected>' + item.pvalue + '</option>');
                        }else{
                            oDom += ('<option value="' + item.pkey + '">' + item.pvalue + '</option>');
                        }
                    });
                    $('#J_shareholderType').html(oDom);
                }
                // 股东证件类型
                if(result.certificatesTypeList.length>=1){
                    var oDom='<option value="100000" disabled selected>--请选择--</option>';
                    $.each(result.certificatesTypeList,function(index,item){
                        if(result.certificatestype && result.certificatestype==item.pkey){
                            oDom += ('<option value="' + item.pkey + '" selected>' + item.pvalue + '</option>');
                        }else{
                            oDom += ('<option value="' + item.pkey + '">' + item.pvalue + '</option>');
                        }
                    });
                    $('#J_shareholderPapers').html(oDom);
                }
                //所属行业
                if(result.companyIndustryList.length>=1){
                    var oDom='<option value="" disabled selected>--请选择--</option>';
                    $.each(result.companyIndustryList,function(index,item){
                        if(result.companyindustry && result.companyindustry==item.pvalue){
                            oDom += ('<option value="' + item.pvalue + '" selected>' + item.pvalue + '</option>');
                        }else{
                            oDom += ('<option value="' + item.pvalue + '">' + item.pvalue + '</option>');
                        }
                    });
                    $('#J_profession').html(oDom);
                }
                if(result.buslicenseurl){
                    $('#J_licenseFile').data('pic',result.buslicenseurl);
                    var buslicenseurl = '[' + result.buslicenseurl + ']';
                    getFile(buslicenseurl, $('#J_licenseFile'));
                }
            }
        })
    },
    loginCompanyInfo:function () {
        var status,result=true,orginStitutionno;
        //注册地址(必)registeredaddress
        var registeredAddr=$.validateTrim($('#J_firmAddress').val());
        if(registeredAddr=="" || registeredAddr=="null"){
            commonFun.showError('J_addrError','注册地址不能为空');
            result=false;
        }else{
            commonFun.hideError('J_addrError');
        }
        //注册电话(必)
        var registerNumber=$.validateTrim($('#J_regTel').val());
        if(registerNumber=="" || registeredAddr=="null"){
            commonFun.showError('J_telError','注册电话不能为空');
            result=false;
        }else{
            if($.validateHomePhone(registerNumber)=='true' || $.validateMobile(registerNumber)=='true'){
                commonFun.hideError('J_telError');
            }else{
                commonFun.showError('J_telError','电话输入格式不正确');
                result=false;
            }
        }
        //办公地址(不校验)companyaddress
        var companyaddress=$.validateTrim($('#J_workAddress').val()) || '';
        // if(companyaddress=="" || companyaddress=="null"){
        //     commonFun.showError('J_workAddressError','办公地址不能为空');
        //     result=false;
        // }else{
        //     commonFun.hideError('J_workAddressError');
        // }
        //三证合一选择否的时候
        //税务登记证编号
        var taxregistrationno=$.validateTrim($('#J_taxNum').val()) || '';
        //组织机构代码图片
        var orginstitutionPic=$('#J_organizationFile').data('pic') || '';
        //税务登记证图片
        var taxregistrationPic=$('#J_taxFile').data('pic') || '';
        if($('#J_selectTrue').is(':checked')){
            status=1;
        }else{
            status=0;
            //税务判别为空
            if(taxregistrationno=="" || taxregistrationno=="null"){
                commonFun.showError('J_taxNumError','税务登记证不能为空');
                result=false;
            }else{
                commonFun.hideError('J_taxNumError');
            }
            //组织机构代码（必填）
            orginStitutionno=$.validateTrim($('#J_organizationNum').val());
            if(orginStitutionno=="" || orginStitutionno=="null"){
                commonFun.showError('J_organizationNumError','组织机构代码证不能为空');
                result=false;
            }else{
                commonFun.hideError('J_organizationNumError');
            }
            if(orginstitutionPic=="" || orginstitutionPic=="null"){
                commonFun.showError('J_organizationFileError','请上传组织机构图片');
                result=false;
            }else{
                commonFun.hideError('J_organizationFileError');
            }
            if(taxregistrationPic=="" || taxregistrationPic=="null"){
                commonFun.showError('J_taxFileError','请上传税务登记证图片');
                result=false;
            }else{
                commonFun.hideError('J_taxFileError');
            }
        }
        //公司规模(必)
        var companysize=$('#J_companyScale option:selected').val();
        if(companysize=="100000"){
            commonFun.showError('J_companyError','公司规模不能为空');
            result=false;
        }else{
            commonFun.hideError('J_companyError');
        }

        //注册时间(必)
        var registerTime=$('#J_regTime').val();
        if(registerTime=="" || registerTime=="null"){
            commonFun.showError('J_regTimeError','注册时间不能为空');
            result=false
        }else{
            commonFun.hideError('J_regTimeError');
        }
        //股东姓名(必填)
        var shareholdername=$.validateTrim($('#J_shareholderName').val()) || '';
        if(shareholdername=="" || shareholdername=="null"){
            commonFun.showError('J_shareholderError','股东姓名不能为空');
            result=false
        }else{
            commonFun.hideError('J_shareholderError');
        }
        // 注册资本(必)
        var registeredcapital=$('#J_regCapital').val();
        if(registeredcapital=="" || registeredcapital=="null"){
            commonFun.showError('J_regCapitalError','注册资本不能为空');
            result=false
        }else{
            commonFun.hideError('J_regCapitalError');
        }
        //股东类型
        var shareholdertype=$('#J_shareholderType option:selected').val();
        //经营区域
        var managementarea=$.validateTrim($('#J_businessArea').val());
        //股东证件类型（必填）
        var certificatestype=$('#J_shareholderPapers option:selected').val();
        if(certificatestype=="100000"){
            commonFun.showError('J_shareholderPapersError','请选择股东证件类型');
            result=false
        }else{
            commonFun.hideError('J_shareholderPapersError');
        }
        //实缴资本(必)
        var actualpayment=$.validateTrim($('#J_payCapital').val());
        if(actualpayment=="" || actualpayment=="null"){
            commonFun.showError('J_payCapitalError','实缴资本不能为空');
            result=false;
        }else{
            commonFun.hideError('J_payCapitalError');
        }
        //股东身份证号（必填）
        var shareholderCardid=$.validateTrim($('#J_shareholderCardid').val());
        if(shareholderCardid=="" || shareholderCardid=="null"){
            commonFun.showError('J_shareholderCardidError','股东身份证号不能为空');
            result=false;
        }else{
            commonFun.hideError('J_shareholderCardidError');
        }
        //所属行业(必选)
        var companyindustry=$('#J_profession option:selected').val();
        if(companyindustry==""){
            commonFun.showError('J_professionError','请选择所属行业');
            result=false;
        }else{
            commonFun.hideError('J_professionError');
        }
        //法人姓名
        var legalName=$.validateTrim($('#J_legalName').val());
        if(legalName=="" || legalName=="null"){
            commonFun.showError('J_legalNameError','法人姓名不能为空');
            result=false;
        }else{
            commonFun.hideError('J_legalNameError');
        }
        //法人身份证号
        var legalID=$.validateTrim($('#J_legalID').val());
        if(legalID=="" || legalID=="null"){
            commonFun.showError('J_legalIDError','法人身份证号不能为空');
            result=false;
        }else{
            commonFun.hideError('J_legalIDError');
        }
        //常用联系人姓名(必)
        var commonpername=$.validateTrim($('#J_trueName').val());
        if(commonpername=="" || commonpername=="null"){
            commonFun.showError('J_trueNameError','常用联系人不能为空');
            result=false;
        }else{
            commonFun.hideError('J_trueNameError');
        }

        //常用联系人手机(必)
        var commonpermobileno=$.validateTrim($('#J_contactNum').val());
        if(commonpermobileno=="" || commonpermobileno=="null"){
            commonFun.showError('J_contactNumError','常用联系人手机不能为空');
            result=false;
        }else{
            if($.validateMobile(commonpermobileno)=='true'){
                commonFun.hideError('J_contactNumError');
            }else{
                commonFun.showError('J_contactNumError',$.validateMobile(commonpermobileno));
                result=false;
            }

        }

        //法人手机号(必)
        var comrepmobileno=$.validateTrim($('#J_mobileNum').val());
        if(comrepmobileno=="" || comrepmobileno=="null"){
            commonFun.showError('J_mobileNumError','法人手机号不能为空');
            result=false;
        }else{
            if($.validateMobile(comrepmobileno)=='true'){
                commonFun.hideError('J_mobileNumError');
            }else{
                commonFun.showError('J_mobileNumError',$.validateMobile(comrepmobileno));
                result=false;
            }

        }
        //企业邮箱(必)
        var commonperemailno=$.validateTrim($('#J_firmEmail').val());
        if(commonperemailno=="" || commonperemailno=="null"){
            commonFun.showError('J_firmEmailError','企业邮箱不能为空');
            result=false;
        }else{
            if($.validateEmail(commonperemailno)=='true'){
                commonFun.checkEmail(commonperemailno,function (data) {
                    if(data==true){
                        commonFun.hideError('J_firmEmailError');
                    }else{
                        commonFun.showError('J_firmEmailError','已存在相同邮箱');
                        result=false;
                    }
                });
            }else{
                commonFun.showError('J_firmEmailError',$.validateEmail(commonperemailno));
                result=false;
            }

        }
        //营业执照副本图片(必)
        var buslicensePic=$('#J_licenseFile').data('pic');
        if(buslicensePic=="" || buslicensePic=="null"){
            commonFun.showError('J_licenseFileError','请上传营业执照副本照片');
            result=false;
        }else{
            commonFun.hideError('J_licenseFileError');
        }

        if(result){
            commonFun.disabledBtn('J_infoSubmit');
            var submitData={"data":{"comrepmobileno":comrepmobileno,"registeredaddress":registeredAddr,"registerphoneno":registerNumber,"companyaddress":companyaddress,"isscc":status,"orginstitutionno":orginStitutionno,"taxregistrationno":taxregistrationno,"companysize":companysize,"registrationtime":registerTime,"shareholdername":shareholdername,"registeredcapital":registeredcapital,"shareholdertype":shareholdertype,"managementarea":managementarea,"certificatestype":certificatestype,"actualpayment":actualpayment,"shareholdercardid":shareholderCardid,"companyindustry":companyindustry,"commonpername":commonpername,"commonpermobileno":commonpermobileno,"commonperemailno":commonperemailno,"buslicenseurl":buslicensePic,"orginstitutionurl":orginstitutionPic,"taxregistrationurl":taxregistrationPic}};
            $.xxdAjax({
                url:dataUrl.saveUserCompanyInfo,
                type:'post',
                clientId: "XXD_FRONT_END",
                token:token,
                data     : JSON.stringify(submitData),
                dataType : 'json',
                callbacks:function(result){
                    if(result.code=="200000"){
                        if(result.data.code==0){
                            alert('保存成功');
                        }else{
                            alert(result.data.message);
                        }
                        commonFun.enableBtn('J_infoSubmit');
                    }else{
                        alert('提交失败，请稍后重试！');
                        commonFun.enableBtn('J_infoSubmit');
                    }
                },
                error:function(){
                    alert('网络异常，请刷新重试');
                    commonFun.enableBtn('J_infoSubmit');
                }
            })

        }

    }

};
fourth.showCompanyInfo();
$('#J_infoSubmit').on('click', function(){
    fourth.loginCompanyInfo();
});
 //第四步提交企业信息
//是否三证合一
$("#J_selectOperate input").on('click',function(){
    if($('#J_selectTrue').is(':checked')){
        $('#J_falseOperate').addClass('disnone');
        $('#J_fileFalse').addClass('disnone');
    }else{
        $('#J_falseOperate').removeClass('disnone');
        $('#J_fileFalse').removeClass('disnone');
    }
});
//第四步显示时间
laydate.render({
    elem: '#J_regTime', //指定元素
    trigger: 'click'
});
function getFile(arr,dom) {
    commonFun.getLoadFile('COMPANY_AUTHENTICATION',arr,function (result) {
        if(result.data.items && result.data.items[0].fileId){
           dom.parent().find('p').html(result.data.items[0].fileName);
        }
    },function (error) {
        alert(error.message || '网络异常，请重试！');
    })
}

//第四部上传图片
$('.file-upload').on('change','input',function (e) {
    handleUploadFile(e.target.files[0],'companySaveInfo',$(this));
});
    function handleUploadFile(file,dir,$domTarget) {
        if(!/image/.test(file.type)) return alert('请选择图片');
        commonFun.uploadFile(file,dir,function (data) {
                $domTarget.data('pic',data.data.fileId);
                $domTarget.parent().find('p').html(file.name);
            },
            function (error) {
                alert(error.message || '图片上传失败，请重新选择');
            });
    }
});
}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

