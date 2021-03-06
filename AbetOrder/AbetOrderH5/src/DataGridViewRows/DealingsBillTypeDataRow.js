import { List, WingBlank, WhiteSpace, Flex } from "antd-mobile";
import * as Common from "../utils/Common";

export default (page, dataGridView, data, index) => {
    return <List.Item style={{ borderBottom: "1px solid #999" }} key={data.Id}>
        <WhiteSpace size='md' />
        <WingBlank size='md'>
            <Flex justify="between">
                <Flex.Item>{data.Name}</Flex.Item>
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