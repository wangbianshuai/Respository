import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex } from "ReactCommon";

export default class DebentureMoneyList extends BaseIndex {
    constructor(props) {
        super(props);
    }

    RenderItem(item) {
        if (item.floatApr) item.apr += item.floatApr;

        return (
            <div className='recommend-list' key={Common.CreateGuid()}>
                <div className='clearfix'>
                    <table>
                        <tr>
                            <th className='first'>产品名称</th>
                            <th className='second'>年化收益</th>
                            <th className='third'>借款期限</th>
                        </tr>
                        <tr>
                            <td className='first'>{item.name}</td>
                            <td className='second'>{item.apr}%</td>
                            <td className='third'>{item.term}</td>
                        </tr>
                    </table>
                    <a className='visit-product' target='_blank' href={item.url}>立即查看</a>
                </div>
            </div>
        );
    }

    render() {
        const { DataList } = this.props;
        if (!this.IsSuccessNextsProps(DataList)) return null;

        return (
            <div className='recommend'>
                <h3><i></i>向你推荐</h3>
                <div className='recommend-focus'>
                    {DataList.map(m => this > this.RenderItem(m))}
                </div>
            </div>
        )
    }
}