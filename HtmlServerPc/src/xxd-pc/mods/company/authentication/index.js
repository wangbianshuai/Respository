/**
 * Created by gaoshanshan_syp on 28/02/2018.
 */
require(['base', "trackBase", 'float','store','companyHeader','footer','laydate',"dialog", 'formValidate','json', "requirejs"], function ($,  track,float,store,header,footer, laydate,dialog) {

    var dataUrl={
        doCompanyRealname:'/userCenter/companyRealname/doCompanyRealname',                       //实名认证自动认证接口
        doManualCompanyRealname:'/userCenter/companyRealname/doManualCompanyRealname',           //实名人工审核接口
        autoCompanyAppro :'/userCenter/company/autoCompanyAppro',               //企业系统自动认证接口
        manualCompanyAppro:'/userCenter/company/manualCompanyAppro',                       //企业人工认证接口
        imagePathUrl:'/fileCenter/files',                                         //上传图片以及获取图片
        // 检查银行卡号是否已使用
        checkBankNotIsUse: '/userCenter/company/bank/checkBankNoIsUse',
        autoCompanyBankAppro:'/userCenter/company/bank/autoCompanyBankAppro',   //企业银行卡系统自动认证接口
        manualCompanyBankAppro:'/userCenter/company/bank/manualCompanyBankAppro', //企业银行卡人工审核认证接口
        queryUserCompanyInfo:'/userCenter/user/queryUserCompanyInfo',                    //根据Token查询企业信息
        saveUserCompanyInfo:'/userCenter/user/saveUserCompanyInfo',             //企业信息保存接口

        fuiouDicCities:'/userCenter/user/bank/fuiouDicCities',
        fuiouDicProvinces:'/userCenter/user/bank/fuiouDicProvinces',
        fuiouCompanySupportedBanks: '/userCenter/user/bank/fuiouCompanySupportedBanks',
        fuiouSupportedBanks:'/userCenter/user/bank/fuiouSupportedBanks',
        enterpriseOpenAcntProgressQuery:'/userCenter/user/enterpriseCapitalAccountV2/enterpriseOpenAcntProgressQuery/staticPc',//进程接口
        // openFuiouOpenAccountPage:'/userCenter/user/enterpriseCapitalAccount/openFuiouOpenAccountPage/staticPc'    //开通存管获取信息

        openFuiouOpenAccountPage:'/userCenter/user/enterpriseCapitalAccountV2/openFuiouOpenAccountPage/staticPc',    //开通存管获取信息
        checkEnterpriseEmailIsUnique:'/userCenter/user/checkEnterpriseEmailIsUnique', //判断邮箱是否已经申请
        getBranchInfoByBranchCode:'/userCenter/company/bank/getBranchInfoByBranchCode',

    };
    //头部和尾部
    header.init();
    footer.init();
    var msg={
        errorMsg:'网络异常，请刷新重试'
    };
    var token=(document.cookie.match(/( |^)Token=([a-zA-Z0-9_\-]+)(;|$)/)||[])[2],OpenAccount=0;

    // 为true 时不能切换回自动审核
    var bankFallbackFlag = false,autoSelect=false;

    //公共方法
    var commonFun={
        //  认证步数
        showStep:function (step,callback) {
            commonFun.showInfo(step);
            if(step !== 'first') {
                var arr = ['second', 'third', 'fourth', 'fifth' ];
                for(var i = 0; i < arr.length; ++i) {
                    $('#' + arr[i] ).addClass('highlight');
                    if(arr[i] === step) break;
                }
            }
            $('.content-step').addClass('disnone');
            $('#J_'+step).removeClass('disnone');
            if(callback){
                callback();
            }
        },
        //步骤信息
        showInfo:function(step){
            switch(step){
                case 'first':
                    $('#J_showStepInfo').html('法人实名认证');
                    break;
                case 'second':
                    $('#J_showStepInfo').html('企业认证');
                    break;
                case 'third':
                    $('#J_showStepInfo').html('对公户信息');
                    break;
                case 'fourth':
                    $('#J_showStepInfo').html('企业信息');
                    break;
                case 'fifth':
                    $('#J_showStepInfo').html('存管开户');
                    break;
            }

        },
        //显示人工审核
        showArtificial:function (dom1,dom2) {
            $('#'+dom1).addClass('disnone');
            $('#'+dom2).removeClass('disnone');
        },
        //   错误信息显示
        showError:function (dom,msg) {
            $('#'+dom).html('');
            $('#'+dom).html(msg);
            $('#'+dom).removeClass('hidden');
        },
        hideError:function (dom) {
            $('#'+dom).addClass('hidden');
            $('#'+dom).html('');
        },
        //  防止多次点击
        disabledBtn:function (dom) {
            $('#'+dom).attr('disabled','disabled');
            $('#'+dom).html('认证中');
            $('#'+dom).addClass('step-special');
        },
        //    解除点击
        enableBtn:function(dom){
            $('#'+dom).removeAttr('disabled','disabled');
            $('#'+dom).html('下一步');
            $('#'+dom).removeClass('step-special');
        },
        //   是否上传三证
        isUpload:function (domRadio,domStep1,domStep2) {
            if($('#'+domRadio).is(':checked')){
                $('#'+domStep1).removeClass('disnone');
                $('#'+domStep2).addClass('disnone');
            }else{
                $('#'+domStep1).addClass('disnone');
                $('#'+domStep2).removeClass('disnone');
            }
        },
        //展示审核状态
        showCheckStatus:function (id,content) {
            $('.content-step').addClass('disnone');
            $('#'+id).removeClass('disnone');
            $('#'+id).find('span').html(content);
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
        myAjax: function (params) {
            params.headers = params.headers || {};
            params.headers.clientId = params.headers.clientId || 'XXD_FRONT_END';
            params.headers.clientTime = Date.now().valueOf();
            var success = params.success;
            params.success = function(data) {
                switch (data.code) {
                    case '200000':{
                        success(data.data)
                        break;
                    }
                    case '200400': {
                        alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                        break;
                    }
                    case '200301':
                    case '200302':
                    case '200303':
                    case '200304':
                    case '200305': {
                        alert('登录状态异常，请重新登录！');
                        window.location.href = 'login.html';
                        break;
                    }
                    default:
                        alert(data.message);
                        break;
                }
            }
            return $.ajax(params);
        },
        getCity:function (provinceCode,callback) {
            commonFun.myAjax({
                url: dataUrl.fuiouDicCities,
                type: 'GET',
                data: {provinceCode:provinceCode},
                success: function(data) {
                  callback && callback(data);
                },
                error:function(){
                    alert('网络异常，请重试！');
                    return false;
                }
            });

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

    };
    var fileInput = document.getElementById('upload-bank');
    var $bankUpload = $('#bank-upload');

    var stepData3 = {
        comBankNo: '',
        comBankName: '',
        comBankCode: '',
        provinceCode: '',
        cityCode:'',
        comBranchName:''
    };
    var citiesCache = {};
    var linkBankNum='';
    //    企业信息
    var companyName={
        show:function (callback) {
            $.xxdAjax({
                url:dataUrl.queryUserCompanyInfo,
                type:'get',
                clientId: "XXD_FRONT_END",
                token:token,
                data     : {},
                dataType : 'json',
                callbacks:function(result){
                    if(result.code=="200000"){
                        if(result.data.code==0){
                            if(result.data.data && result.data.data.companyname){
                                callback && callback(result.data.data.companyname);
                            }
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

    };

    function initBank() {

        // 获取银行列表
        var ajax = commonFun.myAjax;
        ajax({
            url:dataUrl.fuiouCompanySupportedBanks,
            type:'GET',
            success: function(data) {
                var html = '<option value="" disabled selected>请选择银行</option>'
                data.forEach(function(item) {
                    html += ('<option value="' + item.code + '">' + item.name + '</option>');
                });
                $('#J_selectBank,#J_select2Bank').html(html);
            }
        });

        // 获取省市列表
        ajax({
            url:dataUrl.fuiouDicProvinces,
            type:'get',
            success: function(data) {
                var html = '<option value="" disabled selected>请选择省/市</option>'
                if(data.code === 0 && data.data){
                    data.data.forEach(function(item) {
                        html += ('<option value="' + item.provinceCode + '">' + item.provinceName + '</option>');
                    });
                }
                $('#J_provinceNum,#J_province2Num').html(html);
            }
        });
    }
    function manualBankStep() {
        $('#J_third > .step1').addClass('disnone');
        $('#J_third > .step2').removeClass('disnone');
        $('#J_link2Bank').val(linkBankNum);
        $('#J_select2Bank').val(stepData3.comBankName);
        $('#J_province2Num').val(stepData3.province);
        $('#J_city2Num').val(stepData3.city);
        $('#J_bank2Num').val(stepData3.comBankNo);
        $('#branch-bank-name').val(stepData3.comBranchName);
    }
    function autoBankStep() {
        $('#J_third > .step2').addClass('disnone');
        $('#J_third > .step1').removeClass('disnone');
        $('#J_linkBank').val(linkBankNum);
        $('#J_selectBank').val(stepData3.comBankName);
        $('#J_provinceNum').val(stepData3.province);
        $('#J_cityNum').val(stepData3.city);
        $('#J_bankNum').val(stepData3.comBankNo);
        $('#J_branchBank').val(stepData3.comBranchName);
    }
// 进度
    commonFun.myAjax({
        url: dataUrl.enterpriseOpenAcntProgressQuery,
        type: 'POST',
        headers: {
            token: token,
        },
        success: function (data) {
            // 1.实名认证
            var companyRealNameApproStatus = data.data.companyRealNameApproStatus;
            var companyRealNameApproFailedTimes = data.data.companyRealNameApproFailedTimes;

            // 2.企业认证
            var companyApproStatus = data.data.companyApproStatus;
            var companyApproFailedTimes = data.data.companyApproFailedTimes;

            // 3.银行卡认证
            var companyBankApproStatus = data.data.companyBankApproStatus;
            var companyBankApproFailedTimes = data.data.companyBankApproFailedTimes;

            // 4.企业信息录入
            var companyInfoEntryCompleted = data.data.companyInfoEntryCompleted;

            // 5.存管开户
            var companyUserOpenAccountCompletedStatus = data.data.companyUserOpenAccountCompletedStatus;

            // 1.实名认证
            if (companyRealNameApproStatus !== '1') {
                commonFun.showStep('first');
                if (companyRealNameApproStatus === '5') {
                    //  审核中
                    commonFun.showCheckStatus('J_showArtificial', '法人实名认证审核中');
                    return;
                }
                // 2, 3, 4
                if (companyRealNameApproFailedTimes >= 3){
                    // 跳转人工审核
                    commonFun.showArtificial('J_realNameStep1', 'J_realNameStep2');
                    return;
                }
                if (companyRealNameApproFailedTimes > 0){
                    // 显示人工审核按钮
                    $('#J_realNameArtificial').removeClass('hidden');
                    return;
                }
                // companyRealNameApproFailedTimes < 3 自动审核
                return;
            }
            // 2. 企业认证
            if (companyApproStatus !== '1') {
                commonFun.showStep('second');
                if (companyApproStatus === '5') {
                    // 审核中
                    commonFun.showCheckStatus('J_showArtificial', '企业认证审核中');
                    return;
                }
                // 2, 3, 4
                if (companyApproFailedTimes >= 3){
                    // 跳转人工审核
                    commonFun.showArtificial('J_secondStep1','J_secondStep2');
                    return;
                }
                if (companyApproFailedTimes > 0){
                    // 显示人工审核按钮
                    $('#J_stepFirmArtificial').removeClass('hidden');
                    return;
                }
                // companyApproFailedTimes < 3 自动审核
                return;
            }
            // 3. 银行卡认证
            if (companyBankApproStatus !== '1') {
                commonFun.showStep('third');
                // initBank();
                if (companyBankApproStatus === '5') {
                    // 审核中
                    commonFun.showCheckStatus('J_showArtificial', '对公户信息认证审核中');
                    return;
                }
                // 2, 3, 4
                if (companyBankApproFailedTimes >= 3){
                    // 跳转人工审核
                    bankFallbackFlag = true;
                    $('#J_thirdStep1').addClass('disnone');
                    $('#J_thirdStep2').removeClass('disnone');
                    return;
                }
                if (companyBankApproFailedTimes > 0){
                    //   显示人工审核按钮
                    $('#J_stepBankArtificial').removeClass('disnone');
                    return;
                }
                // companyBankApproFailedTimes < 3 自动审核
                return;
            }
            // 4.企业信息录入
            if (companyInfoEntryCompleted !== 1) {
                // companyInfoEntryCompleted === 0
                // 企业信息录入页面
                commonFun.showStep('fourth',function () {
                    fourth.showCompanyInfo();
                });
                return;
            }
            // 5. 存管开户
            switch (companyUserOpenAccountCompletedStatus) {

                case 0: {
                    commonFun.showStep('fifth',function () {
                        fifth.showDetailInfo();
                    });
                    //    待开户
                    $('#J_dialogTips').removeClass('disnone');
                    $('#J_openWait').removeClass('disnone');
                    break;
                }
                case 1: {
                    // 开户成功
                    commonFun.showStep('fifth',function () {
                        fifth.showDetailInfo();
                    });
                    $('#J_tipsMsg').html('您已完成存管银行开户');
                    $('#J_companyCenter').html('前往企业中心');
                    $('#J_dialogTips').removeClass('disnone');
                    $('#J_openComplete').removeClass('disnone');
                    OpenAccount=1;
                    break;
                }
                case 2: {
                    commonFun.showStep('fifth',function () {
                        fifth.showDetailInfo();
                    });
                    //    开户失败
                    var info=getQueryString();
                    if(info!=0 && (info.errorTitle || info.errorMsg)){
                        if(info.errorTitle){
                            if(info.errorMsg){
                                $('#J_tipsMsg').html(info.errorTitle+info.errorMsg);
                            }else{
                                $('#J_tipsMsg').html(info.errorTitle);
                            }
                        }else{
                            if(info.errorMsg){
                                $('#J_tipsMsg').html(info.errorMsg);
                            }
                        }
                    }else{
                        $('#J_tipsMsg').html("存管银行开户失败");
                    }
                    $('#J_companyCenter').html('确定');
                    $('#J_dialogTips').removeClass('disnone');
                    $('#J_openComplete').removeClass('disnone');
                    break;
                }
                case 3: {
                    // 审核中
                    commonFun.showStep('fifth');
                    commonFun.showCheckStatus('J_showArtificial', '存管开户审核中');
                    break;
                }
                default: {
                    // 0/2/4
                    // 开户页面
                    commonFun.showStep('fifth',function () {
                        fifth.showDetailInfo();
                    });
                    break;
                }
            }

        }
    });

//第一步实名认证
    var firstStep={
        enterJudge:function (userName,Idnumber) {
            if(userName=='' || userName=="null"){
                commonFun.showError('J_firstStep1Error','请输入法人真实姓名');
                return false;
            }
            if(Idnumber=='' || Idnumber=="null"){
                commonFun.showError('J_firstStep1Error','请输入法人身份证号码');
                return false;
            }
            return true;
        },
        enterPeopleJudge:function (userName,Idnumber,pic1,pic2) {
            if(userName=='' || userName=="null"){
                commonFun.showError('J_firstStep2Error','请输入法人真实姓名');
                return false;
            }
            if(Idnumber=='' || Idnumber=="null"){
                commonFun.showError('J_firstStep2Error','请输入法人身份证号码');
                return false;
            }
            if(pic1==''){
                commonFun.showError('J_firstStep2Error','请上传法人身份证正面照片');
                return false;
            }
            if(pic2==''){
                commonFun.showError('J_firstStep2Error','请上传法人身份证反面照片');
                return false;
            }
            return true;
        },
        autoRealNameData:function () {
            var userName=$.validateTrim($('#J_userName').val());
            var Idnumber=$.validateTrim($('#J_IDNumber').val());
            var type=1;  //证件类型 1身份证
            var submitData={"data":{"realName":userName,"idCardNumber":Idnumber,"cardType":type}};
            if(firstStep.enterJudge(userName,Idnumber)){
                commonFun.disabledBtn('J_step1RealBtn');
                commonFun.hideError('J_firstStep1Error');
                $.xxdAjax({
                    url:dataUrl.doCompanyRealname,
                    type:'post',
                    clientId: "XXD_FRONT_END",
                    token:token,
                    data     : JSON.stringify(submitData),
                    dataType : 'json',
                    callbacks:function(result){
                        if(result.code=="200000"){
                            if(result.data.code==0){
                                commonFun.showStep('second');
                                commonFun.enableBtn('J_step1RealBtn');
                            }else if(result.data.code==-4){
                                //认证失败超过三次
                                $('#J_userNameArty').val(userName);
                                $('#J_IDNumberArty').val(Idnumber);
                                commonFun.showArtificial('J_realNameStep1','J_realNameStep2');
                                commonFun.enableBtn('J_step1RealBtn');
                            }else{
                                commonFun.showError('J_firstStep1Error',result.data.message);
                                $('#J_realNameArtificial').removeClass('hidden');
                                commonFun.enableBtn('J_step1RealBtn');
                            }
                        }else{
                            if(result.code=="200400"){
                                alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                            }
                            commonFun.enableBtn('J_step1RealBtn');
                        }
                    },
                    error:function(){
                        float.alert({content:msg.errorMsg});
                        commonFun.enableBtn('J_step1RealBtn');
                    }
                })
            }
        },
        //人工审核
        manualRealNameData:function () {
            var userName=$.validateTrim($('#J_userNameArty').val());
            var IDNumber=$.validateTrim($('#J_IDNumberArty').val());
            var positivePicID,negativePicID;
            positivePicID=$('#J_realUploadFile1').data('pic') || '';
            negativePicID=$('#J_realUploadFile2').data('pic') || '';
            var cardType=1;  //身份类别
            var  submitData={"data":{"realName":userName,"idCardNumber":IDNumber,"cardType":cardType,"positivePicID":positivePicID,"negativePicID":negativePicID}};
            if(firstStep.enterPeopleJudge(userName,IDNumber,positivePicID,negativePicID)) {
                commonFun.disabledBtn('J_step2RealBtn');
                commonFun.hideError('J_firstStep2Error');
                $.xxdAjax({
                    url: dataUrl.doManualCompanyRealname,
                    type: 'post',
                    clientId: "XXD_FRONT_END",
                    token: token,
                    data: JSON.stringify(submitData),
                    dataType: 'json',
                    callbacks: function (result) {
                        if (result.code == "200000") {
                            if (result.data.code == 0) {
                                commonFun.showCheckStatus('J_showArtificial', '法人实名认证审核中');
                                commonFun.enableBtn('J_step2RealBtn');
                            } else {
                                commonFun.showError('J_firstStep2Error', result.data.message);
                                commonFun.enableBtn('J_step2RealBtn');
                            }
                        } else {
                            if (result.code == "200400") {
                                alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                            }
                            commonFun.enableBtn('J_step2RealBtn');
                        }
                    },
                    error: function () {
                        float.alert({content: '网络异常，请刷新重试'});
                        commonFun.enableBtn('J_step2RealBtn');
                    }
                })
            }
        }

    };
//第二步骤企业认证
    var secondStep={
        enterJudge:function(compamyName,companyId){
            if(compamyName=='' || compamyName=="null"){
                commonFun.showError('J_secondStep1Error','请输入企业名称');
                return false;
            }
            if(companyId=='' || companyId=="null"){
                commonFun.showError('J_secondStep1Error','请输入您的注册号或统一企业信用代码');
                return false;
            }
            return true;
        },
        enterCompanyJudge:function (compamyName,companyId,buslicensePic,orginstitutionPic,taxregistrationPic) {
            if(compamyName=='' || compamyName=="null"){
                commonFun.showError('J_secondStep2Error','请输入企业名称');
                return false;
            }
            if(companyId=='' || companyId=="null"){
                commonFun.showError('J_secondStep2Error','请输入您的注册号或统一企业信用代码');
                return false;
            }
            if(buslicensePic=='' || buslicensePic=="null"){
                commonFun.showError('J_secondStep2Error','请上传营业执照');
                return false;
            }
            if($('#J_firmUploadFalse').is(':checked')){
                if(orginstitutionPic=='' || orginstitutionPic=="null"){
                    commonFun.showError('J_secondStep2Error','请上传组织机构代码证');
                    return false;
                }
                if(taxregistrationPic=='' || taxregistrationPic=="null"){
                    commonFun.showError('J_secondStep2Error','请上传税务证');
                    return false;
                }
            }
            return true;
        },
        autoSubmitData:function () {
            var compamyName=$.validateTrim($('#J_firmName').val());
            var companyId=$.validateTrim($('#J_firmId').val());
            var submitData={"data":{"companyName":compamyName,"buslicenseno":companyId}};
            if(secondStep.enterJudge(compamyName,companyId)){
                commonFun.disabledBtn('J_step1FirmBtn');
                commonFun.hideError('J_secondStep1Error');
                $.xxdAjax({
                    url:dataUrl.autoCompanyAppro,
                    type:'post',
                    clientId: "XXD_FRONT_END",
                    token:token,
                    data     : JSON.stringify(submitData),
                    dataType : 'json',
                    callbacks:function(result){
                        if(result.code=="200000"){
                            if(result.data.code==0){
                                commonFun.showStep('third');
                                // 初始化银行和省市信息
                                // initBank();
                                commonFun.enableBtn('J_step1FirmBtn');
                            }else if(result.data.code==-4){
                                $('#J_firmNameArty').val(compamyName);
                                $('#J_firmIdArty').val(companyId);
                                commonFun.showArtificial('J_secondStep1','J_secondStep2');
                                commonFun.enableBtn('J_step1FirmBtn');
                            }else{
                                commonFun.showError('J_secondStep1Error',result.data.message);
                                $('#J_stepFirmArtificial').removeClass('hidden');
                                commonFun.enableBtn('J_step1FirmBtn');
                            }
                        }else{
                            if(result.code=="200400"){
                                alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                            }
                            commonFun.enableBtn('J_step1FirmBtn');
                        }
                    },
                    error:function(){
                        float.alert({content:'网络异常，请刷新重试'});
                        commonFun.enableBtn('J_step1FirmBtn');
                    }
                })
            }
        },
        manualCompanyData:function () {
            var compamyName=$.validateTrim($('#J_firmNameArty').val());
            var companyId=$.validateTrim($('#J_firmIdArty').val());
            var buslicensePic,orginstitutionPic,taxregistrationPic;
            if($('#J_firmUploadTrue').is(':checked')){
                buslicensePic=$('#J_firmUploadFile1').data('pic') || '';
            }else {
                buslicensePic=$('#J_firmUploadFile2').data('pic') || '';
            }
            orginstitutionPic=$('#J_firmUploadFile3').data('pic') || '';
            taxregistrationPic=$('#J_firmUploadFile4').data('pic') || '';
            var submitData={"data":{"companyName":compamyName,"buslicenseno":companyId,"buslicense_pic":buslicensePic,"orginstitution_pic":orginstitutionPic,"taxregistration_pic":taxregistrationPic}};
            if(secondStep.enterCompanyJudge(compamyName,companyId,buslicensePic,orginstitutionPic,taxregistrationPic)){
                commonFun.disabledBtn('J_step2FirmBtn');
                commonFun.hideError('J_secondStep2Error');
                $.xxdAjax({
                    url:dataUrl.manualCompanyAppro,
                    type:'post',
                    clientId: "XXD_FRONT_END",
                    token:token,
                    data     : JSON.stringify(submitData),
                    dataType : 'json',
                    callbacks:function(result){
                        if(result.code=="200000"){
                            if(result.data.code==0){
                                commonFun.showCheckStatus('J_showArtificial','企业认证审核中');
                                commonFun.enableBtn('J_step2FirmBtn');
                            }else{
                                commonFun.showError('J_secondStep2Error',result.data.message);
                                commonFun.enableBtn('J_step2FirmBtn');
                            }
                        }else{
                            if(result.code=="200400"){
                                alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                            }
                            commonFun.enableBtn('J_step2FirmBtn');
                        }
                    },
                    error:function(){
                        float.alert({content:'网络异常，请刷新重试'});
                        commonFun.enableBtn('J_step2FirmBtn');
                    }
                })
            }
        }

    };
//第三步 对公户信息
    var third={
        otherBanks:function (BankCode) {
            if(BankCode){
                if (BankCode  === '0313' || BankCode  === '0314' || BankCode  === '0402') {
                    manualBankStep();
                } else {
                    if(!bankFallbackFlag) autoBankStep();
                }
            }
        },
        selectBankNum:function(branchCode,o){
            $.xxdAjax({
                url:dataUrl.getBranchInfoByBranchCode+'?branchCode='+branchCode,
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
                        }else if(result.data.code===-2){
                            if(autoSelect){
                                $('#J_bankNumError').html(result.data.message).removeClass('hidden');
                            }else{
                                // //人工认证
                                // if(!bankFallbackFlag){
                                //     $('#J_thirdStep1').removeClass('disnone');
                                //     $('#J_thirdStep2').addClass('disnone');
                                //     $('#J_linkBank').val(linkBankNum);
                                // }
                                $('#J_BankError').html(result.data.message).removeClass('hidden');
                            }
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
        selectBankInfo:function(branchCode){
            third.selectBankNum(branchCode,{
                cb:function (result) {
                    if(result.provinceCode && result.province){
                        $('#J_provinceNum').val(result.province);
                        stepData3.provinceCode=result.provinceCode;
                        stepData3.province=result.province;
                    }
                    if(result.cityCode && result.city){
                        $('#J_cityNum').val(result.city);
                        stepData3.cityCode=result.cityCode;
                        stepData3.city=result.city;
                    }
                    if(result.branchName){
                        $('#J_branchBank').val(result.branchName);
                        stepData3.comBranchName=result.branchName;
                    }
                    if(result.bankCode && result.bankName){
                        $('#J_selectBank').val(result.bankName);
                        stepData3.comBankCode=result.bankCode;
                        stepData3.comBankName=result.bankName;
                        third.otherBanks(stepData3.comBankCode);
                    }

                }

            })
        },
        select2BankInfo:function(branchCode){
            third.selectBankNum(branchCode,{
                cb:function (result) {
                    if(result.provinceCode && result.province){
                        $('#J_province2Num').val(result.province);
                        stepData3.provinceCode=result.provinceCode;
                        stepData3.province=result.province;
                    }
                    if(result.cityCode && result.city){
                        $('#J_city2Num').val(result.city);
                        stepData3.cityCode=result.cityCode;
                        stepData3.city=result.city;
                    }
                    if(result.branchName){
                        $('#branch-bank-name').val(result.branchName);
                        stepData3.comBranchName=result.branchName;
                    }
                    if(result.bankCode && result.bankName){
                        $('#J_select2Bank').val(result.bankName);
                        stepData3.comBankCode=result.bankCode;
                        stepData3.comBankName=result.bankName;
                        third.otherBanks(stepData3.comBankCode);
                    }
                }

            })
        }
    };
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
                    //股东姓名
                    if(result.shareholdername){
                        $('#J_shareholderName').val(result.shareholdername);
                    }else{
                        if(result.comrepname){
                            $('#J_shareholderName').val(result.comrepname);
                        }
                    }
                    //股东身份证号
                    if(result.shareholdercardid){
                        $('#J_shareholderCardid').val(result.shareholdercardid);
                    }else{
                        if(result.comrecardid){
                            $('#J_shareholderCardid').val(result.comrecardid);
                        }
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
                    //    公司规模
                    if(result.companySizeList.length>=1){
                        var oDom='<option value="100000" disabled selected>--请选择--</option>';
                        $.each(result.companySizeList,function(index,item){
                            oDom += ('<option value="' + item.pkey + '">' + item.pvalue + '</option>');
                        });
                        $('#J_companyScale').html(oDom);
                    }
                    //    股东类型
                    if(result.shareholderTypeList.length>=1){
                        var oDom='<option value=""  selected>--请选择--</option>';
                        $.each(result.shareholderTypeList,function(index,item){
                            oDom += ('<option value="' + item.pkey + '">' + item.pvalue + '</option>');
                        });
                        $('#J_shareholderType').html(oDom);
                    }
                    // 股东证件类型
                    if(result.certificatesTypeList.length>=1){
                        var oDom='<option value="100000" disabled selected>--请选择--</option>';
                        $.each(result.certificatesTypeList,function(index,item){
                            oDom += ('<option value="' + item.pkey + '">' + item.pvalue + '</option>');
                        });
                        $('#J_shareholderPapers').html(oDom);
                    }
                   // 所属行业
                   if(result.companyIndustryList.length>=1){
                       var oDom='<option value="" disabled selected>--请选择--</option>';
                       $.each(result.companyIndustryList,function(index,item){
                           oDom += ('<option value="' + item.pvalue + '">' + item.pvalue + '</option>');
                       });
                       $('#J_profession').html(oDom);
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
            if(registerNumber=="" || registerNumber=="null"){
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
            // if(companyaddress=="" || companyaddress==null){
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
            //股东证件类型(必填)
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
                    })
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
                commonFun.hideError('J_firmEmailError');
                commonFun.disabledBtn('J_fourthInfoBtn');
                $('.info-error').addClass('hidden');
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
                                commonFun.showStep('fifth',function () {
                                    fifth.showDetailInfo();
                                });
                            }else{
                                alert(result.data.message);
                            }
                            commonFun.enableBtn('J_fourthInfoBtn');
                        }else{
                            alert('提交失败，请稍后重试！');
                            commonFun.enableBtn('J_fourthInfoBtn');
                        }
                    },
                    error:function(){
                        alert('网络异常，请刷新重试');
                        commonFun.enableBtn('J_fourthInfoBtn');
                    }
                })


            }

        }

    };
//第五步企业存管开户
    var fifth={
        openAccountPage:function (o) {
            $.xxdAjax({
                url:dataUrl.openFuiouOpenAccountPage,
                type:'post',
                clientId: "XXD_FRONT_END",
                token:token,
                data     : {},
                dataType : 'json',
                callbacks:function(result){
                    if(result.code==="200000"){
                        if(result.data.data){
                            o.cb && o.cb(result.data.data)
                        }
                    }else{
                      alert(result.data.message);
                    }
                },
                error:function(){
                    float.alert({content:msg.errorMsg});
                }
            })
        },
        showDetailInfo:function () {
            fifth.openAccountPage({
                cb:function (result) {
                    var dataList,oDom='';
                    if(result.fuiou_open_capital_account_page_url){
                        $('#J_submitFuiou').attr('action',result.fuiou_open_capital_account_page_url);
                    }
                    //开户银行
                    if(result.true_bank_nm){
                       $('#J_legalBank').val(result.true_bank_nm);
                    }
                    //卡号
                    if(result.capAcntNo){
                        $('#J_legalBankNumber').val(result.capAcntNo);
                    }
                    if(result.fuiouParams){
                        dataList=result.fuiouParams;
                        if(dataList.artif_nm){
                            $('#J_legalPerson').val(dataList.artif_nm);
                        }
                        if(dataList.certif_id){
                            $('#J_legalPersonID').val(dataList.certif_id);
                        }
                        if(dataList.mobile_no){
                            $('#J_legalPersonNum').val(dataList.mobile_no);
                        }
                        //企业名称
                        if(dataList.cust_nm){
                            $('#J_legalFirmName').val(dataList.cust_nm);
                        }
                        //开户支行
                        if(dataList.bank_nm){
                            $('#J_legalPart').removeClass('disnone');
                            $('#J_legalOtherBank').val(dataList.bank_nm);
                        }
                        //省/市  市/区
                        if(result.province_id && dataList.city_id){
                            commonFun.getCity(result.province_id,function (result) {
                                var html = '<option value="" selected>请选择省/市</option>';
                                var regionHtml='<option value="" selected>请选择市/区</option>';
                                if(result.code === 0 && result.data){
                                    result.data.forEach(function(item) {
                                        if(item.regionCode==dataList.city_id){
                                            html += ('<option value="' + item.provinceCode + '"  selected>' + item.provinceName + '</option>');
                                            regionHtml= ('<option value="' + item.regionCode + '"  selected>' + item.regionName + '</option>');
                                        }

                                    });
                                }
                                $('#J_legalProvice').html(html);
                                $('#J_legalCity').html(regionHtml);
                            })
                        }
                        if(OpenAccount!=1){
                            $.each(result.fuiouParams,function(index,item){
                                oDom += ('<input type="text" name="' + index + '" value="' + item+ '"/>');
                            });
                            $('#J_submitFuiou').html(oDom);
                        }
                    }
                }
            })
        }
    };

    $(function(){
        var J_companyNameT=$('#J_companyName').html();
        $('#J_firmName,#J_firmNameArty').val(J_companyNameT);
        //企业信息展示
        // companyName.show(function (result) {
        //     $('#J_firmName,#J_firmNameArty').val(result);
        // });
        //  第一步骤  实名认证
        $('#J_step1RealBtn').on('click',function(){
            firstStep.autoRealNameData();
        });
        // 进行人工审核
        $('#J_realNameArtificial').on('click',function(){
            $('#J_userNameArty').val($.validateTrim($('#J_userName').val()));
            $('#J_IDNumberArty').val($.validateTrim($('#J_IDNumber').val()));
            commonFun.showArtificial('J_realNameStep1','J_realNameStep2');
        });
        //  第一步骤  实名认证提交人工审核
        $('#J_step2RealBtn').on('click',function(){
            firstStep.manualRealNameData();
        });

        //第二步企业认证
        $('#J_step1FirmBtn').on('click',function () {
            secondStep.autoSubmitData();
        });
        // 第二步企业认证提交人工审核
        $('#J_stepFirmArtificial').on('click',function () {
            var firstFirmName=$.validateTrim($('#J_firmName').val());
            var companyID=$.validateTrim($('#J_firmId').val());
            if(firstFirmName){
                $('#J_firmNameArty').val(firstFirmName);
            }else{
                $('#J_firmNameArty').val(J_companyNameT);
            }
            $('#J_firmIdArty').val(companyID);
            commonFun.showArtificial('J_secondStep1','J_secondStep2');
        });
        //提交人工审核
        $('#J_step2FirmBtn').on('click',function(){
            secondStep.manualCompanyData();
        });
        // 第二步是否三证上传
        $("#J_firmUpload input").click(function(){
            commonFun.isUpload('J_firmUploadTrue','J_firmUploadT','J_firmUploadF');
        });
        //第四步提交企业信息
        $('#J_fourthInfoBtn').on('click',function(){
            fourth.loginCompanyInfo();
        });
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

        //第四部上传图片
        $('.file-upload').on('change','input',function (e) {
            var $domPic='';
            handleUploadFile(e.target.files[0],'companySaveInfo',$(this),$domPic);
        });
        //第五步同意开通
        $('#J_openEpository').on('click',function(){
            if($('#J_check').is(':checked')){
                if(OpenAccount==1){
                    $('#J_tipsMsg').html('您已完成存管银行开户');
                    $('#J_companyCenter').html('前往企业中心');
                    $('#J_dialogTips').removeClass('disnone');
                    $('#J_openComplete').removeClass('disnone');
                }else{
                    $('#J_submitFuiou').submit();
                }
            }else{
                commonFun.showError('J_fifthError','请勾选同意协议');
            }

        });

        $(document).on('click','.close,#J_cancelBtn,#J_applyBtn,#J_thirdDialog',function(){
            $('#J_openWait,#J_dialogTips,#J_openComplete').addClass('disnone');
        });
        $(document).on('click','#J_companyCenter',function(){
            if(OpenAccount==1){
                window.location.href='/usercenter/company/account.html';
            }else{
                $('#J_dialogTips').addClass('disnone');
                $('#J_openComplete').addClass('disnone');
            }
        });
        //上传图片
        $('.upload-file').on('change','input',function(e){
            var $domPic=$(this).parent().parent().find('.upload-img');
            handleUploadFile(e.target.files[0],'companyRealnameAppro',$(this),$domPic);
        });
        function handleUploadFile(file,dir,$domTarget,$domPic) {
            if(!file) return;
            if(!/image/.test(file.type)) return alert('请选择图片');
            var formData = new FormData();
            commonFun.uploadFile(file,dir,function (data) {
                    $domTarget.data('pic',data.data.fileId);
                    if($domPic){
                        $domPic.removeClass('disnone');
                        $domPic.find('img').attr('src', data.data.fileURL);
                    }else{
                        $domTarget.parent().find('p').html(file.name);
                    }
                },
                function (error) {
                    alert(error.message || '图片上传失败，请重新选择');
                });
        }
        //联行号
        $('#J_linkBank,#J_link2Bank').on('change',function (e) {
            linkBankNum=this.value;
        });
        // //对公账户
        $('#J_bankNum,#J_bank2Num').on('change', function(e) {
            stepData3.comBankNo = this.value;
        });
        // 图片上传
        function handleSelectFile(file) {
            if(!/image/.test(file.type)) return alert('请选择图片');
            var formData = new FormData();
            commonFun.uploadFile(file,'companyBankAuth',
                function (data) {
                    stepData3.openAccAppro_pic = data.data.fileId;
                    // $bankUpload.css('background-image', 'url(' + data.data.fileURL + ')');
                    $bankUpload.parent().find('.upload-img').removeClass('disnone');
                    $bankUpload.parent().find('.upload-img').find('img').attr('src',data.data.fileURL);
                },
                function (error) {
                    alert(error.message || '图片上传失败，请重新选择');
                });
        }
        // 点击上传
        fileInput.onchange = function(e) {
            handleSelectFile(e.target.files[0])
        };
        // $bankUpload.on('click', function(e) {
        //     fileInput.click();
        // });
        // 拖入上传
        $bankUpload.on('drag dragstart dragend dragover dragenter dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
            .on('dragover dragenter', function() {
                // $form.addClass('is-dragover');
            })
            .on('dragleave dragend drop', function() {
                // $form.removeClass('is-dragover');
            })
            .on('drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
                handleSelectFile(e.originalEvent.dataTransfer.files[0]);
            });
        function ensureStep3(data, $error, callback) {
            if(linkBankNum===''){
                $error.removeClass('hidden').html('请输入联行号');
                return callback && callback(false);
            }
            if(data.comBankCode === '') {
                $error.removeClass('hidden').html('请根据联行号查询支行信息，或联系技术中心');
                return callback && callback(false);
            }
            if(data.cityCode === '') {
                $error.removeClass('hidden').html('请根据联行号查询支行信息，或联系技术中心');
                return callback && callback(false);
            }
            if(data.provinceCode === '') {
                $error.removeClass('hidden').html('请根据联行号查询支行信息，或联系技术中心');
                return callback && callback(false);
            }
            if(data.comBranchName===''){
                $error.removeClass('hidden').html('请根据联行号查询支行信息，或联系技术中心');
                return callback && callback(false);
            }
            if(data.comBankNo === '') {
                $error.removeClass('hidden').html('请输入对公户账号');
                return callback && callback(false);
            }
            if(data.comBankNo.length > 30) {
                $error.removeClass('hidden').html('请输入正确的对公户账号');
                return callback && callback(false);
            }
            $.xxdAjax({
                url: dataUrl.checkBankNotIsUse,
                type: 'GET',
                clientId: "XXD_FRONT_END",
                token:token,
                data: { bankNo: data.comBankNo },
                callbacks: function(data) {
                    if(data.code === '200000' && data.data.code === 0) {
                        return callback && callback(true);
                    }
                    $error.removeClass('hidden').html(data.data.message);
                    callback && callback(false);
                }
            });
        }
        $('#J_stepBankArtificial').on('click', function(e) {
            e.preventDefault();
            manualBankStep();
        });
        //查询联行号
        $('#J_linkBankSelect').on('click',function (e) {
            e.preventDefault();
            // var linkBank=$('#J_linkBank').val();
            commonFun.hideError('J_bankNumError');
            commonFun.hideError('J_BankError');
            emptyInput();
            if(linkBankNum==="" || linkBankNum=="null"){
                commonFun.showError('J_bankNumError','请输入联行号');
            }else{
                autoSelect=true;
                third.selectBankInfo(linkBankNum);
            }
        });
        //人工查询联行号
        $('#J_link2BankSelect').on('click',function (e) {
            e.preventDefault();
            // var linkBank=$('#J_link2Bank').val();
            commonFun.hideError('J_BankError');
            commonFun.hideError('J_bankNumError');
            emptyInput();
            if(linkBankNum==="" || linkBankNum=="null"){
                commonFun.showError('J_BankError','请输入联行号');
            }else{
                autoSelect=false;
                third.select2BankInfo(linkBankNum);
            }
        });
        function emptyInput() {
            stepData3 ={
                comBankNo: '',
                comBankName: '',
                comBankCode: '',
                provinceCode: '',
                cityCode:'',
                comBranchName:'',
                openAccAppro_pic:''
            };
            $('#J_third input:not(#J_linkBank,#J_link2Bank)').val('');
            $('#J_thirdStep2 .upload-img').addClass('disnone');
            $('#J_thirdStep2 .upload-img').find('img').attr('src','');
        }
        //弹窗
        $('#J_getLinkBank,#J_get2LinkBank').on('click',function (e) {
            $('#J_dialogTips').removeClass('disnone');
            $('#J_thirdDialog').removeClass('disnone');
        });
        $('#J_step1BankBtn').on('click', function(e){
            var $errorMessage = $('#J_third .step1 .step1-error');
            $errorMessage.addClass('hidden');
            ensureStep3(stepData3, $errorMessage, function (checked) {
                if(!checked) {
                    return ;
                }
                commonFun.disabledBtn('J_step1BankBtn');
                var autoApproData = {
                    comBankNo: stepData3.comBankNo,
                    comBankName: stepData3.comBankName,
                    comBankCode: stepData3.comBankCode,
                    provinceCode: stepData3.provinceCode,
                    cityCode: stepData3.cityCode,
                    comBranchName:stepData3.comBranchName
                };
                $.xxdAjax({
                    url: dataUrl.autoCompanyBankAppro,
                    type: 'POST',
                    clientId: "XXD_FRONT_END",
                    token:token,
                    data: JSON.stringify({ data: autoApproData }),
                    contentType: 'application/json; charset=utf-8',
                    callbacks: function(data) {
                        switch (data.data.code) {
                            case 0: {
                                // 下一步
                                commonFun.showStep('fourth',function () {
                                    fourth.showCompanyInfo();
                                });
                                commonFun.enableBtn('J_step1BankBtn');
                                break;
                            }
                            case -3: {
                                // 判断失败显示人工审核
                                $('#J_stepBankArtificial').removeClass('disnone');
                                commonFun.enableBtn('J_step1BankBtn');
                                commonFun.showError('J_bankNumError',data.data.message);
                                break;
                            }
                            case -4: {
                                // 判断三次失败转为人工审核
                                bankFallbackFlag = true;
                                manualBankStep();
                                commonFun.enableBtn('J_step1BankBtn');
                                break;
                            }
                            default: {
                                commonFun.showError('J_bankNumError',data.data.message);
                                commonFun.enableBtn('J_step1BankBtn');
                                break;
                            }
                        }
                    },
                    error: function(error) {
                        alert(error);
                        commonFun.enableBtn('J_step1BankBtn');
                    }
                });
            });
        });
        $('#J_step2BankBtn').on('click',function(e) {
            var $errorMessage = $('#J_third .step2 .step1-error');
            $errorMessage.addClass('hidden');
            ensureStep3(stepData3, $errorMessage, function (checked) {
                // var bankCode = stepData3.comBankCode;
                if(!checked) {
                    return ;
                } else if (!stepData3.openAccAppro_pic) {
                    return $errorMessage.removeClass('hidden').html('请上传图片');
                }
                // else if(bankCode === '0313' || bankCode === '0314' || bankCode === '0402') {
                //     if(!stepData3.comBranchName) {
                //         return $errorMessage.removeClass('hidden').html('请输入开户支行名称');
                //     }
                // }
                commonFun.disabledBtn('J_step2BankBtn');
                var manualApproData = {
                    comBankNo: stepData3.comBankNo,
                    comBankName: stepData3.comBankName,
                    comBankCode: stepData3.comBankCode,
                    provinceCode: stepData3.provinceCode,
                    cityCode: stepData3.cityCode,
                    comBranchName:stepData3.comBranchName,
                    openAccAppro_pic:stepData3.openAccAppro_pic
                };
                commonFun.myAjax({
                    url: dataUrl.manualCompanyBankAppro,
                    type: 'POST',
                    headers: { token: token },
                    data: JSON.stringify({ data: manualApproData }),
                    contentType: 'application/json; charset=utf-8',
                    success: function(data) {
                        // 下一步
                        commonFun.showCheckStatus('J_showArtificial', '对公户信息认证审核中');
                        commonFun.enableBtn('J_step2BankBtn');
                    },
                    error: function(error) {
                        commonFun.enableBtn('J_step2BankBtn');
                    }
                });
            });
        });

    });
    //获取url的参数
    function getQueryString() {
        var qs = location.search.substr(1), // 获取url中"?"符后的字串
            args = {}; // 保存参数数据的对象
       if(qs==""){
           args=0;
       }else{
           var items = qs.length ? qs.split("&") : [], // 取得每一个参数项,
            item = null,
            len = items.length;
           for(var i = 0; i < len; i++) {
               item = items[i].split("=");
               var name = decodeURIComponent(item[0]),
                   value = decodeURIComponent(item[1]);
               if(name) {
                   args[name] = value;
               }
           }
       }
        return args;
    }
    var userDO = store && store.get("userDO") || {};
    track.init(userDO);
},function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});