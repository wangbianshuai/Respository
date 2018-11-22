require(['base', "trackBase", 'store', 'juicer'
    , 'companyHeader', 'footer', "dialog", "bankListTpl",'backTop', 'json', "requirejs"
], function ($, track, store, jui, header, footer, dialog,bankListTpl) {
    header.init();
    footer.init();
    var clocks = setInterval(function(){
        if(parseInt($('.g-left').height()) < parseInt($('.g-right').height())){
            $('.g-left').css('min-height',$('.g-right').height() + 'px');
        }else{
            clearInterval(clocks);
        }
    },100);
    function num(obj){
        obj.val(obj.val().replace(/[^\d.]/g,""));
        obj.val(obj.val().replace(/^\./g,""));
        obj.val(obj.val().replace(/\.{2,}/g,"."));
        obj.val(obj.val().replace(".","$#$").replace(/\./g,"").replace("$#$","."));
        obj.val(obj.val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'));
    }
    $('#cardNo').on('keyup',function(){
        num($(this));
    });
    var imgUrl = $('.filed-img').find('#cImg').attr('src');
    $('.filed-img').find('#dImg').click(function(){
        $('.filed-img').find('#cImg').attr('src',imgUrl + '?' + Math.random());
    });
    $('.filed-lost').hover(function(){
        $(this).find('div').fadeIn(0); 
    },function(){
        $(this).find('div').fadeOut(0);
    });
    $.each($('.menu ul li'),function(){
        $(this).find('div').css('display','none');
    });
    $('.menu ul li').eq(3).addClass('showTab');
    $('.showTab').find('div').css('display','block');
    $('.menu ul li a').on('click',function(){
        if($(this).parent('li').attr('class') == 'showTab'){
            $(this).parent('li').removeClass('showTab');
            $(this).parent('li').find('div').css('display','none');
        }else{
            $(this).parent('li').addClass('showTab');
            $(this).parent('li').find('div').css('display','block');
        }
    });
    $('.filed-card1').find('strong').click(function(){
        $('.filed-card1').find('img').fadeIn(0);
    });
    $('.filed-card2').find('strong').click(function(){
        $('.filed-card2').find('img').fadeIn(0);
    });
    $('body').mousedown(function(){
        $('.filed-card1').find('img').fadeOut(0);
        $('.filed-card2').find('img').fadeOut(0);
    });
    var timer = new Date();
    var myTime = timer.getTime();
    function getCookie(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return unescape(arr[2]);
        }else{
            return null;
        }
    }
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
    $('#myToken').val(fakeToken);

    $('#checks').click(function(){
        if($('#checks').is(':checked')){
            $('.filed-card1').fadeOut(0);
            $('.filed-card2').fadeIn(0);
        }else{
            $('.filed-card2').fadeOut(0);
            $('.filed-card1').fadeIn(0);
        }
    });

    //初始化
    var parInt = 1;
    function initBank(){
        $('#bankBrench').val('');
        parInt = 1;
        $('.itembox').fadeOut(0);
        $('.itembox').find('ul').empty();
    }

    //查询更换信息
    function changeCheck(){
       $.ajax({
            url:'/userCenter/user/bank/userCheckingBankCardInfo',
            type:'get',
            async:false,
            cache:false,
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
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
                        window.location.href = '/user/delSessionAndForwardToLogin.html';
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
                        alert(data.data.message);
                        return false;
                    }else{
                        if(data.data.data.existCheckingBankCard == 1){
                            dialog({
                                id: "",
                                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                                "<div class='m-con-bd'>" +
                                "<div class='filed-user'>  " +
                                "<p style='text-align:center;'>您的更换银行卡申请已提交，审核结果将于T+1个工作日生效，审核结果会通过站内信发送，清注意查收。</p></div> " +
                                "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>确认</a></p> </div>" +
                                "</div>"
                                + "</div>",
                                cancel:function (clo) {
                                    window.location.href = 'bundled.html';
                                },
                                confirm:function () {
                                    window.location.href = 'bundled.html';
                                }
                            });
                        }else{
                            
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
    changeCheck();

    //查询银行列表
    function openBank(){
        $.ajax({
            url:'/userCenter/user/bank/fuiouSupportedBanks',
            type:'get',
            async:false,
            cache:false,
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
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
                        window.location.href = '/user/delSessionAndForwardToLogin.html';
                        return false;
                    }else if(data.code == '100500' || data.code == '100600' || data.code == '100700' || data.code == '100900'){
                        alert(data.message);
                        return false;
                    }else{
                        alert(data.message);
                        return false;
                    }
                }else{
                    $.each(data.data.data,function(index,item){
                        $('#openBank').append('<option value="' + item.pkey + '">' + item.pvalue + '</option>');
                    });
                    $('#bankCode').val($('#openBank').find("option:selected").val());
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    }
    openBank();
    $('#openBank').change(function(){
        $('#bankCode').val($('#openBank').find("option:selected").val());
        initBank();
    });

    //查询省信息
    function areaNo(){
        $.ajax({
            url:'/userCenter/user/bank/fuiouDicProvinces',
            type:'get',
            async:false,
            cache:false,
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
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
                        window.location.href = '/user/delSessionAndForwardToLogin.html';
                        return false;
                    }else if(data.code == '100500' || data.code == '100600' || data.code == '100700' || data.code == '100900'){
                        alert(data.message);
                        return false;
                    }else{
                        alert(data.message);
                        return false;
                    }
                }else{
                    $.each(data.data.data,function(index,item){
                        $('#areaNo').append('<option value="' + item.provinceCode + '">' + item.provinceName + '</option>');
                    });
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    }
    areaNo();

    //查询市信息
    function cityNo(){
        $.ajax({
            url:'/userCenter/user/bank/fuiouDicCities',
            type:'get',
            async:false,
            cache:false,
            data:{provinceCode:$('#areaNo').find("option:selected").val()},
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
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
                        window.location.href = '/user/delSessionAndForwardToLogin.html';
                        return false;
                    }else if(data.code == '100500' || data.code == '100600' || data.code == '100700' || data.code == '100900'){
                        alert(data.message);
                        return false;
                    }else{
                        alert(data.message);
                        return false;
                    }
                }else{
                    $('#cityNo').empty();
                    $('#cityNo').append('<option value="100000">请选择</option>');
                    $.each(data.data.data,function(index,item){
                        $('#cityNo').append('<option value="' + item.regionCode + '">' + item.regionName + '</option>');
                    });
                    $('#cityId').val($('#cityNo').find("option:selected").val());
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    }

    $('#areaNo').change(function(){
        if($('#areaNo').find("option:selected").html() == '请选择'){
            $('#cityNo').empty();
            $('#cityNo').append('<option value="100000">请选择</option>');
        }else{
            cityNo();
        }
        initBank();
    });

    $('#cityNo').change(function(){
        $('#cityId').val($('#cityNo').find("option:selected").val());
        initBank();
    });

    //模糊查询
    function parameters(){
        $.ajax({
            url:'/userCenter/user/bank/fuiouSupportedBranchesByKeyWord',
            type:'get',
            async:false,
            cache:false,
            data:{bankCode:$('#openBank').find("option:selected").val(),cityCode:$('#cityNo').find("option:selected").val(),branch:$('#bankBrench').val(),pageIndex:1,pageSize:20},
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
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
                        window.location.href = '/user/delSessionAndForwardToLogin.html';
                        return false;
                    }else if(data.code == '100500' || data.code == '100600' || data.code == '100700' || data.code == '100900'){
                        alert(data.message);
                        return false;
                    }else{
                        alert(data.message);
                        return false;
                    }
                }else{
                    $('.itembox').find('ul').empty();
                    $.each(data.data.data.list,function(index,item){
                        $('.itembox').find('ul').append('<li>' + item.branch + '</li>');
                    });
                    $('.itembox ul li').click(function(){
                        $('#bankBrench').val($(this).html());
                        $('.itembox').find('ul').empty();
                        $('.itembox').fadeOut(0);
                        parInt = 0;
                    })
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    }

    $('#bankBrench').change(function(){
        parInt = 1;
    });

    $('#bankBrench').keyup(function(){
        $('.itembox').fadeIn(0);
        if($(this).val() == ''){
            $('.itembox').fadeOut(0);
        }
        parameters();
    });

    //提交表单
    function formUpload(){  
        var form = new FormData(document.getElementById('myForm'));
        $.ajax({
            url:'/userCenter/user/changeCard/submitFuiouChangeCard/withFile/staticPc',
            type:'post',
            data:form,
            cache:false,
            processData:false,
            contentType:false,
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_INTEGRATION_PLATFORM');
                request.setRequestHeader('clientTime',myTime);
                request.setRequestHeader('token',fakeToken);
            },
            success:function(data){
                if(data.code != '0'){
                    if(data.code == '200403' || data.code == '200406' || data.code == '200407' || data.code == '200408' || data.code == '200600' || data.code == '200601' || data.code == '200602'){
                        alert(data.message);
                        return false;
                    }else if(data.code == '200400'){
                        alert('您的设备本地时间和北京时间差距较大，请确认和北京时间相同之后重新尝试！');
                        return false;
                    }else if(data.code == '200301' || data.code == '200302' || data.code == '200303' || data.code == '200304' || data.code == '200305' || data.code == '200308'){
                        alert('登录状态异常，请重新登录！');
                        window.location.href = '/user/delSessionAndForwardToLogin.html';
                        return false;
                    }else if(data.code == '100500' || data.code == '100600' || data.code == '100700' || data.code == '100900'){
                        alert(data.message);
                        return false;
                    }else{
                        dialog({
                            id: "",
                            content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                            "<div class='m-con-bd'>" +
                            "<div class='filed-user'>  " +
                            "<p style='text-align:center;'>" + data.message + "</p></div> " +
                            "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>确认</a></p> </div>" +
                            "</div>"
                            + "</div>",
                            cancel:function (clo) {
                                clo.close();
                            },
                            confirm:function () {
                                clo.close();
                            }
                        });
                        return false;
                    }
                }else{
                    dialog({
                        id: "",
                        content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                        "<div class='m-con-bd'>" +
                        "<div class='filed-user'>  " +
                        "<p style='text-align:center;'>您的更换银行卡申请已提交，审核结果将于T+1个工作日生效，审核结果会通过站内信发送，清注意查收。</p></div> " +
                        "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>确认</a></p> </div>" +
                        "</div>"
                        + "</div>",
                        cancel:function (clo) {
                            window.location.href = 'bundled.html';
                        },
                        confirm:function () {
                            window.location.href = 'bundled.html';
                        }
                    });
                }
            },
            error:function(){
                alert('网络异常，请重试！');
                return false;
            }
        });
    }

    var fileFlag = 1;
    function checkFileExt(filename){
        var arr = ["jpg","JPG"];
        var index = filename.lastIndexOf(".");
        var ext = filename.substr(index+1);
        for(var i=0;i<arr.length;i++){
            if(ext == arr[i]){
                fileFlag = 0;
                break;
            }else{
                fileFlag = 1;
            }
        }
    }

    $('.openbank').find('input').change(function(){
        checkFileExt($(this).val());
        $('.filed-upload').find('em').html('已上传');
    });

    $('#setOkbtn').click(function(){
        if($('#openBank').find("option:selected").val() == '100000'){
            dialog({
                id: "",
                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                "<div class='m-con-bd'>" +
                "<div class='filed-user'>  " +
                "<p style='text-align:center;'>请选择相应开户行信息！</p></div> " +
                "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>确认</a></p> </div>" +
                "</div>"
                + "</div>",
                cancel:function (clo) {
                    clo.close();
                },
                confirm:function () {
                    clo.close();
                }
            });
            return false;
        }
        if($('#areaNo').find("option:selected").val() == '100000'){
            dialog({
                id: "",
                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                "<div class='m-con-bd'>" +
                "<div class='filed-user'>  " +
                "<p style='text-align:center;'>请选择开户行省市！</p></div> " +
                "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>确认</a></p> </div>" +
                "</div>"
                + "</div>",
                cancel:function (clo) {
                    clo.close();
                },
                confirm:function () {
                    clo.close();
                }
            });
            return false;
        }
        if($('#cityNo').find("option:selected").val() == '100000'){
            dialog({
                id: "",
                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                "<div class='m-con-bd'>" +
                "<div class='filed-user'>  " +
                "<p style='text-align:center;'>请选择开户行区县！</p></div> " +
                "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>确认</a></p> </div>" +
                "</div>"
                + "</div>",
                cancel:function (clo) {
                    clo.close();
                },
                confirm:function () {
                    clo.close();
                }
            });
            return false;
        }
        if(parInt == 1){
            dialog({
                id: "",
                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                "<div class='m-con-bd'>" +
                "<div class='filed-user'>  " +
                "<p style='text-align:center;'>请从下拉框中选择支行名称！</p></div> " +
                "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>确认</a></p> </div>" +
                "</div>"
                + "</div>",
                cancel:function (clo) {
                    clo.close();
                },
                confirm:function () {
                    clo.close();
                }
            });
            return false;
        }
        if($('#picFile').val() == ''){
            dialog({
                id: "",
                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                "<div class='m-con-bd'>" +
                "<div class='filed-user'>  " +
                "<p style='text-align:center;'>请确认照片已成功上传！</p></div> " +
                "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>确认</a></p> </div>" +
                "</div>"
                + "</div>",
                cancel:function (clo) {
                    clo.close();
                },
                confirm:function () {
                    clo.close();
                }
            });
            return false;
        }
        if(fileFlag == 1){
            dialog({
                id: "",
                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                "<div class='m-con-bd'>" +
                "<div class='filed-user'>  " +
                "<p style='text-align:center;'>上传文件格式只能为jpg！</p></div> " +
                "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>确认</a></p> </div>" +
                "</div>"
                + "</div>",
                cancel:function (clo) {
                    clo.close();
                },
                confirm:function () {
                    clo.close();
                }
            });
            return false;
        }
        if(document.getElementById('picFile').files[0].size > 3*1024*1024){
            dialog({
                id: "",
                content: "<div class='openornot'><a class='c_close' href='#'>×</a><div class='m-con-hd'>提示</div>" +
                "<div class='m-con-bd'>" +
                "<div class='filed-user'>  " +
                "<p style='text-align:center;'>上传文件大小不能超过3MB！</p></div> " +
                "<div class='filed-user'>  <p class='clearfix'><a class='btn c_close' style='margin:0 auto; display:block;'>确认</a></p> </div>" +
                "</div>"
                + "</div>",
                cancel:function (clo) {
                    clo.close();
                },
                confirm:function () {
                    clo.close();
                }
            });
            return false;
        }
        else{
            formUpload();
        }
    });

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});