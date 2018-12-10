import React from "react"
import { connect } from "dva"
import * as Common from "../utils/Common"
import { Flex, Button } from "antd-mobile";
import Index from "./Index"
import styles from "../styles/Product.css";
import Header from "../components/Header";

class Test extends Index {
    constructor(props) {
        super(props)

        this.Title = "测试布局，头尾固定中间出滚动条";

        this.state = {
            Title: this.Title,
        };

    }

    render() {

        let isDisabled = false;

        return (
            <Flex direction="column" style={{height:"100%"}}>
                <Header Page={this} Title={this.state.Title} IsRight={false} IsShowBack={true} BackUrl={"AllProducts"} />

                <div style={{display:"flex",flexDirection:"column", flex:1}}>
                <div style={{height:"100%",overflow:"auto"}}>
                    12312312312312312312313123
                    <Flex justify="center" className={styles.topFlex}>
                        <img src={require("../images/Banner.png")} alt="img" />
                    </Flex>
                    <Flex justify="center" className={styles.topFlex}>
                        <img src={require("../images/Banner.png")} alt="img" />
                    </Flex>
                    <Flex justify="center" className={styles.topFlex}>
                        <img src={require("../images/Banner.png")} alt="img" />
                    </Flex>
                    <Flex justify="center" className={styles.topFlex}>
                        <img src={require("../images/Banner.png")} alt="img" />
                    </Flex>
                    <div style={{height:"1000px",backgroundColor:"red"}}>rtghwrts</div>
                    </div>
                </div>

                <div className={styles.submitButtonDiv}>
                    {isDisabled ?
                        <div className={styles.submitButtonDisabled}>
                            <span >积分不足</span>
                        </div>
                        :
                        <Button className={styles.submitButton} >
                            兑换商品
                        </Button>
                    }
                </div>
            </Flex>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = {
    };

    if (!Common.IsDist) console.log(props);

    return props;
}

export default connect(mapStateToProps, Index.MapDispatchToProps)(Test)
