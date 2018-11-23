import React from "react";
import BaseIndex2 from "../BaseIndex2";
import $ from "jquery";

export default class Index extends BaseIndex2 {
    constructor(props) {
        super(props);
        this.state = {
            IsVisible: false,
            ArrowName: "",
            Left: 0,
            Top: 0,
            ArrowLeft: 0,
            ArrowTop: 0
        }
    }

    static get defaultProps() {
        return {
            Position: "bottom",
            MouseOverCall: Function()
        }
    }

    UnTip(obj, tip) {
        const _fn = (e) => {
            if (tip.contains(e.target)) return;
            else if (obj.contains(e.target)) return;

            this.setState({ IsVisible: false });
            this.props.MouseOverCall(false);
            $(document).unbind('mousemove', _fn);
        };

        $(document).on('mousemove', _fn);
    }

    EffectsMouseOver(e, ele) {
        if (this.state.IsVisible) return;

        const $obj = $(ele);
        const $tip = $(this.refs.Tip);

        const { top, left } = $obj.offset();
        var _selfOffsetTop = top, _selfOffsetLeft = left;
        var _selfWidth = $obj.outerWidth(), _selfHeight = $obj.outerHeight();

        const $doc = $(document);
        var _docScrollTop = $doc.scrollTop(), _docScrollLeft = $doc.scrollLeft();

        const $win = $(window);
        var _winHeight = $win.outerHeight(), _winWidth = $win.outerWidth();

        var _contentHeight = $tip.outerHeight(), _contentWidth = $tip.outerWidth();

        var _limitTop = _selfOffsetTop - _docScrollTop,
            _limitBottom = _winHeight - _limitTop - _selfHeight,
            _limitLeft = _selfOffsetLeft - _docScrollLeft,
            _limitRight = _winWidth - _limitLeft - _selfWidth;

        var _left = 0, _top = 0, _arrowLeft = 0, _arrowTop = 0, _arrowName = "mui-calculator-tip-arrow-down";
        var _halfContentHeight = _contentHeight / 2,
            _halfSelfHeight = _selfHeight / 2,
            _halfHeight = _halfContentHeight - _halfSelfHeight;

        var _halfContentWidth = _contentWidth / 2,
            _halfSelfWidth = _selfWidth / 2,
            _halfWidth = _halfContentWidth - _halfSelfWidth;

        const position = this.props.Position;

        const _fnSlidePosition = () => { // 左右两侧
            var fixwhite = 0;//边界值留白的问题 ,  可以不要
            if (_limitBottom <= 20 || _limitTop <= 20) fixwhite = 20;
            if ((_limitTop >= _halfHeight && _limitBottom >= _halfHeight) || _winHeight < _contentHeight) {
                _top = _selfOffsetTop - _halfHeight;
                _arrowTop = _halfContentHeight - 10;
            } else if (_limitTop >= _limitBottom && _limitTop >= _halfHeight) {
                _top = _selfOffsetTop - _contentHeight + _limitBottom + _halfSelfHeight + fixwhite;
                _arrowTop = _contentHeight - _limitBottom - 10 - fixwhite;
            } else {
                _top = _selfOffsetTop - _limitTop - fixwhite;
                _arrowTop = _limitTop + _halfSelfHeight - 10 + fixwhite;
            }
        };

        const _fnFluctuatePosition = () => { //上下
            var fixwhite = 0;//边界值留白的问题 ,  可以不要
            if (_limitLeft <= 20 || _limitRight <= 20) fixwhite = 20;

            if ((_limitLeft >= _halfWidth && _limitRight >= _halfWidth) || _winWidth < _contentWidth) {
                _left = _selfOffsetLeft - _halfWidth;
                _arrowLeft = _halfContentWidth - 10;
            } else if (_limitLeft > _limitRight && _limitLeft >= _halfWidth) {
                _left = _selfOffsetLeft - _contentWidth + _limitRight + _halfSelfWidth + fixwhite;
                _arrowLeft = _contentWidth - _limitRight - 10 - fixwhite;
            } else {
                _left = _selfOffsetLeft - _limitLeft - fixwhite;
                _arrowLeft = _limitLeft + _halfSelfWidth - 10 + fixwhite;
            }
        };

        const _fnLeft = () => {
            _arrowName = "mui-calculator-tip-arrow-right";
            _arrowLeft = _contentWidth - 12;
            _left = _selfOffsetLeft - _contentWidth;
            _fnSlidePosition();
        };

        const _fnRight = () => {
            _arrowName = "mui-calculator-tip-arrow-left";
            _arrowLeft = 0;
            _left = _selfOffsetLeft + _selfWidth;
            _fnSlidePosition();
        };

        const _fnTop = () => {
            _arrowName = "mui-calculator-tip-arrow-down";
            _arrowTop = _contentHeight - 12;
            _top = _selfOffsetTop - _contentHeight;
            _fnFluctuatePosition();
        };

        const _fnBottom = () => {
            _arrowName = "mui-calculator-tip-arrow-top";
            _arrowTop = 0;
            _top = _selfOffsetTop + _selfHeight;
            _fnFluctuatePosition();
        };

        const _fnSlide = () => {
            if (_limitLeft > _limitRight) _fnLeft();
            else _fnRight();
        };

        const _fnFluctuate = () => {
            if (_limitTop > _limitBottom) _fnTop();
            else _fnBottom();
        };

        const _fnAuto = () => {//选择最大的空间然后作tip的方向
            var fn = [_fnTop, _fnRight, _fnBottom, _fnLeft], num = [_limitTop, _limitRight, _limitBottom, _limitLeft];
            var index = 0, temp = num[0];
            for (var i = 1, j = num.length; i < j; i++) {
                if (temp < num[i]) { temp = num[i]; index = i; }
            }
            fn[index]();
        };

        if (position == "left") _fnLeft();
        else if (position == "right") _fnRight();
        else if (position == "top") _fnTop();
        else if (position == "bottom") _fnBottom();
        else if (position == "slide") _fnSlide();//左右
        else if (position == "fluctuate") _fnFluctuate();//上下 
        else _fnAuto();

        this.setState({ IsVisible: true, ArrowName: _arrowName, Left: _left, Top: _top, ArrowLeft: _arrowLeft, ArrowTop: _arrowTop });
        this.props.MouseOverCall(true);

        this.UnTip(ele, this.refs.Tip);
    }

    render() {
        const { IsVisible, ArrowName, ArrowLeft, ArrowTop, Left, Top } = this.state;

        const style = { left: Left, top: Top }, arrowStyle = { left: ArrowLeft, top: ArrowTop };
        if (!IsVisible) style.display = "none";

        return (
            <div className='mui-calculator-tip-tooltip clearfix' style={style} ref="Tip">
                <div className={'mui-calculator-tip-arrow ' + ArrowName} style={arrowStyle}><div className='mui-calculator-tip-arrowIn'></div></div>
                <div className='mui-calculator-tip-block'>{this.props.children}</div>
            </div>
        )
    }
}