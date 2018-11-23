import React from "react";
import BaseIndex2 from "../BaseIndex2";
import { Common } from "UtilsCommon";

export default class Index extends BaseIndex2 {
	constructor(props) {
		super(props);
		this.state = {
			SelectIndex: 0,
			SelectOpacity: 0,
			PreSelectOpacity: 0,
			PreSelectIndex: 0,
			IsMouseOver: false
		};
		this.IsInit = false;
	}

	static get defaultProps() {
		return {
			Arrow: true,
			MinWidth: 1200,
			DataList: [],
			SliderSpeed: 4000,
			AnimateSpeed: 1200
		}
	}

	RenderUlItem(item, index) {
		const style = {};
		const { SelectIndex, SelectOpacity, PreSelectIndex, PreSelectOpacity } = this.state;
		if (SelectIndex === index && SelectOpacity > 0) {
			style.display = "list-item";
			if (SelectOpacity < 1) style.opacity = SelectOpacity;
		}
		else if (PreSelectIndex === index && PreSelectOpacity > 0) {
			style.display = "list-item";
			if (PreSelectOpacity < 1) style.opacity = PreSelectOpacity;
		}

		return (
			<li key={Common.CreateGuid()} style={style}>
				{Common.IsNullOrEmpty(item.linkurl) || item.linkurl === 'javascript:void(0);'
					? <a><img src={item.imgurl} /></a>
					: <a target="_blank" href={item.linkurl}><img src={item.imgurl} /></a>}
			</li>
		)
	}

	componentDidUpdate(prevProps, prevState) {
		if (!this.IsInit && prevProps.DataList.length > 0) {
			this.SliderInit();
			this.IsInit = true;
		}
	}

	componentWillReceiveProps2(nextProp) {
		if (this.JudgeChanged(nextProp, "DataList")) this.IsInit = false;
	}

	RenderOlItem(item, index) {
		return (
			<li key={Common.CreateGuid()} onClick={this.OlLiClick.bind(this, index)} className={this.state.SelectIndex === index ? "current" : ""}></li>
		)
	}

	AnimateLeft() {
		let index = this.state.SelectIndex;
		index--;
		if (index === -1) index = this.props.DataList.length - 1;
		return index;
	}

	AnimateRight() {
		let index = this.state.SelectIndex;
		index++;
		if (index === this.props.DataList.length) index = 0;
		return index;
	}

	SliderTimer(index) {
		const { AnimateSpeed } = this.props;
		const { SelectIndex } = this.state

		clearInterval(this.AnimateIntervalId);

		const startTime = new Date().getTime();
		this.AnimateIntervalId = setInterval(() => {
			const currentTime = new Date().getTime();
			const remaining = Math.max(0, startTime + AnimateSpeed - currentTime);

			const preOpacity = remaining / AnimateSpeed;
			const opacity = 1 - preOpacity;

			this.setState({ PreSelectOpacity: preOpacity, SelectOpacity: opacity });

			if (preOpacity === 0 && opacity === 1) {
				clearInterval(this.AnimateIntervalId);
				this.ClickFlag = 0
			}
		}, 20);

		this.setState({ SelectIndex: index, PreSelectIndex: SelectIndex, PreSelectOpacity: 1, SelectOpacity: 0 });
	}

	SliderInit() {
		const { SliderSpeed } = this.props;
		this.Stop();
		this.IntervalId = setInterval(() => this.SetClickFlag(this.AnimateRight()), SliderSpeed);
	}

	Stop() {
		clearInterval(this.IntervalId);
		clearInterval(this.AnimateIntervalId);
		this.ClickFlag = 0
		this.setState({ PreSelectOpacity: 0, SelectOpacity: 1 });
	}

	SetClickFlag(index) {
		this.ClickFlag = 1;
		this.SliderTimer(index);
	}

	OnMouseOver() {
		this.Stop();
		this.setState({ IsMouseOver: true });
	}

	OnMouseOut() {
		this.SliderInit();
		this.setState({ IsMouseOver: false });
	}

	OlLiClick(index) {
		this.SetSelectItem(index);
	}

	SetSelectItem(index) {
		if (this.ClickFlag == 0) this.SetClickFlag(index);
		else return false;
	}

	PreClick() {
		this.SetSelectItem(this.AnimateLeft());
	}

	NextClick() {
		this.SetSelectItem(this.AnimateRight());
	}

	render() {
		const { MinWidth, DataList, Arrow } = this.props;
		return (
			<div className="mui-slider sliderType1" style={{ minWidth: MinWidth + "px" }}
				onMouseOver={this.OnMouseOver.bind(this)} onMouseOut={this.OnMouseOut.bind(this)}>
				<ul>{DataList.map((m, i) => this.RenderUlItem(m, i))}</ul>
				<ol>{DataList.map((m, i) => this.RenderOlItem(m, i))}</ol>
				{Arrow && this.state.IsMouseOver && <div className="controlBox">
					<div className="pre" onClick={this.PreClick.bind(this)}></div>
					<div className="next" onClick={this.NextClick.bind(this)}></div>
				</div>}
			</div>
		)
	}
}