
##TIP的调用配置params :
  - self , 绑定时间的this, 如果为trigger事件，需为currentTarget
  - formatCallback , 如果为http请求（ajax，jsonp）必须带上，如果为静态输出为可选参数
  - self html config
    	- <div dataUrl="请求路径" tipType="jsonp" position="right"></div>
    	- <div position="right" tipContent="我是静态内容"></div>
  - dataUrl 请求的http的url 
  - tipType 请求的类型 目前支持   get post jsonp类型
  - position 显示位置 定义 ，默认为auto， 可选范围为 ：top , right , bottom , left ,side（两侧） , fluctuate（上下） , auto
  - tipContent 静态内容显示位置，如果有盖参数，不会走配制tipType，dataUrl配制
  - overTipShow  默认是鼠标移到tip的时候也是显示的，如果值为false， 鼠标移除self 对象的时候，tip就会消失

		require(['base' , 'tip'],function ( $ , TIP){
			$(".c_tip").on("mouseover", function (){
				TIP.init({
					self:this,
					formatCallback:function (data){
						return data;
					}
				});
			});
		});