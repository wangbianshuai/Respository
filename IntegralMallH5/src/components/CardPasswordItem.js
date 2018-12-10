import React, { Component } from 'react'
import styles from "../styles/CardPasswordItem.css"
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default class CardPasswordItem extends Component {
     constructor(props) {
         super(props)
         this.copied=false;
         this.state = {
            copied: false,
        }
     }
    onCopy() {
        this.setState({copied: true});
        //this.copied=true;
    }
    render() {
        const { RowData } = this.props

        return (
                <div  className={styles.OrderDetail}>
                <div className={styles.OrderDetailName}>卡号: </div><div className={styles.orderDetailValue}>{RowData.CardCode}</div>
                <div className={styles.OrderDetailName}>卡密：</div>
                <div id="password" className={styles.orderDetailValue}>{RowData.CardPassword}</div>

                 <CopyToClipboard text={RowData.CardPassword} onCopy={this.onCopy.bind(this)}  className={styles.copyPsdButton}>
                {this.state.copied?<span>已复制</span>:<span>复制卡密</span>}
                </CopyToClipboard> 

                <div className={styles.OrderDetailName}>有效期至：</div><div className={styles.orderDetailValue}>{RowData.EndDate.replace('T',' ')}</div>
             </div>
               
        )
    }
}