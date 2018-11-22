require(['base', "trackBase", 'store', 'side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, track, store, side, jui, header, footer, dialog) {

    header.init();
    footer.init();
    var global = window["GLOBAL_STATIC_DATA"];
    side.tabs({
        tabsObject: $("#J_tabs"),//tab 栏
    });
    //左侧菜单
    side.leftMenu(3);
    //日期时间插件
    side.date(".user-date");

    var token = store && store.get("token") || {},
        regID = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,//正则身份证
        regNumber = /^[0-9]*$/,//正则数字
        regNumberPoint = /^\d+(\.\d+)?$/,//正则带小数点数字
        regHundred = /^(\d{1,2}(\.\d{1,3})?|100)$/,//在0-100内的数字
        regLetterNum = /^[0-9a-zA-Z]+$/,   //英文加数字
        regTel = /^1[3|4|5|7|8|9][0-9]{9}$/, //手机号码校验
        regHomeTel = /^([0-9]{3,4}-)?[0-9]{7,8}$/, //座机校验
        regAllTel = /^((0\d{2,3}-\d{7,8})|(1[357849]\d{9}))$/, //家庭电话加座机
        testId = /^[0-9a-zA-Z]{1,18}$/,//社保卡号 1-18位数的英文加数字
        testYear = /^\d{4}$/,   //正则年份
        testMonth = /^(0?[1-9]|1[0-2])$/, // 正则月份
        regMinusNum = /^\-[1-9][0-9]*$/,   //正则负数
        regOrganizeCode = /[a-zA-Z0-9]{8}-[a-zA-Z0-9]/,  // 正则组织机构代码
        regTaxCode = /^\d{0,18}$/, // 正则税务登记证编号
        regBusinessLicense = /^.{18}$/, // 营业执照副本   18位任意字符
        regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,  //邮箱正则
        fileFlag = 1;   //文件类型
    var selectedType;  //用户未保存前选择的类型

    //校验input 框，不让输入空格
    $('input[type="text"]').keyup(function () {
        this.value = this.value.replace(/\s+/g, '');
    });
    var globalUserType = global.userDetailInfo.data.baseInfo.usertype;
    //选择对应的用户类型展示情况
    changeUserTypeTab();
    function changeUserTypeTab() {
        if (globalUserType === '') {
            return;
        }
        if (globalUserType == '1') {
            $('#J_tabs,#selectedData,#selectedInput,#personageInput').removeClass('hide');
            $('#lastBox').removeClass('last');
            $('#absenceInput,#J_firmTabs,#absenceTitle,#firmInput,#firmsInput').addClass('hide');
        } else if (globalUserType == '2') {
            $('#absenceInput,#J_tabs,#absenceTitle,#personageInput,#selectedData,#selectedInput').addClass('hide');
            $('#J_firmTabs,#firmInput,#firmsInput').removeClass('hide');
        }
    }

    function rightHight() {
        var clocks = setInterval(function () {
            if (parseInt($('.g-left').height()) != parseInt($('.g-right').height())) {
                $('.g-left').css('min-height', $('.g-right').height() + 'px');
            } else {
                clearInterval(clocks);
            }
        }, 100);
    }

    if (globalUserType == '1') {
        var infosData = global.personalInfos.data.infos,
            pbinfosData = global.personalInfos.data.pbinfos,
            fninfosData = global.personalInfos.data.fninfos,
            coninfosData = global.personalInfos.data.coninfos;
        updateInfos();
        updatePbinfos();
        updateFninfos();
        updateConinfos();
    }
    //渲染固定资产
    function updateInfos() {
        if (JSON.stringify(infosData) == "{}") {
            return;
        }
        //房
        if (infosData['是否购房']) {
            var extValue = infosData['是否购房'].extValue;
            $('input[type=radio][name=buyHouseYN][value="' + extValue + '"]').attr("checked", true);      //是否购房

            if (infosData['是否购房'].extValue == '是') {
                var buyHouseYear = infosData['购房时间'].extValue.substr(0, 4),
                    buyHouseMonth = infosData['购房时间'].extValue.substr(4, infosData['购房时间'].extValue.length - 1);
                $('.J_buyHouseYear').val(buyHouseYear);                                          //购房年
                $('.J_buyHouseMonth').val(buyHouseMonth);                                        //购房月
                $('.J_houseProperty').val(infosData['房产地址'].extValue);                         //房产地址
                $('.J_paymentHouse').val(infosData['供房状况'].extValue);                         //供房状况
                $('.J_houseArea').val(infosData['房产面积'].extValue);                            //房产面积
                $('.J_housePercent').val(infosData['产权份额'].extValue);                         //产权份额
            }
        }


        //车
        if (infosData['是否购车']) {
            var extValue = infosData['是否购车'].extValue;
            $('input[type=radio][name=buyCarYN][value="' + extValue + '"]').attr("checked", true);      //是否购车

            if (infosData['是否购车'].extValue == '是') {
                var buyCarYear = infosData['购车时间'].extValue.substr(0, 4),
                    buyCarMonth = infosData['购车时间'].extValue.substr(4, infosData['购车时间'].extValue.length - 1);
                $('.J_buyCarYear').val(buyCarYear);                                        //购车年
                $('.J_buyCarMonth').val(buyCarMonth);                                      //购车月
                var carData = infosData['车辆型号'].extValue,
                    carData = carData.split(","),
                    carFront = carData[0],
                    carNext = carData[1];
                $('.J_carFront').val(carFront);                                          //车辆型号前
                $('.J_carNext').val(carNext);                                            //车辆型号后
                $('.J_paymentCar').val(infosData['供车状况'].extValue);                        //供车状况
            }
        }


        //else
        if (infosData['其他备注']) {
            $('.J_elseRemark').val(infosData['其他备注'].extValue);                        //else
        }
    }

    //渲染私营业主
    function updatePbinfos() {
        if (JSON.stringify(pbinfosData) == "{}") {
            return;
        }
        if (pbinfosData['企业类型']) {
            $('.J_firmType').val(pbinfosData['企业类型'].extValue);         //企业类型
        }
        $('.J_dutyParagraph').val(pbinfosData['税务编号'].extValue);    //税务编号
        $('.J_firmName').val(pbinfosData['公司名称'].extValue);         //公司名称
        $('.J_firmDirectory').val(pbinfosData['工商登记号'].extValue);    //工商登记号
        var signData = pbinfosData['注册时间'].extValue,
            signData = signData.split("-"),
            firmSignYear = signData[0],
            firmSignMonth = signData[1];
        $('.J_firmSignYear').val(firmSignYear);                          //注册年
        $('.J_firmSignMonth').val(firmSignMonth);                        //注册月
        $('.J_firmAddress').val(pbinfosData['公司地址'].extValue);      //公司地址
        if (pbinfosData['其他备注']) {
            $('.J_firmElse').val(pbinfosData['其他备注'].extValue);          //else
        }
    }

    //渲染财务状况
    function updateFninfos() {
        if (JSON.stringify(fninfosData) == "{}") {
            return;
        }
        $('.J_payByPledge').val(fninfosData['每月无抵押还款额'].extValue);         //每月无抵押还款额
        $('.J_payByHouse').val(fninfosData['每月房屋按揭金额'].extValue);          //每月房屋按揭金额
        $('.J_payByCar').val(fninfosData['每月汽车按揭金额'].extValue);           //每月汽车按揭金额
        $('.J_payByCredit').val(fninfosData['每月信用卡还款额'].extValue);        //每月信用卡还款额
        if (fninfosData['其他还款情况']) {
            $('.J_payElse').val(fninfosData['其他还款情况'].extValue);            //其他还款情况
        }
    }

    //渲染联系方式
    function updateConinfos() {
        if (JSON.stringify(coninfosData) == "{}") {
            return;
        }
        $('.J_userQQ').val(coninfosData['用户QQ'].extValue);                //qq
        if (coninfosData['阿里旺旺']) {
            $('.J_userAliWang').val(coninfosData['阿里旺旺'].extValue);          //阿里旺旺
        }
        $('.J_firstPeople').val(coninfosData['第一联系人'].extValue);           //第一联系人
        $('.J_firstPTel').val(coninfosData['第一联系人-电话'].extValue);             //电话
        $('.J_firstPAddress').val(coninfosData['第一联系人-地址'].extValue);         //地址
        $('.J_nextPeople').val(coninfosData['第二联系人'].extValue);           //第二联系人
        $('.J_nextPTel').val(coninfosData['第二联系人-电话'].extValue);             //电话
        $('.J_nextPAddress').val(coninfosData['第二联系人-地址'].extValue);         //地址
        if (coninfosData['第三联系人']) {
            $('.J_lastPeople').val(coninfosData['第三联系人'].extValue);           //第三联系人
        }
        if (coninfosData['第三联系人-电话']) {
            $('.J_lastPTel').val(coninfosData['第三联系人-电话'].extValue);             //电话
        }
        if (coninfosData['第三联系人-地址']) {
            $('.J_lastPAddress').val(coninfosData['第三联系人-地址'].extValue);         //地址
        }
        if (coninfosData['其他备注']) {
            $('.J_relationElse').val(coninfosData['其他备注'].extValue);         //else
        }
    }

    //企业类型点击tab 切换
    var $tabsli = $('#J_firmTabs li');
    $tabsli.click(function () {
        var $me = $(this);
        var index = $tabsli.index($me);
        $tabsli.removeClass("active").eq(index).addClass("active");
        $(".j_firmContent").addClass("hide").eq(index).removeClass("hide");
    });
    //渲染地点
    $('.J_nowProvince').change(function () {
        updateCity($('.J_nowProvince').val(), $('.J_nowTown'));
    });
    $('.J_workAddressone').change(function () {
        updateCity($('.J_workAddressone').val(), $('.J_workAddresstwo'));
    });
    //更新基本资料
    $('.J_submitBasicInfor').click(function () {
        var isEducation = $('.J_education').val() == '',
            isHomeNumber = !regTel.test($('.J_homeNumber').val()) && !regHomeTel.test($('.J_homeNumber').val()) && ($('.J_homeNumber').val() != ''),
            isBirthday = $('.J_birthday').val() == '',
            isProfession = $('.J_profession').val() == '',
            isNativePlace = $('.J_nativePlace').val() == '',
            isMaritalStatus = $('.J_maritalStatus').val() == '',
            isNowAddresstwo = $('.J_nowAddresstwo').val() == '',
            isNowAddressthree = $('.J_nowAddressthree').val() == '',
            isNowAddress = $('.J_nowAddress').val() == '',
            isAddress = ($('.J_nowProvince').val() == '') || ($('.J_nowTown').val() == ''),
            isCompanyTel = $('.J_companyTel').val() == '',
            testCompanyTel = (!regHomeTel.test($('.J_companyTel').val())) && (!regTel.test($('.J_companyTel').val())),
            isIndustry = $('.J_industry').val() == '',
            isFirmAddressone = $('.J_firmAddressone').val() == '',
            isSocialID = $('.J_socialID').val() == '',
            testSocialID = !testId.test($('.J_socialID').val()),
            isWorkAddress = $('.J_workAddressone').val() == '' || $('.J_workAddresstwo').val() == '';
        //家庭电话格式不正确报错
        if (globalUserType == '') {
            popError($('.J_perosonal1'), 'ml106 block mtop', '请选择用户类型！');
            if (isEducation) {
                popError($('.J_perosonal4'), 'ml568 block', '请选择学历！');
            } else {
                removeError($('.J_perosonal4'), '');
            }
            if (isHomeNumber) {
                popError($('.J_perosonal3'), 'ml568 block', '请输入正确格式的手机号或者座机号！');
            } else {
                removeError($('.J_perosonal3'), '');
            }
            if (isBirthday) {
                popError($('.J_perosonal5'), 'ml106 m_birth', '请选择出生日期！');
            } else {
                removeError($('.J_perosonal5'), '.m_birth');
            }
            if (isProfession) {
                popError($('.J_perosonal5'), 'mr74 m_profess', '请选择职业状态！');
            } else {
                removeError($('.J_perosonal5'), '.m_profess');
            }
            if (isNativePlace) {
                popError($('.J_perosonal6'), 'ml106 m_nativePlace', '请输入籍贯！');
            } else {
                removeError($('.J_perosonal6'), '.m_nativePlace');
            }
            if (isMaritalStatus) {
                popError($('.J_perosonal6'), 'ml568 m_maritalStatus', '请选择婚姻状态！');
            } else {
                removeError($('.J_perosonal6'), '.m_maritalStatus');
            }
            if (isNowAddress) {
                popError($('.J_perosonal7'), 'ml106 m_NowAddress', '请输入现居住地址！');
            } else {
                removeError($('.J_perosonal7'), '.m_NowAddress');
            }
            if (isAddress) {
                popError($('.J_perosonal7'), 'ml568 m_Address', '请输入所在地点！');
            } else {
                removeError($('.J_perosonal7'), '.m_Address');
            }
            if (globalUserType == '' || isEducation || isHomeNumber || isBirthday || isProfession || isNativePlace || isMaritalStatus || isNowAddress || isAddress) {
                return;
            }
        } else if (globalUserType == '1') {
            removeError($('.J_perosonal1'), '');
            if (isEducation) {
                popError($('.J_perosonal4'), 'ml568 block', '请选择学历！');
            } else {
                removeError($('.J_perosonal4'), '');
            }
            if (isHomeNumber) {
                popError($('.J_perosonal3'), 'ml568 block', '请输入正确格式的手机号或者座机号！');
            } else {
                removeError($('.J_perosonal3'), '');
            }
            if (isBirthday) {
                popError($('.J_perosonal5'), 'ml106 m_birth', '请选择出生日期！');
            } else {
                removeError($('.J_perosonal5'), '.m_birth');
            }
            if (isProfession) {
                popError($('.J_perosonal5'), 'mr74 m_profess', '请选择职业状态！');
            } else {
                removeError($('.J_perosonal5'), '.m_profess');
            }
            if (isNativePlace) {
                popError($('.J_perosonal6'), 'ml106 m_nativePlace', '请输入籍贯！');
            } else {
                removeError($('.J_perosonal6'), '.m_nativePlace');
            }
            if (isMaritalStatus) {
                popError($('.J_perosonal6'), 'ml568 m_maritalStatus', '请选择婚姻状态！');
            } else {
                removeError($('.J_perosonal6'), '.m_maritalStatus');
            }
            if (isNowAddresstwo) {
                popError($('.J_perosonal8'), 'ml106 block', '请输入现居住地址！');
            } else {
                removeError($('.J_perosonal8'), '');
            }
            if (isCompanyTel) {
                popError($('.J_perosonal10'), 'ml106 m_companytel', '请输入公司电话！');
            } else if (testCompanyTel) {
                popError($('.J_perosonal10'), 'ml106 m_companytel', '请输入正确格式的座机或者手机号！');
            } else {
                removeError($('.J_perosonal10'), '.m_companytel');
            }
            if (isIndustry) {
                popError($('.J_perosonal10'), 'mr74 m_industry', '请选择公司行业！');
            } else {
                removeError($('.J_perosonal10'), '.m_industry');
            }
            if (isFirmAddressone) {
                popError($('.J_perosonal11'), 'ml568 block', '请输入公司地址！');
            } else {
                removeError($('.J_perosonal11'), '');
            }
            if (isSocialID) {
                popError($('.J_perosonal12'), 'ml106 m_socialID', '请输入社保卡号！');
            } else if (testSocialID) {
                popError($('.J_perosonal12'), 'ml106 m_socialID', '请输入正确格式的社保卡号！');
            }
            else {
                removeError($('.J_perosonal12'), '.m_socialID');
            }
            if (isWorkAddress) {
                popError($('.J_perosonal12'), 'mr74 m_workAddress', '请选择工作地址！');
            } else {
                removeError($('.J_perosonal12'), '.m_workAddress');
            }
            if (isEducation || isBirthday || isHomeNumber || isProfession || isNativePlace || isMaritalStatus || isNowAddresstwo || isCompanyTel || testCompanyTel || isIndustry || isFirmAddressone || isSocialID || testSocialID || isWorkAddress) {
                return;
            }
            var UserBaseInfoData = JSON.stringify({
                "data": {
                    "usertype": globalUserType,
                    "gender": $('.J_gender[name=sex]:checked').val(),
                    "hometel": $('.J_homeNumber').val(),
                    "degree": $('.J_education').val(),
                    "birthday": $('.J_birthday').val(),
                    "occupation": $('.J_profession').val(),
                    "nativeplace": $('.J_nativePlace').val(),
                    "maritalstatus": $('.J_maritalStatus').val(),
                    "homeaddr": $('.J_nowAddresstwo').val(),
                    "ability": $('.J_myAbility').val(),
                    "interest": $('.J_hobby').val(),
                    "note": $('.J_twoElse').val(),
                    "companytel": $('.J_companyTel').val(),
                    "companyindustry": $('.J_industry').val(),
                    "income": $('.J_monthIncome').val(),
                    "companyaddr": $('.J_firmAddressone').val(),
                    "socialinsurcode": $('.J_socialID').val(),
                    "province": $('.J_workAddressone').val(),
                    "city": $('.J_workAddresstwo').val()
                }
            });
        } else if (globalUserType == '2') {
            removeError($('.J_perosonal1'), '');
            if (isNativePlace) {
                popError($('.J_perosonal6'), 'ml106 m_nativePlace', '请输入籍贯！');
            } else {
                removeError($('.J_perosonal6'), '.m_nativePlace');
            }
            if (isMaritalStatus) {
                popError($('.J_perosonal6'), 'ml568 m_maritalStatus', '请选择婚姻状态！');
            } else {
                removeError($('.J_perosonal6'), '.m_maritalStatus');
            }
            if (isNowAddressthree) {
                popError($('.J_perosonal9'), 'ml106 block', '请输入现居住地址！');
            } else {
                removeError($('.J_perosonal9'), '');
            }
            if (isNativePlace || isMaritalStatus || isNowAddressthree) {
                return;
            }
            var UserBaseInfoData = JSON.stringify({
                "data": {
                    "usertype": globalUserType,
                    "gender": $('.J_gender[name=sex]:checked').val(),
                    "nativeplace": $('.J_nativePlace').val(),
                    "homeaddr": $('.J_nowAddressthree').val(),
                    "maritalstatus": $('.J_maritalStatus').val(),
                    "note": $('.J_oneElse').val()
                }
            });
        }
        upDateAllData('/userCenter/userDetail/updateUserBaseInfo', UserBaseInfoData);
    });
    //更新用户固定资产
    var isBuyHouse = $('input[type="radio"][name=buyHouseYN]:checked').val();
    if (isBuyHouse == '否') {
        buyHouseTrue();
    } else {
        buyHouseFalse();
    }
    var isBuyCar = $('input[type="radio"][name=buyCarYN]:checked').val();
    if (isBuyCar == '否') {
        buyCarTrue();
    } else {
        buyCarFalse();
    }
    $('input[type=radio][name=buyHouseYN]').change(function () {
        if (this.value == '否') {
            $('.fixedAssets1 .pop-error,.fixedAssets2 .pop-error,.fixedAssets3 .pop-error').remove();
            $('.fixedAssets1,.fixedAssets2,.fixedAssets3').removeClass('mb55');
            buyHouseTrue();
        } else {
            buyHouseFalse();
        }
    });
    $('input[type=radio][name=buyCarYN]').change(function () {
        if (this.value == '否') {
            $('.fixedAssets4 .pop-error,.fixedAssets5 .pop-error').remove();
            $('.fixedAssets4,.fixedAssets5').removeClass('mb55');
            buyCarTrue();
        } else {
            buyCarFalse();
        }
    });
    $('.J_submitFixedAssets').click(function () {
        var buyHouseYN = $('input[type="radio"][name=buyHouseYN]:checked').val(),
            buyCarYN = $('input[type="radio"][name=buyCarYN]:checked').val(),
            isBuyHouseTime = ($('.J_buyHouseYear').val() == '') || ($('.J_buyHouseMonth').val() == ''),
            isBuyCarTime = ($('.J_buyCarYear').val() == '') || ($('.J_buyCarMonth').val() == ''),
            isHouseProperty = $('.J_houseProperty').val() == '',
            isPaymentHouse = $('.J_paymentHouse').val() == '',
            isHouseArea = $('.J_houseArea').val() == '',
            testHouseArea = !regNumberPoint.test($('.J_houseArea').val()),
            isHousePercent = $('.J_housePercent').val() == '',
            testHousePercent = !regHundred.test($('.J_housePercent').val()),
            testMinusNum = regMinusNum.test($('.J_housePercent').val()),
            isCarType = ($('.J_carFront').val() == '') || ($('.J_carNext').val() == ''),
            isPaymentCar = $('.J_paymentCar').val() == '';
        if (buyHouseYN != '否') {
            if (isBuyHouseTime) {
                popError($('.fixedAssets1'), 'ml568 block', '请选择购房时间！');
            } else {
                removeError($('.fixedAssets1'), '');
            }
            if (isHouseProperty) {
                popError($('.fixedAssets2'), 'ml106 m_houseProperty', '请输入房产地址！');
            } else {
                removeError($('.fixedAssets2'), '.m_houseProperty');
            }
            if (isPaymentHouse) {
                popError($('.fixedAssets2'), 'mr74 m_paymentHouse', '请选择供房状态！');
            } else {
                removeError($('.fixedAssets2'), '.m_paymentHouse');
            }
            if (isHouseArea || testHouseArea) {
                popError($('.fixedAssets3'), 'ml106 m_houseArea', '请输入房产面积，只能是数字！');
            } else {
                removeError($('.fixedAssets3'), '.m_houseArea');
            }
            if (isHousePercent) {
                popError($('.fixedAssets3'), 'mr74 m_housePercent', '请输入产权份额！');
            } else if (testMinusNum) {
                popError($('.fixedAssets3'), 'mr74 m_housePercent', '产权份额只能包含数字和"."，请重新输入！');
            } else if (testHousePercent) {
                popError($('.fixedAssets3'), 'mr74 m_housePercent', '产权份额不能超过100，请重新输入！');
            }
            else {
                removeError($('.fixedAssets3'), '.m_housePercent');
            }
            if (isBuyHouseTime || isHouseProperty || isPaymentHouse || isHouseArea || testHouseArea || isHousePercent || testHousePercent || testMinusNum) {
                return;
            }
        }
        if (buyCarYN != '否') {
            if (isBuyCarTime) {
                popError($('.fixedAssets4'), 'ml568 block', '请选择购车时间！');
            } else {
                removeError($('.fixedAssets4'), '');
            }
            if (isCarType) {
                popError($('.fixedAssets5'), 'ml106 m_carType', '请选择车辆型号！');
            } else {
                removeError($('.fixedAssets5'), '.m_carType');
            }
            if (isPaymentCar) {
                popError($('.fixedAssets5'), 'mr74 m_paymentCar', '请选择供车状态！');
            } else {
                removeError($('.fixedAssets5'), '.m_paymentCar');
            }
            if (isBuyCarTime || isCarType || isPaymentCar) {
                return;
            }
        }
        var buyCarTime = $('.J_buyCarYear').val() + $('.J_buyCarMonth').val();
        var resideHouseTime = $('.J_buyHouseYear').val() + $('.J_buyHouseMonth').val();
        var carType;
        if (buyCarYN == '否') {
            carType = '';
        } else {
            carType = $('.J_carFront').val() + ',' + $('.J_carNext').val();
        }
        var fixedAssetsData = JSON.stringify({
            "data": {
                "resideTypeCode": $('input[type="radio"][name=buyHouseYN]:checked').val(),    //是否有房产
                "resideHouseTime": resideHouseTime,
                "houseAddress": $('.J_houseProperty').val(),
                "houseStatus": $('.J_paymentHouse').val(),
                "houseArea": $('.J_houseArea').val(),
                "housePercent": $('.J_housePercent').val(),
                "isBuyCar": $('input[type="radio"][name=buyCarYN]:checked').val(),
                "buyCarTime": buyCarTime,
                "carType": carType,
                "carStatus": $('.J_paymentCar').val(),
                "resideRemark": $('.J_elseRemark').val(),
            }
        });
        upDateAllData('/userCenter/userDetail/updateUserInfoByPC', fixedAssetsData);
    });
    //更新私营业主
    $('.J_submitFirmDetail').click(function () {
        var isDutyParagraph = $('.J_dutyParagraph').val() == '',
            isFirmName = $('.J_firmName').val() == '',
            isFirmDirectory = $('.J_firmDirectory').val() == '',
            isFirmSignTime = ($('.J_firmSignYear').val() == '') || ($('.J_firmSignMonth').val() == ''),
            testFirmSignYear = testYear.test($('.J_firmSignYear').val()),
            testFirmSignMonth = testMonth.test($('.J_firmSignMonth').val()),
            isFirmAddress = $('.J_firmAddress').val() == '';
        if (isDutyParagraph) {
            popError($('.J_owner1'), 'mr74 m_dutyParagraph', '请填写税务编号，且只能是数字！');
        } else {
            removeError($('.J_owner1'), '.m_dutyParagraph');
        }
        if (isFirmName) {
            popError($('.J_owner2'), 'ml106 m_firmName', '请填写公司名称！');
        } else {
            removeError($('.J_owner2'), '.m_firmName');
        }
        if (isFirmDirectory) {
            popError($('.J_owner2'), 'mr74 m_firmDirectory', '请填写工商登记号，且只能是数字！');
        } else {
            removeError($('.J_owner2'), '.m_firmDirectory');
        }
        if (isFirmSignTime) {
            popError($('.J_owner3'), 'ml106 m_firmSignYear', '请输入注册年月！');
        } else if (!testFirmSignYear) {
            popError($('.J_owner3'), 'ml106 m_firmSignYear', '请输入4位数字的年份！');
        } else if (!testFirmSignMonth) {
            popError($('.J_owner3'), 'ml106 m_firmSignYear', '请输入1-12以内的月份！');
        }
        else {
            removeError($('.J_owner3'), '.m_firmSignYear');
        }
        if (isFirmAddress) {
            popError($('.J_owner3'), 'mr74 m_firmAddress', '请填写公司地址！');
        } else {
            removeError($('.J_owner3'), '.m_firmAddress');
        }
        if (isDutyParagraph || isFirmName || isFirmDirectory || isFirmSignTime || isFirmAddress || !testFirmSignYear || !testFirmSignMonth) {
            return;
        }
        var loginTime = $('.J_firmSignYear').val() + '-' + $('.J_firmSignMonth').val();
        var ownerData = JSON.stringify({
            "data": {
                "companyTypes": $('.J_firmType').val(),
                "taxNum": $('.J_dutyParagraph').val(),
                "companyName": $('.J_firmName').val(),
                "commercialNum": $('.J_firmDirectory').val(),
                "loginTime": loginTime,
                "loginAddress": $('.J_firmAddress').val(),
                "comRemark": $('.J_firmElse').val()
            }
        });
        upDateAllData('/userCenter/userDetail/updateUserInfoByPC', ownerData);
    });
    //更新财务状况
    $('.J_submitPayMoney').click(function () {
        var isPayByPledge = $('.J_payByPledge').val() == '',
            testPayByPledge = regNumberPoint.test($('.J_payByPledge').val()),
            isPayByHouse = $('.J_payByHouse').val() == '',
            testPayByHouse = regNumberPoint.test($('.J_payByHouse').val()),
            isPayByCar = $('.J_payByCar').val() == '',
            testPayByCar = regNumberPoint.test($('.J_payByCar').val()),
            isPayByCredit = $('.J_payByCredit').val() == '',
            testPayByCredit = regNumberPoint.test($('.J_payByCredit').val());
        if (isPayByPledge) {
            popError($('.J_finance1'), 'ml160 block mt52', '请输入每月无抵押还款额！');
        } else if (!testPayByPledge) {
            popError($('.J_finance1'), 'ml160 block mt52', '只能输入数字！');
        } else {
            removeError($('.J_finance1'), '');
        }
        if (isPayByHouse) {
            popError($('.J_finance2'), 'ml160 block mt52', '请输入每月房屋按揭款额！');
        } else if (!testPayByHouse) {
            popError($('.J_finance2'), 'ml160 block mt52', '只能输入数字！');
        } else {
            removeError($('.J_finance2'), '');
        }
        if (isPayByCar) {
            popError($('.J_finance3'), 'ml160 block mt52', '请输入每月汽车按揭款额！');
        } else if (!testPayByCar) {
            popError($('.J_finance3'), 'ml160 block mt52', '只能输入数字！');
        } else {
            removeError($('.J_finance3'), '');
        }
        if (isPayByCredit) {
            popError($('.J_finance4'), 'ml160 block mt52', '请输入每月信用卡还款额！');
        } else if (!testPayByCredit) {
            popError($('.J_finance4'), 'ml160 block mt52', '只能输入数字！');
        } else {
            removeError($('.J_finance4'), '');
        }
        if (isPayByPledge || isPayByHouse || isPayByCar || isPayByCredit || !testPayByPledge || !testPayByHouse || !testPayByCar || !testPayByCredit) {
            return;
        }
        var financeData = JSON.stringify({
            "data": {
                "unsecuredMoney": $('.J_payByPledge').val(),
                "houseMortgage": $('.J_payByHouse').val(),
                "carMortgage": $('.J_payByCar').val(),
                "creditMortgage": $('.J_payByCredit').val(),
                "otherMortgage": $('.J_payElse').val()
            }
        });
        upDateAllData('/userCenter/userDetail/updateUserInfoByPC', financeData);
    });
    //更新联系方式
    $('.J_submitRelation').click(function () {
        var isUserQQ = ($('.J_userQQ').val() == '') || (!regNumber.test($('.J_userQQ').val())),
            isFirstPeople = $('.J_firstPeople').val() == '',
            isFirstPTel = $('.J_firstPTel').val() == '',
            testFirstPTel = !regTel.test($('.J_firstPTel').val()),
            isFirstPAddress = $('.J_firstPAddress').val() == '',
            isNextPeople = $('.J_nextPeople').val() == '',
            isNextPTel = $('.J_nextPTel').val() == '',
            testNextPTel = !regTel.test($('.J_nextPTel').val()),
            isNextPAddress = $('.J_nextPAddress').val() == '',
            testLastPTel = !regTel.test($('.J_nextPTel').val());
        if (isUserQQ) {
            popError($('.J_relation1'), 'ml106 block', '请填写QQ号，且必须为数字！');
        } else {
            removeError($('.J_relation1'), '');
        }
        if (isFirstPeople) {
            popError($('.J_relation2'), 'ml106 mtop', '请输入第一联系人！');
        } else {
            removeError($('.J_relation2'), '');
        }
        if (isFirstPTel) {
            popError($('.J_relation3'), 'ml106 m_firstPTel', '请填写手机号码！');
        } else if (testFirstPTel) {
            popError($('.J_relation3'), 'ml106 m_firstPTel', '请填写正确格式的手机号码！');
        } else {
            removeError($('.J_relation3'), '.m_firstPTel');
        }
        if (isFirstPAddress) {
            popError($('.J_relation3'), 'mr74 m_firstPAddress', '请输入地址！');
        } else {
            removeError($('.J_relation3'), '.m_firstPAddress');
        }
        if (isNextPeople) {
            popError($('.J_relation4'), 'ml106 mtop', '请输入第二联系人！');
        } else {
            removeError($('.J_relation4'), '');
        }
        if (isNextPTel) {
            popError($('.J_relation5'), 'ml106 m_nextPTel', '请填写手机号码！');
        } else if (testNextPTel) {
            popError($('.J_relation5'), 'ml106 m_nextPTel', '请填写正确格式的手机号码！');
        } else {
            removeError($('.J_relation5'), '.m_nextPTel');
        }
        if (isNextPAddress) {
            popError($('.J_relation5'), 'mr74 nextPAddress', '请输入地址！');
        } else {
            removeError($('.J_relation5'), '.nextPAddress');
        }
        if (testLastPTel) {
            popError($('.J_relation6'), 'ml106 block', '请填写正确格式的手机号码！');
        } else {
            removeError($('.J_relation6'), '');
        }
        if (isUserQQ || isFirstPeople || isFirstPTel || testFirstPTel || isFirstPAddress || isNextPeople || isNextPTel || testNextPTel || isNextPAddress || testLastPTel) {
            return;
        }
        var relationData = JSON.stringify({
            "data": {
                "qq": $('.J_userQQ').val(),
                "aLiWangWang": $('.J_userAliWang').val(),
                "contractRemark": $('.J_relationElse').val(),
                "contactInfoList": [
                    {
                        "contactName": $('.J_firstPeople').val(),
                        "mobile": $('.J_firstPTel').val(),
                        "comAddress": $('.J_firstPAddress').val()
                    },
                    {
                        "contactName": $('.J_nextPeople').val(),
                        "mobile": $('.J_nextPTel').val(),
                        "comAddress": $('.J_nextPAddress').val()
                    },
                    {
                        "contactName": $('.J_lastPeople').val(),
                        "mobile": $('.J_lastPTel').val(),
                        "comAddress": $('.J_lastPAddress').val()
                    }
                ]
            }
        });
        upDateAllData('/userCenter/userDetail/updateUserInfoByPC', relationData);
    });
    //更新企业信息 ,上传营业执照、组织机构、税务登记证图片
    var imgLicenseUrl, imgOrganizeUrl, imgTaxPhotoUrl, fileURL;
    //上传营业执照图片
    $('.J_businessLicensePhoto').change(function () {
        checkFileExt($(this).val());
        if (fileFlag == 1) {
            popError($('.J_companyNine'), 'ml144 block', '文件格式只能是jpg或者是png!');
            return;
        }
        var form = new FormData(document.getElementById('formLicense'));
        upDateImage(form, function () {
            imgLicenseUrl = fileURL;
        });
        $('.s_tipLicense').html('已上传').addClass('file-end');
    });
    //上传组织机构图片
    $('.J_organizationPhoto').change(function () {
        checkFileExt($(this).val());
        if (fileFlag == 1) {
            popError($('.J_companyTen'), 'ml144 block', '文件格式只能是jpg或者是png!');
            return;
        }
        var form = new FormData(document.getElementById('formOrganization'));
        upDateImage(form, function () {
            imgOrganizeUrl = fileURL;
        });
        $('.s_tipOrganize').html('已上传').addClass('file-end');
    });
    //上传税务登记证图片
    $('.J_taxPhoto').change(function () {
        checkFileExt($(this).val());
        if (fileFlag == 1) {
            popError($('.J_companyEleven'), 'ml144 block', '文件格式只能是jpg或者是png!');
            return;
        }
        var form = new FormData(document.getElementById('formTaxPhoto'));
        upDateImage(form, function () {
            imgTaxPhotoUrl = fileURL;
        });
        $('.s_tipTaxPhoto').html('已上传').addClass('file-end');
    });
    //保存企业信息点击提交
    $('.J_submitCompany').click(function () {
        var isLegalPerson = $('.J_legalPerson').val() == '',
            isLegalID = ($('.J_legalID').val() == '') || (!regID.test($('.J_legalID').val())),
            isLegalNumber = $('.J_legalNumber').val() == '',
            testLegalNumber = !regTel.test($('.J_legalNumber').val()),
            isFrequentName = $('.J_frequentName').val() == '',
            isFrequentNumber = $('.J_frequentNumber').val() == '',
            testFrequentNumber = !regTel.test($('.J_frequentNumber').val()),
            isFirmEmail = $('.J_firmEmail').val() == '',
            testFirmEmail = !regEmail.test($('.J_firmEmail').val()),
            isCompanyName = $('.J_companyName').val() == '',
            isCompanyPeople = $('.J_companyPeople').val() == '',
            isCompanyAddress = $('.J_companyAddress').val() == '',
            isTimeRegister = $('.J_timeRegister').val() == '',
            isMoneyRegister = ($('.J_moneyRegister').val() == '') || (!regNumberPoint.test($('.J_moneyRegister').val())),
            isMoneyActual = ($('.J_moneyActual').val() == '') || (!regNumberPoint.test($('.J_moneyActual').val())),
            isShareholderName = $('.J_shareholderName').val() == '',
            isManageArea = $('.J_manageArea').val() == '',
            isBusinessLicense = $('.J_businessLicense').val() == '',  //营业执照副本
            testBusinessLicense = !regBusinessLicense.test($('.J_businessLicense').val()),  //营业执照副本
            isRegisterAddress = $('.J_registerAddress').val() == '',
            isBusinessLicensePhoto = $('.J_businessLicensePhoto').val() == '' && ($('.s_tipLicense').html() == '请上传正面证件照');
        if (isLegalPerson) {
            popError($('.J_company1'), 'ml149 m_LegalPerson', '请输入法定代表人真实姓名!');
        } else {
            removeError($('.J_company1'), '.m_LegalPerson');
        }
        if (isLegalID) {
            popError($('.J_company1'), 'ml610 m_LegalID', '请输入正确格式的法定代表人身份证号!');
        } else {
            removeError($('.J_company1'), '.m_LegalID');
        }
        if (isLegalNumber) {
            popError($('.J_company2'), 'ml149 m_LegalNumber', '请输入手机号码!');
        } else if (testLegalNumber) {
            popError($('.J_company2'), 'ml149 m_LegalNumber', '手机号码格式不正确!');
        }
        else {
            removeError($('.J_company2'), '.m_LegalNumber');
        }
        if (isFrequentName) {
            popError($('.J_company2'), 'ml610 m_FrequentName', '请输入常用联系人真实姓名!');
        } else {
            removeError($('.J_company2'), '.m_FrequentName');
        }
        if (isFrequentNumber) {
            popError($('.J_company3'), 'ml149 m_FrequentNumber', '请输入联系人手机号码!');
        } else if (testFrequentNumber) {
            popError($('.J_company3'), 'ml149 m_FrequentNumber', '手机号码格式不正确!');
        }
        else {
            removeError($('.J_company3'), '.m_FrequentNumber');
        }
        if (isFirmEmail) {
            popError($('.J_company3'), 'ml610 m_FirmEmail', '请输入邮箱地址!');
        } else if (testFirmEmail) {
            popError($('.J_company3'), 'ml610 m_FirmEmail', '邮箱格式不正确!');
        }
        else {
            removeError($('.J_company3'), '.m_FirmEmail');
        }
        if (isCompanyName) {
            popError($('.J_company4'), 'ml149 m_CompanyName', '请输入公司名称!');
        } else {
            removeError($('.J_company4'), '.m_CompanyName');
        }
        if (isCompanyPeople) {
            popError($('.J_company4'), 'ml610 m_CompanyPeople', '请选择公司规模!');
        } else {
            removeError($('.J_company4'), '.m_CompanyPeople');
        }
        if (isCompanyAddress) {
            popError($('.J_company5'), 'ml149 m_CompanyAddress', '请输入公司地址!');
        } else {
            removeError($('.J_company5'), '.m_CompanyAddress');
        }
        if (isTimeRegister) {
            popError($('.J_company5'), 'ml610 m_TimeRegister', '请输入注册时间!');
        } else {
            removeError($('.J_company5'), '.m_TimeRegister');
        }
        if (isMoneyRegister) {
            popError($('.J_company6'), 'ml149 m_MoneyRegister', '请输入注册资本!');
        } else {
            removeError($('.J_company6'), '.m_MoneyRegister');
        }
        if (isMoneyActual) {
            popError($('.J_company6'), 'ml610 m_MoneyActual', '请输入实缴资本!');
        } else {
            removeError($('.J_company6'), '.m_MoneyActual');
        }
        if (isShareholderName) {
            popError($('.J_company7'), 'ml149 mt100 m_ShareholderName', '请输入股东名称!');
        } else {
            removeError($('.J_company7'), '.m_ShareholderName');
        }
        if (isManageArea) {
            popError($('.J_company7'), 'ml610 mt100 m_ManageArea', '请输入经营区域!');
        } else {
            removeError($('.J_company7'), '.m_ManageArea');
        }
        if (isBusinessLicense) {
            popError($('.J_company9'), 'ml149 block mtop', '请输入营业执照副本编号!');
        } else if (testBusinessLicense) {
            popError($('.J_company9'), 'ml149 block mtop', '格式必须为18位!');
        }
        else {
            removeError($('.J_company9'), '');
        }
        if (isRegisterAddress) {
            popError($('.J_company10'), 'ml149 block mtop', '请输入企业注册地址!');
        } else {
            removeError($('.J_company10'), '');
        }
        if (isBusinessLicensePhoto) {
            popError($('.J_company11'), 'ml149 block mtop', '请上传正面证件照!');
        } else {
            removeError($('.J_company11'), '');
        }
        if (isLegalPerson || isLegalID || isLegalNumber || testLegalNumber || isFrequentName || isFrequentNumber || testFrequentNumber || isFirmEmail || testFirmEmail || isCompanyName || isCompanyPeople || isCompanyAddress
            || isTimeRegister || isMoneyRegister || isMoneyActual || isShareholderName || isManageArea || isBusinessLicense || testBusinessLicense || isRegisterAddress || isBusinessLicensePhoto) {
            return;
        }
        var companyInfoData = JSON.stringify({
            "data": {
                "comRepName": $('.J_legalPerson').val(),
                "comReCardId": $('.J_legalID').val(),
                "comRepMobileNo": $('.J_legalNumber').val(),
                "commonPerName": $('.J_frequentName').val(),
                "commonPerMobileNo": $('.J_frequentNumber').val(),
                "commonPerEmailNo": $('.J_firmEmail').val(),
                "companyName": $('.J_companyName').val(),
                "companySize": $('.J_companyPeople').val(),
                "companyAddress": $('.J_companyAddress').val(),
                "registrationTime": $('.J_timeRegister').val(),
                "registeredCapital": $('.J_moneyRegister').val(),
                "actualPayment": $('.J_moneyActual').val(),
                "shareholderName": $('.J_shareholderName').val(),
                "managementArea": $('.J_manageArea').val(),
                "shareholderType": $('.J_shareholderType').val(),
                "certificatesType": $('.J_shareholderPapers').val(),
                "orgInstitutionNo": $('.J_organizingCode').val(),
                "taxRegistrationNo": $('.J_taxCode').val(),
                "busLicenseNo": $('.J_businessLicense').val(),
                "registeredAddress": $('.J_registerAddress').val(),
                "busLicenseUrl": imgLicenseUrl,
                "orgInstitutionUrl": imgOrganizeUrl,
                "taxRegistrationUrl": imgTaxPhotoUrl
            }
        });
        upDateFirmData('/userCenter/userDetail/insertCompanyInfo', companyInfoData)
    });
    //更新资料
    function upDateAllData(url, allData) {
        $.xxdAjax({
            url: url,
            type: 'patch',
            clientId: 'XXD_FRONT_END',
            token: token,
            data: allData,
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        if (data.data.code == 0) {
                            side.thisDialog(data.data.message);
                            $('.pop-error').remove();
                        } else {
                            side.thisDialog(data.data.message);
                        }
                    } else {
                        side.thisDialog(data.message);
                    }
                } else {
                    side.thisDialog(data.message);
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }

    //新增修改企业信息
    function upDateFirmData(url, allData) {
        //邮箱没修改的话
        if (commonEmail == $('.J_firmEmail').val()) {
            //验证法人并提交
            checkLegal();
        } else {
            //判断邮箱是否已经注册
            $.xxdAjax({
                url: '/userCenter/userDetail/checkCompanyEmailUnique',
                type: 'get',
                clientId: 'XXD_FRONT_END',
                data: {
                    email: $('.J_firmEmail').val()
                },
                callbacks: function (data) {
                    if (data && data.code == '200000') {
                        if (data.data) {
                            if (data.data.data == 0) {
                                removeError($('.J_company3'), '.m_FirmEmail');
                                //邮箱未注册过，成功
                                checkLegal();
                            } else {
                                //邮箱已注册，报错
                                popError($('.J_company3'), 'ml610 m_FirmEmail', '该邮箱已被注册!');
                            }
                        } else {
                            side.thisDialog('网络异常，请刷新重试');
                        }
                    } else {
                        side.thisDialog('网络异常，请刷新重试');
                    }
                },
                error: function () {
                    side.thisDialog('网络异常，请刷新重试');
                }
            });
        }
        function checkLegal() {
            //验证法人手机号跟法人身份证，同一个身份证和手机号必须和系统某一个用户完全一致 或者完全不一致
            $.xxdAjax({
                url: '/userCenter/user/appro/checkMobileIsUsableForFaDaDaCompro',
                type: 'post',
                clientId: 'XXD_FRONT_END',
                data: JSON.stringify({
                    "data": {
                        "idcardNo": $('.J_legalID').val(),
                        "mobile": $('.J_legalNumber').val()
                    }
                }),
                callbacks: function (data) {
                    if (data && data.code == '200000') {
                        if (data.data) {
                            if (data.data.data == 0) {
                                removeError($('.J_company1'), '.m_LegalID');
                                removeError($('.J_company2'), '.m_LegalNumber');
                                //法人身份证与手机号系统中不一致，则可以使用 ,再请求修改新增接口
                                $.xxdAjax({
                                    url: url,
                                    type: 'patch',
                                    clientId: 'XXD_FRONT_END',
                                    token: token,
                                    data: allData,
                                    callbacks: function (data) {
                                        if (data && data.code == '200000') {
                                            if (data.data) {
                                                if (data.data.code == 0) {
                                                    $('.pop-error').remove();
                                                    backDelDialog(data.data.message);
                                                } else {
                                                    side.thisDialog(data.data.message);
                                                }
                                            } else {
                                                side.thisDialog(data.message);
                                            }
                                        } else {
                                            side.thisDialog(data.message);
                                        }
                                    },
                                    error: function () {
                                        side.thisDialog('网络异常，请刷新重试');
                                    }
                                });
                            } else {
                                //已经使用过身份证和手机
                                popError($('.J_company1'), 'ml610 m_LegalID', '信息错误!');
                                popError($('.J_company2'), 'ml149 m_LegalNumber', '信息错误!');
                            }
                        } else {
                            side.thisDialog('网络异常，请刷新重试');
                        }
                    } else {
                        side.thisDialog('网络异常，请刷新重试');
                    }
                },
                error: function () {
                    side.thisDialog('网络异常，请刷新重试');
                }
            });
        }
    }

    //公共弹窗，会更改企业信息详情为企业列表
    function backDelDialog(data) {
        dialog({
            content: "<div class='dimension operate-tip'>"
            + "<i class=' close_x J_backFirmTable'>×</i>"
            + "<h5>提示</h5>"
            + "<div class='tip-content'>"
            + "<p>" + data + "</p>"
            + "<a href='#' class='btn J_backFirmTable'>确定</a>"
            + "</div>"
            + "</div>",
            id: "",
            confirm: function (art) {

            },
            cancel: function (art) {
                art.remove();
            }
        });
    }

    //修改新增成功后，点击确定关闭按钮，返回企业资料列表
    $('body').on("click", ".J_backFirmTable", function () {
        $('.mui-dialog').remove();
        //请求列表接口，重新渲染修改后的企业资料列表
        $.xxdAjax({
            url: '/userCenter/user/getCompanyInfos',
            type: 'get',
            clientId: 'XXD_FRONT_END',
            token: token,
            data: {},
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        if (data.data.companyInfo) {
                            $('.firm-gather table').html('');
                            $.each(data.data.companyInfo, function (i, v) {
                                $('.firm-gather table').append('<tr><td companyid="' + v.id + '">' + v.companyName + '</td>' +
                                    '<td><a class="change-company J_changeFirm">更改信息</a></td>' +
                                    '<td><a class="delete-company J_deleteFirm">删除</a></td></tr>');
                            });
                        }
                        $('.firm-empty').addClass('hide');
                        $('.firm-gather').removeClass('hide');
                    } else {
                        side.thisDialog('网络异常，请重试');
                    }
                } else {
                    side.thisDialog('网络异常，请重试');
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    });
    //图片上传
    function upDateImage(form, callback) {
        $.ajax({
            url: '/fileCenter/files?bizCode=XXD_USER_DETAILS&fileDir=xxd%2Fuserdetail',
            type: 'post',
            data: form,
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function (request) {
                request.setRequestHeader('clientId', 'SHENZHOURONG');
                request.setRequestHeader('clientTime', new Date().getTime());
            },
            success: function (data) {
                if (data.code == '200000') {
                    if (data.data.fileURL) {
                        fileURL = data.data.fileURL;
                    }
                    callback();
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }

    //企业用户多个企业信息情况
    var busLicenseUrl, orgInstitutionUrl, taxRegistrationUrl, companyid, commonEmail;
    //点击新增企业
    $('.J_addCompany').click(function () {
        $('.firm-empty').find('input').val('');
        $('.J_companyPeople,.J_shareholderType,.J_shareholderPapers').val('');
        $('.s_tipLicense').html('请上传正面证件照').removeClass('file-end');
        $('.firm-empty').removeClass('hide');
        $('.firm-gather').addClass('hide');
        rightHight();
    });
    //点击修改按钮
    $('body').on('click', '.J_changeFirm', function (v) {
        companyid = $(v.target).parent().prev().attr('companyid');
        //点击提交改为点击修改按钮
        $('.J_submitCompany').addClass('hide');
        $('.J_reviseCompany').removeClass('hide');
        //请求接口确定该页面能否修改
        $.xxdAjax({
            url: '/userCenter/user/getCompanyInfos',
            type: 'get',
            clientId: 'XXD_FRONT_END',
            token: token,
            data: {
                id: companyid
            },
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        $('.firm-empty').removeClass('hide');
                        $('.firm-gather').addClass('hide');
                        //渲染table表格
                        var comInfoItem = data.data.companyInfo[0];
                        $('.J_legalPerson').val(comInfoItem.comRepName);       //法定代表人真实姓名
                        $('.J_legalID').val(comInfoItem.comReCardId);           //法定代表人身份证号
                        $('.J_legalNumber').val(comInfoItem.comRepMobileNo);       //手机号码
                        $('.J_frequentName').val(comInfoItem.commonPerName);       //常用联系人真实姓名
                        $('.J_frequentNumber').val(comInfoItem.commonPerMobileNo);     //联系人手机号码
                        commonEmail = comInfoItem.commonPerEmailNo;
                        $('.J_firmEmail').val(comInfoItem.commonPerEmailNo);     //联系人邮箱
                        $('.J_companyName').val(comInfoItem.companyName);       //公司名称
                        $('.J_companyPeople').val(comInfoItem.companySize);       //公司规模
                        $('.J_companyAddress').val(comInfoItem.companyAddress);       //公司地址
                        var registrationFnDate = $.fnDateToString(comInfoItem.registrationTime, 'yyyy-MM-dd');
                        $('.J_timeRegister').val(registrationFnDate);       //注册时间
                        $('.J_moneyRegister').val(comInfoItem.registeredCapital);       //注册资本
                        $('.J_moneyActual').val(comInfoItem.actualPayment);       //实缴资本
                        $('.J_shareholderName').val(comInfoItem.shareholderName);       //股东名称
                        $('.J_manageArea').val(comInfoItem.managementArea);       //经营区域
                        $('.J_shareholderType').val(comInfoItem.shareholderType);       //股东类型
                        $('.J_shareholderPapers').val(comInfoItem.certificatesType);       //股东证件类型
                        $('.J_organizingCode').val(comInfoItem.orgInstitutionNo);       //组织机构代码编号
                        $('.J_taxCode').val(comInfoItem.taxRegistrationNo);               //税务登记本编号
                        $('.J_businessLicense').val(comInfoItem.busLicenseNo);       //营业执照副本编号
                        $('.J_registerAddress').val(comInfoItem.registeredAddress);       //注册地址
                        busLicenseUrl = comInfoItem.busLicenseUrl;
                        var busLicenseUrlSplit = comInfoItem.busLicenseUrl.split('/');
                        $('.s_tipLicense').html(busLicenseUrlSplit[busLicenseUrlSplit.length - 1]);      //营业执照副本图片
                        if (comInfoItem.orgInstitutionUrl) {
                            orgInstitutionUrl = comInfoItem.orgInstitutionUrl;
                            var orgInstitutionUrlSplit = comInfoItem.orgInstitutionUrl.split('/');
                            $('.s_tipOrganize').html(orgInstitutionUrlSplit[orgInstitutionUrlSplit.length - 1]);      //组织机构图片
                        }
                        if (comInfoItem.taxRegistrationUrl) {
                            taxRegistrationUrl = comInfoItem.taxRegistrationUrl;
                            var taxRegistrationUrlSplit = comInfoItem.orgInstitutionUrl.split('/');
                            $('.s_tipTaxPhoto').html(taxRegistrationUrlSplit[taxRegistrationUrlSplit.length - 1]);      //税务登记证图片
                        }
                        //判断是否可修改
                        if (data.data.resultCode == 0) {
                            //可修改
                        } else if (data.data.resultCode == -1) {
                            //不可修改 , 全部置灰
                            side.thisDialog(data.data.resultDesc);
                            $('.firm-empty').find('input,select').attr("disabled", true).addClass('disabled');
                            $('.firm-empty').find('.openbank,.openbank i').addClass('disabled');
                            $('.J_reviseCompany').addClass('hide');
                            $('.J_noCompany').removeClass('hide').addClass('btn-disabled');
                        } else if (data.data.resultCode == -2) {
                            //可修改公司规模，公司地址，常用联系人真实姓名，联系人手机号
                            side.thisDialog(data.data.resultDesc);
                            $('.firm-empty').find('input,select').attr("disabled", true).addClass('disabled');
                            $('.firm-empty').find('.openbank,.openbank i').addClass('disabled');
                            $('.J_companyPeople,.J_companyAddress,.J_frequentName,.J_frequentNumber').attr("disabled", false).removeClass('disabled');
                        } else {
                            side.thisDialog('网络异常，请重试');
                        }
                    } else {
                        side.thisDialog('网络异常，请重试');
                    }
                } else {
                    side.thisDialog('网络异常，请重试');
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
        rightHight();
    })
    //修改企业信息提交
    $('.J_reviseCompany').click(function () {
        var isLegalPerson = $('.J_legalPerson').val() == '',
            isLegalID = ($('.J_legalID').val() == '') || (!regID.test($('.J_legalID').val())),
            isLegalNumber = $('.J_legalNumber').val() == '',
            testLegalNumber = !regTel.test($('.J_legalNumber').val()),
            isFrequentName = $('.J_frequentName').val() == '',
            isFrequentNumber = $('.J_frequentNumber').val() == '',
            testFrequentNumber = !regTel.test($('.J_frequentNumber').val()),
            isFirmEmail = $('.J_firmEmail').val() == '',
            testFirmEmail = !regEmail.test($('.J_firmEmail').val()),
            isCompanyName = $('.J_companyName').val() == '',
            isCompanyPeople = $('.J_companyPeople').val() == '',
            isCompanyAddress = $('.J_companyAddress').val() == '',
            isTimeRegister = $('.J_timeRegister').val() == '',
            isMoneyRegister = ($('.J_moneyRegister').val() == '') || (!regNumberPoint.test($('.J_moneyRegister').val())),
            isMoneyActual = ($('.J_moneyActual').val() == '') || (!regNumberPoint.test($('.J_moneyActual').val())),
            isShareholderName = $('.J_shareholderName').val() == '',
            isManageArea = $('.J_manageArea').val() == '',
            isBusinessLicense = $('.J_businessLicense').val() == '',  //营业执照副本
            testBusinessLicense = !regBusinessLicense.test($('.J_businessLicense').val()),  //营业执照副本
            isRegisterAddress = $('.J_registerAddress').val() == '',
            isBusinessLicensePhoto = $('.J_businessLicensePhoto').val() == '' && ($('.s_tipLicense').html() == '请上传正面证件照');
        if (isLegalPerson) {
            popError($('.J_company1'), 'ml149 m_LegalPerson', '请输入法定代表人真实姓名!');
        } else {
            removeError($('.J_company1'), '.m_LegalPerson');
        }
        if (isLegalID) {
            popError($('.J_company1'), 'ml610 m_LegalID', '请输入正确格式的法定代表人身份证号!');
        } else {
            removeError($('.J_company1'), '.m_LegalID');
        }
        if (isLegalNumber) {
            popError($('.J_company2'), 'ml149 m_LegalNumber', '请输入手机号码!');
        } else if (testLegalNumber) {
            popError($('.J_company2'), 'ml149 m_LegalNumber', '手机号码格式不正确!');
        }
        else {
            removeError($('.J_company2'), '.m_LegalNumber');
        }
        if (isFrequentName) {
            popError($('.J_company2'), 'ml610 m_FrequentName', '请输入常用联系人真实姓名!');
        } else {
            removeError($('.J_company2'), '.m_FrequentName');
        }
        if (isFrequentNumber) {
            popError($('.J_company3'), 'ml149 m_FrequentNumber', '请输入联系人手机号码!');
        } else if (testFrequentNumber) {
            popError($('.J_company3'), 'ml149 m_FrequentNumber', '手机号码格式不正确!');
        }
        else {
            removeError($('.J_company3'), '.m_FrequentNumber');
        }
        if (isFirmEmail) {
            popError($('.J_company3'), 'ml610 m_FirmEmail', '请输入邮箱地址!');
        } else if (testFirmEmail) {
            popError($('.J_company3'), 'ml610 m_FirmEmail', '邮箱格式不正确!');
        }
        else {
            removeError($('.J_company3'), '.m_FirmEmail');
        }
        if (isCompanyName) {
            popError($('.J_company4'), 'ml149 m_CompanyName', '请输入公司名称!');
        } else {
            removeError($('.J_company4'), '.m_CompanyName');
        }
        if (isCompanyPeople) {
            popError($('.J_company4'), 'ml610 m_CompanyPeople', '请选择公司规模!');
        } else {
            removeError($('.J_company4'), '.m_CompanyPeople');
        }
        if (isCompanyAddress) {
            popError($('.J_company5'), 'ml149 m_CompanyAddress', '请输入公司地址!');
        } else {
            removeError($('.J_company5'), '.m_CompanyAddress');
        }
        if (isTimeRegister) {
            popError($('.J_company5'), 'ml610 m_TimeRegister', '请输入注册时间!');
        } else {
            removeError($('.J_company5'), '.m_TimeRegister');
        }
        if (isMoneyRegister) {
            popError($('.J_company6'), 'ml149 m_MoneyRegister', '请输入注册资本!');
        } else {
            removeError($('.J_company6'), '.m_MoneyRegister');
        }
        if (isMoneyActual) {
            popError($('.J_company6'), 'ml610 m_MoneyActual', '请输入实缴资本!');
        } else {
            removeError($('.J_company6'), '.m_MoneyActual');
        }
        if (isShareholderName) {
            popError($('.J_company7'), 'ml149 mt100 m_ShareholderName', '请输入股东名称!');
        } else {
            removeError($('.J_company7'), '.m_ShareholderName');
        }
        if (isManageArea) {
            popError($('.J_company7'), 'ml610 mt100 m_ManageArea', '请输入经营区域!');
        } else {
            removeError($('.J_company7'), '.m_ManageArea');
        }
        if (isBusinessLicense) {
            popError($('.J_company9'), 'ml149 block mtop', '请输入营业执照副本编号!');
        } else if (testBusinessLicense) {
            popError($('.J_company9'), 'ml149 block mtop', '格式必须为18位!');
        }
        else {
            removeError($('.J_company9'), '');
        }
        if (isRegisterAddress) {
            popError($('.J_company10'), 'ml149 block mtop', '请输入企业注册地址!');
        } else {
            removeError($('.J_company10'), '');
        }
        if (isBusinessLicensePhoto) {
            popError($('.J_company11'), 'ml149 block mtop', '请上传正面证件照!');
        } else {
            removeError($('.J_company11'), '');
        }
        if (isLegalPerson || isLegalID || isLegalNumber || testLegalNumber || isFrequentName || isFrequentNumber || testFrequentNumber || isFirmEmail || testFirmEmail || isCompanyName || isCompanyPeople || isCompanyAddress
            || isTimeRegister || isMoneyRegister || isMoneyActual || isShareholderName || isManageArea || isBusinessLicense || testBusinessLicense || isRegisterAddress || isBusinessLicensePhoto) {
            return;
        }
        //上传内容
        var companyInfoData = JSON.stringify({
            "data": {
                "id": companyid,
                "comRepName": $('.J_legalPerson').val(),
                "comReCardId": $('.J_legalID').val(),
                "comRepMobileNo": $('.J_legalNumber').val(),
                "commonPerName": $('.J_frequentName').val(),
                "commonPerMobileNo": $('.J_frequentNumber').val(),
                "commonPerEmailNo": $('.J_firmEmail').val(),
                "companyName": $('.J_companyName').val(),
                "companySize": $('.J_companyPeople').val(),
                "companyAddress": $('.J_companyAddress').val(),
                "registrationTime": $('.J_timeRegister').val(),
                "registeredCapital": $('.J_moneyRegister').val(),
                "actualPayment": $('.J_moneyActual').val(),
                "shareholderName": $('.J_shareholderName').val(),
                "managementArea": $('.J_manageArea').val(),
                "shareholderType": $('.J_shareholderType').val(),
                "certificatesType": $('.J_shareholderPapers').val(),
                "orgInstitutionNo": $('.J_organizingCode').val(),
                "taxRegistrationNo": $('.J_taxCode').val(),
                "busLicenseNo": $('.J_businessLicense').val(),
                "registeredAddress": $('.J_registerAddress').val(),
                "busLicenseUrl": imgLicenseUrl,
                "orgInstitutionUrl": imgOrganizeUrl,
                "taxRegistrationUrl": imgTaxPhotoUrl
            }
        });
        var tipLicenseHtml = $('.s_tipLicense').html(),
            tipOrganizeHtml = $('.s_tipOrganize').html(),
            tipTaxPhotoHtml = $('.s_tipTaxPhoto').html();
        if (tipLicenseHtml != '已上传') {
            imgLicenseUrl = busLicenseUrl;
        }
        if (tipOrganizeHtml != '已上传') {
            imgOrganizeUrl = orgInstitutionUrl;
        }
        if (tipTaxPhotoHtml != '已上传') {
            imgTaxPhotoUrl = taxRegistrationUrl;
        }
        upDateFirmData('/userCenter/userDetail/updateCompanyInfo', companyInfoData)
    });
    //删除当前企业信息
    var companyidDel;
    $('body').on('click', '.J_deleteFirm', function (v) {
        companyidDel = $(v.target).parent().prev().prev().attr('companyid');
        //弹框提示是否删除
        dialog({
            content: "<div class='dimension operate-tip'>"
            + "<i class='c_close close_x'>×</i>"
            + "<h5>提示</h5>"
            + "<div class='tip-content'>"
            + "<p>是否确定删除</p>"
            + "<a href='#' class='btn J_ensureDelete'>确认删除</a>"
            + "<a href='#' class='btn c_close next'>取消</a>"
            + "</div>"
            + "</div>",
            id: "",
            confirm: function (art) {

            },
            cancel: function (art) {
                art.remove();
            }
        });

    });
    //确认删除
    $('body').on('click', '.J_ensureDelete', function () {
        //请求接口确定删除
        $.xxdAjax({
            url: '/userCenter/user/updateCompanyStatus',
            type: 'get',
            clientId: 'XXD_INTEGRATION_PLATFORM',
            token: token,
            data: {
                id: companyidDel
            },
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        if (data.data.resultCode == 0) {
                            //可删除
                            $('.mui-dialog').remove();
                            side.thisDialog('删除成功');
                            $('.firm-gather td').each(function (i, v) {
                                if ($(v).attr('companyid') == companyidDel) {
                                    $(v).parent().remove();
                                }
                            });
                        } else {
                            $('.mui-dialog').remove();
                            dialog({
                                content: "<div class='dimension operate-tip'>"
                                + "<i class='c_close close_x'>×</i>"
                                + "<h5>提示</h5>"
                                + "<div class='tip-content'>"
                                + "<p style='margin-bottom: 40px;'>" + data.data.resultDesc + "</p>"
                                + "</div></div>",
                                id: "",
                                confirm: function (art) {
                                },
                                cancel: function (art) {
                                    art.remove();
                                }
                            });
                            setTimeout(function () {
                                $('.mui-dialog').remove();
                            }, 3000);
                        }
                    } else {
                        $('.pop-error').html('网络异常，请重试').removeClass('hide');
                    }
                } else {
                    $('.pop-error').html('网络异常，请重试').removeClass('hide');
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    });
    //文件类型
    function checkFileExt(filename) {
        var arr = ["jpg", "JPG", "png", "PNG"];
        var index = filename.lastIndexOf(".");
        var ext = filename.substr(index + 1);
        for (var i = 0; i < arr.length; i++) {
            if (ext == arr[i]) {
                fileFlag = 0;
                break;
            } else {
                fileFlag = 1;
            }
        }
    }

    //更改固定资产情况
    function buyHouseTrue() {
        $('.J_buyHouseYear,.J_buyHouseMonth,.J_houseProperty,.J_paymentHouse,' +
            '.J_houseArea,.J_housePercent').attr("disabled", true).addClass('disabled');
    }

    function buyCarTrue() {
        $('.J_buyCarYear,.J_buyCarMonth,.J_carFront,.J_carNext,.J_paymentCar').attr("disabled", true).addClass('disabled');
    }

    function buyHouseFalse() {
        $('.J_buyHouseYear,.J_buyHouseMonth,.J_houseProperty,.J_paymentHouse,' +
            '.J_houseArea,.J_housePercent').attr("disabled", false).removeClass('disabled');
    }

    function buyCarFalse() {
        $('.J_buyCarYear,.J_buyCarMonth,.J_carFront,.J_carNext,.J_paymentCar').attr("disabled", false).removeClass('disabled');
    }

    //渲染省
    var provinceAll = global.provinceList.data.provinceList;
    $.each(provinceAll, function (i, v) {
        $('.J_nowProvince,.J_workAddressone').append('<option value="' + v.code + '">' + v.name + '</option>');
    });
    //渲染市
    function updateCity(val, obj) {
        $.xxdAjax({
            url: '/userCenter/user/cityList?code=' + val,
            type: 'get',
            clientId: 'XXD_FRONT_END',
            data: {},
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        if (data.data.cityList) {
                            obj.html('<option selected value="">--请选择--</option>');
                            $.each(data.data.cityList, function (i, v) {
                                obj.append('<option value="' + v.code + '">' + v.name + '</option>');
                            });
                        } else {
                            side.thisDialog(data.data.message);
                        }
                    } else {
                        side.thisDialog(data.message);
                    }
                } else {
                    side.thisDialog(data.message);
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }

    //报错
    function popError(obj, css, content) {
        if (obj.find('.pop-error.block').length != 0) {
            return;
        }
        if (obj.find('.pop-error' + css).length != 0) {
            return;
        }
        obj.addClass('mb55').append('<p class="pop-error ' + css + '">' + content + '</p>');
    }

    //移除报错
    function removeError(obj, classCon) {
        obj.find('.pop-error' + classCon).remove();
        if (obj.find('.pop-error').length == 0) {
            obj.removeClass('mb55');
        }
    }

    side.getLeftHeight();
}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});