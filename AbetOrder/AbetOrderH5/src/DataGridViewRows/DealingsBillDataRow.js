import { List, WingBlank, WhiteSpace, Flex } from "antd-mobile"

export default (page, data, index) => {
    return <List.Item style={{ borderBottom: "1px solid #999" }} key={data.Id}>
        <WhiteSpace size='md' />
        <WingBlank size='md'>
            <Flex justify="between">
                <Flex.Item>{data.BillTypeName}</Flex.Item>
                <Flex.Item>{data.BillDate}</Flex.Item>
            </Flex>
            <Flex justify="between">
                <Flex.Item>{data.Amount2}</Flex.Item>
                <Flex.Item>{data.BillStatusName}</Flex.Item>
            </Flex>
            <Flex justify="between">
                <Flex.Item>{data.CreateUserName}</Flex.Item>
                <Flex.Item>{data.ApproveUserName}</Flex.Item>
            </Flex>
            <Flex>
                <Flex.Item>{data.Remark}</Flex.Item>
            </Flex>
        </WingBlank>
        <WhiteSpace size='md' />
    </List.Item>
};