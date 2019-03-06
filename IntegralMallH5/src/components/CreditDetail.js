import React, { Component } from 'react'
import { Flex } from "antd-mobile"
import styles from "../styles/CreditDetail.css"

export default class CreditDetail extends Component {
    // constructor(props) {
    //     super(props)
    // }

    // ToProductItemDetailPage(rowData) {
    //     this.props.Router.ToPage("ProductItemDetail", { Product: rowData })
    // }

    render() {
        const { RowData } = this.props
        var CreditText="";
        if(RowData.IntegralType==="1")
            CreditText="+"+RowData.IntegralValue;
        if(RowData.IntegralType==="2")
            CreditText="-"+RowData.IntegralValue;

        return (
           <Flex direction="row" justify="between" className={styles.CreditDetail}>
                <Flex direction="column" justify="start" align="start" className={styles.CreditDetailLeft}>                     
                    <Flex direction="column" justify="start" >{RowData.IntegralCategory}</Flex>
                    <Flex direction="column" justify="start" >{RowData.CreateDate.replace('T',' ')}</Flex>
                </Flex>
                <Flex direction="column" justify="start" align="start"  className={styles.CreditDetailRight}>
                    <Flex direction="column" justify="start" className={styles.CreditText}>积分</Flex> 
                    <Flex direction="column"className={styles.CreditValue} justify="start">{CreditText}</Flex>
                </Flex>
            </Flex>
        )
    }
}