import { List, WingBlank, WhiteSpace, Flex } from "antd-mobile";
import * as Common from "../utils/Common";

export default (page, dataGridView, data, index) => {
    return <List.Item style={{ borderBottom: "1px solid #999" }} key={data.Id}>
        <WhiteSpace size='md' />
        <WingBlank size='md'>
            <Flex justify="between">
                <Flex.Item>{data.IncomePaymentName}</Flex.Item>
                <Flex.Item>{data.BillDate}</Flex.Item>
            </Flex>
            <Flex>
                <Flex.Item><span style={{ color: data.Amount2 >= 0 ? "#1890ff" : "red" }}>{data.Amount2}</span></Flex.Item>
            </Flex>
            <Flex>
                <Flex.Item>{data.Remark}</Flex.Item>
            </Flex>
            {RenderOperation(dataGridView, data)}
        </WingBlank>
        <WhiteSpace size='md' />
    </List.Item>
};

function RenderOperation(dataGridView, record) {
    const p = Common.ArrayFirst(dataGridView.props.DataProperties, (f) => f.Name === "Operation");
    return p.Render("", record);
}