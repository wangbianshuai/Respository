require(['base', "trackBase", 'store', 'detail', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', 'md'
], function ($, track, store, detail, jui, header, footer, dialog, md) {
    header.init();
    footer.init();
    var userDO = store && store.get("userDO") || {};
    track.init(userDO);
    var tenderType = $.readCookie("tenderType");
    //读取cookie
    function getCookie(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return unescape(arr[2]);
        }else{
            return null;
        }
    }

    var realToken;
    if(getCookie('Token') != '' && getCookie('Token') != undefined && getCookie('Token') != null){
        realToken = getCookie('Token');
    }else{
        realToken = getCookie('userToken');
    }
    var historyUrl = $.readCookie("historyUrl");


    //获得时间
    Date.prototype.toLocaleString = function () {
        return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 ";
    };
    var startDate = $.readCookie("startDate"),
        expireDate = $.readCookie("expireDate");
    startDate = new Date(parseInt(startDate));
    expireDate = new Date(parseInt(expireDate));
    $('.start-date').html(startDate.toLocaleString());
    $('.end-date').html(expireDate.toLocaleString());
    var referrerUrl;
    if (document.referrer) {
        referrerUrl = document.referrer.split('/');
    } else {
        referrerUrl = historyUrl.split('/');
    }
    var url = referrerUrl[referrerUrl.length - 1];
    var consumptionUrl = referrerUrl[referrerUrl.length - 2];  //消费贷地址不一样
    $('.record').click(function () {
        if (url.indexOf('monthgold') >= 0) {
            window.location.href = '/usercenter/tender/monthgold.html';
        } else if (url.indexOf('sevengold') >= 0) {
            window.location.href = '/usercenter/tender/sevengold.html';
        } else if (url.indexOf('newtender') >= 0) {
            window.location.href = '/usercenter/tender/newtender.html';
        } else if (url.indexOf('thirtytender') >= 0) {
            window.location.href = '/usercenter/tender/thirtytender.html';
        } else if (consumptionUrl.indexOf('consumption') >= 0) {
            window.location.href = '/usercenter/tender/investment.html';
        }
    });


    //继续出借
    $('.purchase').click(function () {
        if (consumptionUrl.indexOf('consumption') >= 0) {
            window.location.href ='/detail/consumptionList.html';
        }else{
            if (document.referrer) {
                window.location.href = document.referrer;
            } else {
                window.location.href = historyUrl;
            }
        }
    });

    //不是消费贷的时候就请求
    if (consumptionUrl.indexOf('consumption') < 0) {
        $.xxdAjax({
            url: '/tradeCenter/investBiz/recommend',
            type: 'get',
            clientId: 'XXD_FRONT_END',
            data: {
                'tenderType': tenderType
            },
            callbacks: function (data) {
                if (data.code == 200000) {
                    if (data.data.floatApr) {
                        $.each(data.data, function (i, item) {
                            $('.recommend-focus').append("<div class='recommend-list'>"
                                + "<div class='clearfix'>"
                                + "<table>"
                                + "<tr>"
                                + "<th class='first'>产品名称</th>"
                                + "<th class='second'>年化收益</th>"
                                + "<th class='third'>借款期限</th>"
                                + "</tr>"
                                + "<tr>"
                                + "<td class='first'>" + item.name + "</td>"
                                + "<td class='second'>" + item.apr + item.floatApr + "%</td>"
                                + "<td class='third'>" + item.term + "</td>"
                                + "</tr>"
                                + "</table>"
                                + "<a class='visit-product' target='_blank' href='" + item.url + "'>立即查看</a>"
                                + "</div>"
                                + "</div>")
                        })
                    } else {
                        $.each(data.data, function (i, item) {
                            $('.recommend-focus').append("<div class='recommend-list'>"
                                + "<div class='clearfix'>"
                                + "<table>"
                                + "<tr>"
                                + "<th class='first'>产品名称</th>"
                                + "<th class='second'>年化收益</th>"
                                + "<th class='third'>借款期限</th>"
                                + "</tr>"
                                + "<tr>"
                                + "<td class='first'>" + item.name + "</td>"
                                + "<td class='second'>" + item.apr + "</td>"
                                + "<td class='third'>" + item.term + "</td>"
                                + "</tr>"
                                + "</table>"
                                + "<a class='visit-product' href='" + item.url + "'>立即查看</a>"
                                + "</div>"
                                + "</div>")
                        })
                    }
                } else {
                    $('.recommend').hide();
                }
            }
        });
    }

    //在散标页面上是没有时间的，要去掉
    if (consumptionUrl.indexOf('consumption') >= 0) {
        $('.start-date').html('等待满标');
        $('.end-date').html('开始回款');
        $('.start-info').hide();
        $('.end-info').hide();
        $('.recommend').hide();
    };


	// /html/FIFAWorldCup/img/detailSuccess.png
	// activityStatus=0 是活动进行中-1是活动未开始，1是活动已结束
	if(url.indexOf('thirtytender') >= 0||url.indexOf('newtender')>=0) {
		// /html/FIFAWorldCup/img/detailSuccess.png
		$.xxdAjax({
			url: '/activityCenter/activityBase/getActivityStatus?activityCode=sjb-vip-activity',
			dataType: "json",
			clientId: "XXD_ACTIVITY_H5_PAGE",
			type: "get",
			callbacks: function (r) {
				if (r && r.code == 200000) {
					if (r.data.data.activityStatus == 0) {
						$('body').append('<div style="width:100%; height:100%; top:0; left:0; position:fixed; background:#000000; opacity:0.5;" id="ballOutlayer"></div><div style="    width: 624px;\n' +
							'    height: 691px;\n' +
							'    background: url(/html/FIFAWorldCup/img/detail-success.png) center center no-repeat; \n' +
							'    top: 0;\n' +
							'    left: 0;\n' +
							'    bottom: 0px;\n' +
							'    position: fixed;\n' +
							'    margin: auto;\n' +
							'    right: 0px;" id="ballOutBox"><span id="ballClose" style="width:55px; height:55px; display:block; float:right;margin-top:256px; cursor:pointer;"></span><a href="/html/FIFAWorldCup/index.html?xxd_utm_source=AnEzUn" style="width: 325px;height: 74px;margin: 558px auto;display: block;cursor:pointer;"></a>');
						$('#ballClose').click(function () {
							$('#ballOutlayer').fadeOut(0);
							$('#ballOutBox').fadeOut(0);
						});
					}
				}
			}
		});
	}

    // 百万红包
    // activityStatus=0 是活动进行中-1是活动未开始，1是活动已结束
    if(url.indexOf('thirtytender') >= 0||url.indexOf('newtender')>=0) {
        $.xxdAjax({
            url: '/activityCenter/MillionActivity/getActivityStatus?activityCode=friday-activity',
            dataType: "json",
            clientId: "XXD_ACTIVITY_H5_PAGE",
            type: "get",
            callbacks: function (r) {
                if (r && r.code == 200000) {
                    if (r.data.data.activityStatus == 0) {
                        $('body').append('<div style="width:100%; height:100%; top:0; left:0; position:fixed; background:#000000; opacity:0.5;" id="sixYearOutlayer"></div><div style="width:391px; height:275px; background:url(/html/millionRedpacket/img/millilRedpacketSuccess.png) 0 0 no-repeat; top:50%; left:50%; position:fixed; margin:-237px 0 0 -214px" id="sixYearOutBox"><span id="sixYearClose" style="width:55px; height:55px; display:block; margin-left:338px; cursor:pointer;"></span><a href="/html/millionRedpacket/index.html?xxd_utm_source=AnEzUn" style="width: 255px;height: 60px;margin: 125px auto 0;display: block;cursor:pointer;"></a>');
                        $('#sixYearClose').click(function () {
                            $('#sixYearOutlayer').fadeOut(0);
                            $('#sixYearOutBox').fadeOut(0);
                        });
                    } else {
                        // 百万红包 跟 6周年时间冲突，以百万红包为主
                        anniversary6th();
                    }
                }
            },
            error: function (r) {
                main.tip(r.code);
            }
        });
    }



    // 百万红包
    // 周年庆弹窗
   function anniversary6th(){
    var timer = new Date();
    var myTime = timer.getTime(); //本地时间
        $.ajax({
            url:'/activityCenter/anniversary6th/activityStatus',
            type:'get',
            async:false,
            cache:false,
            beforeSend:function(request){
                request.setRequestHeader('clientId','XXD_ACTIVITY_H5_PAGE');
                request.setRequestHeader('clientTime',myTime);
            },
            success:function(data){
                if(data.data.code == 0){
                    $.ajax({
                        url:'/activityCenter/anniversary6th/userActivityInfoOutward',
                        type:'get',
                        async:false,
                        cache:false,
                        beforeSend:function(request){
                            request.setRequestHeader('clientId','XXD_ACTIVITY_H5_PAGE');
                            request.setRequestHeader('clientTime',myTime);
                            request.setRequestHeader('token',realToken);
                        },
                        success:function(data){
                            //1 新 2 老用户
                            if(data.data.data.userType == 2){

                            }else if(data.data.data.userType == 1){

                                $('body').append('<div style="width:100%; height:100%; top:0; left:0; position:fixed; background:#000000; opacity:0.5;" id="sixYearOutlayer"></div><div style="width:429px; height:474px; background:url(/html/sixYearsV2/img/box14.png) 0 0 no-repeat; top:50%; left:50%; position:fixed; margin:-237px 0 0 -214px" id="sixYearOutBox"><span id="sixYearClose" style="width:55px; height:55px; display:block; margin-left:370px; cursor:pointer;"></span><a href="/html/sixYearsV2/index.html?xxd_utm_source=AnEzUn" style="width: 255px;height: 60px;margin: 256px auto 0;display: block;cursor:pointer;"></a>');
                                $('#sixYearClose').click(function(){
                                    $('#sixYearOutlayer').fadeOut(0);
                                    $('#sixYearOutBox').fadeOut(0);
                                });
                            }
                        },
                        error:function(){
                            alert('网络异常，请重试！');
                            return false;
                        }
                    });

}
            },
            error:function(){
                return false;
            }
        });

   }

    //周年庆


}, function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});
