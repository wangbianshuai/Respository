import React, { Component } from 'react'
import { Flex } from "antd-mobile"
import styles from "../styles/ExchangeItem.css"
import { Link } from "dva/router"

export default class ExchangeItem extends Component {
    // constructor(props) {
    //     super(props)
    // }

    // ToProductItemDetailPage(rowData) {
    //     this.props.Router.ToPage("ProductItemDetail", { Product: rowData })
    // }

    render() {
        const { RowData } = this.props
        return (
             <Link to={`ExchangeDetail?OrderId=${RowData.OrderId}`}>
                 <div className={styles.OrderLists}>
                    <Flex direction="row" justify="between" className={styles.OrderName}>{RowData.ProductName}</Flex>

                    <Flex direction="row" justify="start" className={styles.OrderWrap}></Flex>

                    <Flex direction="column" justify="start" align="start" className={styles.Detail}>
                        <Flex direction="row" jestify="start" className={styles.DetailLabel}>兑换积分：
                        <Flex.Item direction="row" justify="start" className={styles.DetailValue}>{RowData.IntegralValue}</Flex.Item>
                        </Flex>
                        <Flex direction="row" jestify="start" className={styles.DetailLabel}>商品数量：
                        <Flex direction="row" justify="start" className={styles.DetailValue}>x{RowData.ProductNumber}</Flex>
                        </Flex>
                        <Flex direction="row" jestify="start" className={styles.DetailLabel}>兑换时间：
                        <Flex direction="row" justify="start" className={styles.DetailValue}>{RowData.OrderConfrimDate.replace('T',' ')}</Flex>
                        </Flex>
                    </Flex>
                    <Flex direction="row" justify="start" className={styles.OrderWrapLRWhite}></Flex>

                    <div className={styles.OrderStatus}>
                        <div className={styles.OrderStatusImage}>  </div>

                        <div className={styles.OrderCompleted}>订单状态: 
                         <div className={styles.OrderCompletedValue}>{RowData.OrderStatus}</div>
                        </div>
                        <div className={styles.OrderCredit}>合计积分: 
                         <div className={styles.OrderCreditValue}>{RowData.OrderIntegralValue}</div>
                        </div>
                    </div>
                </div>
                </Link>
        )
    }
}