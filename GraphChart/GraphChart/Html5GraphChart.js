﻿//替换说明
//1、将斜杠替换成双斜杠
//2、将引号替换成双斜杠引号
const grahChartjs ="\"use strict\";function _possibleConstructorReturn(t,e){if(!t)throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\");return!e||\"object\"!=typeof e&&\"function\"!=typeof e?t:e}function _inherits(t,e){if(\"function\"!=typeof e&&null!==e)throw new TypeError(\"Super expression must either be null or a function, not \"+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError(\"Cannot call a class as a function\")}var _typeof=\"function\"==typeof Symbol&&\"symbol\"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&\"function\"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?\"symbol\":typeof t},_createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,\"value\"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}();!function(){var t=function(){function t(){_classCallCheck(this,t)}return _createClass(t,null,[{key:\"CreateGuid\",value:function(){for(var t=\"\",e=1;e<=32;e++){t+=Math.floor(16*Math.random()).toString(16),8!==e&&12!==e&&16!==e&&20!==e||(t+=\"-\")}return t}},{key:\"ToCurrency\",value:function(t,e){e=void 0===e||e;var i=parseFloat(t);if(isNaN(i))return t;for(var n=e?i.toFixed(2):i.toString(),s=/(\\d+)(\\d{3})/;s.test(n);)n=n.replace(s,\"$1,$2\");return n}},{key:\"BindEvent\",value:function(e,i,n,s){if(e){var h=i.split(\".\"),a=\"\";2===h.length?(i=h[0],a=h[1]):a=i,void 0===e[\"Event_\"+i]&&(e[\"Event_\"+i]={EventAction:function(t){var e=!0,i=null;o.EventList.forEach(function(n){!1===(i=n.Action(t))&&(e=i)}),!1===e&&(t.preventDefault(),t.returnValue=e,t.cancel=!e)},EventList:[]});var o=e[\"Event_\"+i];if(s)if(1===o.EventList.length)t.RemoveEvent(e,i,o.EventAction),o.EventList=[];else{for(var r=-1,u=0;u<o.EventList.length;u++)if(o.EventList[u].Name===a){r=u;break}r>=0&&o.EventList.splice(r,1)}else{0===o.EventList.filter(function(t){return t.Name===a}).length&&o.EventList.push({Name:a,Action:n}),1===o.EventList.length&&t.AddEvent(e,i,o.EventAction)}}}},{key:\"OffBindEvent\",value:function(e,i){t.BindEvent(e,i,null,!0)}},{key:\"AddEvent\",value:function(t,e,i){t.addEventListener?t.addEventListener(e,i,!1):t.attachEvent?t.attachEvent(\"on\"+e,i):t[\"on\"+e]=i}},{key:\"RemoveEvent\",value:function(t,e,i){t.detachEvent?t.detachEvent(\"on\"+e,i):t.removeEventListener?t.removeEventListener(e,i,!1):t[\"on\"+e]=null}},{key:\"GetNumber\",value:function(t,e){var i=parseFloat(t);return isNaN(i)?t:(e=10*(e||2),Math.floor(i*e)/e)}},{key:\"IsArray\",value:function(t){return null!==t&&void 0!==t&&(\"object\"===(void 0===t?\"undefined\":_typeof(t))&&t.length>=0)}},{key:\"IsObject\",value:function(t){return null!==t&&void 0!==t&&(\"object\"==(void 0===t?\"undefined\":_typeof(t))&&\"[object object]\"==Object.prototype.toString.call(t).toLowerCase()&&!t.length)}},{key:\"Assign\",value:function(e,i,n){if(!t.IsObject(e))return e;var s=[];if(t.IsObject(i))for(var h in i)e[h]=t.Clone(i[h],s);if(t.IsObject(n))for(var a in n)e[a]=t.Clone(n[a],s);return e}},{key:\"ArrayClone\",value:function(e,i){if(!t.IsArray(e))return e;for(var n=[],s=0;s<e.length;s++)n.push(t.Clone(e[s],i));return n}},{key:\"Clone\",value:function(e,i){if(t.IsArray(e))return t.ArrayClone(e,i);if(!t.IsObject(e))return e;for(var n=!1,s=0;s<i.length;s++)if(i[s]===e){n=!0;break}if(n)return e;i.push(e);var h={};for(var a in e)t.IsArray(e[a])?h[a]=t.ArrayClone(e[a],i):t.IsObject(e[a])?h[a]=t.Clone(e[a],i):h[a]=e[a];return h}}]),t}();Object.assign||(Object.assign=t.Assign);var e=function(){function e(i,n){if(_classCallCheck(this,e),this.Id=t.CreateGuid(),this.Graph=i,this.Context=i.GraphChart.CanvasContext,this.Width=i.GraphChart.Width,this.Height=i.GraphChart.Height,this.CanvasWidth=i.GraphChart.CanvasWidth,this.CanvasHeight=i.GraphChart.CanvasHeight,n)for(var s in n)this[s]=n[s];this.BackColor&&this.DrawBackground()}return _createClass(e,[{key:\"GetShapeList\",value:function(){return[]}},{key:\"Draw\",value:function(){this.ShapeList=this.GetShapeList(),this.ShapeList.forEach(function(t){return t.Draw()})}},{key:\"EventAction\",value:function(t,e){var i=\"off\"+t;if(this[i]&&this[i](e),i=\"on\"+t,this[i]){var n=this.GetSelectShape(e);if(null===n)return;this[i](e,n)}}},{key:\"DrawBackground\",value:function(){this.Context.save(),this.Context.rect(0,0,this.CanvasWidth,this.CanvasHeight),this.Context.fillStyle=this.BackColor,this.Context.fill(),this.Context.restore()}},{key:\"GetTextWidth\",value:function(t){return this.Context.measureText(t).width}},{key:\"GetSelectShape\",value:function(t){for(var e=null,i=0;i<this.ShapeList.length;i++)if(this.ShapeList[i].Contain(t)){e=this.ShapeList[i];break}return e}},{key:\"ClearRect\",value:function(t){this.Context.clearRect(t.X,t.Y,t.Width,t.Height)}},{key:\"ComputeLinePoint\",value:function(t,e){t.X!==e.X&&t.Y!==e.Y||(t.X===e.X&&(t.X2=e.X2=this.GetVHLinePointValue(t.X)),t.Y===e.Y&&(t.Y2=e.Y2=this.GetVHLinePointValue(t.Y)))}},{key:\"GetVHLinePointValue\",value:function(t){return t=Math.round(2*t),(t+1)%2==0?t/2:(t+1)/2}}]),e}(),i=function(e){function i(t,e){_classCallCheck(this,i);var n=_possibleConstructorReturn(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,t,e));return n.Color=n.Color||\"#000000\",n.Top=n.Top||10,n.Bottom=n.Bottom||20,n.MaxValueY=n.MaxValueY||35,n.BottomLineY=n.BottomLineY||35,n.MinValueY=n.MinValueY||n.Height-n.BottomLineY-n.R,n}return _inherits(i,e),_createClass(i,[{key:\"GetShapeList\",value:function(){var t=this,e=this.GetPonitList();this.PointList=e;var i=[new a(this.Context,{},{PointList:e,StrokeColor:this.Color})];return i=i.concat(this.GetFillLineQuadrangleList(e)),i=i.concat(e.map(function(e){return t.GetYLine(e)})),this.R>0&&(i=i.concat(e.map(function(e){return t.GetDot(e)}))),this.PreMoveY=!1,i=i.concat(e.map(function(e,i){return t.GetValueText(e,i)})),i.push(this.GetBottomLine(e)),i=i.concat(e.map(function(e){return t.GetNameText(e)}))}},{key:\"GetFillLineQuadrangleList\",value:function(t){for(var e=[],i=1;i<t.length;i++)e.push(this.GetFillLineQuadrangle(t[i-1],t[i]));return e}},{key:\"GetFillLineQuadrangle\",value:function(t,e){var i=[];return i.push(t),i.push(e),i.push({X:e.X,Y:this.Height-this.BottomLineY}),i.push({X:t.X,Y:this.Height-this.BottomLineY}),new o(this.Context,{},{PointList:i,FillColor:this.FillLineColor})}},{key:\"GetYLine\",value:function(t){var e=[],i=this.GetVHLinePointValue(t.X);return e.push({X:i,Y:this.Top}),e.push({X:i,Y:this.Height-this.BottomLineY}),new a(this.Context,{},{PointList:e,StrokeColor:this.DashLineColor,IsDash:!0})}},{key:\"GetBottomLine\",value:function(t){var e=[],i=Math.round(this.PointWidth/4),n=this.GetVHLinePointValue(this.Height-this.BottomLineY);return e.push({X:t[0].X-i,Y:n}),e.push({X:t[t.length-1].X+i,Y:n}),new a(this.Context,{},{PointList:e,StrokeColor:this.BottomLineColor})}},{key:\"GetValueText\",value:function(e,i){var n=0;if(i>0){var s=this.PointList[i-1];!this.PreMoveY&&Math.abs(s.Y-e.Y)<10&&(n=-20)}var h=this.IsCurrency?t.ToCurrency(e.Data.Value,!1):e.Data.Value,a=Math.floor(this.GetTextWidth(h))+2,o=e.Y-10;(a>this.PointWidth||this.PointWidth-a<10)&&0!==n?(o=e.Y+n,this.PreMoveY=!0):this.PreMoveY=!1;var r=e.X-a/2<2?2+Math.round(a/2):e.X;return e.X+a/2-(this.Width-5)>0&&(r=Math.round(this.Width-a/2)-5),new l(this.Context,e.Data,{X:r,Y:o,Text:h,TextAlign:\"center\",Font:this.ValueFont,FontColor:this.ValueColor})}},{key:\"GetNameText\",value:function(t){return new l(this.Context,t.Data,{X:t.X,Y:this.Height-this.Bottom,Text:t.Data.Name,TextAlign:\"center\",Font:this.NameFont,FontColor:this.NameColor})}},{key:\"GetDot\",value:function(t){return new h(this.Context,t.Data,{X:t.X,Y:t.Y,R:this.R,FillColor:this.Color})}},{key:\"GetPonitList\",value:function(){var t=this;if(this.PointList&&this.PointList.length>0)return this.PointList;if(this.PointList=[],this.Data&&this.Data.length>0){this.PointWidth=Math.round(this.Width/this.Data.length);var e=this.GetMaxMinValue(),i=this.GetMaxMinValue(!1);i>e?(this.Ratio=1,this.GetRatio(i),this.UnitRadian=(this.MinValueY-this.MaxValueY)*this.Ratio/i):(this.UnitRadian=0,this.Ratio=1),this.PointList=this.Data.map(function(i,n){return t.GetPoint(i,n,e)});for(var n=1;n<this.PointList.length;n++)this.ComputeLinePoint(this.PointList[n-1],this.PointList[n]);this.PointList=this.PointList.map(function(t){return t.X=void 0===t.X2?t.X:t.X2,t.Y=void 0===t.Y2?t.Y:t.Y2,t})}return this.PointList}},{key:\"GetRatio\",value:function(t){t<1e3||(this.Ratio=10*this.Ratio,this.GetRatio(t/10))}},{key:\"GetPoint\",value:function(t,e,i){var n=this.PointWidth*(e+1)-this.PointWidth/2,s=Math.round(this.MinValueY-t.Value/this.Ratio*this.UnitRadian);return s=t.Value>0&&this.MinValueY-s<1?this.MinValueY-1:s,{X:n,Y:s,R:this.R||0,Data:t}}},{key:\"GetMaxMinValue\",value:function(t){t=void 0===t||t;var e=0;return this.Data&&this.Data.length>0&&this.Data.forEach(function(i,n){t?0===n?e=i.Value:e>=i.Value&&(e=i.Value):e<i.Value&&(e=i.Value)}),e}}]),i}(e),n=function(e){function i(t,e){_classCallCheck(this,i);var n=_possibleConstructorReturn(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,t,e));return n.Anticlockwise=!0,n.Legend&&(n.Legend=Object.assign({},n.Legend)),n.Legend=n.Legend||{X:0,Y:0,Width:0,Height:0,R:0,Space:0},n.TextLegend&&(n.TextLegend=Object.assign({},n.TextLegend)),n.TextLegend=n.TextLegend||{X:0,Y:0,Height:0,Space:0},n}return _inherits(i,e),_createClass(i,[{key:\"GetShapeList\",value:function(){var t=this;if(this.MathCompute(),this.ShapeList=[],this.Data&&this.Data.length>0){if(this.CurrentAngle=this.StartAngle,this.ShapeList=this.Data.map(function(e,i){return t.GetShape(e,i===t.Data.length-1)}),this.CurrentAngle=this.StartAngle,this.IsLine){var e=[];this.ShapeList.forEach(function(i){return t.GetSectorLine(e,i)}),this.ShapeList=this.ShapeList.concat(e)}this.Legend&&this.Legend.X>0&&(this.ShapeList=this.ShapeList.concat(this.Data.map(function(e){return t.GetLegendShape(e)})),this.ShapeList=this.ShapeList.concat(this.Data.map(function(e){return t.GetTextShape(e)})))}return this.TextData&&this.TextData.length>0&&(this.ShapeList=this.ShapeList.concat(this.TextData.map(function(e){return t.GetCenterTextShape(e)}))),this.BottomPoints&&this.BottomPoints.length>0&&(this.ShapeList=this.ShapeList.concat(this.BottomPoints.map(function(e){return t.GetBottomPointShape(e)}))),this.ShapeList}},{key:\"GetBottomPointShape\",value:function(t){var e=this.X+t.X,i=this.Y+t.Y;return new h(this.Context,t,{X:e,Y:i,R:t.R,FillColor:t.Color})}},{key:\"GetSectorLine\",value:function(e,i){if(i.ComputeLineRPiont(),i.IsLabel){e.push(new a(this.Context,{},{PointList:i.LinePointList,StrokeColor:i.FillColor})),e.push(new h(this.Context,i.Data,{X:i.LineX,Y:i.LineY,R:this.LineR,FillColor:i.FillColor}));var n=i.Data.Name;e.push(new l(this.Context,i.Data,{X:i.LineTextX1,Y:i.LineTextY1,Text:n,TextAlign:\"center\",Font:this.LineTextFont,FontColor:i.FillColor}));var s=i.Data.TextValue||i.Data.Value;n=this.IsCurrency?t.ToCurrency(s,!1):s,this.UnitName&&(n+=this.UnitName);var o=Math.round(this.GetTextWidth(n))+10,r=i.LineTextX2;i.LineTextX2+o>this.Width-2&&(r=this.Width-2-o);var u={X:r,Y:i.LineTextY2,Text:n,Font:this.LineTextFont,FontColor:i.FillColor};this.IsValueCenter&&(u.X=i.LineTextX1,u.TextAlign=\"center\"),e.push(new l(this.Context,i.Data,u))}}},{key:\"MathCompute\",value:function(){var t=this;this.X=this.X||this.Width/2,this.Y=this.Y||this.Height/2,this.MoveY&&(this.Y=this.Y+this.MoveY),this.StartAngle=this.StartAngle||-Math.PI/180*90;var e=this.GetSumValue();this.UnitRadian=2*Math.PI/e;var i=0;this.Data&&this.Data.length>0&&this.Data.forEach(function(n,s){s===t.Data.length-1?n.Rate=(100-i).toFixed(2):(n.Rate=(100*n.Value/e).toFixed(2),i+=parseFloat(n.Rate))}),this.Dir=this.Anticlockwise?1:-1}},{key:\"GetSumValue\",value:function(){var t=0;return this.Data&&this.Data.length>0&&this.Data.forEach(function(e){return t+=e.Value}),t}},{key:\"GetShape\",value:function(t,e){var i=t.Value*this.UnitRadian,n=this.CurrentAngle+this.Dir*i;e&&(n=(2*Math.PI+this.StartAngle)*this.Dir);var s=new u(this.Context,t,{Cx:this.X,Cy:this.Y,StartAngle:this.CurrentAngle,EndAngle:n,R1:this.R1,R2:this.R2||0,FillColor:t.Color,Anticlockwise:this.Anticlockwise,IsLabel:void 0===t.IsLabel||t.IsLabel});return this.CurrentAngle=n,s}},{key:\"GetLegendShape\",value:function(t){var e=this.Legend,i=e.X,n=e.Y,s=e.R,h=e.Width,a=e.Height,o=e.Space,u=new r(this.Context,t,{X:i,Y:n,Width:h,Height:a,R:s,FillColor:t.Color});return this.Legend.Y+=a+o,u}},{key:\"GetTextShape\",value:function(t){var e=this.TextLegend,i=e.Height,n=e.Space,s=new l(this.Context,t,Object.assign(this.TextLegend,{Text:t.Name}));return this.TextLegend.Y+=i+n,s}},{key:\"GetCenterTextShape\",value:function(t){var e=this.X+t.X,i=this.Y+t.Y;return new l(this.Context,t,{X:e,Y:i,TextAlign:\"center\",Text:t.Text,Font:t.Font,FontColor:t.Color})}},{key:\"offclick\",value:function(t){}},{key:\"onclick\",value:function(t,e){this.ClickAction&&new Function(\"e\",\"shape\",this.ClickAction)(t,e)}}]),i}(e),s=function(){function e(i,n,s){if(_classCallCheck(this,e),this.Id=t.CreateGuid(),this.Context=i,this.Data=n,this.Ratio=window.devicePixelRatio||1,this.FillColor=\"\",this.StrokeColor=\"\",this.StrokeWidth=1,this.LineJoin=\"\",s)for(var h in s)this[h]=s[h]}return _createClass(e,[{key:\"Draw\",value:function(){this.Context.save(),this.IsText?this.DrawText():(!this.IsRect&&this.Context.beginPath(),this.BuildPath(),this.SetStyle()),this.Context.restore()}},{key:\"SetProperty\",value:function(){}},{key:\"DrawText\",value:function(){this.SetProperty(),this.FontColor&&(this.Context.fillStyle=this.FontColor),this.Font&&(this.SetRadioFont(),this.Context.font=this.Font),this.TextAlign&&(this.Context.textAlign=this.TextAlign),this.TextBaseline&&(this.Context.textBaseline=this.TextBaseline),this.Text&&this.Context.fillText(this.Text,this.X*this.Ratio,this.Y*this.Ratio)}},{key:\"SetRadioFont\",value:function(){if(this.Ratio>1){var t=this.Font.split(\" \"),e=t[0];e.indexOf(\"px\")>0&&(e=parseFloat(e.replace(\"px\",\"\"))*this.Ratio+\"px\",t[0]=e),this.Font=t.join(\" \")}}},{key:\"GetTextWidth\",value:function(t){return this.Context.measureText(t).width}},{key:\"Move\",value:function(t,e){return this.SetPath(\"move\",{X:t,Y:e})}},{key:\"Line\",value:function(t,e){return this.SetPath(\"line\",{X:t,Y:e})}},{key:\"Rect\",value:function(t,e,i,n){return this.SetPath(\"rect\",{X:t,Y:e,W:i,H:n})}},{key:\"Arc\",value:function(t,e,i,n,s,h){return this.SetPath(\"arc\",{X:t,Y:e,R:i,S:n,E:s,C:h})}},{key:\"Bcurve\",value:function(t,e,i,n,s,h){return this.SetPath(\"bcurve\",{X:s,Y:h,X1:t,Y1:e,X2:i,Y2:n})}},{key:\"Qcurve\",value:function(t,e,i,n){return this.SetPath(\"qcurve\",{X:i,Y:n,X1:t,Y1:e})}},{key:\"Close\",value:function(){return this.SetPath(\"close\")}},{key:\"BuildPath\",value:function(){}},{key:\"Contain\",value:function(t){return null}},{key:\"SetRatioValue\",value:function(t,e){e<=1||!t||(this.GetRatioValue(t,\"X\",e),this.GetRatioValue(t,\"Y\",e),this.GetRatioValue(t,\"X1\",e),this.GetRatioValue(t,\"Y1\",e),this.GetRatioValue(t,\"X2\",e),this.GetRatioValue(t,\"Y2\",e),this.GetRatioValue(t,\"W\",e),this.GetRatioValue(t,\"H\",e),this.GetRatioValue(t,\"R\",e))}},{key:\"GetRatioValue\",value:function(t,e,i){var n=t[e];if(n){var s=Math.floor(n);t[e]=n-s==.5&&3!==i&&5!==i?Math.floor(n*i)+.5:n*i}}},{key:\"SetPath\",value:function(t,e){switch(this.SetRatioValue(e,this.Ratio),t){case\"move\":return this.Context.moveTo(e.X,e.Y);case\"line\":return this.Context.lineTo(e.X,e.Y);case\"rect\":return this.Context.rect(e.X,e.Y,e.W,e.H);case\"arc\":return this.Context.arc(e.X,e.Y,e.R,e.S,e.E,e.C);case\"bcurve\":return this.Context.bezierCurveTo(e.X1,e.Y1,e.X2,e.Y2,e.X,e.Y);case\"qcurve\":return this.Context.quadraticCurveTo(e.X1,e.Y1,e.X,e.Y);case\"close\":return this.Context.closePath()}}},{key:\"SetStyle\",value:function(){this.FillColor&&(this.Context.fillStyle=this.FillColor,this.Context.fill()),this.StrokeColor&&(this.Context.lineWidth=this.StrokeWidth,this.LineJoin&&(this.Context.lineJoin=this.LineJoin),this.Context.strokeStyle=this.StrokeColor,this.Context.stroke())}},{key:\"Save\",value:function(){this.Context.save()}},{key:\"Translate\",value:function(t,e){t*=this.Ratio,e*=this.Ratio,this.Context.translate(t,e)}},{key:\"BeginPath\",value:function(){this.Context.beginPath()}},{key:\"Restore\",value:function(){this.Context.restore()}},{key:\"Rotate\",value:function(t){this.Context.rotate(t)}}]),e}(),h=function(t){function e(t,i,n){_classCallCheck(this,e);var s=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i,n));return s.X=s.X||0,s.Y=s.Y||0,s.R=s.R||0,s}return _inherits(e,t),_createClass(e,[{key:\"BuildPath\",value:function(){var t=this.X,e=this.Y,i=this.R;this.Arc(t,e,i,0,2*Math.PI,!1)}}]),e}(s),a=function(t){function e(t,i,n){_classCallCheck(this,e);var s=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i,n));return s.PointList=s.PointList||[],s.LineJoin=s.LineJoin||\"round\",s}return _inherits(e,t),_createClass(e,[{key:\"BuildPath\",value:function(){var t=this;this.PointList.forEach(function(e,i){0===i?t.Move(e.X,e.Y):t.Line(e.X,e.Y)}),this.IsDash&&this.Context.setLineDash([2*this.Ratio,5*this.Ratio])}},{key:\"Contain\",value:function(t){for(var e=!1,i=1;i<this.PointList.length;i++)if(this.JudgePointInLine(this.PointList[i-1],this.PointList[i],t.Point)){e=!0;break}return e}},{key:\"JudgePointInLine\",value:function(t,e,i){var n=0,s=0,h=0,a=0;n=t.X>=e.X?e.X:t.X,h=t.X>=e.X?t.X:e.X,s=t.Y>=e.Y?e.Y:t.Y,a=t.Y>=e.Y?t.Y:e.Y;var o=i.X,r=i.Y,u=this.StrokeWidth+1,l=!1;if(l=o>=n-u&&o<=h+u,l=l&&r>=s-u&&r<=a+u,n=t.X,h=e.X,s=t.Y,a=e.Y,l&&n===h&&(l=Math.abs(o-n)<=u),l&&s===a&&(l=Math.abs(r-s)<=u),l){var c=(r-s)/(a-s)*(h-n)+n;l=Math.abs(c-o)<=u}return l}}]),e}(s),o=function(t){function e(t,i,n){_classCallCheck(this,e);var s=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i,n));return s.PointList=s.PointList||[],s.LineJoin=s.LineJoin||\"round\",s}return _inherits(e,t),_createClass(e,[{key:\"BuildPath\",value:function(){var t=this;this.PointList.forEach(function(e,i){0===i?t.Move(e.X,e.Y):t.Line(e.X,e.Y)}),this.Close(),this.Context.globalAlpha=.1}}]),e}(s),r=function(t){function e(t,i,n){_classCallCheck(this,e);var s=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i,n));return s.Y=s.Y||0,s.X=s.X||0,s.Width=s.Width||0,s.Height=s.Height||0,s.R=s.R||0,s.IsRect=0===s.R,s}return _inherits(e,t),_createClass(e,[{key:\"BuildPath\",value:function(){var t=this.X,e=this.Y,i=this.R,n=this.Width,s=this.Height;this.IsRect?this.Rect(t,e,n,s):(this.Move(t+i,e),this.Line(t+n-i,e),this.Qcurve(t+n,e,t+n,e+i),this.Line(t+n,e+s-i),this.Qcurve(t+n,e+s,t+n-i,e+s),this.Line(t+i,e+s),this.Qcurve(t,e+s,t,e+s-i),this.Line(t,e+i),this.Qcurve(t,e,t+i,e),this.Close())}}]),e}(s),u=function(t){function e(t,i,n){_classCallCheck(this,e);var s=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i,n));return s.Cx=s.Cx||0,s.Cy=s.Cy||0,s.R1=s.R1||0,s.R2=s.R2||0,s.StartAngle=s.StartAngle||0,s.EndAngle=s.EndAngle||0,s.Anticlockwise=s.Anticlockwise||!0,s}return _inherits(e,t),_createClass(e,[{key:\"BuildPath\",value:function(){var t=this.Cx,e=this.Cy,i=this.R1,n=this.R2,s=this.StartAngle,h=this.EndAngle,a=this.Anticlockwise;Math.cos(s),Math.sin(s);this.Save(),this.Translate(t,e),this.BeginPath(),this.Arc(0,0,i,s,h,!a),this.Save(),this.Rotate(h),this.Move(i,0),this.Line(n,0),this.Restore(),0!==n&&this.Arc(0,0,n,h,s,a),this.Save(),this.Rotate(s),this.Line(i,0),this.Close(),this.Restore()}},{key:\"ComputeLineRPiont\",value:function(){var t=(this.Cx,this.Cy,this.R1,this.R2,this.StartAngle),e=this.EndAngle;this.LineRAngle=(e+t)/2,this.LineR=Math.round(1.08*this.R1),this.LineR=this.LineR-this.R1>15?this.R1+15:this.LineR,this.LineR=this.LineR-this.R1<8?this.R1+8:this.LineR,this.LineX=Math.round(Math.cos(this.LineRAngle)*this.LineR)+this.Cx,this.LineY=Math.round(Math.sin(this.LineRAngle)*this.LineR)+this.Cy;var i=0,n=0,s=0,h=0;this.LinePointList=[];var a=this.LineR-this.R1;this.LineY>=this.Cy&&this.LineX>=this.Cx?(i=this.LineX+a,n=Math.round(this.LineY+a)+.5,n=n>2*this.Cy-20?2*this.Cy-20:n,this.LineX===this.Cx&&(i=this.LineX+15,n=h=this.LineY+5),s=i+80,s=s>2*this.Cx-10?2*this.Cx-20:s,h=n,this.LinePointList.push({X:this.LineX,Y:this.LineY}),this.LinePointList.push({X:i,Y:n}),this.LinePointList.push({X:s,Y:h}),this.LineTextX1=Math.round(i+(s-i)/2),this.LineTextY1=n-7,this.LineTextX2=i,this.LineTextY2=n+15):this.LineY>=this.Cy&&this.LineX<=this.Cx?(i=this.LineX-a,n=Math.round(this.LineY+a)+.5,n=n>2*this.Cy-20?2*this.Cy-20:n,this.LineX===this.Cx&&(i=this.LineX,n=h=this.LineY-5),s=i-80,s=s<20?20:s,h=n,this.LinePointList.push({X:s,Y:h}),this.LinePointList.push({X:i,Y:n}),this.LinePointList.push({X:this.LineX,Y:this.LineY}),this.LineTextX1=Math.round(s+(i-s)/2),this.LineTextY1=h-7,this.LineTextX2=s,this.LineTextY2=h+15):this.LineY<=this.Cy&&this.LineX<=this.Cx?(i=this.LineX-a,n=Math.round(this.LineY-a)+.5,s=i-80,s=s<20?20:s,h=n,this.LinePointList.push({X:s,Y:h}),this.LinePointList.push({X:i,Y:n}),this.LinePointList.push({X:this.LineX,Y:this.LineY}),this.LineTextX1=Math.round(s+(i-s)/2),this.LineTextY1=h-7,this.LineTextX2=s,this.LineTextY2=h+15):this.LineY<=this.Cy&&this.LineX>=this.Cx&&(i=this.LineX+a,n=Math.round(this.LineY-a)+.5,s=i+80,s=s>2*this.Cx-10?2*this.Cx-20:s,h=n,this.LinePointList.push({X:this.LineX,Y:this.LineY}),this.LinePointList.push({X:i,Y:n}),this.LinePointList.push({X:s,Y:h}),this.LineTextX1=Math.round(i+(s-i)/2),this.LineTextY1=n-7,this.LineTextX2=i,this.LineTextY2=n+15)}},{key:\"Contain\",value:function(t){var e=t.Point,i=e.X,n=e.Y,s=this.Cx,h=this.Cy,a=this.R1,o=this.R2,r=this.StartAngle,u=this.EndAngle,l=i-s,c=n-h,v=Math.sqrt(l*l+c*c),f=v<=a&&v>=o;if(f){var C=Math.atan2(c,l);f=u>Math.PI&&C<0?C<-(2*Math.PI-u):C>=r&&C<=u}return f}}]),e}(s),l=function(t){function e(t,i,n){_classCallCheck(this,e);var s=_possibleConstructorReturn(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i,n));return s.Text=s.Text||\"\",s.FontStyle=s.FontStyle||\"\",s.FontWeight=s.FontWeight||\"\",s.FontSize=s.FontSize||\"\",s.FontFamily=s.FontFamily||\"\",s.Font=s.Font||\"\",s.TextAlign=s.TextAlign||\"\",s.TextBaseline=s.TextBaseline||\"\",s.FontColor=s.FontColor||\"\",s.X=s.X||0,s.Y=s.Y||0,s.IsText=!0,s.GetTextRect(),s}return _inherits(e,t),_createClass(e,[{key:\"SetProperty\",value:function(){if(!this.Font){var t=[];this.FontStyle&&t.push(this.FontStyle),this.FontWeight&&t.push(this.FontWeight),this.FontSize&&t.push(this.FontSize),this.FontFamily&&t.push(this.FontFamily),this.Font=t.join(\" \")}}},{key:\"GetTextRect\",value:function(){this.TextWidth=this.GetTextWidth(this.Text);var t=this.X-5,e=this.Y-20;\"center\"===this.TextAlign&&(t-=this.TextWidth/2),this.TextRect={X:t,Y:e,Width:this.TextWidth+10,Height:this.Height||40}}},{key:\"Contain\",value:function(t){var e=t.Point,i=e.X,n=e.Y,s=this.TextRect;return i>=s.X&&i<=s.X+s.Width&&n>=s.Y&&n<=s.Y+s.Height}}]),e}(s),c=function t(){_classCallCheck(this,t)};c.Line=\"line\",c.Pie=\"pie\";var v=function(){function e(i,n){if(_classCallCheck(this,e),this.Id=t.CreateGuid(),this.GraphChart=i,this.Options=n,n)for(var s in n)this[s]=n[s]}return _createClass(e,[{key:\"Draw\",value:function(){this.Chart=this.GetChart(),null!==this.Chart&&this.Chart.Draw()}},{key:\"GetChart\",value:function(){switch(this.Type){case c.Line:return new i(this,this.Options);case c.Pie:return new n(this,this.Options);default:return null}}},{key:\"EventAction\",value:function(t,e){this.Chart&&this.Chart.EventAction(t,e)}}]),e}(),f=function(){function e(i){if(_classCallCheck(this,e),this.Id=t.CreateGuid(),this.GraphList=[],i)for(var n in i)this[n]=i[n];this.Init()}return _createClass(e,[{key:\"Init\",value:function(){var e=this;this.Ratio=window.devicePixelRatio||1,this.CanvasWidth=this.Width,this.CanvasHeight=this.Height,this.CanvasWidth*=this.Ratio,this.CanvasHeight*=this.Ratio;var i='<canvas id=\"'+this.Id+'\" width=\"'+this.CanvasWidth+'\" height=\"'+this.CanvasHeight+'\" style=\"width:'+this.Width+\"px;height:\"+this.Height+'px;\"></canvas>',n=document.getElementById(this.TagId);n&&(n.innerHTML=i,(n=document.getElementById(this.Id))&&n.getContext&&(this.CanvasContext=n.getContext(\"2d\"),this.EventNames&&this.EventNames.length>0&&this.EventNames.forEach(function(i){return t.BindEvent(n,i,function(t){return e.EventAction(i,t)})})))}},{key:\"EventAction\",value:function(t,e){var i=e.target.getBoundingClientRect();e.Point={X:e.pageX-i.left,Y:e.pageY-i.top},this.GraphList.forEach(function(i){return i.EventAction(t,e)})}},{key:\"Draw\",value:function(t){var e=this;if(this.CanvasContext){var i=null;t&&t.length>0&&t.forEach(function(t){i=new v(e,t),i.Draw(),e.GraphList.push(i)})}}}]),e}(),C=function(){function e(i){if(_classCallCheck(this,e),this.Id=t.CreateGuid(),this.GraphChartList=[],i)for(var n in i)this[n]=i[n]}return _createClass(e,[{key:\"Load\",value:function(){var e=this;!this.GraphOptions||this.GraphOptions.length<1||(this.GraphOptions.length>1&&(this.FirstItem={TagId:t.CreateGuid(),Graph:Object.assign({},this.GraphOptions[this.GraphOptions.length-1])},this.LastItem={TagId:t.CreateGuid(),Graph:Object.assign({},this.GraphOptions[0])}),this.Element=document.getElementById(this.TagId),this.Element&&(this.Element.className=\"GraphSlide\",this.Element.style.display=\"none\",this.Element.innerHTML=this.GetHtml(),this.UlElement=document.getElementById(this.Id),this.LoadGraphChartList(),this.EventLoad(),this.Translate(-this.Width,50),setTimeout(function(){return e.Element.style.display=\"\"},60)))}},{key:\"GetHtml\",value:function(){var e=this,i=[],n=this.Width*(this.GraphOptions.length+2);return i.push('<ul id=\"'+this.Id+'\" style=\"position:absolute;width:'+n+'px;\">'),this.GraphOptions.length>1&&i.push(this.GetItemHtml(this.FirstItem)),this.GraphOptions.forEach(function(n){n.TagId=t.CreateGuid(),i.push(e.GetItemHtml(n))}),this.GraphOptions.length>1&&i.push(this.GetItemHtml(this.LastItem)),i.push(\"</ul>\"),i.join(\"\")}},{key:\"GetItemHtml\",value:function(t){return'<li id=\"'+t.TagId+'\" style=\"width:'+this.Width+\"px;height:\"+this.Height+'px;\"></li>'}},{key:\"GetGraphChart\",value:function(t,e){return{GraphChart:new f({TagId:t,Width:this.Width,Height:this.Height,EventNames:e.EventNames}),Options:[e]}}},{key:\"LoadGraphChartList\",value:function(){var t=this;this.GraphChartList=[],this.GraphOptions.length>1&&this.GraphChartList.push(this.GetGraphChart(this.FirstItem.TagId,this.FirstItem.Graph)),this.GraphOptions.forEach(function(e){t.GraphChartList.push(t.GetGraphChart(e.TagId,e))}),this.GraphOptions.length>1&&this.GraphChartList.push(this.GetGraphChart(this.LastItem.TagId,this.LastItem.Graph)),this.GraphChartList.forEach(function(t,e){t.Index=e+1,t.GraphChart.Draw(t.Options)}),this.SelectGraphChart=this.GraphChartList[1],this.SelectGraphChart.Left=-this.Width}},{key:\"Translate\",value:function(t,e){e=void 0===e?\"0ms\":e+\"ms\",this.SetStyle(this.UlElement,\"transform\",\"translate(\"+t+\"px,0px) translateZ(0)\"),this.SetStyle(this.UlElement,\"transitionTimingFunction\",\"cubic-bezier(0.1, 0.57, 0.1, 1)\"),this.SetStyle(this.UlElement,\"transitionDuration\",e)}},{key:\"SetStyle\",value:function(t,e,i){if(t&&t.style){t.style[e]=i;for(var n=e.charAt(0).toUpperCase()+e.substr(1),s=[\"webkit\",\"Moz\",\"ms\",\"O\"],h=0;h<s.length;h++)(e=s[h]+n)in t.style&&(t.style[e]=i)}}},{key:\"SetSelectIndex\",value:function(t,e){t&&(this.SelectGraphChart=t),this.SelectGraphChart&&this.SetSelectItem(this.SelectGraphChart,e)}},{key:\"SetSelectItem\",value:function(t,e){var i=this.GraphChartList.filter(function(e){return e.Index<t.Index}),n=i.length,s=0-n*this.Width;t.Left=s,this.Translate(s,e)}},{key:\"EventLoad\",value:function(){var e=this,i=function(t){return e.Start(t)},n=function(t){return e.End(t)};t.BindEvent(this.UlElement,\"touchstart\",i),t.BindEvent(window,\"touchend\",n),t.BindEvent(window,\"touchcancel\",n)}},{key:\"Start\",value:function(t){this.IsTouchStart=!0;var e=t.touches?t.touches[0]:t;this.StartX=e.pageX,this.StartY=e.pageY,this.BindMove()}},{key:\"Move\",value:function(t){if(this.IsTouchStart){t.preventDefault&&t.preventDefault(),this.IsTouchMove=!0;var e=t.touches?t.touches[0]:t,i=e.pageX-this.StartX,n=e.pageY-this.StartY;if(Math.abs(i)>Math.abs(n)){var s=this.SelectGraphChart.Left+i;this.Translate(s)}}}},{key:\"BindMove\",value:function(e){var i=this,n=function(t){return i.Move(t)},s=this.UlElement;e?t.RemoveEvent(s,\"touchmove\",n):t.BindEvent(s,\"touchmove\",n)}},{key:\"End\",value:function(t){if(this.IsTouchMove&&this.IsTouchStart){var e=t.changedTouches?t.changedTouches[0]:t,i=e.pageX-this.StartX;i>50?this.SetLast(200):i<=-50?this.SetNext(200):this.Translate(this.SelectGraphChart.Left,50)}this.IsTouchStart&&this.BindMove(!0),this.IsTouchStart=!1,this.IsTouchMove=!1}},{key:\"SetLast\",value:function(t){for(var e=this,i=null,n=null,s=this.GraphChartList.length-2;s>=1;s--)if(n=this.GraphChartList[s],this.SelectGraphChart&&n.Index<this.SelectGraphChart.Index){i=n;break}var h=!1;null===i&&(i=this.GraphChartList[this.GraphChartList.length-2],t=0,h=!0,this.Translate(0,200)),null!==i&&(h?window.setTimeout(function(){e.SetSelectIndex(i,t)},200):this.SetSelectIndex(i,t))}},{key:\"SetNext\",value:function(t){for(var e=this,i=null,n=null,s=1;s<this.GraphChartList.length-1;s++)if(n=this.GraphChartList[s],this.SelectGraphChart&&n.Index>this.SelectGraphChart.Index){i=n;break}var h=!1;if(null===i){i=this.GraphChartList[1],t=0,h=!0;var a=this.GraphChartList.length-1,o=0-a*this.Width;this.Translate(o,200)}null!==i&&(h?window.setTimeout(function(){e.SetSelectIndex(i,t)},200):this.SetSelectIndex(i,t))}}]),e}();window.GraphChart=f,window.GraphSlider=C}();"