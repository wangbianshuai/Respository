import React, { Component } from "react"
import { Button } from "antd-mobile"
import JsBridge from 'JsBridge'

export default class AuditStatus extends Component {
	// constructor(props) {
    //     super(props)
    // }
    
	componentDidMount() {
		this.Bridge = JsBridge();
	}
	
    JulpToBasicList(){
		if (this.props.cbPage){
			this.props.cbPage()
		}else{
			this.Bridge.Js2Native.ToPop(0,3);
		}
    }
    
    

    render() {
        const { StepIndex, GetImageUrl, RefreshArtificial, ResetStatus } = this.props;
        
		//StepIndex -1 未认证    StepIndex 0 审核中   StepIndex 1 认证成功      StepIndex 2 认证失败
        return (
            <div className="Container4">
                <div className="WhiteSpace6"></div>
                { (StepIndex === 0 || StepIndex === 2 )&&
                        <div className="show-artificial">
                            <div className="artificial-cur">
                                <div className="WhiteSpaceArt1"></div>
                                <img src={GetImageUrl('artificial-check.png')} alt=""/>
                                <div className="DivArtStatus">
                                    <span>待人工审核中</span>
                                    <a onClick={RefreshArtificial} href="javascript:void (0)"><img src={GetImageUrl("refresh.png")} alt=""/></a>
                                </div>
                                <span>已提交人工审核，请联系门店经理进行审核</span>
                            </div>
							<div className="WhiteSpace4"></div>
							<div className="WhiteSpace4"></div>
							{StepIndex === 2 && <Button onClick={ResetStatus} className="JulpToIndexButton" type="default" >审核失败，请重新提交</Button>}
							<div className="WhiteSpace4"></div>
							<div className="WhiteSpace4"></div>
                        </div>
                }

                {StepIndex === 1 &&
                    <div className="show-result">
                        <div className="result-cur">
                            <div className="WhiteSpaceArt1"></div>
                            <img src={GetImageUrl('ic_great@2x.png')} alt=""/>

                            <div className="DivArtStatus">
                                <span>认证成功</span>
                            </div>
                        </div>
                        <div className="WhiteSpace4"></div>
                        <div className="WhiteSpace4"></div>
                        <Button onClick={this.JulpToBasicList.bind(this)} className="JulpToIndexButton" type="primary" >返回</Button>
                    </div>
                }
	
				{/*{ StepIndex === 2 &&*/}
					{/*<div className="show-result">
						<div className="result-cur">
							<div className="WhiteSpaceArt1"></div>
							<img src={GetImageUrl('ic_miss@2x.png')} alt=""/>
				
							<div className="DivArtStatus">
								<span>认证失败</span>
							</div>
						</div>
						<div className="WhiteSpace4"></div>
						<div className="WhiteSpace4"></div>
						<Button onClick={this.JulpToBasicList.bind(this)} className="JulpToIndexButton" type="primary" >返回</Button>
					</div>*/}
				{/*}*/}
            </div>
        )
    }
}