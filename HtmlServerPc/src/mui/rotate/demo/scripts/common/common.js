require.config({
	paths:{
		'jquery':'../library/jquery'
	}
});
define(['jquery'],function(jquery){
	return{
		// 焦点图切换
		sliderBox:function(parma){
			var _this = $(parma.object),
				_sliderType = parma.sliderType,
				_sliderSpeed = parma.sliderSpeed,
				_animateSpeed = parma.animateSpeed,
				_title = parma.title,
				_info = parma.info,
				_arrow = parma.arrow,
				_dataType = parma.dataType,
				_data = parma.data,
				_minWidth = parma.minWidth,
				_callback = parma.callback,
				sliderInit,
				sliderTimer,
				clickFlag = 0,
				index = 0,
				animateLeft,
				animateRight,
				t;
			_this.append('<ul></ul>');
			_this.append('<ol></ol>');
			_this.css('min-width',parseInt(_minWidth) + 'px');
			if(_dataType == 'json'){
				$.each(_data,function(index,item){
					_this.find('ul').append('<li><a target="_blank" class="ga-banner" ga-data-name=' + item.title + ' href="' + item.linkurl + '"><img src="' + item.imgurl + '" /></a><h2>' + item.title + '</h2><span>' + item.content + '</span></li>');
				});
				if(_callback != null){
					_callback();
				}
			}else if(_dataType == 'html'){
				_this.find('ul').append(_data);
				if(_callback != null){
					_callback();
				}
			}
			_title == true ? _this.find('ul li').find('h2').fadeIn(0) : _this.find('ul li').find('h2').remove();
			_info == true ? _this.find('ul li').find('span').fadeIn(0) : _this.find('ul li').find('span').remove();
			_arrow == true ? _this.append('<div class="controlBox"><div class="pre"></div><div class="next"></div></div>') : _this.remove('.controlBox');
			$.each(_this.find('ul li'),function(){
				_this.find('ol').append('<li></li>');
			});
			_this.find('ol').find('li').eq(0).addClass('current');
			animateLeft = function(){
				index--;
				if(index == -1){
					index = _this.find('ul li').length - 1;
				}
			}
			animateRight = function(){
				index++;
				if(index == _this.find('ul li').length){
					index = 0
				}
			}
			if(_sliderType == 1){
				_this.addClass('sliderType1');
				_this.find('ul li').eq(0).fadeIn(0);
				sliderTimer = function(){
					_this.find('ul li').stop().fadeOut(parseInt(_animateSpeed)).eq(index).stop().fadeIn(parseInt(_animateSpeed));
					_this.find('ol li').removeClass('current').eq(index).addClass('current');
				}
			}else if(_sliderType == 2){
				_this.addClass('sliderType2');
				_this.find('ul').css('width',_this.find('ul li').length * 100 + '%');
				_this.find('ul li').css('width',1/_this.find('ul li').length*100 + '%');
				sliderTimer = function(){
					_this.find('ul').stop().animate({left:-100 * parseInt(index) + '%'},parseInt(_animateSpeed));
					_this.find('ol li').removeClass('current').eq(index).addClass('current');
				}
			}else if(_sliderType == 3){
				_this.addClass('sliderType3');
				sliderTimer = function(){
					_this.find('ul').stop().animate({top:-_this.height() * parseInt(index)},parseInt(_animateSpeed));
					_this.find('ol li').removeClass('current').eq(index).addClass('current');
				}
			}
			sliderInit = function(){
				clearInterval(t);
				t = setInterval(function(){
					clickFlag = 1;
					animateRight();
					sliderTimer();
					setTimeout(function(){
						clickFlag = 0;
					},_animateSpeed);
				},_sliderSpeed);
			}
			sliderInit();
			_this.mouseover(function(){
				clearInterval(t);
				_this.find('.controlBox').fadeIn(0);
			}).hover(function(){
				clearInterval(t);
				_this.find('.controlBox').fadeIn(0);
			}).mouseout(function(){
				sliderInit();
				_this.find('.controlBox').fadeOut(0);
			});
			_this.find('ol').find('li').click(function(){
				if(clickFlag == 0){
					clickFlag = 1;
					index = $(this).index();
					sliderTimer();
					setTimeout(function(){
						clickFlag = 0;
					},_animateSpeed);
				}else{
					return false;
				}
			});
			_this.find('.controlBox .pre').click(function(){
				if(clickFlag == 0){
					clickFlag = 1;
					animateLeft();
					sliderTimer();
					setTimeout(function(){
						clickFlag = 0;
					},_animateSpeed);
				}else{
					return false;
				}
			});
			_this.find('.controlBox .next').click(function(){
				if(clickFlag == 0){
					clickFlag = 1;
					animateRight();
					sliderTimer();
					setTimeout(function(){
						clickFlag = 0;
					},_animateSpeed);
				}else{
					return false;
				}
			});
		}
	}
});