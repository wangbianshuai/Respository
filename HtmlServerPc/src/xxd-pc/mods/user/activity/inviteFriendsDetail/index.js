require(['base', "trackBase", 'store', 'side', 'juicer'
	, 'header', 'footer', "dialog", 
	//'backTop',
	'json', "requirejs"
], function ($, track, store, side, jui, header, footer, dialog) {

	header.init();
	footer.init();
	//左侧菜单
	side.leftMenu(4);
	side.tabs({
		tabsObject: $("#J_tabs"),//tab 栏
	});
	var token = store && store.get("token") || {};
    var tabStatus = $.getUrlParam('type', location.search);
	side.getLeftHeight();
	//var invitationData= { "code": "200000", "data":{"code":0,"data":{"total":2,"pages":1,"pageSize":10,"list":[{"createtime":1521623532000,"direction":2,"id":2,"mobile":"1111111","registtime":1521623532000,"userid":1111111,"uuid":"2226319-test"},{"createtime":1521623532000,"direction":2,"firstinvestementtime":1521619932000,"id":3,"mobile":"1111112","registtime":1521623532000,"userid":1111112,"uuid":"2226319-test"}]},"message":"查询成功！"},"message":"查询成功！"}, "message": "操作成功" };
	//console.log(invitationData);
	//var da=`
	//{ "code": "200000", "data":{"code":0,"data":{"total":2,"pages":1,"pageSize":10,"list":[{"createtime":1521623532000,"direction":2,"id":2,"mobile":"1111111","registtime":1521623532000,"userid":1111111,"uuid":"2226319-test"},{"createtime":1521623532000,"direction":2,"firstinvestementtime":1521619932000,"id":3,"mobile":"1111112","registtime":1521623532000,"userid":1111112,"uuid":"2226319-test"}]},"message":"查询成功！"},"message":"查询成功！"}, "message": "操作成功" }
	//`;

	Date.prototype.format=function(){
		return this.getFullYear()+'.'+(this.getMonth()+1)+'.'+this.getDate();
	}

	function Ajax(){
		this.data=null;
		this.url=null;
		this.method=null;
        this.api = {
            // inviteReward:{// 查询邀请好友获取奖励记录
            // 	url:'/activityCenter/invitation/getInvitationBrief',
			// 	method:'POST'
			// },
			// 我的邀请战绩
			invitationAchievement: {
				url: '/activityCenter/invitation/invitationAchievement',
				method:'POST'
			},
			// 我的邀请等级
			invitationGrade: {
				url: '/activityCenter/invitation/invitationGrade',
				method:'POST'
			},
            getInvitationDetail:{//查询邀请好友记录
            	url:'/activityCenter/invitation/invitationRecord',
				method:'POST'
            },
            getInvitationRewards:{
            	url:'/activityCenter/invitation/invitationRewardDetail',
				method:'post'
            }
        }
        this.currentApi=null;
	}

	Ajax.prototype.http=function(url,data){
		if(url){
            this.data= data;
            this.currentApi= url;
        }else{
			throw "url 不能没有值";
		}
		return this;
    }


	Ajax.prototype.then=function(callback,errorCallback){
	    var that=this;
		$.ajax({
            url:that.currentApi.url||"",
			dataType:'json',
			method:that.currentApi.method||'get',
            contentType:'application/json',
            data:JSON.stringify(that.data||{data:{}}),
            beforeSend:function(request){
                request.setRequestHeader("s", "de42212bdc77b66092a9211cc08b2313");
                request.setRequestHeader("clientId", "XXD_ACTIVITY_H5_PAGE");
                request.setRequestHeader("clientTime", new Date().getTime());
                request.setRequestHeader('token',token);
            },
			success:function(data){
            	if(data.code==='200000'){
            	    callback(data.data);
				}else{
            	    console.log(data.message);
				}
			},
			error:errorCallback||function(){
                // alert('网络异常，请重试！');
                return false;
			}
		})
	}

	function initpage(data){
		var data = data.data
		$("#J_jdNum").text(data.jdCardAmount);
		$("#J_fxNum").text(data.amount);
		$("#J_peopleNum").text(data.invitationCount);
	}

	function initpageGrade(data){
		var data = data.data
		$("#J_gradeAmount").text(data.amount);
		$("#J_gradeP").text(data.count);
		$("#J_gradePer").text(data.proportion);
	}



	console.log('init tab');
	function Tabs(inviteTable,rewardTable){
		this.inviteTable=inviteTable;
		this.rewardTable=rewardTable;
		this.currentShow=this.inviteTable.id;
		var that=this;
		console.log(tabStatus)
        if (tabStatus == 'rewardDetail'){
            that.switchTab(this.rewardTable.id);
            $('.'+that.inviteTable.id).removeClass('active');
            $('.'+that.rewardTable.id).addClass('active');
        }
		$('.'+this.inviteTable.id).click(function(){
			that.switchTab(that.inviteTable.id);
			$('.'+that.rewardTable.id).removeClass('active');
			$('.'+that.inviteTable.id).addClass('active');
		});
		$('.'+this.rewardTable.id).click(function(){
			that.switchTab(that.rewardTable.id);
			$('.'+that.inviteTable.id).removeClass('active');
			$('.'+that.rewardTable.id).addClass('active');
		});
	}

	Tabs.prototype.switchTab=function(id){
		if(this.currentShow!==id){
			this.inviteTable.toggle();
			this.rewardTable.toggle();
			this.currentShow=id;
		}
	}

	function Table(id,title,prop){
		this.id=id;
		this.selector= $('#'+id);
		this.title=title;
		this.prop=prop;
	}

	Table.prototype.setData=function(data){
		this.data=data;
		this.render();
	}

	Table.prototype.toggle=function (){
		this.selector.toggle();
	}

	Table.prototype.getTitle=function(){
		var that= this;
		if (that.title.length === 3) {
			return "\t<tr class='title'>\n" +
				"\t<th>"+that.title[0]+"</th>\n" +
				"\t<th>"+that.title[1]+"</th>\n" +
				"\t<th>"+that.title[2]+"</th>\n" +
				"\t</tr>";
		} else if (that.title.length === 4) {
			return "\t<tr class='title'>\n" +
				"\t<th>"+that.title[0]+"</th>\n" +
				"\t<th>"+that.title[1]+"</th>\n" +
				"\t<th>"+that.title[2]+"</th>\n" +
				"\t<th>"+that.title[3]+"</th>\n" +
				"\t</tr>";
		}
		
	};
	Table.prototype.getTableBody=function(){
		var that=this;

        /**
		 * 有数据就返回数据，没有数据就返回字符串 暂无记录
         * @type {string}
		 *
         */
		if (that.title.length === 3) {
			if(that.data.length==0||that.data==null||that.data==undefined){
				return '<tr><td colspan="3" class="table-no-data">暂无记录</td></tr>'
			}

			var arrStr='';
			for(var i=0;i<that.data.length;i++){
				arrStr+="\n" +
					"\t<tr name='usable' class='kyye-style'>\n" +
					"\t<td>"+that.data[i][that.prop[0]]+"</td>\n" +
					"\t<td>"+that.data[i][that.prop[1]]+"</td>\n" +
					"\t<td>"+that.data[i][that.prop[2]]+"</td>\n" +
					"\t</tr>\n" ;
			}
		} else if (that.title.length === 4) {
			if(that.data.length==0||that.data==null||that.data==undefined){
				return '<tr><td colspan="4" class="table-no-data">暂无记录</td></tr>'
			}

			var arrStr='';
			for(var i=0;i<that.data.length;i++){
				arrStr+="\n" +
					"\t<tr name='usable' class='kyye-style'>\n" +
					"\t<td>"+that.data[i][that.prop[0]]+"</td>\n" +
					"\t<td>"+that.data[i][that.prop[1]]+"</td>\n" +
					"\t<td>"+that.data[i][that.prop[2]]+"</td>\n" +
					"\t<td>"+that.data[i][that.prop[3]]+"</td>\n" +
					"\t</tr>\n" ;
			}
		}
		return arrStr;
	};

	Table.prototype.render=function(){
		var tempHtml ='';
		tempHtml+=this.getTitle();
		tempHtml+=this.getTableBody();
		var currentRoot=this.selector.find('tbody');
		currentRoot.html(tempHtml);
	};
    var detailProp= ['mobile','registtime','expectEarnings', 'expectEarningsMonth'];
    var rewardProp =['releasetime','rewardname','rewarddesc'];
	//主要的业务流
    try{
        var tableDetail=null;
        var tableReward=null;
    	var ajax= new Ajax();
        // ajax.http(ajax.api.inviteReward).then(initpage);
        ajax.http(ajax.api.invitationAchievement).then(initpage);
        ajax.http(ajax.api.invitationGrade).then(initpageGrade);
        var data ={data:{"pages": 1, "pageSize": 10000}}

        tableDetail = new Table('inviteD',['好友','注册时间','好友预期收益', '本月好友预期收益'],detailProp);
        tableReward= new Table('rewardD',['发放时间','奖励','奖励来源'],rewardProp);
        new Tabs(tableDetail,tableReward);
        ajax.http(ajax.api.getInvitationDetail,data).then(function(data){
        	console.log(data);
        	//处理时间格式
            // data.data.list=[];
			for(var i=0;i<data.data.list.length;i++){
				if(typeof data.data.list[i]['firstinvestementtime'] == 'number'){
					data.data.list[i]['firstinvestementtime'] = new Date(data.data.list[i]['firstinvestementtime']).format();
				}
                if(typeof data.data.list[i]['registtime'] == 'number'){
                    data.data.list[i]['registtime'] = new Date(data.data.list[i]['registtime']).format();
                }
			}
        	tableDetail.setData(data.data.list);
		});
        ajax.http(ajax.api.getInvitationRewards,data).then(function(data){
        	console.log(data);
            //处理时间格式
            // data.data.list=[];
            for(var i=0;i<data.data.list.length;i++){
                if(typeof data.data.list[i]['createtime'] == 'number'){
                    data.data.list[i]['createtime'] = new Date(data.data.list[i]['createtime']).format();
                }
            }
            tableReward.setData(data.data.list);
		});

    }catch (e){
        console.log(e);
    }


}, function (err) {
	var con = null;
	if ((con = window.console)) con.log(err);
	else alert(err);
});
