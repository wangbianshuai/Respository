import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex } from "ReactCommon";

export default class ThirtyTenderInfo extends BaseIndex {
    constructor(props) {
        super(props);
    }

    render() {
        const { InvestProduct } = this.props;

        return (
            <div className='main-product'>
                <p className='title'>{InvestProduct.name}、限投1次</p>
                <table>
                    <tbody>
                        <tr>
                            <td className='rate'>{InvestProduct.apr}%
                            {InvestProduct.floatApr !== 0 && <div>
                                    +{InvestProduct.floatApr}%
                                <p className='new-hot xszx-tip'>
                                        新手专享加息
                                    <i></i>
                                    </p>
                                </div>}
                            </td>
                            <td>{InvestProduct.period}<span>个月</span></td>
                            <td>{InvestProduct.lowestTender}<span>元</span></td>
                        </tr>
                        <tr>
                            <th>历史年化收益</th>
                            <th>后可申请转让</th>
                            <th>起投金额</th>
                        </tr>
                    </tbody>
                </table>
                <p>
                    加入上限：<span>{Common.ToCurrency(InvestProduct.mostTender)}</span>元
                            </p>
                <p className='new-tip'>注：新手专享加息奖励每个账户仅限1次</p>
                <p>合同范本：<a href={'/commpd/agree/XSCP30T_agree_' + InvestProduct.id + '.html?productSign=XSCP30T'}>《新元宝（新手专享）服务协议》</a></p>
                <p>募集成功后次日开始计息</p>
            </div>
        )
    }
}