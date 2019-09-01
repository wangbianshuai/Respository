import React, {Component} from "react";

// import {Descriptions} from 'antd';

export default class Description extends Component {
	constructor(props) {
		super(props);
		
		this.Id = props.Property.Id;
		
		this.state = {
			IsVisible: props.Property.IsVisible !== false,
			Item: props.Property
		}
		
	}
	
	RenderListItem(Item){
		return (
			<div className="ant-descriptions" key={Item.Id} name={Item.Name}>
				<div className="ant-descriptions-view">
					<table>
						<tbody>
						<tr className="ant-descriptions-row">
							<td colSpan="1" className="ant-descriptions-item"><span className="ant-descriptions-item-label">{Item.Label}：</span>
								<span className="ant-descriptions-item-content"> { Item.Value } </span></td>
						</tr>
						</tbody>
					</table>
				</div>
			</div>
		)
		
	}
	
	render() {
		const {Item} = this.state;
		return (
			<div>
				{/*<Descriptions title="">*/}
					{/*<Descriptions.Item label={Item.Label} name={Item.Name} key={Item.Id}> { Item.Value }</Descriptions.Item>*/}
				{/*</Descriptions>*/}
				{this.RenderListItem(Item)}
			</div>
			
		);
	}
}

