require(['base', 'echarts', 'cropper', "trackBase", 'store', 'side', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, echarts, cropper, track, store, side, jui, header, footer, dialog) {

    header.init();
    footer.init();
    var global = window["GLOBAL_STATIC_DATA"];
    $('.change-head').click(function () {
        $('#myAccount').hide();
        $('#changeHead').removeClass('hide');
        var clocks = setInterval(function () {
            if (parseInt($('.g-left').height()) != parseInt($('#changeHead').height())) {
                $('.g-left').css('min-height', $('.g-right').height() + 'px');
            } else {
                clearInterval(clocks);
            }
        }, 100);
    });
    //左侧菜单
    side.leftMenu();
    var token = store && store.get("token") || {},
        fileFlag = 1,//文件类型
        URL = window.URL || window.webkitURL,
        $image = $('.J_cropperImg'),
        uploadedImageType = 'image/jpeg',
        uploadedImageURL,
        fileURL;

    //头部小弹框
    $('.position').hover(function () {
        $('.position-tip').removeClass('hide');
    }, function () {
        $('.position-tip').addClass('hide');
    });
    //小图标认证与显示问题
    $.each($('.allicon a'), function () {
        $(this).hover(function () {
            if ($(this).hasClass('active')) {
                $(this).find('b').html('已认证');
            }
            $(this).find('span').removeClass('hide');
        }, function () {
            $(this).find('span').addClass('hide');
        });
    });

    // 用户数据
    var investProduct = global.assetStatistics.data.percents;
    //用户资产总额
    var sumTotal=global.assetStatistics.data.mapAccount.sumTotal;
    showAge(investProduct);
    // 饼图
    function showAge(data) {
        if (!data) {
            return;
        }
        var legendData = new Array();
        var seriesData = new Array();
        $.each(data, function (i, v) {
            var legendItem = new Object();
            legendItem.name = v.name;
            legendItem.icon = 'circle';
            legendData.push(legendItem);
            var seriesItem = new Object();
            seriesItem.value = v.sum;
            seriesItem.name = v.name;
            seriesData.push(seriesItem);
        });
        var $charts = echarts.init($('.centre')[0]);
        var option = {
            title: {
                text: '资产总额：'+sumTotal+'元',
                left: 'center',
                top: 'center',
                right: 'center',
                bottom: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#000',
                    fontSize: '14',
                    width: '200px'
                }
            },
            tooltip: {
                show: false
            },
            color: ['#009BFF', '#FF685D', '#FFA900', '#FFD100', '#3BB5FF', '#FF8A33', '#0066FF','#70A0FF','#FFD470','#FF7085'],
            series: [
                {
                    type: 'pie',
                    radius: ['65%', '90%'],
                    avoidLabelOverlap: false,
                    text: '你好',
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: seriesData
                }
            ]
        };
        $charts.setOption(option);
        var trs = $('.table-box table tr');
        $charts.on('mouseover', function (params) { // 实现左边的框框对应
            trs.removeClass('active');
            $.each(trs, function () {
                if (params.data.name == $(this).attr('name')) {
                    $(this).addClass('active');
                }
            });
        });
        $charts.on('mouseout', function (params) { // 实现左边的框框对应
            var trs = $('.table-box table tr');
            $.each(trs, function () {
                trs.removeClass('active');
            });
        });
        trs.hover(function (e) {
            var name = $(e.target).parent().attr('name');
            $(e.target).parent().addClass('active');
            $charts.dispatchAction({  //实现凸起的状态
                type: 'highlight',
                // 可选，系列 index，可以是一个数组指定多个系列
                seriesIndex: 0,
                // 可选，系列名称，可以是一个数组指定多个系列
                //seriesName: 1,
                // 数据的 index，如果不指定也可以通过 name 属性根据名称指定数据
                //dataIndex: i
                // 可选，数据名称，在有 dataIndex 的时候忽略
                name: name
            });
        }, function () {
            $charts.dispatchAction({ //取消所有的高亮
                type: 'downplay',
                seriesIndex: 0,
            });
            $.each(trs, function () {
                trs.removeClass('active');
            });
        });
    }


    //返回按钮
    $('.J_back').click(function () {
        $('#myAccount').show();
        $('#changeHead').addClass('hide');
    });
    //默认头像渲染
    getSystemImg();
    function getSystemImg() {
        $.xxdAjax({
            url: '/userCenter/userAvatar/selectAvatar',
            type: 'get',
            clientId: 'XXD_FRONT_END',
            token: token,
            data: {},
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        $.each(data.data.list, function (i, v) {
                            $('.J_SystemImgs').append("<img src='" + v + "' alt='系统头像'>");
                        });
                    }
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    }

    //设置默认头像
    $('.J_SystemImgs').click(function (v) {
        $('.J_SystemImgs img').removeClass('active');
        $(v.target).addClass('active');
        $('.J_userPortrait').attr('src', $(v.target).attr('src'));
    });
    $('.J_setPortrait').click(function () {
        var hasClassname =0;
        $.each($('.J_SystemImgs img'),function (i, v) {
            if($(v).hasClass("active")){
                hasClassname =1 ;
            }
        })
        if (($('.J_userPortrait').attr('src') == '') || (hasClassname ==0)) {
            side.thisDialog('请先选择头像');
            var a = 3;
            var timer = setInterval(function () {
                a--;
                if (a == -1) {
                    //关闭弹框
                    $('.mui-dialog').remove();
                    window.clearTimeout(timer);
                }
            }, 1000);
            return;
        }
        $.xxdAjax({
            url: '/userCenter/userAvatar/saveimg?imgPath=' + $('.J_userPortrait').attr('src'),
            type: 'get',
            clientId: 'XXD_FRONT_END',
            token: token,
            data: {},
            callbacks: function (data) {
                if (data && data.code == '200000') {
                    if (data.data) {
                        side.thisDialog(data.data.msg);
                        var a = 3;
                        var timer = setInterval(function () {
                            a--;
                            if (a == -1) {
                                //关闭弹框
                                $('.mui-dialog').remove();
                                window.clearTimeout(timer);
                            }
                        }, 1000);
                    }
                } else {
                    side.thisDialog('网络异常，请刷新重试');
                }
            },
            error: function () {
                side.thisDialog('网络异常，请刷新重试');
            }
        });
    });
    //上传自定义头像
    var $inputImage = $('.J_uploadMyImg');
    if (URL) {
        $inputImage.change(function () {
            checkFileExt($(this).val());
            if (fileFlag == 1) {
                side.thisDialog('文件格式只能是jpg或者是jpeg!');
                return;
            }
            if (document.getElementsByClassName('J_uploadMyImg')[0].files[0].size > 2 * 1024 * 1024) {
                side.thisDialog('单张图片不能超过2MB!');
                return;
            }

            $('.fadetip').html('已上传').addClass('file-end');

            //显示出来图片
            var files = this.files;
            var file;
            if (files && files.length) {
                file = files[0];
                if (/^image\/\w+$/.test(file.type)) {
                    uploadedImageType = file.type;
                    if (uploadedImageURL) {
                        URL.revokeObjectURL(uploadedImageURL);
                    }
                    $('.tailor').removeClass('hide');
                    uploadedImageURL = URL.createObjectURL(file);
                    $image.cropper('destroy').attr('src', uploadedImageURL).cropper({
                        aspectRatio: 16 / 16,
                        autoCropArea: 0.65,
                        crop: function (e) {
                        }
                    });
                    $inputImage.val('');
                } else {
                    window.alert('Please choose an image file.');
                }
            }

        });
    } else {
        $inputImage.prop('disabled', true).parent().addClass('disabled');
    }
    //裁剪后保存图片
    $('.J_savePortrait').click(function () {
        // var form = new FormData(document.getElementById('uploadPortrait'));
        $image.cropper('getCroppedCanvas').toBlob(function (blob) {
            var formData = new FormData();
            formData.append('file', blob, 'img.jpg');
            $.ajax({
                url: '/fileCenter/files?bizCode=XXD_USER_DETAILS&fileDir=xxd%2Fuserdetail',
                type: 'post',
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                // contentType:'form-data'
                beforeSend: function (request) {
                    request.setRequestHeader('clientId', 'SHENZHOURONG');
                    request.setRequestHeader('clientTime', new Date().getTime());
                },
                success: function (data) {
                    if (data.code == '200000') {
                        if (data.data) {
                            fileURL = data.data.fileURL;
                            thisDialog('头像上传成功');
                            $('.J_userPortrait').attr('src',fileURL);
                            $('.change-head').attr('src',fileURL);
                            $.xxdAjax({
                                url: '/userCenter/userAvatar/saveAvatarImage',
                                clientId: 'XXD_FRONT_END',
                                type: 'get',
                                token: token,
                                data: {
                                    'headUrl': fileURL
                                },
                                callbacks: function (data) {
                                    if (data.code == '200000') {
                                        if (data.data.code == '20000') {
                                        } else {
                                            console.log('上传失败');
                                        }
                                    } else {
                                        console.log('上传失败');
                                    }
                                },
                                error: function () {
                                }
                            });
                        }
                        else {
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
        }, 'image/jpeg');

    });

    //文件类型
    function checkFileExt(filename) {
        var arr = ["jpg", "JPG", "jpeg", "JPEG"];
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

    side.getLeftHeight();

    //点击跳转
    $('.J_xszx').click(function () {
        window.open('/usercenter/tender/thirtytender.html');
    });
    $('.J_yjdj').click(function () {
        window.open('/usercenter/tender/monthgold.html');
    });
    $('.J_xyb').click(function () {
        window.open('/usercenter/tender/goldIngot.html');
    });
    $('.J_yyp').click(function () {
        window.open('/usercenter/tender/monthSend.html');
    });
    $('.J_xsb').click(function () {
        window.open('/usercenter/tender/newtender.html');
    });
    $('.J_sb').click(function () {
        window.open('/usercenter/tender/investment.html');
    });
    $('.J_other').hover(function () {
        $('.other-pro').removeClass('hide');
    }, function () {
        $('.other-pro').addClass('hide');
    });

    //隐藏上传按钮及文案
    function thisDialog(content) {
        dialog({
            content: "<div class='dimension operate-tip'>"
            +"<i class='c_close close_x'>×</i>"
            +"<h5>提示</h5>"
            +"<div class='tip-content'>"
            +"<p>"+content+"</p>"
            +"<a href='#' class='btn c_close'>确认</a>"
            +"</div>"
            +"</div>",
            id: "",
            confirm: function (art) {
                $('.tailor').addClass('hide');
            },
            cancel: function (art) {
                art.remove();
                $('.tailor').addClass('hide');
            }
        });
    }


    // 邀请好友的数据init
    $.ajax({
        url:'/activityCenter/invitation/invitationAchievement',
        dataType:'json',
        method:'post',
        contentType:'application/json',
        beforeSend:function(request){
            request.setRequestHeader("s", "de42212bdc77b66092a9211cc08b2313");
            request.setRequestHeader("clientId", "XXD_ACTIVITY_H5_PAGE");
            request.setRequestHeader("clientTime", new Date().getTime());
            request.setRequestHeader('token',token);
        },
        success:function(data){
            if(data.code==='200000'){
                var data = data.data.data
                $('.invite-friends-num').html(data.invitationCount);
                $('.invite-reward').html(data.jdCardAmount + data.amount);
            }else{
                console.log(data.message);
            }
        },
        error:function(){
            // alert('网络异常，请重试！');
            return false;
        }
    })

}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});

