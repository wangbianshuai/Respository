import React, { Component } from "react"
import styles from "../styles/CreditRuleCom.css"

export default class CreditRuleCom extends Component {

    render() {
        return (
            <div  className={styles.CreditRuleBody}>
              <div className={styles.CreditRuleTitle}>
                   <div className={styles.CreditRuleTitleIcon}>
                        <img className={styles.BackImage} src={require("../images/CreditRuleTitleIcon.png")} alt="img" />
                   </div>
                   <div className={styles.CreditRuleTitle0}>积分</div>
                   <div className={styles.creditRuleTitle1}>说明</div>
                </div>

                <div className={styles.Row}>
                    <div className={styles.RowTitle}>一、如何获取积分？</div>
                    <div className={styles.circle}>1</div>
                    <div className={styles.RowValue}>用户通过出借达到一定金额成为会员获得相应积分，并享有不同程度的会员权益</div>

                    <div className={styles.circle}>2</div>
                    <div className={styles.RowValue}>积分商城每日签到获取随机积分</div>

                    <div className={styles.circle}>3</div>
                    <div className={styles.RowValue}>参与论坛活动，发表优质内容</div>

                    <div className={styles.circle}>4</div>
                    <div className={styles.RowValue}>邀请好友注册获取积分</div>                    
                </div>

                <div className={styles.Row}>
                    <div className={styles.RowTitle}>二、积分价值说明？</div>
                    <div className={styles.RowValue1}>1积分等于1人民币，积分按实际出借金额计算，无封顶</div>                  
                </div>

                 <div className={styles.Row}>
                    <div className={styles.RowTitle}>三、如何使用积分？</div>
                    <div className={styles.RowValue1}>兑换商城礼品可享受各种优惠的红包或代金券，参与不定期积分抽奖及活动中心报名，只需手指轻轻一动，梦想大奖随时拿回家！</div>                  
                </div>

                
                <div className={styles.Row}>
                    <div className={styles.RowTitle}>四、积分使用注意事项 ：</div>
                    <div className={styles.circle}>1</div>
                    <div className={styles.RowValue}>不同的帐户中的积分不可合并使用；</div>

                    <div className={styles.circle}>2</div>
                    <div className={styles.RowValue}>积分是夸客优富对用户行为的记录数据，不构成用户资产；</div>

                    <div className={styles.circle}>3</div>
                    <div className={styles.RowValue}>如果产生转让，出借订单将不计算积分。</div>                   
                </div>

                <div className={styles.Row}>
                    <div className={styles.RowTitle}>五、违规处理：</div>
                    <div className={styles.RowValue1}>如果会员利用系统漏洞作弊等违规方式获得积分，经查证后，将查封会员帐号，并追缴相关积分，并保留追究相应法律责任的权利。</div>                  
                </div>

 <              div className={styles.Row}>
                    <div className={styles.RowTitle}>六、修改及终止：</div>
                    <div className={styles.RowValue1}>夸客优富保留对本活动细则中条款的解释的权利，并有权根据需要取消本细则或增删、修订细则的权利（包括但不限于参加资格、积分计算及兑换标准）。</div>                  
                </div>

            </div>

        
        )
    }
}
