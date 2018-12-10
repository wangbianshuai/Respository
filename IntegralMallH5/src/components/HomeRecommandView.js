import React, { Component } from 'react'
import { Flex } from "antd-mobile"
import styles from "../styles/HomeRecommandView.css"
import RecommendProductItem from "../components/RecommendProductItem";
// import * as Common from '../utils/Common'

export default class HomeRecommandView extends Component {
  render() {
    const { DataList } = this.props;

    return (
      <Flex justify="between" style={{ width: "100%", height: "10rem" }}>
        <Flex justify="center" align="baseline" className={styles.recommendflex1}>
          {/* <Flex.Item className={styles.flexitem} >
            <div className={styles.divbox} > */}
              <RecommendProductItem RowData={DataList[0]} Direction={"column-reverse"} IsSmall={false} />
            {/* </div>
          </Flex.Item> */}
        </Flex>

        <div className={styles.verticalblankdiv} />

        <Flex justify="between" direction="column" align="baseline" style={{ width: "50%", height: "10rem" }} >
          <Flex className={styles.recommendflex2}>
            <Flex.Item >
              <RecommendProductItem RowData={DataList[1]} Direction={"row-reverse"} IsSmall={true} />
            </Flex.Item>
          </Flex>

          <div className={styles.blankdiv} />

          <Flex className={styles.recommendflex2}>
            <Flex.Item >
              <RecommendProductItem RowData={DataList[2]} Direction={"row"} IsSmall={true} />
            </Flex.Item>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}
