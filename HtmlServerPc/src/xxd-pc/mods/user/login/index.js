require(['base',"trackBase", 'store', 'juicer'
    , 'header', 'footer', "dialog", 'backTop', 'json', "requirejs"
], function ($, track, store, jui, header, footer, dialog) {

	header.init();
	footer.init();

var errorTips={
	 userNull:'登录名为空~',
	 pswNull:'密码名为空~',
	 verifyNull:'验证码为空~'
}
 var dataUrl = {
	    token  : '/feapi/users/formToken',
	    submitInf:'/i/login.html',
	    verifyUrl:'/feapi/randCode/createVerifyCode',
	    loginInfoUrl:'/feapi/users/loginInfo',
        ref:document.referrer,
	    formtoken :store && store.get("formtoken") || {},
	    // gettoken:store && store.get("token") || {},
	    islogin:store && store.get("isLogin") || {}
 }

 // 获取tocken
	function getCode() {
		var loginToken;
		$.ajax({
			url     : dataUrl.token,
			dataType: 'json',
			type    : 'GET',
			data    : {},
			success : function (result) {
				loginToken = result.token;
				changeCode($('#verifyUrl'),loginToken);
			},
			error   : function () {
				console.log('网络出错')
			}
		});


    }

function getCookie(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

		if (arr = document.cookie.match(reg))

			return (arr[2]);
		else
			return null;
	}

// //   获取userToken
// 	function isLogin(){
//         var result = false;
//         $.ajax({
//             url     : dataUrl.loginInfoUrl+'?userToken='+getCookie('userToken'),
//             dataType: 'json',
//             type    : 'GET',
//             data    : {},
//             success : function (result) {
//                 if(result.data.status.code===200){
//                     result=true;
// 				}
//             }
//         });
//         return result;
// 	}

//	islogin success
	if(dataUrl.islogin=='true'){
		  if(dataUrl.ref==''){
             window.location.href='/';
		  }else {
              window.location.href=dataUrl.ref;
		  }
    }

$('#submit').on('click',function(ev){
	var event=ev || event;
	event.preventDefault(); 
	remember();
	if(judgeInput()==false){
     // $('#verifyCode').val('');
      return;
	}else{
	  $.post(dataUrl.submitInf,{
          formtoken:dataUrl.formtoken,
          imgcode:$('#verifyCode').val(),
          username:$('#username').val(),
          password:$.trim($('#userpsw').val())
		},function(data){
          var result = data.message;
          if(data.code==='200000'){
              SetCookie("token",data.data.token);
              if(dataUrl.ref==''){
                  // window.location.href='/';
              }else {
                  window.location.href = dataUrl.ref;
              }
		  }else{
          	errorChange($('#errorTips'),result);
          	if(data.code===-1){
                $('#username').focus();
                $('#userpsw').focus();
                $('#username').addClass('tips-border');
                $('#userpsw').addClass('tips-border');
			}else if(data.code===-2) {
                $('#verifyCode').focus();
                $('#verifyCode').addClass('tips-border');
			}
			changeCode($('#verifyUrl'),dataUrl.formtoken);
			  // getCode();
			$('#submit').html('立即登录');

		  }

	   },"json")
	  .error(function(){
          errorChange($('#errorTips'),"抱歉,连接失败，请稍后再试");
	  })
	}
})
// 当在文本上去掉所有的样式
// $("input[type='text'],input[type='password']").on('focus',function(){
// 	$("input[type='text'],input[type='password']").each(function(index,val){
// 		$(val).removeClass('tips-border');
// 	})
// 	$('#tipsBorder').css('visibility','hidden');
// })
// 刷新验证码
$('#resetVerify').on('click',function(){
	changeCode($('#verifyUrl'),dataUrl.formtoken);
})
// 关闭显示
$('#closeBtn').on('click',function(ev){
	var event=ev||event;
	event.preventDefault(); 
	$('#tipsBorder').css('visibility','hidden');
})
  var check=false;
	$('#remember').on('click',function (){
        if(!check){
            $(this).attr('checked','checked');
            check=true;
        }else{
            $(this).removeAttr('checked');
            check=false;
        }

   })
// 改变验证码
    changeCode($('#verifyUrl'),dataUrl.formtoken);
     function  changeCode(veriElem,dataToken){
        veriElem.attr('src',dataUrl.verifyUrl+'?formtoken='+dataToken+'&v='+ Math.random());
    }

function judgeInput(){
	// 用户名
	var flag=true;
	if($('#username').val()==""){
		errorChange($('#errorTips'),errorTips.userNull);
        $('#username').focus();
		$('#username').addClass('tips-border');
		flag=false;
		return flag;
	}else{
		$('#username').removeClass('tips-border');
	}

  // 密码
	if($('#userpsw').val()==""){
		errorChange($('#errorTips'),errorTips.pswNull);
		$('#userpsw').addClass('tips-border');
		$('#userpsw').focus();
		flag=false;
		return flag;
	}else{
		$('#userpsw').removeClass('tips-border');
	}
	if($('#verifyCode').val()==""){
		errorChange($('#errorTips'),errorTips.verifyNull);
		$('#verifyCode').addClass('tips-border');
		$('#verifyCode').focus();
		flag=false;
		return flag;
	}else{
		$('#verifyCode').removeClass('tips-border');
	}
	  $('#tipsBorder').css('visibility','hidden');
	  $('#submit').html('正在登录...');
      return flag;
	}
	// 错误文案
	function errorChange(elem,text){
	    $('#tipsBorder').css('visibility','visible');
		elem.html(text);
		$('#submit').html('立即登录');
	}

//本地设置cookie start
    function remember()
    {
        if($('#remember').attr("checked")=='checked'){
            SetCookie("username",$('#username').val());
        }
    }
    function SetCookie (name, value) {
        var exp = new Date();
        exp.setTime(exp.getTime() + (30*24*60*60*1000));
        window.document.cookie = name + "=" + escape (value) + "; expires=" + exp.toGMTString()+";path=/";
    }


//  cookie end
},function (err) {
    var con = null;
    if ((con = window.console)) con.log(err);
    else alert(err);
});


