import React, { Component } from 'react'
import { Flex } from "antd-mobile"
import { Link } from "dva/router"
import styles from "../styles/ProductItem.css"
// import * as Common from '../utils/Common'

export default class ProductItem extends Component {
    // constructor(props) {
    //     super(props)
    // }

    ToProductItemDetailPage(rowData) {
        this.props.Router.ToPage("ProductItemDetail", { Product: rowData })
    }

    render() {
        const { RowData } = this.props;

        return (
            <Link to={`Product?ProductId=${RowData.ProductId}`}>
                <Flex direction="column" justify="between" align="baseline" className={styles.topFlex}>
                    <Flex align="center" justify="center" className={styles.imgFlex}>
                        <img src={RowData.PicturePath} alt="img" className={styles.img} ></img>
                    </Flex>
                    <Flex direction="column" align="start" className={styles.textFlex}>
                        <Flex.Item>
                            <div className={styles.divNameText}>{RowData.ProductName}</div>
                        </Flex.Item>
                        <Flex.Item>
                            <Flex justify="around" wrap="nowrap" direction="row" align="start" className={styles.textSubFlex} >
                                <Flex.Item style={{ width: "9.904rem" }}>
                                    <div className={styles.divNameText}>{RowData.ProductPrice}积分</div>
                                </Flex.Item>
                                <Flex.Item style={{ width: "2.816rem" }}>
                                    <div className={styles.divCategoryText}>{RowData.CategoryName}</div>
                                </Flex.Item>
                            </Flex>
                        </Flex.Item>
                    </Flex>
                </Flex>
            </Link>
        )
    }
}