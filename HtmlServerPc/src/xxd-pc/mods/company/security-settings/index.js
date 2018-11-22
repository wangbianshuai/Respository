require(['base', "trackBase", 'store', 'juicer'
    , 'companyHeader', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, track, store, jui, header, footer, dialog) {
    header.init();
    footer.init();
    var fakeToken = getCookie('Token');
    if(fakeToken == '' || fakeToken == null || fakeToken == undefined){
        alert('登录状态异常，请重新登录！');
        window.location.href = '/user/delSessionAndForwardToLogin.html';
        return false;
    }else{
        if(fakeToken.substring(0,1) == '\"'){
            fakeToken = fakeToken.substr(1,fakeToken.length - 2);
        }
    }
    var domain,version=window.version,proTocol=window.location.protocol;
    if(document.domain == 'stage.xxd.com'){
        domain =  proTocol+'//stage-static.xxd.com/pc/'+version+'/build/mods/company/security-settings/i/';
    }else if(document.domain == 'dev.xxd.com'){
        domain = proTocol+'//dev-static.xxd.com/pc/'+version+'/build/mods/company/security-settings/i/';
    }else if(document.domain == 'uat.xxd.com'){
        domain = proTocol+'//uat-static.xxd.com/pc/'+version+'/build/mods/company/security-settings/i/';
    }else if(document.domain == 'www.xinxindai.com'){
        domain = proTocol+'//static.xinxindai.com/pc/'+version+'/build/mods/company/security-settings/i/';
    }
    var timer = new Date();
    var myTime = timer.getTime();
    var dataFlag = 0;
    var openType = 1;
    securitySettingsData();
    function getCookie(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return unescape(arr[2]);
        }else{
            return null;
        }
    }
    $('#editInsure').on('click',function () {
        securitySettingsData()
    });
  function securitySettingsData() {
        $.ajax({
            url:'/userCenter/user/queryUserAuthStByFYou',
            type:'get',
            async:false,
            cache:false,
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_STATIC_PC');
                request.setRequestHeader('clientTime',myTime);
                request.setRequestHeader('token',fakeToken);
            },
            success:function(data){
                if(data.code != '200000'){
                    if(data.code == '200403' || data.code == '200406' || data.code == '200407' || data.code == '200408' || data.code == '200600' || data.code == '200601' || data.code == '200602'){
                        alert(data.message);
                        return false;
                    }else if(data.code == '200400'){
                        alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                        return false;
                    }else if(data.code == '200301' || data.code == '200302' || data.code == '200303' || data.code == '200304' || data.code == '200305'){
                        alert('登录状态异常，请重新登录！');
                        window.location.href = '../../user/delSessionAndForwardToLogin.html';
                        return false;
                    }else if(data.code == '100500' || data.code == '100600' || data.code == '100700' || data.code == '100900'){
                        alert(data.message);
                        return false;
                    }else{
                        alert(data.message);
                        return false;
                    }
                }else{
                    if(data.data.code != 0){
                        $('#tableCon').fadeOut(0);
                        if(data.data.code == 1){
                            openType = 1;
                            dialog({
                                id: "",
                                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                "<div class='m-con-bd'>" +
                                "<div class='filed-user'>  " +
                                "<p>尊敬的用户，为了提升您的资金安全，保证顺利投标、充值和提现等操作，建议您尽快开通华瑞银行存管账户</p> </div> " +
                                "<div class='filed-user'>  <p class='clearfix'><a class='btn_left left c_confirm' id='J_submitApply'>开通存管账户</a><a class='btn btn_right right c_close' >暂不开通</a></p> </div>" +
                                "</div>"
                                + "</div>",
                                cancel: function (clo) {
                                    clo.close();
                                },
                                confirm: function () {
                                    window.location.href = 'openAccount.html';
                                }
                            });
                            return false;
                        }else{
                            alert(data.data.message);
                            return false;
                        }
                    }else{
                        //judgeUser();
                        openType = 0;
                        $('#tableCon').fadeIn(0);
                        if(dataFlag == 0){
                            dataFlag = 1;
                            $.each(data.data.data.results,function(index,item){
                                if(item.autoLendStatus == '0'){
                                    $('#tableCon').append('<tr><td style="width:170px;">自动出借授权</td><td style="width:160px;">--</td><td style="width:160px;">--</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '0.png" /></td><td>--</td></tr>');
                                }else if(item.autoLendStatus == '1'){
                                    $('#tableCon').append('<tr><td style="width:170px;">自动出借授权</td><td style="width:160px;">' + item.auto_lend_amt + '</td><td style="width:160px;">' + item.auto_lend_term + '</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '1.png" /></td><td>已使用授权出借额度' + item.used_lend_amt + '</td></tr>');
                                }
                                if(item.autoRepayStatus == '0'){
                                    $('#tableCon').append('<tr><td style="width:170px;">自动还款授权</td><td style="width:160px;">--</td><td style="width:160px;">--</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '0.png" /></td><td>--</td></tr>');
                                }else if(item.autoRepayStatus == '1'){
                                    $('#tableCon').append('<tr><td style="width:170px;">自动还款授权</td><td style="width:160px;">' + item.auto_repay_amt + '</td><td style="width:160px;">' + item.auto_repay_term + '</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '1.png" /></td><td>--</td></tr>');
                                }
                                if(item.autoCompenStatus == '0'){
                                    $('#tableCon').append('<tr><td style="width:170px;">自动代偿授权</td><td style="width:160px;">--</td><td style="width:160px;">--</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '0.png" /></td><td>--</td></tr>');
                                }else if(item.autoCompenStatus == '1'){
                                    $('#tableCon').append('<tr><td style="width:170px;">自动代偿授权</td><td style="width:160px;">' + item.auto_compen_amt + '</td><td style="width:160px;">' + item.auto_compen_term + '</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '1.png" /></td><td>--</td></tr>');
                                }
                                if(item.autoFeeStatus == '0'){
                                    $('#tableCon').append('<tr><td style="width:170px;">缴费授权</td><td style="width:160px;">--</td><td style="width:160px;">--</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '0.png" /></td><td>--</td></tr>');
                                }else if(item.autoFeeStatus == '1'){
                                    $('#tableCon').append('<tr><td style="width:170px;">缴费授权</td><td style="width:160px;">' + item.auto_fee_amt + '</td><td style="width:160px;">' + item.auto_fee_term + '</td><td style="width:125px;"><img style="width:24px; height:24px; margin-top:6px;" src="' + domain + '1.png" /></td><td>--</td></tr>');
                                }
                            });
                        }
                    }
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    }


}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});