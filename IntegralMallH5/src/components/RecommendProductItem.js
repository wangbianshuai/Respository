import React, { Component } from 'react'
import { Flex } from "antd-mobile"
import { Link } from "dva/router"
import styles from "../styles/RecommendProductItem.css"

export default class RecommendProductItem extends Component {

    render() {
        const { RowData } = this.props
        const direction = this.props.Direction
        const isSmall = this.props.IsSmall

        return (
            <Link to={`Product?ProductId=${RowData.ProductId}`}>
                <Flex direction={direction} justify="end" className={isSmall ? styles.topFlex_s : styles.topFlex}>
                    <Flex align="center" justify="center" className={isSmall ? styles.imgFlex_s : styles.imgFlex}>
                        <img src={RowData.PicturePath} alt="img" className={isSmall ? styles.img_s : styles.img} ></img>
                    </Flex>
                    <Flex direction={isSmall ? "column" : "row"} align="start" className={isSmall ? styles.textFlex_s : styles.textFlex}>
                        <Flex.Item>
                            <Flex wrap="nowrap" direction="column" align="start" className={isSmall ? styles.textSubFlex_s : styles.textSubFlex} >
                                <Flex.Item >
                                    <div className={isSmall ? styles.divNameText_s : styles.divNameText}>{RowData.ProductName}</div>
                                </Flex.Item>
                                <Flex.Item >
                                    <div className={isSmall ? styles.divLabelText_s : styles.divLabelText}>{RowData.ProductLabel}</div>
                                </Flex.Item>
                            </Flex>
                        </Flex.Item>
                        <Flex.Item>
                            <div className={isSmall ? styles.divCategoryText_s : styles.divCategoryText}>{RowData.CategoryName}</div>
                        </Flex.Item>
                    </Flex>
                </Flex>
            </Link>
        )
    }
}